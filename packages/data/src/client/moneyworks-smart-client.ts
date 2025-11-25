/**
 * Smart MoneyWorks REST Client
 *
 * Uses field discovery to handle any table without hardcoded field mappings
 *
 * @moneyworks-dsl PURE
 */

import {
	type ExportOptions,
	MoneyWorksRESTClient,
} from "../client/moneyworks-rest-client";
import type {
	ImportErrorDetail,
	ImportOptions,
	ImportResult,
} from "../client/types";
import type { MoneyWorksConfig } from "../config/types";
import { addHeaders, arrayToObject, enrichWithSchema } from "../converters";
import {
	type FieldInfo,
	type TableStructure,
	discoverTableStructure,
	getCachedStructure,
} from "../parsers/field-discovery";

/**
 * Parse field value based on data type
 */
function parseFieldValue(
	value: string,
	dataType: "string" | "number" | "boolean" | "date",
): any {
	if (value === "") {
		return dataType === "string" ? "" : null;
	}

	switch (dataType) {
		case "number":
			return value.includes(".")
				? Number.parseFloat(value)
				: Number.parseInt(value, 10);
		case "boolean":
			return value === "1";
		case "date":
			return value; // Keep as YYYYMMDD string
		default:
			return value;
	}
}

export class SmartMoneyWorksClient extends MoneyWorksRESTClient {
	private discoveryCache = new Map<string, boolean>();

	/**
	 * Smart export that discovers field structure automatically
	 *
	 * @param table - Table name to export
	 * @param options - Export options including exportFormat
	 * @returns Data in the requested format
	 *
	 * @example
	 * // Get full objects (default)
	 * const data = await client.smartExport('TaxRate');
	 *
	 * // Get compact arrays
	 * const arrays = await client.smartExport('TaxRate', { exportFormat: 'compact' });
	 *
	 * // Get arrays with headers
	 * const withHeaders = await client.smartExport('TaxRate', { exportFormat: 'compact-headers' });
	 *
	 * // Get schema-enriched data
	 * const enriched = await client.smartExport('TaxRate', { exportFormat: 'schema' });
	 */
	async smartExport(
		table: string,
		options: ExportOptions = {},
	): Promise<any[] | any[][] | any> {
		// Ensure we have field structure for this table
		await this.ensureFieldStructure(table);

		// Get cached structure
		const structure = getCachedStructure(table);
		if (!structure) {
			throw new Error(`Field structure not found for table ${table}`);
		}

		// Extract our custom format option
		const { exportFormat = "full", ...restOptions } = options;

		// Now export as TSV for efficiency
		const tsvOptions = { ...restOptions, format: "tsv" as const };
		const rawData = await this.export(table, tsvOptions);

		// The REST client returns arrays for TSV format
		if (!Array.isArray(rawData)) {
			throw new Error("Unexpected response format from TSV export");
		}

		// Handle different export formats
		switch (exportFormat) {
			case "compact":
				// Return raw arrays as-is
				return rawData;

			case "compact-headers":
				// Add headers to the arrays
				return addHeaders(rawData, structure.fields);

			case "full":
				// Convert to objects (default behavior)
				return arrayToObject(rawData, structure.fields);

			case "schema": {
				// Convert to objects first, then enrich with schema
				const objects = arrayToObject(rawData, structure.fields);
				return enrichWithSchema(objects, structure, table);
			}

			default:
				throw new Error(`Unsupported export format: ${exportFormat}`);
		}
	}

	/**
	 * Ensure we have field structure for a table
	 *
	 * @param table - Table name
	 */
	private async ensureFieldStructure(table: string): Promise<void> {
		// Check if we already discovered this table
		if (this.discoveryCache.has(table)) {
			return;
		}

		// Discover field structure
		await discoverTableStructure(this, table);
		this.discoveryCache.set(table, true);
	}

	/**
	 * Export with explicit format choice
	 * Falls back to base implementation
	 */
	async exportWithFormat(
		table: string,
		format: "tsv" | "xml-terse" | "xml-verbose",
		options: Omit<ExportOptions, "format"> = {},
	): Promise<any[] | string> {
		return this.export(table, { ...options, format });
	}

	/**
	 * Get discovered field structure for a table
	 *
	 * @param table - Table name
	 * @returns Field structure or undefined if not discovered
	 */
	getFieldStructure(table: string) {
		return getCachedStructure(table);
	}

	/**
	 * Pre-discover multiple tables
	 * Useful for initialization
	 *
	 * @param tables - Array of table names to discover
	 */
	async preDiscoverTables(tables: string[]): Promise<void> {
		for (const table of tables) {
			await this.ensureFieldStructure(table);
		}
	}

	/**
	 * Test connection to MoneyWorks
	 * @returns true if connection is successful
	 */
	async testConnection(): Promise<boolean> {
		try {
			const result = await this.evaluate("1 + 1");
			return result.trim() === "2";
		} catch {
			return false;
		}
	}

