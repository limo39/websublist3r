// app/api/scan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateDomain, sanitizeDomain, scanOptionsSchema } from '@/lib/utils';
import { Sublist3rService } from '@/lib/sublist3r';
import { prisma } from '@/lib/database';
import { rateLimiter } from '@/lib/rate-limiter';

const sublist3r = new Sublist3rService();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = await rateLimiter.consume(ip);
    
    if (rateLimit.remainingPoints < 0) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': (rateLimit.msBeforeNext / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + rateLimit.msBeforeNext).toISOString()
          }
        }
      );
    }

    const body = await request.json();
    let { domain, options = {} } = body;

    // Validate and sanitize domain
    domain = sanitizeDomain(domain);
    
    if (!validateDomain(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    // Validate options
    const validatedOptions = scanOptionsSchema.parse(options);

    // Generate scan ID
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // Save scan to database
    const scanRecord = await prisma.scanResult.create({
      data: {
        scanId,
        domain,
        status: 'pending',
        scanOptions: validatedOptions,
        subdomainCount: 0,
        subdomains: []
      }
    });

    // Start scan in background
    (async () => {
      try {
        // Update status to running
        await prisma.scanResult.update({
          where: { id: scanRecord.id },
          data: { status: 'running' }
        });

        // Run the scan
        const results = await sublist3r.scanDomain(domain, validatedOptions);

        // Save results
        await prisma.scanResult.update({
          where: { id: scanRecord.id },
          data: {
            status: 'completed',
            subdomains: results,
            subdomainCount: results.length,
            completedAt: new Date()
          }
        });

        // Cache results (Redis not available, skipping)

        // Add to history
        await prisma.domainHistory.create({
          data: {
            domain,
            scanId
          }
        });

      } catch (error) {
        console.error('Background scan error:', error);
        
        await prisma.scanResult.update({
          where: { id: scanRecord.id },
          data: { 
            status: 'failed',
            completedAt: new Date()
          }
        });
      }
    })();

    return NextResponse.json({
      scanId,
      message: 'Scan started successfully',
      domain,
      status: 'pending',
      estimatedTime: '2-5 minutes',
      monitorUrl: `/api/scan/${scanId}`
    }, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimit.remainingPoints.toString(),
        'X-RateLimit-Reset': new Date(Date.now() + rateLimit.msBeforeNext).toISOString()
      }
    });

  } catch (error) {
    console.error('Scan API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const page = parseInt(searchParams.get('page') || '1');

  const scans = await prisma.scanResult.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: 'desc' },
    select: {
      scanId: true,
      domain: true,
      status: true,
      createdAt: true,
      completedAt: true,
      subdomainCount: true
    }
  });

  const total = await prisma.scanResult.count();

  return NextResponse.json({
    scans,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}