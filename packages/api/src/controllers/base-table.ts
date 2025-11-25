/**
 * Base Table Controller
 * Generic implementation for all MoneyWorks tables
 *
 * @moneyworks-dsl PURE
 */

import type {
	ExportFormat,
	ExportOptions,
	ImportMode,
	ImportOptions,
	ImportResult,
	SmartMoneyWorksClient,
} from "@moneyworks/data";

export interface TableExportParams {
	format?: ExportFormat;
	filter?: string;
	limit?: number;
	offset?: number;
	orderBy?: string;
}

export interface TableImportParams {
	/** Records to import */
	records: Record<string, unknown>[];
	/** Import mode: insert, update, or replace (upsert) */
	mode?: ImportMode;
	/** Let MoneyWorks work out field mappings */
	workItOut?: boolean;
	/** Include calculated fields */
	calculated?: boolean;
	/** Validate records before import */
	validate?: boolean;
}

export interface TableController {
	tableName: string;
	displayName: string;
	description: string;
	export(params: TableExportParams): Promise<any>;
	import(params: TableImportParams): Promise<ImportResult>;
	getSchema(): Promise<any>;
	validateExport(params: TableExportParams): void;
	validateImport(params: TableImportParams): void;
}

/**
 * Base controller for MoneyWorks tables
 */
export abstract class BaseTableController implements TableController {
	abstract readonly tableName: string;
	abstract readonly displayName: string;
	abstract readonly description: string;

	constructor(protected client: SmartMoneyWorksClient) {}

	/**
	 * Export table data with format support
	 */
	async export(params: TableExportParams): Promise<any> {
		// Validate parameters
		this.validateExport(params);

		const options: ExportOptions = {
			exportFormat: (params.format as any) || "full",
			search: params.filter,
			limit: params.limit,
			offset: params.offset,
			sort: params.orderBy,
		};

		try {
			const data = await this.client.smartExport(this.tableName, options);
			return data;
		} catch (error) {
			this.handleMoneyWorksError(error);
		}
	}

	/**
	 * Get table schema information
	 */
	async getSchema(): Promise<any> {
		try {
			// Ensure field structure is discovered
			await this.client.preDiscoverTables([this.tableName]);

			const structure = this.client.getFieldStructure(this.tableName);
			if (!structure) {
				throw new Error(`Schema not available for table ${this.tableName}`);
			}

			return {
				table: this.tableName,
				displayName: this.displayName,
				description: this.description,
				fields: structure.fields,
				primaryKey: this.getPrimaryKey(),
			};
		} catch (error) {
			this.handleMoneyWorksError(error);
		}
	}

	/**
	 * Validate export parameters
	 * Can be overridden by subclasses for specific validation
	 */
	validateExport(params: TableExportParams): void {
		// Validate limit
		if (params.limit !== undefined) {
			if (params.limit < 1 || params.limit > 10000) {
				throw new ValidationError(
					"INVALID_LIMIT",
					"Limit must be between 1 and 10000",
				);
			}
		}

		// Validate offset
		if (params.offset !== undefined && params.offset < 0) {
			throw new ValidationError(
				"INVALID_OFFSET",
				"Offset must be non-negative",
			);
		}

		// Validate format
		const validFormats = ["compact", "compact-headers", "full", "schema"];
		if (params.format) {
			// Check if format is a string and one of our custom formats
			if (
				typeof params.format === "string" &&
				!validFormats.includes(params.format)
			) {
				// Also allow MoneyWorks native formats
				if (!["tsv", "xml-terse", "xml-verbose"].includes(params.format)) {
					throw new ValidationError(
						"INVALID_FORMAT",
						`Format must be one of: ${validFormats.join(", ")}, tsv, xml-terse, xml-verbose, or an object with template/script`,
					);
				}
			}
			// Allow object formats with template or script
			else if (
				typeof params.format === "object" &&
				!("template" in params.format || "script" in params.format)
			) {
				throw new ValidationError(
					"INVALID_FORMAT",
					"Object format must have either template or script property",
				);
			}
		}

		// Subclasses can add table-specific validation
		this.validateTableSpecific(params);
	}

