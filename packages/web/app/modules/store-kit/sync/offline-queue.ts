/**
 * Offline queue for handling sync operations when offline
 */

import { getCache } from "~/modules/store-kit/cache/indexed-db-cache";

export interface QueuedOperation<T = any> {
  id: string;
  type: string;
  documentId: string;
  operation: 'write' | 'delete';
  payload: T;
  timestamp: number;
  retryCount: number;
  lastError?: string;
}

export class OfflineQueue<T = any> {
  private readonly queueKey = 'store-kit-offline-queue';
  private cache = getCache();
  private isProcessing = false;
  private processingPromise: Promise<void> | null = null;

  async add(operation: Omit<QueuedOperation<T>, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const queue = await this.getQueue();
    const queuedOp: QueuedOperation<T> = {
      ...operation,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    queue.push(queuedOp);
    await this.saveQueue(queue);
  }

  async getQueue(): Promise<QueuedOperation<T>[]> {
    const data = await this.cache.get(this.queueKey);
    return (data || []) as QueuedOperation<T>[];
  }

  private async saveQueue(queue: QueuedOperation<T>[]): Promise<void> {
    await this.cache.set(this.queueKey, queue);
  }

  async process(
    executor: (operation: QueuedOperation<T>) => Promise<void>,
    options: { maxRetries?: number; onError?: (op: QueuedOperation<T>, error: Error) => void } = {}
  ): Promise<void> {
    if (this.isProcessing) {
      return this.processingPromise!;
    }

    this.isProcessing = true;
    this.processingPromise = this.processQueue(executor, options);
    
    try {
      await this.processingPromise;
    } finally {
      this.isProcessing = false;
      this.processingPromise = null;
    }
  }

  private async processQueue(
    executor: (operation: QueuedOperation<T>) => Promise<void>,
    options: { maxRetries?: number; onError?: (op: QueuedOperation<T>, error: Error) => void }
  ): Promise<void> {
    const { maxRetries = 3, onError } = options;
    const queue = await this.getQueue();
    const failedOps: QueuedOperation<T>[] = [];

    for (const operation of queue) {
      try {
        await executor(operation);
        // Successfully processed, don't add to failed ops
      } catch (error) {
        operation.retryCount++;
        operation.lastError = error instanceof Error ? error.message : String(error);
        
        if (operation.retryCount < maxRetries) {
          failedOps.push(operation);
        } else {
          // Max retries reached
          onError?.(operation, error as Error);
        }
      }
    }

    // Save failed operations back to queue
    await this.saveQueue(failedOps);
  }

  async remove(operationId: string): Promise<void> {
    const queue = await this.getQueue();
    const filtered = queue.filter(op => op.id !== operationId);
    await this.saveQueue(filtered);
  }

  async clear(): Promise<void> {
    await this.saveQueue([]);
  }

  async size(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  async getFailedOperations(): Promise<QueuedOperation<T>[]> {
    const queue = await this.getQueue();
    return queue.filter(op => op.retryCount > 0);
  }

  // Deduplicate operations for the same document
  async deduplicate(): Promise<void> {
    const queue = await this.getQueue();
    const deduped = new Map<string, QueuedOperation<T>>();
    
    // Keep only the latest operation for each document
    for (const op of queue) {
      const key = `${op.type}-${op.documentId}`;
      const existing = deduped.get(key);
      
      if (!existing || op.timestamp > existing.timestamp) {
        deduped.set(key, op);
      }
    }
    
    await this.saveQueue(Array.from(deduped.values()));
  }
}

// Singleton instance
let queueInstance: OfflineQueue | null = null;

export function getOfflineQueue<T = any>(): OfflineQueue<T> {
  if (!queueInstance) {
    queueInstance = new OfflineQueue<T>();
  }
  return queueInstance as OfflineQueue<T>;
}