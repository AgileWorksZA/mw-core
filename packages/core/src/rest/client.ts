/**
 * MoneyWorks REST Client
 *
 * Main client for interacting with MoneyWorks REST API.
 */

import { ExportParser } from "../export/parser";
import type { TableMapCamel, TableName } from "../tables";
import { XMLBuilder } from "../xml/builder";
import { parseXMLWithSchema } from "../xml/schema-parser";
import {
  buildAuthHeaders,
  buildRESTUrl,
  maskConfig,
  parseAuthError,
  validateConfig,
} from "./auth";
import { MoneyWorksError } from "./errors";
import type {
  AuthHeaders,
  ExportFormat,
  ExportOptions,
  ImportOptions,
  ImportResult,
  MoneyWorksConfig,
  RESTResponse,
  StreamOptions,
} from "./types";
import { DEFAULT_CONFIG, MoneyWorksErrorCode, REST_ENDPOINTS } from "./types";

/**
 * MoneyWorks REST API Client
 */
export class MoneyWorksRESTClient {
  private config: MoneyWorksConfig;
  private authHeaders: AuthHeaders;

  constructor(config: MoneyWorksConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    validateConfig(this.config);
    this.authHeaders = buildAuthHeaders(this.config);

    if (this.config.debug) {
      console.log(
        "MoneyWorks REST Client initialized:",
        maskConfig(this.config),
      );
    }
  }