	/**
	 * Get table information
	 * @param table - Table name
	 * @returns Table metadata
	 */
	async getTableInfo(table: string): Promise<any> {
		// MoneyWorks doesn't have a direct table info endpoint
		// We'll use field discovery instead
		const structure = await discoverTableStructure(this, table);
		return {
			table,
			fields: structure.fields.map((f) => f.name),
			fieldCount: structure.fields.length,
			structure,
		};
	}

	/**
	 * List available tables
	 * @returns Array of table names
	 */
	async listTables(): Promise<string[]> {
		// Return the known tables - MoneyWorks doesn't have a tables list endpoint
		return [
			"TaxRate",
			"Account",
			"Transaction",
			"Name",
			"Product",
			"Job",
			"Contact",
			"Department",
			"General",
			"Inventory",
			"Payment",
		];
	}

	/**
	 * Smart import that discovers field structure and converts objects to TSV
	 *
	 * This method:
	 * 1. Discovers the table structure via ensureFieldStructure()
	 * 2. Converts objects to TSV with correct field ordering
	 * 3. Calls the base import() method
	 * 4. Returns typed ImportResult
	 *
	 * @param table - Table name to import into
	 * @param records - Array of records to import
	 * @param options - Import options (mode, workItOut, calculated)
	 * @returns ImportResult with success/error details
	 *
	 * @example
	 * // Create new tax rate
	 * const result = await client.smartImport('TaxRate', [
	 *   { TaxCode: 'GST15', Rate: 15, Description: 'GST 15%' }
	 * ], { mode: 'insert' });
	 *
	 * @example
	 * // Update existing records
	 * const result = await client.smartImport('Name', [
	 *   { Code: 'CUST001', Name: 'Updated Customer Name' }
	 * ], { mode: 'update' });
	 *
	 * @ai-instruction This is the preferred method for importing data to MoneyWorks
	 */
	async smartImport(
		table: string,
		records: Record<string, unknown>[],
		options: ImportOptions = {},
	): Promise<ImportResult> {
		// Handle empty records array
		if (records.length === 0) {
			return {
				success: true,
				processed: 0,
				created: 0,
				updated: 0,
				skipped: 0,
				errors: 0,
				errorDetails: [],
			};
		}

		// Ensure we have field structure for this table
		await this.ensureFieldStructure(table);

		// Get cached structure
		const structure = getCachedStructure(table);
		if (!structure) {
			throw new Error(`Field structure not found for table ${table}`);
		}

		// Convert records to TSV format with proper field ordering
		const tsvData = this.recordsToOrderedTSV(records, structure);

		// Call base import method
		const baseResult = await this.import(table, [], {
			mode: options.mode,
			workItOut: options.workItOut,
			calculated: options.calculated,
		});

		// The base import expects raw records, but we need to use TSV
		// So we'll call the raw import endpoint directly
		return this.importTSV(table, tsvData, options);
	}

	/**
	 * Convert records to TSV format using discovered field structure
	 *
	 * @param records - Records to convert
	 * @param structure - Table structure with field ordering
	 * @returns TSV string with header row
	 */
	private recordsToOrderedTSV(
		records: Record<string, unknown>[],
		structure: TableStructure,
	): string {
		// Get all field names present in the records
		const recordFields = new Set<string>();
		for (const record of records) {
			for (const key of Object.keys(record)) {
				recordFields.add(key);
			}
		}

		// Match record fields to structure fields (case-insensitive)
		const fieldMap = new Map<string, FieldInfo>();
		for (const field of structure.fields) {
			const lowerName = field.name.toLowerCase();
			fieldMap.set(lowerName, field);
		}

		// Determine which fields to include (only fields present in records)
		const includedFields: FieldInfo[] = [];
		for (const recordField of recordFields) {
			const lowerField = recordField.toLowerCase();
			const structureField = fieldMap.get(lowerField);
			if (structureField) {
				includedFields.push(structureField);
			}
		}

		// Sort by position
		includedFields.sort((a, b) => a.position - b.position);

		// Build header row with field names
		const headers = includedFields.map((f) => f.name);

		// Build data rows
		const lines: string[] = [headers.join("\t")];

		for (const record of records) {
			const values: string[] = [];
			for (const field of includedFields) {
				// Find the value (case-insensitive match)
				let value: unknown = undefined;
				for (const [key, val] of Object.entries(record)) {
					if (key.toLowerCase() === field.name.toLowerCase()) {
						value = val;
						break;
					}
				}

				// Convert value to string
				values.push(this.valueToTSV(value, field.dataType));
			}
			lines.push(values.join("\t"));
		}

		return lines.join("\n");
	}

	/**
	 * Convert a value to TSV-compatible string
	 */
	private valueToTSV(
		value: unknown,
		dataType: "string" | "number" | "boolean" | "date",
	): string {
		if (value === null || value === undefined) {
			return "";
		}

		switch (dataType) {
			case "boolean":
				return value ? "1" : "0";
			case "number":
				return String(value);
			case "date":
				// Assume YYYYMMDD format already
				return String(value);
			default:
				// Escape tabs and newlines in strings
				return String(value).replace(/\t/g, " ").replace(/\n/g, " ");
		}
	}

