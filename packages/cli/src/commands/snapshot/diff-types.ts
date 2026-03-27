/**
 * Diff Types and Result Structures
 * Types for comparing snapshots and identifying changes
 *
 * @moneyworks-dsl PURE
 */

/**
 * A single field change within a record
 */
export interface FieldChange {
	/** Field name (MoneyWorks canonical name) */
	field: string;
	/** Value in the 'before' snapshot */
	oldValue: unknown;
	/** Value in the 'after' snapshot */
	newValue: unknown;
}

/**
 * Diff for a single record
 */
export interface RecordDiff {
	/** Primary key value identifying this record */
	primaryKey: string | number;
	/** Primary key field name (e.g., "SequenceNumber", "TaxCode") */
	primaryKeyField: string;
	/** List of fields that changed */
	changes: FieldChange[];
}

/**
 * Diff results for a single table
 */
export interface TableDiff {
	/** Table name */
	tableName: string;
	/** Records that exist in 'after' but not in 'before' */
	added: AddedRecord[];
	/** Records that exist in 'before' but not in 'after' */
	deleted: DeletedRecord[];
	/** Records that exist in both but have different field values */
	modified: RecordDiff[];
	/** Count statistics */
	counts: {
		added: number;
		deleted: number;
		modified: number;
		unchanged: number;
	};
}

/**
 * A record that was added (exists only in 'after')
 */
export interface AddedRecord {
	/** Primary key value */
	primaryKey: string | number;
	/** The full record data */
	record: Record<string, unknown>;
}

/**
 * A record that was deleted (exists only in 'before')
 */
export interface DeletedRecord {
	/** Primary key value */
	primaryKey: string | number;
	/** The full record data that was deleted */
	record: Record<string, unknown>;
}

/**
 * Complete diff result comparing two snapshots
 */
export interface DiffResult {
	/** Label of the 'before' snapshot */
	beforeLabel: string;
	/** Label of the 'after' snapshot */
	afterLabel: string;
	/** ISO timestamp when diff was computed */
	computedAt: string;
	/** Per-table diff results */
	tables: TableDiff[];
	/** Summary statistics across all tables */
	summary: DiffSummary;
}

/**
 * Summary statistics for the entire diff
 */
export interface DiffSummary {
	/** Total tables compared */
	tablesCompared: number;
	/** Tables with changes */
	tablesWithChanges: number;
	/** Total records added across all tables */
	totalAdded: number;
	/** Total records deleted across all tables */
	totalDeleted: number;
	/** Total records modified across all tables */
	totalModified: number;
	/** Total unchanged records */
	totalUnchanged: number;
}

/**
 * Options for comparing snapshots
 */
export interface DiffOptions {
	/** Specific tables to compare (default: all common tables) */
	tables?: string[];
	/** Ignore certain fields when comparing (e.g., timestamps) */
	ignoreFields?: string[];
	/** Include unchanged records in output */
	includeUnchanged?: boolean;
	/** Show detailed field-level changes */
	detailed?: boolean;
}

/**
 * Result of loading a snapshot for diffing
 */
export interface LoadedSnapshot {
	/** Snapshot label */
	label: string;
	/** Path to snapshot directory */
	path: string;
	/** Table data loaded from JSON files */
	tables: Map<string, Record<string, unknown>[]>;
	/** Tables that were found */
	availableTables: string[];
}
