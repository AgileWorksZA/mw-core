/**
 * IndexedDB-based cache for document storage
 * Provides better performance and storage limits than localStorage
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  version?: number;
}

export class IndexedDBCache<T = any> {
  private db: IDBDatabase | null = null;
  private readonly dbName: string;
  private readonly storeName = 'documents';
  private readonly version = 1;

  constructor(dbName = 'store-kit-cache') {
    this.dbName = dbName;
  }

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async get(key: string): Promise<T | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(new Error(`Failed to get ${key}`));
      request.onsuccess = () => {
        const entry = request.result as CacheEntry<T> | undefined;
        resolve(entry ? entry.value : null);
      };
    });
  }

  async set(key: string, value: T, version?: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      version,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      try {
        const request = store.put(entry);
        
        request.onerror = () => {
          console.error(`Failed to set ${key}:`, request.error);
          // Try to identify the problematic value
          if (request.error?.name === 'DataCloneError') {
            console.error('DataCloneError: The value contains non-serializable data');
            console.error('Attempting to identify the problematic data...');
            this.identifyNonSerializable(value);
          }
          reject(new Error(`Failed to set ${key}: ${request.error?.message || 'Unknown error'}`));
        };
        
        request.onsuccess = () => resolve();
      } catch (error) {
        console.error(`Error storing ${key}:`, error);
        if (error instanceof DOMException && error.name === 'DataCloneError') {
          console.error('DataCloneError: The value contains non-serializable data');
          this.identifyNonSerializable(value);
        }
        reject(error);
      }
    });
  }

  async delete(key: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(new Error(`Failed to delete ${key}`));
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(new Error('Failed to clear cache'));
      request.onsuccess = () => resolve();
    });
  }

  async getAllKeys(): Promise<string[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.onerror = () => reject(new Error('Failed to get keys'));
      request.onsuccess = () => resolve(request.result as string[]);
    });
  }

  // Clean up old entries
  async cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const cutoff = Date.now() - maxAge;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoff);
      const request = index.openCursor(range);

      request.onerror = () => reject(new Error('Failed to cleanup'));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  /**
   * Helper method to identify non-serializable values in an object
   */
  private identifyNonSerializable(obj: any, path: string = 'root'): void {
    if (obj === null || obj === undefined) return;

    // Check for non-serializable types
    if (typeof obj === 'function') {
      console.error(`Found function at ${path}`);
      return;
    }

    if (obj instanceof Promise) {
      console.error(`Found Promise at ${path}`);
      return;
    }

    if (typeof obj === 'symbol') {
      console.error(`Found Symbol at ${path}`);
      return;
    }

    // Check arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.identifyNonSerializable(item, `${path}[${index}]`);
      });
      return;
    }

    // Check objects
    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        this.identifyNonSerializable(value, `${path}.${key}`);
      }
    }
  }
}

// Singleton instance
let cacheInstance: IndexedDBCache | null = null;

export function getCache(): IndexedDBCache {
  if (!cacheInstance) {
    cacheInstance = new IndexedDBCache();
  }
  return cacheInstance;
}