/**
 * Snapshot Types and Interfaces
 * Types for database snapshot capture and storage
 *
 * @moneyworks-dsl PURE
 */

/**
 * Metadata about a snapshot capture
 */
export interface SnapshotMetadata {
	/** Human-readable label for this snapshot */
	label: string;
	/** ISO timestamp when snapshot was taken */
	timestamp: string;
	/** List of table names included in this snapshot */
	tables: string[];
	/** Total record count across all tables */
	totalRecords: number;
	/** MoneyWorks document name (from config) */
	dataFile?: string;
}

/**
 * Snapshot of a single table
 */
export interface TableSnapshot {
	/** MoneyWorks table name (e.g., "TaxRate", "Name", "Transaction") */
	tableName: string;
	/** Number of records in this table snapshot */
	recordCount: number;
	/** All records from the table in full object format */
	records: SnapshotRecord[];
	/** ISO timestamp when this table was captured */
	capturedAt: string;
}

/**
 * A single record in a snapshot
 * Uses MoneyWorks field names directly (canonical DSL)
 */
export interface SnapshotRecord {
	/** Primary key - SequenceNumber for most tables, Code for lookup tables */
	_primaryKey: string | number;
	/** The actual record data with MoneyWorks field names */
	[field: string]: unknown;
}

/**
 * Complete snapshot including metadata and all table data
 */
export interface Snapshot {
	/** Snapshot metadata */
	metadata: SnapshotMetadata;
	/** Map of table name to table snapshot */
	tables: Record<string, TableSnapshot>;
}

/**
 * Options for taking a snapshot
 */
export interface SnapshotOptions {
	/** Label for this snapshot (used in directory name) */
	label: string;
	/** Specific tables to include (default: all registered tables) */
	tables?: string[];
	/** Output directory (default: .snapshots) */
	outputDir?: string;
	/** Show progress output */
	verbose?: boolean;
}

/**
 * Result of a snapshot operation
 */
export interface SnapshotResult {
	/** Whether the snapshot was successful */
	success: boolean;
	/** Path to the snapshot directory */
	path: string;
	/** Snapshot metadata */
	metadata: SnapshotMetadata;
	/** Any errors encountered (keyed by table name) */
	errors?: Record<string, string>;
}

/**
 * Tables that are available in MoneyWorks REST API for snapshotting
 *
 * Note: MoneyWorks uses PLURAL names for subfile tables (Contacts, Payments)
 * but SINGULAR for most others. Category1-6, SalesArea are FIELDS not tables.
 */
export const SNAPSHOT_TABLES = [
	// Core implemented tables
	"TaxRate",
	"Name",
	"Account",
	"Product",
	"Transaction",
	"Detail",
	"Job",
	// Subfile tables (PLURAL names)
	"Contacts",
	"Payments",
	// Available but NOT yet implemented
	"Department",
	"General",
	"Inventory",
	"Message",
	"Build",
	"User",
	"Login",
	"OffLedger",
] as const;

export type SnapshotTableName = (typeof SNAPSHOT_TABLES)[number];

/**
 * Get the primary key field for a given table
 * Most tables use Sequencenumber (note: lowercase 'n' from MW REST API),
 * but some use Code or other identifiers
 */
export function getPrimaryKeyField(tableName: string): string {
	switch (tableName) {
		// Code-based lookup tables
		case "TaxRate":
			return "TaxCode";
		case "Account":
			return "Code";
		case "Job":
			return "Code";
		case "Department":
			return "Code";
		// User-related tables
		case "User":
			return "Name";
		case "Login":
			return "Name";
		// Most other tables use Sequencenumber (lowercase 'n' - actual MW field name)
		default:
			return "Sequencenumber";
	}
}
