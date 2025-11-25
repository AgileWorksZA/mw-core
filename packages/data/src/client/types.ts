/**
 * Type definitions for MoneyWorks REST Client
 *
 * @moneyworks-dsl PURE
 * @ai-instruction These types support MoneyWorks REST API operations
 */

/**
 * Import mode for MoneyWorks import operations
 *
 * MoneyWorks-specific semantics:
 * - **insert**: Create new records only. Fails if record with same key exists.
 * - **update**: Update existing records only. Fails if record doesn't exist.
 * - **replace**: Replace/update existing records or create if not found (upsert).
 *
 * @ai-instruction These map to MoneyWorks REST API mode parameter
 */
export type ImportMode = "insert" | "update" | "replace";

/**
 * Legacy import mode aliases for backward compatibility
 * @deprecated Use ImportMode instead
 */
export type LegacyImportMode = "create" | "createOrUpdate";

/**
 * Options for import operations
 *
 * @ai-instruction Configure import behavior for MoneyWorks REST API
 */
export interface ImportOptions {
	/**
	 * Import mode - how to handle existing records
	 *
	 * - **insert**: Create new records only (fails if exists)
	 * - **update**: Update existing records only (fails if not found)
	 * - **replace**: Upsert - update if exists, create if not
	 *
	 * @default "replace"
	 */
	mode?: ImportMode;

	/**
	 * Let MoneyWorks work out field mappings automatically
	 *
	 * When true, MoneyWorks will attempt to match field names even if
	 * they're not in the exact expected format. Useful when field names
	 * in your data don't exactly match MoneyWorks field names.
	 *
	 * @default false
	 */
	workItOut?: boolean;

	/**
	 * Include calculated fields in import
	 *
	 * When true, MoneyWorks will recalculate calculated fields
	 * after import. Set to false if providing pre-calculated values.
	 *
	 * @default false
	 */
	calculated?: boolean;

	/**
	 * Return the imported records after successful import
	 *
	 * When true, the import result will include the actual records
	 * that were created/updated. Useful for getting server-generated
	 * values like sequence numbers.
	 *
	 * @default false
	 */
	returnImported?: boolean;

	/**
	 * Validate records before sending to MoneyWorks
	 *
	 * When true, performs client-side validation using canonical
	 * field validators before sending to MoneyWorks. Catches errors
	 * earlier with better error messages.
	 *
	 * @default true
	 */
	validate?: boolean;
}

/**
 * Error detail for a specific record or field that failed during import
 *
 * @ai-instruction Provides granular error information for import failures
 */
export interface ImportErrorDetail {
	/** Zero-based index of the record that failed */
	recordIndex: number;
	/** Field name that caused the error (if field-specific) */
	field?: string;
	/** Human-readable error message */
	message: string;
	/** Error code for programmatic handling */
	code?: string;
	/** The value that caused the error (if applicable) */
	value?: unknown;
}

/**
 * Result from an import operation
 *
 * @ai-instruction Provides detailed feedback on import operation results
 */
export interface ImportResult {
	/** Whether the import was successful (no errors) */
	success: boolean;
	/** Total number of records processed */
	processed: number;
	/** Number of records created (new records) */
	created: number;
	/** Number of records updated (existing records) */
	updated: number;
	/** Number of records skipped (no changes needed) */
	skipped: number;
	/** Number of errors encountered */
	errors: number;
	/**
	 * Detailed error information for each failed record
	 *
	 * @ai-instruction Use this to provide user feedback on what went wrong
	 */
	errorDetails: ImportErrorDetail[];
	/**
	 * The imported records if returnImported was true
	 *
	 * Contains the actual records as they exist in MoneyWorks after import,
	 * including any server-generated values.
	 */
	importedRecords?: Record<string, unknown>[];
	/**
	 * Raw response from MoneyWorks server
	 *
	 * Useful for debugging when the parsed result doesn't capture
	 * all information from the server response.
	 */
	rawResponse?: string;
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
