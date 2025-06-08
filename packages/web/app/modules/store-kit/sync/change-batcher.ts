/**
 * Batches multiple changes into a single sync operation
 */

import type { Delta } from "jsondiffpatch";
import { diff, patch } from "jsondiffpatch";

export interface Change<T> {
  timestamp: number;
  previous: T;
  current: T;
  delta?: Delta;
}

export interface BatchedChange<T> {
  startTimestamp: number;
  endTimestamp: number;
  changes: Change<T>[];
  combinedDelta: Delta;
  finalContext: T;
}

export class ChangeBatcher<T> {
  private pending: Change<T>[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly maxBatchSize: number;
  private readonly maxBatchAge: number;
  private readonly onFlush: (batch: BatchedChange<T>) => Promise<void>;

  constructor(options: {
    maxBatchSize?: number;
    maxBatchAge?: number;
    onFlush: (batch: BatchedChange<T>) => Promise<void>;
  }) {
    this.maxBatchSize = options.maxBatchSize ?? 10;
    this.maxBatchAge = options.maxBatchAge ?? 1000;
    this.onFlush = options.onFlush;
  }

  add(change: Change<T>): void {
    // Calculate delta if not provided
    if (!change.delta) {
      change.delta = diff(change.previous, change.current);
    }

    // Skip if no actual changes
    if (!change.delta) {
      return;
    }

    this.pending.push(change);

    // Flush if batch is full
    if (this.pending.length >= this.maxBatchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  private scheduleFlush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.flush();
    }, this.maxBatchAge);
  }

  async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.pending.length === 0) {
      return;
    }

    const batch = this.createBatch();
    this.pending = [];

    await this.onFlush(batch);
  }

  private createBatch(): BatchedChange<T> {
    if (this.pending.length === 0) {
      throw new Error("Cannot create batch from empty pending changes");
    }

    const firstChange = this.pending[0];
    const lastChange = this.pending[this.pending.length - 1];

    // Calculate combined delta from first previous to last current
    const combinedDelta = diff(firstChange.previous, lastChange.current);

    return {
      startTimestamp: firstChange.timestamp,
      endTimestamp: lastChange.timestamp,
      changes: this.pending,
      combinedDelta: combinedDelta!,
      finalContext: lastChange.current,
    };
  }

  hasPendingChanges(): boolean {
    return this.pending.length > 0;
  }

  getPendingCount(): number {
    return this.pending.length;
  }

  clear(): void {
    this.pending = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Merge multiple deltas into a single delta
   * Useful for combining multiple operations
   */
  static mergeDeltas<T>(deltas: Delta[], baseContext: T): { delta: Delta; result: T } {
    let current = JSON.parse(JSON.stringify(baseContext));
    
    for (const delta of deltas) {
      current = patch(current, delta);
    }

    const mergedDelta = diff(baseContext, current);
    
    return {
      delta: mergedDelta!,
      result: current,
    };
  }

  /**
   * Optimize a batch by removing redundant changes
   * For example, if a field is changed multiple times, only keep the final value
   */
  static optimizeBatch<T>(batch: BatchedChange<T>): BatchedChange<T> {
    // For now, just return the batch as-is
    // In a real implementation, you could analyze the deltas
    // and remove redundant operations
    return batch;
  }
}