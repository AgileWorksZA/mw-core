import type { VersionCursor } from "~/modules/store-kit/versioning/types";

export interface CacheEntry<T> {
  data: T;
  cursor: VersionCursor;
  timestamp: number;
  size: number;
}

export class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private maxMemory: number;
  private currentMemory = 0;

  constructor(maxSize = 100, maxMemoryMB = 50) {
    this.maxSize = maxSize;
    this.maxMemory = maxMemoryMB * 1024 * 1024; // Convert to bytes
  }

  private estimateSize(obj: unknown): number {
    return JSON.stringify(obj).length * 2; // Rough estimate (2 bytes per char)
  }

  get(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, entry);
    }
    return entry;
  }

  set(key: string, data: T, cursor: VersionCursor): void {
    const size = this.estimateSize(data);
    
    // Remove oldest entries if we're at capacity
    while (
      (this.cache.size >= this.maxSize || this.currentMemory + size > this.maxMemory) &&
      this.cache.size > 0
    ) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        const removed = this.cache.get(firstKey);
        if (removed) {
          this.currentMemory -= removed.size;
        }
        this.cache.delete(firstKey);
      } else {
        break;
      }
    }

    const entry: CacheEntry<T> = {
      data,
      cursor,
      timestamp: Date.now(),
      size,
    };

    this.cache.set(key, entry);
    this.currentMemory += size;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
    this.currentMemory = 0;
  }

  get stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsed: this.currentMemory,
      maxMemory: this.maxMemory,
      hitRate: 0, // Would need to track hits/misses
    };
  }
}