	/**
	 * Import TSV data directly to MoneyWorks
	 *
	 * @param table - Table name
	 * @param tsvData - TSV formatted data (with header row)
	 * @param options - Import options
	 * @returns ImportResult
	 */
	private async importTSV(
		table: string,
		tsvData: string,
		options: ImportOptions = {},
	): Promise<ImportResult> {
		// Build query parameters
		const params = new URLSearchParams();
		params.append("table", table);

		if (options.mode) {
			params.append("mode", options.mode);
		}
		if (options.workItOut) {
			params.append("work_it_out", "true");
		}
		if (options.calculated) {
			params.append("calculated", "true");
		}

		// Access base class URL building through evaluate
		// We need to construct the URL manually
		const config = (this as any).config as MoneyWorksConfig;
		const encodedDataFile = config.dataFile.replace(/\//g, "%2f");
		const encodedUsername = encodeURIComponent(config.username);
		const encodedPassword = encodeURIComponent(config.password || "");
		const baseUrl = `${config.protocol || "http"}://${config.host}:${config.port}/REST/${encodedUsername}:${encodedPassword}@${encodedDataFile}`;

		const url = `${baseUrl}/import?${params.toString()}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					Accept: "text/plain",
					"Content-Type": "text/plain",
				},
				body: tsvData,
				signal: AbortSignal.timeout(config.timeout || 30000),
			});

			const responseText = await response.text();

			if (!response.ok) {
				return this.parseImportError(responseText, tsvData);
			}

			return this.parseImportResponse(responseText, tsvData);
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				return {
					success: false,
					processed: 0,
					created: 0,
					updated: 0,
					skipped: 0,
					errors: 1,
					errorDetails: [
						{
							recordIndex: -1,
							message: "Request timed out",
							code: "MW_TIMEOUT",
						},
					],
				};
			}
			throw error;
		}
	}

	/**
	 * Parse successful import response from MoneyWorks
	 */
	private parseImportResponse(
		responseText: string,
		tsvData: string,
	): ImportResult {
		// Count records from TSV (subtract 1 for header)
		const recordCount = tsvData.split("\n").length - 1;

		const result: ImportResult = {
			success: true,
			processed: recordCount,
			created: 0,
			updated: 0,
			skipped: 0,
			errors: 0,
			errorDetails: [],
			rawResponse: responseText,
		};

		// Parse MoneyWorks response for counts
		// Format varies, but typically includes lines like:
		// "X records created"
		// "Y records updated"
		const lines = responseText.split("\n");
		for (const line of lines) {
			const lowerLine = line.toLowerCase();

			// Check for created count
			const createdMatch = lowerLine.match(/(\d+)\s*(records?\s+)?created/);
			if (createdMatch) {
				result.created = Number.parseInt(createdMatch[1], 10);
			}

			// Check for updated count
			const updatedMatch = lowerLine.match(/(\d+)\s*(records?\s+)?updated/);
			if (updatedMatch) {
				result.updated = Number.parseInt(updatedMatch[1], 10);
			}

			// Check for errors
			if (lowerLine.includes("error") || lowerLine.includes("failed")) {
				result.errors++;
				result.success = false;
				result.errorDetails.push({
					recordIndex: -1,
					message: line.trim(),
				});
			}
		}

		// Calculate skipped
		result.skipped =
			result.processed - result.created - result.updated - result.errors;
		if (result.skipped < 0) result.skipped = 0;

		return result;
	}

	/**
	 * Parse import error response from MoneyWorks
	 */
	private parseImportError(responseText: string, tsvData: string): ImportResult {
		const recordCount = tsvData.split("\n").length - 1;

		const errorDetails: ImportErrorDetail[] = [];

		// Try to parse field-specific errors
		// MoneyWorks may return errors like:
		// "Record 1: Invalid value for field TaxCode"
		// "Line 2: Duplicate key"
		const lines = responseText.split("\n");
		for (const line of lines) {
			if (!line.trim()) continue;

			// Try to extract record index
			const recordMatch = line.match(/(?:record|line)\s*(\d+)/i);
			const recordIndex = recordMatch
				? Number.parseInt(recordMatch[1], 10) - 1
				: -1;

			// Try to extract field name
			const fieldMatch = line.match(/field\s+(\w+)/i);
			const field = fieldMatch ? fieldMatch[1] : undefined;

			errorDetails.push({
				recordIndex,
				field,
				message: line.trim(),
			});
		}

		// If no specific errors found, add generic error
		if (errorDetails.length === 0) {
			errorDetails.push({
				recordIndex: -1,
				message: responseText || "Import failed",
			});
		}

		return {
			success: false,
			processed: recordCount,
			created: 0,
			updated: 0,
			skipped: 0,
			errors: errorDetails.length,
			errorDetails,
			rawResponse: responseText,
		};
	}
}

/**
 * Create a smart MoneyWorks client
 */
export function createSmartClient(
	config: MoneyWorksConfig,
): SmartMoneyWorksClient {
	return new SmartMoneyWorksClient(config);
}