  /**
   * Clean headers to remove undefined values
   */
  private cleanHeaders(headers: AuthHeaders): Record<string, string> {
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  /**
   * Export records from a table
   */
  async export<T extends TableName>(
    table: T,
    options: ExportOptions = {},
  ): Promise<TableMapCamel[T][] | string> {
    let format = options.format || "json"; // Default to JSON, not XML

    // Handle 'json' as a special case - export as XML and convert
    const isJsonFormat = format === "json";
    if (isJsonFormat) {
      format = "xml-verbose";
    }
    
    if (this.config.debug) {
      console.log("Export options:", { 
        originalFormat: options.format,
        format, 
        isJsonFormat,
        table 
      });
    }

    // Build query parameters
    const params = new URLSearchParams({
      table,
      format: this.getFormatParam(format),
      ...(options.filter && { filter: options.filter }),
      ...(options.start !== undefined && { start: options.start.toString() }),
      ...(options.limit !== undefined && { limit: options.limit.toString() }),
      ...(options.orderBy && { orderby: options.orderBy }),
      ...(options.noLinger && { no_linger: "true" }),
    });

    // Add custom template/script if needed
    this.addCustomFormatParams(params, format);

    // Make request
    const url = buildRESTUrl(this.config, REST_ENDPOINTS.EXPORT, params);
    
    if (this.config.debug) {
      console.log("Export URL:", url);
      console.log("Format param:", this.getFormatParam(format));
    }
    
    const response = await this.makeRequest(url, {
      method: "GET",
      headers: this.cleanHeaders(this.authHeaders),
    });

    const data = await response.text();
    
    if (this.config.debug) {
      console.log(`Response data (first 200 chars): ${data.substring(0, 200)}`);
    }
    
    // Check if we got a valid response
    if (!data || data.trim().length === 0) {
      throw new MoneyWorksError(
        MoneyWorksErrorCode.INVALID_RESPONSE,
        "Empty response from server"
      );
    }
    
    // Check if response is just a single word (likely an error)
    if (data.trim().indexOf(' ') === -1 && data.trim().indexOf('<') === -1 && data.trim().indexOf('\t') === -1) {
      throw new MoneyWorksError(
        MoneyWorksErrorCode.INVALID_RESPONSE,
        `Invalid response from server: ${data.trim()}`
      );
    }

    // Parse based on format
    if (
      typeof format === "string" &&
      (format === "xml-terse" || format === "xml-verbose")
    ) {
      // For XML formats, return raw XML unless JSON was explicitly requested
      if (isJsonFormat) {
        // Use schema-aware parser for better validation and typing
        return await parseXMLWithSchema<T>(data, table, format);
      }
      if (this.config.debug) {
        console.log("Returning raw XML for format:", format);
      }
      return data; // Return raw XML string
    }

    if (format === "tsv") {
      // For TSV, always parse to array (can't use raw TSV as easily)
      return ExportParser.parseTSV<T>(data, table);
    }

    if (format === "json" || isJsonFormat) {
      // JSON format - parse the XML and return as JSON with schema validation
      return await parseXMLWithSchema<T>(data, table, "xml-verbose");
    }

    // Return raw data for custom formats
    return data;
  }

  /**
   * Stream export for large datasets
   */
  async *exportStream<T extends TableName>(
    table: T,
    options: StreamOptions = {},
  ): AsyncGenerator<TableMapCamel[T][], void, unknown> {
    const chunkSize = options.chunkSize || 1000;
    let offset = 0;
    let hasMore = true;
    let total: number | undefined;

    while (hasMore) {
      const batch = await this.export(table, {
        ...options,
        start: offset,
        limit: chunkSize,
      });

      // Handle string responses (shouldn't happen with streaming)
      if (typeof batch === "string") {
        throw new MoneyWorksError(
          MoneyWorksErrorCode.INVALID_REQUEST,
          "Streaming not supported for this format",
        );
      }

      // First batch - try to get total count
      if (offset === 0 && batch.length > 0) {
        try {
          const countResult = await this.evaluate(
            `Count(${table}, ${options.filter || "true"})`,
          );
          total = Number.parseInt(countResult);
        } catch {
          // Ignore count errors
        }
      }

      // Progress callback
      if (options.onProgress) {
        options.onProgress({
          current: offset + batch.length,
          total,
          percentage: total
            ? ((offset + batch.length) / total) * 100
            : undefined,
        });
      }

      if (batch.length === 0) {
        hasMore = false;
      } else {
        yield batch;
        offset += batch.length;
        hasMore = batch.length === chunkSize;
      }
    }
  }

  /**
   * Import records into a table
   */
  async import<T extends TableName>(
    table: T,
    records: Partial<TableMapCamel[T]>[],
    options: ImportOptions = {},
  ): Promise<ImportResult> {
    // Build XML for import
    const xml = XMLBuilder.build(table, records, {
      mode: options.mode || "create",
      workItOut: options.workItOut,
      calculated: options.calculated,
    });

    // Make request
    const url = buildRESTUrl(this.config, REST_ENDPOINTS.IMPORT);
    const response = await this.makeRequest(url, {
      method: "POST",
      headers: {
        ...this.authHeaders,
        "Content-Type": "text/xml",
      },
      body: xml,
    });

    const responseText = await response.text();

    // Parse import result
    return this.parseImportResult(responseText, records.length);
  }

  /**
   * Evaluate a MWScript expression
   */
  async evaluate(expression: string): Promise<string> {
    const params = new URLSearchParams({
      expr: expression,
    });

    const url = buildRESTUrl(this.config, REST_ENDPOINTS.EVALUATE, params);
    const response = await this.makeRequest(url, {
      method: "GET",
      headers: this.cleanHeaders(this.authHeaders),
    });

    return response.text();
  }

  /**
   * Post transactions
   */
  async post(sequenceNumbers: number[]): Promise<RESTResponse<string>> {
    const params = new URLSearchParams({
      seq: sequenceNumbers.join(","),
    });

    const url = buildRESTUrl(this.config, REST_ENDPOINTS.POST, params);
    const response = await this.makeRequest(url, {
      method: "POST",
      headers: this.cleanHeaders(this.authHeaders),
    });

    return this.parseResponse(response);
  }

  /**
   * Generate a report
   */
  async generateReport(
    reportName: string,
    parameters?: Record<string, string>,
  ): Promise<Buffer> {
    const params = new URLSearchParams({
      report: reportName,
      ...parameters,
    });

    const url = buildRESTUrl(this.config, REST_ENDPOINTS.REPORT, params);
    const response = await this.makeRequest(url, {
      method: "GET",
      headers: this.cleanHeaders(this.authHeaders),
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Generate a form (invoice, statement, etc.)
   */
  async generateForm(
    formType: string,
    sequenceNumber: number,
    parameters?: Record<string, string>,
  ): Promise<Buffer> {
    const params = new URLSearchParams({
      form: formType,
      seq: sequenceNumber.toString(),
      ...parameters,
    });

    const url = buildRESTUrl(this.config, REST_ENDPOINTS.FORM, params);
    const response = await this.makeRequest(url, {
      method: "GET",
      headers: this.cleanHeaders(this.authHeaders),
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Get server version
   */
  async getVersion(): Promise<string> {
    const url = buildRESTUrl(this.config, REST_ENDPOINTS.VERSION);
    const response = await this.makeRequest(url, {
      method: "GET",
      headers: this.cleanHeaders(this.authHeaders),
    });

    return response.text();
  }

  /**
   * List available documents
   */
  async listDocuments(): Promise<string[]> {
    const url = buildRESTUrl(this.config, REST_ENDPOINTS.LIST);
    const response = await this.makeRequest(url, {
      method: "GET",
      headers: this.cleanHeaders(this.authHeaders),
    });

    const text = await response.text();
    return text.split("\n").filter((line) => line.trim());
  }

  /**
   * Make HTTP request with error handling
   */
  private async makeRequest(
    url: string,
    options: RequestInit,
  ): Promise<Response> {
    if (this.config.debug) {
      console.log("MoneyWorks REST Request:", {
        url,
        method: options.method,
        headers: Object.keys(options.headers || {}),
      });
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        this.config.timeout || 30000,
      );

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new MoneyWorksError(
          this.getErrorCode(response),
          parseAuthError(response),
          { status: response.status, statusText: response.statusText },
        );
      }

      return response;
    } catch (error) {
      if (error instanceof MoneyWorksError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new MoneyWorksError(
            MoneyWorksErrorCode.TIMEOUT,
            "Request timeout",
          );
        }

        throw new MoneyWorksError(
          MoneyWorksErrorCode.UNKNOWN,
          error.message,
          error,
        );
      }

      throw error;
    }
  }

  /**
   * Get format parameter for export
   */
  private getFormatParam(format: ExportFormat): string {
    if (typeof format === "string") {
      return format;
    }

    return "custom";
  }

  /**
   * Add custom format parameters
   */
  private addCustomFormatParams(
    params: URLSearchParams,
    format: ExportFormat,
  ): void {
    if (typeof format === "object") {
      if ("template" in format) {
        params.append("template", format.template);
      } else if ("script" in format) {
        params.append("script", format.script);
      }
    }
  }

  /**
   * Parse import result from response
   */
  private parseImportResult(
    responseText: string,
    recordCount: number,
  ): ImportResult {
    // Look for error patterns
    const errors = responseText.match(/\[ERROR\]([^\n]+)/g) || [];
    const errorDetails = errors.map((error, index) => ({
      record: index,
      message: error.replace("[ERROR]", "").trim(),
    }));

    // Basic result
    const result: ImportResult = {
      processed: recordCount,
      created: recordCount - errors.length,
      updated: 0,
      errors: errors.length,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    };

    // Look for specific counts in response
    const createdMatch = responseText.match(/Created: (\d+)/);
    const updatedMatch = responseText.match(/Updated: (\d+)/);

    if (createdMatch?.[1]) {
      result.created = Number.parseInt(createdMatch[1], 10);
    }
    if (updatedMatch?.[1]) {
      result.updated = Number.parseInt(updatedMatch[1], 10);
    }

    return result;
  }

  /**
   * Parse generic response
   */
  private async parseResponse<T = unknown>(
    response: Response,
  ): Promise<RESTResponse<T>> {
    const contentType = response.headers.get("content-type") || "";
    let data: T | undefined;

    if (contentType.includes("application/json")) {
      data = (await response.json()) as T;
    } else if (contentType.includes("text/")) {
      data = (await response.text()) as T;
    }

    return {
      success: response.ok,
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  /**
   * Get error code from response
   */
  private getErrorCode(response: Response): MoneyWorksErrorCode {
    switch (response.status) {
      case 401:
        return MoneyWorksErrorCode.AUTH_FAILED;
      case 403:
        return MoneyWorksErrorCode.PERMISSION_DENIED;
      case 404:
        return MoneyWorksErrorCode.DOCUMENT_NOT_FOUND;
      case 400:
        return MoneyWorksErrorCode.INVALID_REQUEST;
      case 500:
        return MoneyWorksErrorCode.SERVER_ERROR;
      default:
        return MoneyWorksErrorCode.UNKNOWN;
    }
  }
}
