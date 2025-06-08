/*
 * Storage module public API
 */

// Core types and interfaces
export type {
  StorageAdapter,
  StorageAdapterConfig,
  ReadResult,
  WriteResult,
} from "./types";

// Error classes
export {
  StorageError,
  DocumentNotFoundError,
  TimestampNotFoundError,
  ValidationError,
  ConcurrencyError,
} from "./errors";

// Utilities
export { createStorageLoader } from "./loader";
export { getRequestConfig } from "./utils";