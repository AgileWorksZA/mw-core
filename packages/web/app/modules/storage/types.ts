import type { Delta } from "jsondiffpatch";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";

/*
 * Represents the result of reading a document from the storage.
 * data: The context of the document.
 * cursor: The cursor to the latest version of the document if no timestamp is provided.
 *         The cursor to the version with the provided timestamp if it is provided.
 */
export interface ReadResult<TContext> {
  data: TContext;
  cursor: VersionCursor;
}

/*
 * Represents the result of writing a document to the storage.
 * cursor: The cursor to the latest version of the document after the write operation.
 *         If a timestamp is provided, it should point to the version with that timestamp.
 */
export interface WriteResult {
  cursor: VersionCursor;
}

export interface StorageAdapter<TContext = any> {
  /**
   * Reads a document.
   * If a timestamp is provided, it attempts to read that specific version.
   * Otherwise, it reads the latest version.
   * If the document does not exist, it should create it using defaultContext and return that state.
   */
  read(props: {
    type: string;
    id: string;
    defaultContext?: TContext;
    timestamp?: number;
  }): Promise<ReadResult<TContext>>;

  /**
   * Writes or updates a document.
   * Can accept either a full context or a delta to patch the existing document.
   * It should create the document if it doesn't exist, using defaultContext if only a delta is provided for a new document.
   */
  write(props: {
    type: string;
    id: string;
    payload: { context?: TContext; delta?: Delta; data?: TContext }; // data for backward compatibility
    defaultContext?: TContext;
  }): Promise<WriteResult>;

  /**
   * Replaces the document's history after a specified timestamp.
   * This is used for scenarios like reverting to an old version and then making new changes from that point,
   * effectively branching the history.
   */
  replaceHistory(
    props: {
      type: string;
      id: string;
      afterTimestamp: number;
      payload: { context: TContext; delta?: Delta };
      defaultContext?: TContext;
    }, // Represents the type structure and potential base for delta if needed
  ): Promise<WriteResult>;

  /**
   * Retrieves all documents ids and paths of a specific type.
   */
  getAll(props: { type: string; defaultContext: TContext }): Promise<
    { id: string; path: string }[]
  >;

  /**
   * Optional: Utility method to get an underlying storage path or identifier,
   * primarily useful for file-based adapters.
   */
  getStoragePath?(props: { type: string; id: string }): Promise<string>;

  /**
   * Utility method to delete a document.
   */
  deleteDocument(props: { type: string; id: string }): Promise<void>;
}

export interface StorageAdapterConfig<TContext> {
  validator?: (data: unknown) => data is TContext;
  sanitizer?: (data: TContext) => TContext;
  enableCompression?: boolean;
  compressionThreshold?: number; // bytes
  cacheSize?: number;
  cacheMaxMemoryMB?: number;
  snapshotInterval?: number; // Create snapshot every N versions
}
