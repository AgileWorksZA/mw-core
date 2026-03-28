/**
 * MoneyWorks REST API Client (Proper Implementation)
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This client correctly implements MoneyWorks REST API
 * @ai-critical MoneyWorks defaults to TSV format, supports XML and custom formats
 */

import type {
	ExportFormat,
	ImportOptions,
	ImportResult,
} from "../client/types";
import type {
	MoneyWorksConfig,
	MoneyWorksError,
	MoneyWorksQueryParams,
	MoneyWorksResponse,
} from "../config/types";

export interface ExportOptions extends MoneyWorksQueryParams {
	format?: ExportFormat;
	noLinger?: boolean;
	/**
	 * Our extended export format option
	 * @ai-instruction This overrides format for our custom formats
	 */
	exportFormat?: "compact" | "compact-headers" | "full" | "schema";
}

/**
 * MoneyWorks REST API Client
 * Properly handles MoneyWorks authentication and data formats
 *
 * @ai-instruction MoneyWorks REST API specifics:
 * - URL format: /REST/username:password@datafile/endpoint
 * - Default format is TSV (tab-separated values)
 * - JSON is NOT natively supported, only through XML conversion
 * - Authentication can be in URL or headers, not both
 */
export class MoneyWorksRESTClient {
	private config: MoneyWorksConfig;
	private baseUrl: string;
	private authHeaders: Record<string, string>;

