// lib/redis.ts
// Mock Redis implementation for development
class MockRedis {
  private store = new Map<string, { value: string; expiry?: number }>();

  async setex(key: string, seconds: number, value: string): Promise<void> {
    const expiry = Date.now() + seconds * 1000;
    this.store.set(key, { value, expiry });
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.store.has(key);
  }
}

export const redis = new MockRedis();
