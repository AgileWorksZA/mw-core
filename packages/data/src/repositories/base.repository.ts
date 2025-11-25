/**
 * Base Repository Pattern for MoneyWorks Entities
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This is the base class for all MoneyWorks repositories
 * @ai-critical Use MoneyWorks terminology in all methods
 */

import type { SmartMoneyWorksClient } from "../client/moneyworks-smart-client";
import type { ImportOptions, ImportResult } from "../client/types";
import type {
	MoneyWorksQueryParams,
	MoneyWorksResponse,
} from "../config/types";
import { getCachedStructure } from "../parsers/field-discovery";
import { validateRecordsForImport } from "../validators/import-validator";

/**
 * Base repository interface for MoneyWorks entities
 *
 * @ai-instruction All repositories must implement these methods
 */
export interface IMoneyWorksRepository<
	T,
	TCreate = Partial<T>,
	TUpdate = Partial<T>,
> {
	/**
	 * Find records by MoneyWorks search expression
	 * @ai-term Say "find", NEVER "query" or "select"
	 */
	find(search?: string, params?: MoneyWorksQueryParams): Promise<T[]>;

	/**
	 * Find one record by key
	 * @ai-term Say "findByKey", NEVER "findById" or "get"
	 */
	findByKey(key: string): Promise<T | null>;

	/**
	 * Find all records
	 * @ai-term Say "findAll", NEVER "getAll" or "list"
	 */
	findAll(params?: MoneyWorksQueryParams): Promise<T[]>;

	/**
	 * Create new record
	 * @ai-term Say "create", NEVER "insert" or "add"
	 */
	create(data: TCreate, options?: Partial<ImportOptions>): Promise<T>;

	/**
	 * Update existing record
	 * @ai-term Say "update", NEVER "patch" or "modify"
	 */
	update(
		key: string,
		data: TUpdate,
		options?: Partial<ImportOptions>,
	): Promise<T>;

	/**
	 * Create or update record (upsert)
	 * @ai-term Say "upsert", uses MoneyWorks replace mode
	 */
	upsert(data: TCreate | TUpdate, options?: Partial<ImportOptions>): Promise<T>;

	/**
	 * Bulk create multiple records
	 * @ai-term Say "bulkCreate" for batch inserts
	 */
	bulkCreate(
		records: TCreate[],
		options?: Partial<ImportOptions>,
	): Promise<ImportResult>;

	/**
	 * Bulk upsert multiple records
	 * @ai-term Say "bulkUpsert" for batch upserts
	 */
	bulkUpsert(
		records: (TCreate | TUpdate)[],
		options?: Partial<ImportOptions>,
	): Promise<ImportResult>;

	/**
	 * Delete record
	 * @ai-term Say "delete", NEVER "remove" or "destroy"
	 */
	delete(key: string): Promise<void>;
}

/**
 * Abstract base repository for MoneyWorks entities
 *
 * @ai-instruction Extend this class for each MoneyWorks entity
 * @ai-critical Uses smart field discovery - no manual parsing needed
 */
export abstract class BaseMoneyWorksRepository<
	T,
	TCreate = Partial<T>,
	TUpdate = Partial<T>,
