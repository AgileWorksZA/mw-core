/**
 * Sync strategy abstraction for different synchronization patterns
 */

import type { Delta } from "jsondiffpatch";
import { diff } from "jsondiffpatch";

export interface ChangeEvent<T> {
  previous: T;
  current: T;
  delta?: Delta;
}

export interface SyncPayload<T> {
  context: T;
  delta?: Delta;
  metadata?: Record<string, any>;
}

export interface ConflictInfo<T> {
  local: T;
  remote: T;
  base?: T;
}

export abstract class SyncStrategy<T> {
  /**
   * Determine if a change should trigger a sync
   */
  abstract shouldSync(change: ChangeEvent<T>): boolean;

  /**
   * Prepare data for synchronization
   */
  abstract prepareSync(current: T, previous: T): SyncPayload<T>;

  /**
   * Handle conflicts between local and remote versions
   */
  abstract handleConflict(conflict: ConflictInfo<T>): T;

  /**
   * Schedule the sync operation
   */
  abstract scheduleSync(syncFn: () => Promise<void>): void;

  /**
   * Cancel any pending sync operations
   */
  abstract cancelPendingSync(): void;
}

/**
 * Optimistic sync strategy - assumes success and syncs in background
 */
export class OptimisticSyncStrategy<T> extends SyncStrategy<T> {
  private timeout: NodeJS.Timeout | null = null;
  private readonly debounceMs: number;
  private readonly minChangeSize: number;

  constructor(options: { debounceMs?: number; minChangeSize?: number } = {}) {
    super();
    this.debounceMs = options.debounceMs ?? 500;
    this.minChangeSize = options.minChangeSize ?? 0;
  }

  shouldSync(change: ChangeEvent<T>): boolean {
    if (!change.delta) {
      change.delta = diff(change.previous, change.current);
    }
    
    // Skip sync if no changes
    if (!change.delta) return false;
    
    // Skip sync if change is too small
    const changeSize = JSON.stringify(change.delta).length;
    return changeSize >= this.minChangeSize;
  }

  prepareSync(current: T, previous: T): SyncPayload<T> {
    const delta = diff(previous, current);
    return {
      context: current,
      delta,
      metadata: {
        strategy: 'optimistic',
        timestamp: Date.now(),
      },
    };
  }

  handleConflict(conflict: ConflictInfo<T>): T {
    // Optimistic strategy: prefer local changes
    return conflict.local;
  }

  scheduleSync(syncFn: () => Promise<void>): void {
    this.cancelPendingSync();
    this.timeout = setTimeout(syncFn, this.debounceMs);
  }

  cancelPendingSync(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

/**
 * Pessimistic sync strategy - waits for server confirmation
 */
export class PessimisticSyncStrategy<T> extends SyncStrategy<T> {
  private syncPromise: Promise<void> | null = null;

  shouldSync(change: ChangeEvent<T>): boolean {
    // Always sync in pessimistic mode
    return true;
  }

  prepareSync(current: T, previous: T): SyncPayload<T> {
    return {
      context: current,
      delta: diff(previous, current),
      metadata: {
        strategy: 'pessimistic',
        timestamp: Date.now(),
      },
    };
  }

  handleConflict(conflict: ConflictInfo<T>): T {
    // Pessimistic strategy: prefer remote changes
    return conflict.remote;
  }

  scheduleSync(syncFn: () => Promise<void>): void {
    // Execute immediately and wait
    this.syncPromise = syncFn();
  }

  cancelPendingSync(): void {
    // Can't cancel in pessimistic mode
  }

  async waitForSync(): Promise<void> {
    if (this.syncPromise) {
      await this.syncPromise;
    }
  }
}

/**
 * Real-time sync strategy - syncs immediately on every change
 */
export class RealtimeSyncStrategy<T> extends SyncStrategy<T> {
  private readonly throttleMs: number;
  private lastSyncTime = 0;

  constructor(options: { throttleMs?: number } = {}) {
    super();
    this.throttleMs = options.throttleMs ?? 100;
  }

  shouldSync(change: ChangeEvent<T>): boolean {
    const now = Date.now();
    if (now - this.lastSyncTime < this.throttleMs) {
      return false;
    }
    this.lastSyncTime = now;
    return true;
  }

  prepareSync(current: T, previous: T): SyncPayload<T> {
    return {
      context: current,
      delta: diff(previous, current),
      metadata: {
        strategy: 'realtime',
        timestamp: Date.now(),
      },
    };
  }

  handleConflict(conflict: ConflictInfo<T>): T {
    // Real-time strategy: merge changes if possible
    if (conflict.base) {
      // Implement 3-way merge logic here
      // For now, prefer remote
      return conflict.remote;
    }
    return conflict.remote;
  }

  scheduleSync(syncFn: () => Promise<void>): void {
    // Execute immediately
    syncFn();
  }

  cancelPendingSync(): void {
    // Nothing to cancel in real-time mode
  }
}

/**
 * Factory for creating sync strategies
 */
export function createSyncStrategy<T>(
  type: 'optimistic' | 'pessimistic' | 'realtime',
  options?: any
): SyncStrategy<T> {
  switch (type) {
    case 'optimistic':
      return new OptimisticSyncStrategy<T>(options);
    case 'pessimistic':
      return new PessimisticSyncStrategy<T>(options);
    case 'realtime':
      return new RealtimeSyncStrategy<T>(options);
    default:
      throw new Error(`Unknown sync strategy: ${type}`);
  }
}