	constructor(config: MoneyWorksConfig) {
		this.config = {
			protocol: "http",
			timeout: 30000,
			...config,
		};

		// Build base URL with authentication embedded
		// Format: http://host:port/REST/username:password@datafile
		const encodedDataFile = this.config.dataFile.replace(/\//g, "%2f");
		const encodedUsername = encodeURIComponent(this.config.username);
		const encodedPassword = encodeURIComponent(this.config.password || "");
		if (this.config.proxyBaseUrl) {
			this.baseUrl = `${this.config.proxyBaseUrl}/REST/${encodedUsername}:${encodedPassword}@${encodedDataFile}`;
		} else {
			this.baseUrl = `${this.config.protocol}://${this.config.host}:${this.config.port}/REST/${encodedUsername}:${encodedPassword}@${encodedDataFile}`;
		}

		console.log("[MoneyWorksRESTClient] Base URL:", this.baseUrl);

		// Build headers (no auth in headers when using URL auth)
		this.authHeaders = {
			Accept: "text/plain", // MoneyWorks defaults to TSV
		};
	}

	/**
	 * Parse TSV response from MoneyWorks
	 *
	 * @ai-instruction MoneyWorks TSV format:
	 * - NO HEADERS - field order must be known in advance
	 * - Tab-separated values (\t)
	 * - Empty fields are empty strings between tabs
	 * - Returns raw arrays, not objects with field names
	 */
	private parseTSV(data: string): any[] {
		// WARNING: This is a basic TSV parser that returns raw arrays
		// MoneyWorks TSV has NO headers, so field mapping must be done elsewhere
		// Use SmartMoneyWorksClient for automatic field discovery

		const lines = data.trim().split("\n");
		if (lines.length === 0) return [];

		const results: any[] = [];

		// Parse each line as array of values
		for (const line of lines) {
			const values = line.split("\t");
			results.push(values);
		}

		return results;
	}

	/**
	 * Export data from MoneyWorks table
	 *
	 * @ai-instruction MoneyWorks export endpoint:
	 * - Endpoint: /export
	 * - Query params: table, search, start, limit, orderby, format
	 * - Default format is TSV when format param is omitted
	 */
	async export(
		table: string,
		options: ExportOptions = {},
	): Promise<any[] | string> {
		// Build query parameters
		const params = new URLSearchParams();
		params.append("table", table);

		if (options.search) {
			params.append("search", options.search);
		}
		if (options.offset !== undefined) {
			params.append("start", options.offset.toString());
		}
		if (options.limit !== undefined) {
			params.append("limit", options.limit.toString());
		}
		if (options.sort) {
			params.append("orderby", options.sort);
		}

		// Handle format parameter
		const format = options.format || "tsv";
		if (format !== "tsv") {
			if (typeof format === "object") {
				if ("template" in format) {
					params.append("format", format.template);
				} else if ("script" in format) {
					params.append("format", format.script);
				}
			} else {
				params.append("format", format);
			}
		}
		// If format is TSV, don't add format parameter

		if (options.noLinger) {
			params.append("no_linger", "true");
		}

		const url = `${this.baseUrl}/export?${params.toString()}`;

		console.log("[MoneyWorksRESTClient] Export URL:", url);
		console.log(
			"[MoneyWorksRESTClient] Export params:",
			Object.fromEntries(params.entries()),
		);

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.authHeaders,
				signal: AbortSignal.timeout(this.config.timeout || 30000),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw {
					code: `MW_HTTP_${response.status}`,
					message: errorText || response.statusText,
					details: { status: response.status },
				} as MoneyWorksError;
			}

			const responseText = await response.text();

			// Check if response looks like an error
			const trimmed = responseText.trim();

			// Empty response could mean no matching records - that's OK for export
			if (trimmed.length === 0) {
				// Return empty array for TSV format
				if (format === "tsv") {
					return [];
				}
				// Return empty string for other formats
				return responseText;
			}

			// Check if response is an error message from MoneyWorks
			// Single word errors (like "error", "failed", etc.)
			if (
				trimmed.indexOf(" ") === -1 &&
				trimmed.indexOf("<") === -1 &&
				trimmed.indexOf("\t") === -1
			) {
				throw new Error(`MoneyWorks error response: ${trimmed}`);
			}

			// Multi-word error messages from MoneyWorks
			if (
				trimmed.startsWith("could not understand") ||
				trimmed.includes("Bad search expression") ||
				trimmed.includes("Expression optimisation failed") ||
				trimmed.startsWith("Malformed REST request")
			) {
				throw new Error(trimmed);
			}

			// Parse based on format
			if (format === "tsv") {
				return this.parseTSV(responseText);
			}

			// For XML or custom formats, return raw text
			return responseText;
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				throw {
					code: "MW_TIMEOUT",
					message: "Request timed out",
					details: { timeout: this.config.timeout },
				} as MoneyWorksError;
			}
			throw error;
		}
	}

	/**
	 * Evaluate a MoneyWorks expression
	 *
	 * @ai-instruction MoneyWorks evaluate endpoint:
	 * - Endpoint: /evaluate
	 * - Query param: expr (the MWScript expression)
	 * - Returns plain text result
	 */
	async evaluate(expression: string): Promise<string> {
		const params = new URLSearchParams({ expr: expression });
		const url = `${this.baseUrl}/evaluate?${params.toString()}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.authHeaders,
				signal: AbortSignal.timeout(this.config.timeout || 30000),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw {
					code: `MW_HTTP_${response.status}`,
					message: errorText || response.statusText,
					details: { status: response.status },
				} as MoneyWorksError;
			}

			return await response.text();
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				throw {
					code: "MW_TIMEOUT",
					message: "Request timed out",
					details: { timeout: this.config.timeout },
				} as MoneyWorksError;
			}
			throw error;
		}
	}

	/**
	 * Import records into MoneyWorks table
	 *
	 * @ai-instruction MoneyWorks import endpoint:
	 * - Endpoint: /import
	 * - Method: POST
	 * - Body: TSV or XML data
	 * - Query params: table, mode, work_it_out, calculated
	 */
	async import(
		table: string,
		records: any[],
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

		// Convert records to TSV format for import
		// This is a simplified version - real implementation would need proper field mapping
		const tsvData = this.recordsToTSV(records);

		const url = `${this.baseUrl}/import?${params.toString()}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					...this.authHeaders,
					"Content-Type": "text/plain",
				},
				body: tsvData,
				signal: AbortSignal.timeout(this.config.timeout || 30000),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw {
					code: `MW_HTTP_${response.status}`,
					message: errorText || response.statusText,
					details: { status: response.status },
				} as MoneyWorksError;
			}

			// Parse the response - MoneyWorks typically returns a summary
			const responseText = await response.text();

			// This is a simplified parser - actual format depends on MoneyWorks version
			const result: ImportResult = {
				success: true,
				processed: records.length,
				created: 0,
				updated: 0,
				skipped: 0,
				errors: 0,
				errorDetails: [],
			};

			// Parse response to extract actual counts
			// MoneyWorks response format varies, this is a basic implementation
			const lines = responseText.split("\n");
			for (const line of lines) {
				if (line.includes("created")) {
					const match = line.match(/(\d+) created/);
					if (match) result.created = Number.parseInt(match[1]);
				}
				if (line.includes("updated")) {
					const match = line.match(/(\d+) updated/);
					if (match) result.updated = Number.parseInt(match[1]);
				}
				if (line.includes("error") || line.includes("failed")) {
					result.errors++;
				}
			}

			return result;
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				throw {
					code: "MW_TIMEOUT",
					message: "Request timed out",
					details: { timeout: this.config.timeout },
				} as MoneyWorksError;
			}
			throw error;
		}
	}

	/**
	 * Get MoneyWorks server version
	 *
	 * @ai-instruction MoneyWorks version endpoint:
	 * - Endpoint: /version
	 * - Returns plain text version info
	 */
	async getVersion(): Promise<string> {
		const url = `${this.baseUrl}/version`;

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: this.authHeaders,
				signal: AbortSignal.timeout(this.config.timeout || 30000),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw {
					code: `MW_HTTP_${response.status}`,
					message: errorText || response.statusText,
					details: { status: response.status },
				} as MoneyWorksError;
			}

			const versionText = await response.text();
			// Extract version from response
			// Format typically includes server version, platform, etc.
			const versionMatch = versionText.match(/MoneyWorks[^\d]*(\d+\.\d+\.\d+)/);
			return versionMatch ? versionMatch[1] : versionText.trim();
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				throw {
					code: "MW_TIMEOUT",
					message: "Request timed out",
					details: { timeout: this.config.timeout },
				} as MoneyWorksError;
			}
			throw error;
		}
	}

	/**
	 * List available documents/data files
	 *
	 * @ai-instruction MoneyWorks list endpoint:
	 * - Endpoint: /list (at server level, not document level)
	 * - Returns list of accessible documents
	 */
	async listDocuments(): Promise<string[]> {
		// For listing documents, we need to use the server-level endpoint
		const serverUrl = `${this.config.protocol}://${this.config.host}:${this.config.port}/REST/list`;

		try {
			const response = await fetch(serverUrl, {
				method: "GET",
				headers: this.authHeaders,
				signal: AbortSignal.timeout(this.config.timeout || 30000),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw {
					code: `MW_HTTP_${response.status}`,
					message: errorText || response.statusText,
					details: { status: response.status },
				} as MoneyWorksError;
			}

			const listText = await response.text();
			// Parse the document list - format varies by MoneyWorks version
			// Typically returns one document per line
			const documents = listText
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line.length > 0);

			return documents;
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				throw {
					code: "MW_TIMEOUT",
					message: "Request timed out",
					details: { timeout: this.config.timeout },
				} as MoneyWorksError;
			}
			throw error;
		}
	}

	/**
	 * Convert records array to TSV format for import
	 * @private
	 */
	private recordsToTSV(records: any[]): string {
		if (records.length === 0) return "";

		// Get all unique keys from all records
		const allKeys = new Set<string>();
		records.forEach((record) => {
			Object.keys(record).forEach((key) => allKeys.add(key));
		});

		const keys = Array.from(allKeys);
		const lines: string[] = [];

		// Add each record as a TSV line
		for (const record of records) {
			const values = keys.map((key) => {
				const value = record[key];
				if (value === null || value === undefined) return "";
				if (typeof value === "string") return value;
				return String(value);
			});
			lines.push(values.join("\t"));
		}

		return lines.join("\n");
	}

	/**
	 * Test connection to MoneyWorks
	 */
	async testConnection(): Promise<boolean> {
		try {
			// Try to export one record from TaxRate table
			const result = await this.export("TaxRate", { limit: 1 });
			return Array.isArray(result) && result.length >= 0;
		} catch (error) {
			console.error("Connection test failed:", error);
			return false;
		}
	}
}
