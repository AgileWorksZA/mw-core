/**
 * Base Table Controller
 * Generic implementation for all MoneyWorks tables
 *
 * @moneyworks-dsl PURE
 */

import type { ExportOptions, SmartMoneyWorksClient } from "@moneyworks/data";
import type { ExportFormat } from "@moneyworks/data";

export interface TableExportParams {
	format?: ExportFormat;
	filter?: string;
	limit?: number;
	offset?: number;
	orderBy?: string;
}

export interface TableController {
	tableName: string;
	displayName: string;
	description: string;
	export(params: TableExportParams): Promise<any>;
	getSchema(): Promise<any>;
	validateExport(params: TableExportParams): void;
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