	/**
	 * Import records into the table
	 *
	 * @param params - Import parameters including records, mode, and options
	 * @returns ImportResult with success/error details
	 *
	 * @example
	 * const result = await controller.import({
	 *   records: [{ TaxCode: 'GST15', Rate: 15 }],
	 *   mode: 'insert'
	 * });
	 */
	async import(params: TableImportParams): Promise<ImportResult> {
		// Validate parameters
		this.validateImport(params);

		const options: ImportOptions = {
			mode: params.mode || "replace",
			workItOut: params.workItOut,
			calculated: params.calculated,
			validate: params.validate,
		};

		try {
			const result = await this.client.smartImport(
				this.tableName,
				params.records,
				options,
			);
			return result;
		} catch (error) {
			this.handleMoneyWorksError(error);
		}
	}

	/**
	 * Validate import parameters
	 */
	validateImport(params: TableImportParams): void {
		// Validate records array
		if (!params.records || !Array.isArray(params.records)) {
			throw new ValidationError(
				"INVALID_RECORDS",
				"Records must be a non-empty array",
			);
		}

		if (params.records.length === 0) {
			throw new ValidationError(
				"EMPTY_RECORDS",
				"At least one record is required for import",
			);
		}

		// Validate max records per request
		const maxRecords = 1000;
		if (params.records.length > maxRecords) {
			throw new ValidationError(
				"TOO_MANY_RECORDS",
				`Cannot import more than ${maxRecords} records at once`,
			);
		}

		// Validate mode if provided
		const validModes: ImportMode[] = ["insert", "update", "replace"];
		if (params.mode && !validModes.includes(params.mode)) {
			throw new ValidationError(
				"INVALID_MODE",
				`Mode must be one of: ${validModes.join(", ")}`,
			);
		}

		// Validate each record is an object
		for (let i = 0; i < params.records.length; i++) {
			const record = params.records[i];
			if (
				!record ||
				typeof record !== "object" ||
				Array.isArray(record)
			) {
				throw new ValidationError(
					"INVALID_RECORD",
					`Record at index ${i} must be an object`,
				);
			}
		}

		// Subclasses can add table-specific validation
		this.validateTableSpecificImport(params);
	}

	/**
	 * Table-specific import validation (override in subclasses)
	 */
	protected validateTableSpecificImport(params: TableImportParams): void {
		// Default: no additional validation
	}

	/**
	 * Table-specific validation (override in subclasses)
	 */
	protected validateTableSpecific(params: TableExportParams): void {
		// Default: no additional validation
	}

	/**
	 * Get primary key field (override in subclasses)
	 */
	protected getPrimaryKey(): string | undefined {
		return undefined;
	}

	/**
	 * Handle MoneyWorks-specific errors
	 */
	protected handleMoneyWorksError(error: any): never {
		if (error instanceof Error) {
			if (error.message.includes("MW_HTTP")) {
				throw new MoneyWorksError("MW_ERROR", error.message);
			}
			throw error;
		}
		// Handle plain objects thrown by the REST client
		if (error && typeof error === "object" && "message" in error) {
			throw new MoneyWorksError(
				error.code || "MW_ERROR",
				error.message,
			);
		}
		throw new Error(
			typeof error === "string" ? error : JSON.stringify(error),
		);
	}
}

/**
 * Custom error classes
 */
export class ValidationError extends Error {
	constructor(
		public code: string,
		message: string,
	) {
		super(message);
		this.name = "ValidationError";
	}
}

export class MoneyWorksError extends Error {
	constructor(
		public code: string,
		message: string,
	) {
		super(message);
		this.name = "MoneyWorksError";
	}
}
