export class FileLock {
  private locks = new Map<string, Promise<void>>();

  async acquire<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.locks.get(key);
    
    let result: T;
    const promise = (async () => {
      if (existing) await existing;
      result = await fn();
    })();
    
    this.locks.set(key, promise);
    
    try {
      await promise;
      return result!;
    } finally {
      this.locks.delete(key);
    }
  }

  isLocked(key: string): boolean {
    return this.locks.has(key);
  }

  async waitForUnlock(key: string): Promise<void> {
    const existing = this.locks.get(key);
    if (existing) await existing;
  }
}