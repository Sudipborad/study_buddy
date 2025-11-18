// Simple in-memory cache for AI responses to improve performance
class AICache {
  private cache = new Map<string, any>();
  private readonly maxSize = 50; // Limit cache size
  private readonly ttl = 1000 * 60 * 30; // 30 minutes TTL

  private generateKey(type: string, input: string): string {
    // Create a hash-like key from the input
    return `${type}:${btoa(input.slice(0, 100))}`;
  }

  set(type: string, input: string, result: any): void {
    const key = this.generateKey(type, input);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  get(type: string, input: string): any | null {
    const key = this.generateKey(type, input);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if cache entry is expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.result;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const aiCache = new AICache();