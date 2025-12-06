// lib/database.ts
// Mock database for development (Prisma not installed)
const scanStore = new Map<string, any>();

class MockPrisma {
  scanResult = {
    create: async (data: any) => {
      const record = { id: Math.random().toString(36).substring(7), ...data };
      scanStore.set(data.scanId, record);
      return record;
    },
    update: async (args: any) => {
      const existing = scanStore.get(args.where.scanId);
      const updated = { ...existing, ...args.data };
      scanStore.set(args.where.scanId, updated);
      return updated;
    },
    findUnique: async (args: any) => {
      return scanStore.get(args.where.scanId) || null;
    },
    findMany: async () => Array.from(scanStore.values()),
    count: async () => scanStore.size,
    delete: async (args: any) => {
      const record = scanStore.get(args.where.scanId);
      scanStore.delete(args.where.scanId);
      return record;
    },
  };

  domainHistory = {
    create: async (data: any) => ({ id: Math.random().toString(36).substring(7), ...data }),
  };
}

export const prisma = new MockPrisma() as any;
