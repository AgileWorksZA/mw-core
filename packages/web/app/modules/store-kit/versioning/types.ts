/** Document identifier type */
export type ID = string;

/**
 * Version cursor containing document history navigation points.
 * If next is null, it means there are no more versions available.
 * If previous is null, it means this is the first version.
 * If the timestamp is null, it means the current version is the latest.
 * Latest is always the latest version available.
 * If the timestamp is not null and not equal to the latest version, it means the document is an older version.
 */
export interface VersionCursor {
  /** Next version timestamp, if available */
  next: number | null;
  /** Previous version timestamp, if available */
  previous: number | null;
  /** Latest available version timestamp */
  latest: number;
  /** Current document timestamp */
  timestamp: number | null;
}

/**
 * Version information returned by the version store
 */
export interface VersionInfo {
  /** Version number of the document */
  version: number;

  /** Whether the document has unsaved changes */
  changed: boolean;

  /** Timestamp of the last update in milliseconds, used for debouncing, sorting etc */
  date: number;

  /** Cursor for navigating through version history */
  cursor: VersionCursor;
}

/**
 * Extended version information with helper methods
 */
export interface VersionInfoExtended extends VersionInfo {
  /** Whether the document has unsaved changes in local storage */
  getTrackingChanges: boolean;
}

/**
 * Document version history
 * Tracks the version history of documents for offline/online synchronization
 */
export type History = Record<ID, VersionInfo>;