> implements IMoneyWorksRepository<T, TCreate, TUpdate>
{
	/**
	 * MoneyWorks table name
	 * @ai-term Use exact MoneyWorks table name (e.g., "TaxRate", "Account")
	 */
	protected abstract readonly tableName: string;

	/**
	 * Primary key field name
	 * @ai-term Use exact MoneyWorks field name (e.g., "TaxCode", "Code")
	 */
	protected abstract readonly primaryKey: string;

	constructor(protected readonly client: SmartMoneyWorksClient) {}

	/**
	 * Post-process data after smart export (optional)
	 * Override to add branded types or additional transformations
	 *
	 * @ai-instruction The smart client already handles field discovery and basic parsing
	 */
	protected postProcess(record: any): T {
		// Default implementation - just return as-is
		// Override in specific repositories to add branded types
		return record as T;
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * @ai-instruction Override this to convert typed data to MW format
	 * @ai-critical Must handle date formatting, enum values, etc.
	 */
	protected abstract prepare(data: TCreate | TUpdate): any;

	/**
	 * Find records by MoneyWorks search expression
	 *
	 * @example
	 * // Find all GST tax rates
	 * await repo.find("TaxCode CONTAINS 'GST'");
	 *
	 * @ai-instruction Use MoneyWorks search syntax
	 */
	async find(
		search?: string,
		params: MoneyWorksQueryParams = {},
	): Promise<T[]> {
		// Smart export handles field discovery automatically
		const data = await this.client.smartExport(this.tableName, {
			...params,
			search,
		});

		// Apply post-processing to add branded types if needed
		return data.map((record: any) => this.postProcess(record));
	}

	/**
	 * Find one record by primary key
	 *
	 * @ai-instruction MoneyWorks uses exact match on primary key
	 */
	async findByKey(key: string): Promise<T | null> {
		// MoneyWorks search syntax: use double quotes for strings, no quotes for numbers
		const isNumeric = /^\d+$/.test(key);
		const search = isNumeric
			? `${this.primaryKey}=${key}`
			: `${this.primaryKey}="${key}"`;

		const data = await this.client.smartExport(this.tableName, {
			search,
			limit: 1,
		});

		if (data.length === 0) {
			return null;
		}

		return this.postProcess(data[0]);
	}

	/**
	 * Find all records with optional pagination
	 *
	 * @ai-instruction Use for listing all records of an entity
	 */
	async findAll(params: MoneyWorksQueryParams = {}): Promise<T[]> {
		const data = await this.client.smartExport(this.tableName, params);
		return data.map((record: any) => this.postProcess(record));
	}

	/**
	 * Create new record in MoneyWorks
	 *
	 * @ai-instruction MoneyWorks validates all required fields
	 * @param data - Record data to create
	 * @param options - Import options (validate, workItOut, calculated)
	 * @returns The created record (fetched back from MoneyWorks)
	 *
	 * @example
	 * const newTaxRate = await repo.create({
	 *   TaxCode: 'GST15',
	 *   Rate: 15,
	 *   Description: 'GST 15%'
	 * });
	 */
	async create(data: TCreate, options: Partial<ImportOptions> = {}): Promise<T> {
		// Prepare data for MoneyWorks
		const prepared = this.prepare(data);

		// Validate before sending if requested (default: true)
		if (options.validate !== false) {
			await this.validateBeforeImport([prepared]);
		}

		// Import with insert mode
		const result = await this.client.smartImport(
			this.tableName,
			[prepared],
			{
				mode: "insert",
				workItOut: options.workItOut,
				calculated: options.calculated,
			},
		);

		if (!result.success) {
			const errorMsg = result.errorDetails
				.map((e) => e.message)
				.join("; ");
			throw new Error(`Create failed: ${errorMsg}`);
		}

		// Fetch the created record back
		const keyValue = prepared[this.primaryKey];
		if (!keyValue) {
			throw new Error(`Primary key '${this.primaryKey}' not found in created data`);
		}

		const created = await this.findByKey(String(keyValue));
		if (!created) {
			throw new Error(`Failed to retrieve created record with key ${keyValue}`);
		}

		return created;
	}

	/**
	 * Update existing record in MoneyWorks
	 *
	 * @ai-instruction MoneyWorks requires primary key for updates
	 * @param key - Primary key of the record to update
	 * @param data - Fields to update
	 * @param options - Import options (validate, workItOut, calculated)
	 * @returns The updated record (fetched back from MoneyWorks)
	 *
	 * @example
	 * const updated = await repo.update('GST', { Rate: 15 });
	 */
	async update(
		key: string,
		data: TUpdate,
		options: Partial<ImportOptions> = {},
	): Promise<T> {
		// Prepare data for MoneyWorks
		const prepared = this.prepare(data);

		// Ensure primary key is included
		prepared[this.primaryKey] = key;

		// Validate before sending if requested (default: true)
		if (options.validate !== false) {
			await this.validateBeforeImport([prepared]);
		}

		// Import with update mode
		const result = await this.client.smartImport(
			this.tableName,
			[prepared],
			{
				mode: "update",
				workItOut: options.workItOut,
				calculated: options.calculated,
			},
		);

		if (!result.success) {
			const errorMsg = result.errorDetails
				.map((e) => e.message)
				.join("; ");
			throw new Error(`Update failed: ${errorMsg}`);
		}

		// Fetch the updated record back
		const updated = await this.findByKey(key);
		if (!updated) {
			throw new Error(`Failed to retrieve updated record with key ${key}`);
		}

		return updated;
	}

	/**
	 * Create or update record in MoneyWorks (upsert)
	 *
	 * @ai-instruction Uses MoneyWorks replace mode for upsert behavior
	 * @param data - Record data to create or update
	 * @param options - Import options (validate, workItOut, calculated)
	 * @returns The created/updated record (fetched back from MoneyWorks)
	 *
	 * @example
	 * // Will create if doesn't exist, update if exists
	 * const result = await repo.upsert({
	 *   TaxCode: 'GST15',
	 *   Rate: 15,
	 *   Description: 'GST 15%'
	 * });
	 */
	async upsert(
		data: TCreate | TUpdate,
		options: Partial<ImportOptions> = {},
	): Promise<T> {
		// Prepare data for MoneyWorks
		const prepared = this.prepare(data);

		// Validate before sending if requested (default: true)
		if (options.validate !== false) {
			await this.validateBeforeImport([prepared]);
		}

		// Import with replace mode (upsert)
		const result = await this.client.smartImport(
			this.tableName,
			[prepared],
			{
				mode: "replace",
				workItOut: options.workItOut,
				calculated: options.calculated,
			},
		);

		if (!result.success) {
			const errorMsg = result.errorDetails
				.map((e) => e.message)
				.join("; ");
			throw new Error(`Upsert failed: ${errorMsg}`);
		}

		// Fetch the created/updated record back
		const keyValue = prepared[this.primaryKey];
		if (!keyValue) {
			throw new Error(`Primary key '${this.primaryKey}' not found in data`);
		}

		const record = await this.findByKey(String(keyValue));
		if (!record) {
			throw new Error(`Failed to retrieve record with key ${keyValue}`);
		}

		return record;
	}

	/**
	 * Bulk create multiple records
	 *
	 * @ai-instruction More efficient than creating one by one
	 * @param records - Array of records to create
	 * @param options - Import options
	 * @returns Import result with success/error details
	 *
	 * @example
	 * const result = await repo.bulkCreate([
	 *   { TaxCode: 'GST15', Rate: 15 },
	 *   { TaxCode: 'GST10', Rate: 10 }
	 * ]);
	 */
	async bulkCreate(
		records: TCreate[],
		options: Partial<ImportOptions> = {},
	): Promise<ImportResult> {
		// Prepare all records
		const prepared = records.map((r) => this.prepare(r));

		// Validate before sending if requested (default: true)
		if (options.validate !== false) {
			await this.validateBeforeImport(prepared);
		}

		// Import with insert mode
		return this.client.smartImport(this.tableName, prepared, {
			mode: "insert",
			workItOut: options.workItOut,
			calculated: options.calculated,
		});
	}

	/**
	 * Bulk upsert multiple records
	 *
	 * @ai-instruction More efficient than upserting one by one
	 * @param records - Array of records to create or update
	 * @param options - Import options
	 * @returns Import result with success/error details
	 *
	 * @example
	 * const result = await repo.bulkUpsert([
	 *   { TaxCode: 'GST15', Rate: 15 },
	 *   { TaxCode: 'GST10', Rate: 10 }
	 * ]);
	 */
	async bulkUpsert(
		records: (TCreate | TUpdate)[],
		options: Partial<ImportOptions> = {},
	): Promise<ImportResult> {
		// Prepare all records
		const prepared = records.map((r) => this.prepare(r));

		// Validate before sending if requested (default: true)
		if (options.validate !== false) {
			await this.validateBeforeImport(prepared);
		}

		// Import with replace mode (upsert)
		return this.client.smartImport(this.tableName, prepared, {
			mode: "replace",
			workItOut: options.workItOut,
			calculated: options.calculated,
		});
	}

	/**
	 * Validate records before import
	 *
	 * @ai-instruction Called automatically if validate option is true
	 * @throws ValidationError if any records are invalid
	 */
	protected async validateBeforeImport(
		records: Record<string, unknown>[],
	): Promise<void> {
		// Ensure field structure is discovered
		await this.client.preDiscoverTables([this.tableName]);

		const structure = getCachedStructure(this.tableName);
		if (!structure) {
			// Can't validate without structure, skip validation
			return;
		}

		const result = validateRecordsForImport(records, structure);

		if (!result.valid) {
			const errorMessages: string[] = [];
			for (const recordError of result.recordErrors) {
				for (const error of recordError.errors) {
					errorMessages.push(
						`Record ${recordError.recordIndex}: ${error.field} - ${error.message}`,
					);
				}
			}
			throw new Error(`Validation failed:\n${errorMessages.join("\n")}`);
		}
	}

	/**
	 * Delete record from MoneyWorks
	 *
	 * @ai-instruction MoneyWorks may prevent deletion if record is referenced
	 */
	async delete(key: string): Promise<void> {
		// TODO: Implement delete endpoint
		// MoneyWorks REST API doesn't have a direct delete endpoint
		// This would need to be implemented via MWScript or custom handling
		throw new Error(
			`Delete operation not yet implemented for ${this.tableName}`,
		);
	}

	/**
	 * Check if record exists
	 *
	 * @ai-instruction Useful for validation before operations
	 */
	async exists(key: string): Promise<boolean> {
		const record = await this.findByKey(key);
		return record !== null;
	}

	/**
	 * Count records matching search
	 *
	 * @ai-instruction MoneyWorks doesn't have COUNT, so we fetch with limit
	 */
	async count(search?: string): Promise<number> {
		// MoneyWorks doesn't have a direct count endpoint
		// We could fetch all and count, but that's inefficient
		// For now, fetch with reasonable limit
		const data = await this.client.smartExport(this.tableName, {
			search,
			limit: 1000, // Reasonable limit
		});

		return data.length;
	}

	/**
	 * Find records with related data
	 *
	 * @ai-instruction Override in specific repositories to handle relationships
	 */
	async findWithRelated(
		search?: string,
		params?: MoneyWorksQueryParams,
	): Promise<T[]> {
		// Base implementation just returns regular find
		// Override in specific repositories to join related data
		return this.find(search, params);
	}
}

/**
 * Repository factory function
 *
 * @ai-instruction Use to create repository instances with shared client
 */
export function createRepository<
	T extends BaseMoneyWorksRepository<any, any, any>,
>(
	RepositoryClass: new (client: SmartMoneyWorksClient) => T,
	client: SmartMoneyWorksClient,
): T {
	return new RepositoryClass(client);
}
