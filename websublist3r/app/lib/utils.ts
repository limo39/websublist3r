// lib/utils.ts
import { z } from 'zod';

export const domainSchema = z.string()
  .min(3)
  .max(253)
  .regex(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/);

export const scanOptionsSchema = z.object({
  engines: z.array(z.string()).optional().default(['google', 'bing', 'yahoo']),
  ports: z.array(z.number().min(1).max(65535)).optional().default([80, 443]),
  threads: z.number().min(1).max(100).optional().default(10),
  enableBruteforce: z.boolean().optional().default(false),
  verbose: z.boolean().optional().default(false),
  saveFull: z.boolean().optional().default(false),
});

export const batchScanSchema = z.object({
  domains: z.array(domainSchema).max(50),
  options: scanOptionsSchema.optional(),
});

export function validateDomain(domain: string): boolean {
  return domainSchema.safeParse(domain).success;
}

export function sanitizeDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
}
