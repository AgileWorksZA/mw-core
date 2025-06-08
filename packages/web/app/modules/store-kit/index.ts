/**
 * Store-Kit Module
 *
 * A comprehensive document synchronization and versioning framework
 * with enterprise-grade features for offline-capable, real-time applications.
 *
 * @module store-kit
 */

// Core Types
export type {
  StoreContext,
  StoreKit,
  StoreKitEvents,
  StoreKitEmitted,
  EventHandlers,
  EmitHandlers,
  CreateStoreKitFunction,
  EnqueueObject,
} from "./types";

// Core Functions
export { useCreateStoreKit } from "./types";

// Version Types
export type {
  VersionCursor,
  VersionInfo,
  VersionInfoExtended,
  History,
} from "./versioning/types";

// Storage Integration
export type {
  StorageAdapter,
  ReadResult as PersistenceReadResult,
  WriteResult as PersistenceWriteResult,
} from "~/modules/storage/types";
// Note: JsonFileStorageAdapter should only be imported server-side
// export { JsonFileStorageAdapter } from "~/modules/storage/json-adapter";
export { createStorageLoader } from "~/modules/storage/loader";
export type { StorageLoader } from "~/modules/storage/loader";
export { useSyncDocument } from "~/modules/storage/json-adapter/client";

// Version Tracking
export { useServerSyncedCallback } from "./versioning/hooks/use-server-sync-emit";
export { useCursor } from "./versioning/hooks/use-cursor";
export {
  clientContextChanged,
  getServerContext,
  initServerContext,
  saveServerContext,
  Tracking,
} from "./versioning/tracking";

// Synchronization Hooks
export { useServerSync } from "./hooks/use-server-sync";
export { useEnhancedServerSync } from "./hooks/use-enhanced-server-sync";
export type { UseServerSyncOptions } from "./hooks/use-server-sync";
export type { UseEnhancedServerSyncOptions } from "./hooks/use-enhanced-server-sync";

// Sync Utilities
export { SyncError } from "./sync/errors";
export type { SyncErrorDetails, SyncErrorType } from "./sync/errors";

export { RetryManager } from "./sync/retry-manager";
export type { RetryOptions } from "./sync/retry-manager";

export {
  createSyncStrategy,
  OptimisticSyncStrategy,
  PessimisticSyncStrategy,
  RealtimeSyncStrategy,
} from "./sync/strategies";
export type {
  SyncStrategy,
  ChangeEvent,
  SyncPayload,
} from "./sync/strategies";

export { getOfflineQueue } from "./sync/offline-queue";
export type {
  OfflineQueue,
  QueuedOperation,
} from "./sync/offline-queue";

export { ChangeBatcher } from "./sync/change-batcher";
export type {
  Change,
  BatchedChange,
} from "./sync/change-batcher";

export {
  createConflictResolver,
  SimpleConflictResolver,
  FieldLevelConflictResolver,
} from "./sync/conflict-resolver";
export type {
  ConflictResolver,
  Conflict,
  Resolution,
  ConflictContext,
} from "./sync/conflict-resolver";

// Cache
export { getCache, IndexedDBCache } from "./cache/indexed-db-cache";
export type { CacheEntry } from "./cache/indexed-db-cache";
