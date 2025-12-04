// app/api/scan/[scanId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { redis } from '@/lib/redis';

interface Params {
  params: {
    scanId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { scanId } = params;

  try {
    // Try cache first
    const cached = await redis.get(`scan:${scanId}`);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Get from database
    const scan = await prisma.scanResult.findUnique({
      where: { scanId }
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    const response = {
      scanId: scan.scanId,
      domain: scan.domain,
      status: scan.status,
      createdAt: scan.createdAt,
      completedAt: scan.completedAt,
      subdomainCount: scan.subdomainCount,
      subdomains: scan.subdomains,
      scanOptions: scan.scanOptions
    };

    // Cache the response
    if (scan.status === 'completed') {
      await redis.setex(
        `scan:${scanId}`,
        86400,
        JSON.stringify(response)
      );
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { scanId } = params;

  try {
    await prisma.scanResult.delete({
      where: { scanId }
    });

    // Clear cache
    await redis.del(`scan:${scanId}`);

    return NextResponse.json({
      message: 'Scan deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete scan' },
      { status: 500 }
    );
  }
}