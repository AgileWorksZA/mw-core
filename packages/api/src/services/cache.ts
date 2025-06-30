/**
 * Cache Service
 * LRU cache with TTL support for API responses
 * 
 * @moneyworks-dsl PURE
 */

interface CacheEntry<T> {
  value: T;
  expires: number;
  hits: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  onEvict?: (key: string, value: any) => void;
}

/**
 * LRU Cache with TTL support
 */
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private accessOrder: string[] = [];
  private readonly defaultTTL: number;
  private readonly maxSize: number;
  private readonly onEvict?: (key: string, value: any) => void;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 60000; // 1 minute default
    this.maxSize = options.maxSize || 1000;
    this.onEvict = options.onEvict;
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expires) {
      this.delete(key);
      return undefined;
    }

    // Update access order (LRU)
    this.updateAccessOrder(key);
    entry.hits++;

    return entry.value;
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    // Evict if at capacity
    if (!this.cache.has(key) && this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      value,
      expires,
      hits: 0
    });

    this.updateAccessOrder(key);
  }

  /**
   * Delete a value from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry && this.onEvict) {
      this.onEvict(key, entry.value);
    }

    this.accessOrder = this.accessOrder.filter(k => k !== key);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    if (this.onEvict) {
      for (const [key, entry] of this.cache.entries()) {
        this.onEvict(key, entry.value);
      }
    }
    
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: entries.reduce((sum, [_, entry]) => sum + entry.hits, 0),
      expired: entries.filter(([_, entry]) => now > entry.expires).length,
      avgHits: entries.length > 0 
        ? entries.reduce((sum, [_, entry]) => sum + entry.hits, 0) / entries.length 
        : 0
    };
  }

  /**
   * Get or set with factory function
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    ttl?: number
  ): Promise<{ value: T; cached: boolean }> {
    const cached = this.get<T>(key);
    
    if (cached !== undefined) {
      return { value: cached, cached: true };
    }

    const value = await factory();
    this.set(key, value, ttl);
    
    return { value, cached: false };
  }

  /**
   * Warm cache with multiple entries
   */
  async warmUp<T>(
    entries: Array<{
      key: string;
      factory: () => Promise<T>;
      ttl?: number;
    }>
  ): Promise<void> {
    await Promise.all(
      entries.map(({ key, factory, ttl }) => 
        this.getOrSet(key, factory, ttl)
      )
    );
  }

  /**
   * Update access order for LRU
   */
  private updateAccessOrder(key: string): void {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;

    const lru = this.accessOrder[0];
    this.delete(lru);
  }
}

/**
 * Create cache instances with specific TTLs
 */
export const createCaches = () => ({
  // Company info: 5 minutes
  company: new CacheService({ ttl: 5 * 60 * 1000 }),
  
  // Field labels: 1 hour
  labels: new CacheService({ ttl: 60 * 60 * 1000 }),
  
  // Eval results: 1 minute
  eval: new CacheService({ ttl: 60 * 1000 }),
  
  // General purpose: 5 minutes
  general: new CacheService({ ttl: 5 * 60 * 1000 })
});

export type CacheInstances = ReturnType<typeof createCaches>;