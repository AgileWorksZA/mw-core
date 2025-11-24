/**
 * Type definitions for MoneyWorks REST Client
 *
 * @moneyworks-dsl PURE
 * @ai-instruction These types support MoneyWorks REST API operations
 */

/**
 * Import mode for MoneyWorks import operations
 */
export type ImportMode = "create" | "update" | "createOrUpdate";

/**
 * Options for import operations
 */
export interface ImportOptions {
	/** Import mode - how to handle existing records */
	mode?: ImportMode;
	/** Let MoneyWorks work out field mappings automatically */
	workItOut?: boolean;
	/** Include calculated fields in import */
	calculated?: boolean;
}

/**
 * Result from an import operation
 */
export interface ImportResult {
	/** Total number of records processed */
	processed: number;
	/** Number of records created */
	created: number;
	/** Number of records updated */
	updated: number;
	/** Number of errors encountered */
	errors: number;
	/** Detailed error information */
	errorDetails?: Array<{
		/** Record index that failed */
		record: number;
		/** Error message */
		message: string;
	}>;
}

/**
 * Global options passed to CLI commands
 */
export interface GlobalOptions {
	/** Enable debug output */
	debug?: boolean;
	/** Show timing information */
	timing?: boolean;
	/** Configuration file path */
	config?: string;
	/** Show help */
	help?: boolean;
	/** Show version */
	version?: boolean;
}

/**
 * MoneyWorks native export format options
 * @ai-instruction These are the formats MoneyWorks REST API supports
 */
export type MoneyWorksNativeFormat =
	| "tsv"
	| "xml-terse"
	| "xml-verbose"
	| { template: string }
	| { script: string };

/**
 * Extended export format options including our custom formats
 * @ai-instruction Use these for the full range of export capabilities
 */
export type ExportFormat =
	| MoneyWorksNativeFormat
	| "compact" // Raw arrays (same as TSV parsing)
	| "compact-headers" // Arrays with header row
	| "full" // Full objects with field names (default)
	| "schema"; // Objects with schema metadata

/**
 * Schema-enriched export format
 * @ai-instruction This format includes field metadata for maximum context
 */
export interface SchemaEnrichedExport<T = any> {
	/** Field schema information */
	schema: Record<
		string,
		{
			type: string;
			maxLength?: number;
			required?: boolean;
			description?: string;
		}
	>;
	/** The actual data */
	data: T[];
	/** Export metadata */
	metadata?: {
		table: string;
		exportedAt: string;
		recordCount: number;
	};
}

/**
 * Version information from MoneyWorks server
 */
export interface VersionInfo {
	/** Server version string */
	version: string;
	/** REST API version */
	restVersion?: string;
	/** Server platform */
	platform?: string;
}
