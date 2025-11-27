/**
 * Snapshot Module
 * Exports all snapshot-related commands and utilities
 */

// Types
export type {
	SnapshotMetadata,
	TableSnapshot,
	SnapshotRecord,
	Snapshot,
	SnapshotOptions,
	SnapshotResult,
	SnapshotTableName,
} from "./types";

export { SNAPSHOT_TABLES, getPrimaryKeyField } from "./types";

// Diff Types
export type {
	FieldChange,
	RecordDiff,
	TableDiff,
	AddedRecord,
	DeletedRecord,
	DiffResult,
	DiffSummary,
	DiffOptions,
	LoadedSnapshot,
} from "./diff-types";

// Commands
export { snapshotCommand, takeSnapshot } from "./snapshot";
export { diffCommand } from "./diff";
export { actionMapCommand, generateActionMap } from "./action-map";

// Engine
export { compareSnapshots, loadSnapshot } from "./diff-engine";
