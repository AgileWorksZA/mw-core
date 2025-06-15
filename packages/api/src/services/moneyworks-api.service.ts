import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { tableNames } from "../types/constants";
import type { ANY } from "../types/hack";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../types/moneyworks";

// function yyyyMmDdToDate(yyyyMmDd_?: number | string | Date): Date {
//   const yyyyMmDd = String(yyyyMmDd_);
//   if (!yyyyMmDd) return new Date(-1);
//
//   if (/^\d{8}$/.test(yyyyMmDd)) {
//     const year = Number.parseInt(yyyyMmDd.slice(0, 4), 10);
//     const month = Number.parseInt(yyyyMmDd.slice(4, 6), 10) - 1; // JS months are 0-based
//     const day = Number.parseInt(yyyyMmDd.slice(6, 8), 10);
//     return new Date(year, month, day);
//   }
//
//   // Try standard date parsing
//   return new Date(yyyyMmDd);
// }

/**
 * MoneyWorks API service
 * Handles direct communication with MoneyWorks Datacentre REST API
 */
export class MoneyWorksApiService {
  private config: MoneyWorksConfig;
  private parser: XMLParser;

  constructor(config: MoneyWorksConfig) {
    this.config = config;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
      isArray: (name) => tableNames.includes(name),
      parseAttributeValue: true,
      processEntities: true,
    });
  }

  /**
   * Create authentication headers for MoneyWorks REST API
   */
  private createAuthHeaders() {
    // Document auth (always required)
    const documentCredentials = `${this.config.username}:Document:${this.config.password}`;
    const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

    // Folder auth (only if configured)
    if (this.config.folderAuth) {
      const { folderName, password } = this.config.folderAuth;
      const folderCredentials = `${folderName}:Datacentre:${password}`;
      const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

      // Return dual headers as array (Axios format for duplicate header names)
      return {
        Authorization: [folderAuth, documentAuth],
      };
    }

    // Return document auth only
    return {
      Authorization: documentAuth,
    };
  }

  /**
   * Build the base URL for MoneyWorks REST API
   */
  private getBaseUrl() {
    const protocol = this.config.protocol || "http";
    
    // If folderAuth exists, use folder path structure per MoneyWorks specification
    if (this.config.folderAuth) {
      const folderName = this.config.folderAuth.folderName;
      const folderPathEncoded = encodeURIComponent(folderName).replace('/', '%2f');
      const docNameEncoded = encodeURIComponent(this.config.dataFile);
      return `${protocol}://${this.config.host}:${this.config.port}/REST/${folderPathEncoded}%2f${docNameEncoded}`;
    }
    
    // Top-level document (no folder)
    return `${protocol}://${this.config.host}:${this.config.port}/REST/${encodeURIComponent(this.config.dataFile)}`;
  }

  /**
   * Build query parameters string
   */
  private buildQueryParams(
    params: MoneyWorksQueryParams,
    parent?: string,
  ): string {
    const queryParts: string[] = [];

    if (params.limit !== undefined) {
      queryParts.push(`limit=${params.limit}`);
    }

    if (params.start !== undefined) {
      queryParts.push(`start=${params.start}`);
    }

    if (params.search) {
      const search = Object.entries(params.search).reduce(
        (acc, [key, value]) => {
          if (value) {
            if (parent) {
              acc.push(`${parent}.${key}="${value}"`);
            } else {
              acc.push(`${key}="${value}"`);
            }
          }
          return acc;
        },
        [] as string[],
      );
      queryParts.push(`search=${encodeURIComponent(search.join("&"))}`);
    }

    if (params.sort) {
      queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
    }

    if (params.direction) {
      queryParts.push(`direction=${params.direction}`);
    }

    // Handle custom field format (array of field names)
    if (
      params.fields &&
      Array.isArray(params.fields) &&
      params.fields.length > 0
    ) {
      // Convert the array of field names to MoneyWorks format specification
      // Each field will be wrapped in square brackets and joined with tabs
      const formatStr = params.fields
        .map((field) => {
          if (parent) {
            return `[${parent}:${field}]`;
          }
          return `[${field}]`;
        })
        .join("\\t"); // Use actual tab character, not the escaped string '\t'

      queryParts.push(`format=${encodeURIComponent(formatStr)}%5Cn`);
    }
    // If fields is not provided but format is, use the provided format
    else if (params.format) {
      queryParts.push(`format=${encodeURIComponent(params.format)}`);
    }

    return queryParts.join("&");
  }

  /**
   * Evaluate a search expression
   * @param expression
   */
  async evaluate(expression: string) {
    try {
      const url = `${this.getBaseUrl()}/evaluate?expr=${encodeURIComponent(expression)}`;
      const headers = this.createAuthHeaders();

      const response = await axios.get(url, { headers });

      return response.data as string;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get list of all moneyworks in the database
   * @returns Array of table names
   */
  async getDatabaseTables(): Promise<string[]> {
    try {
      const response = await this.evaluate("GetDatabaseFiles()");

      if (response !== undefined) {
        // Split by newline and filter out empty strings
        return response.split("\n").filter((table) => table.trim() !== "");
      }

      return [];
    } catch (error) {
      console.error("Error fetching database moneyworks:", error);
      this.handleError(error);
      return [];
    }
  }

  /**
   * Get list of all fields in a specific table
   * @param tableName The name of the table to get fields from
   * @returns Array of field names
   */
  async getDatabaseFields(tableName: string): Promise<string[]> {
    try {
      const expression = `GetDatabaseFields("${tableName}")`;
      const response = await this.evaluate(expression);

      if (response !== undefined) {
        // Split by newline and filter out empty strings
        return response.split("\n").filter((field) => field.trim() !== "");
      }

      return [];
    } catch (error) {
      console.error(`Error fetching fields for table ${tableName}:`, error);
      this.handleError(error);
      return [];
    }
  }

  /**
   * Get the size/type of a specific field in a table
   * @param tableName The name of the table
   * @param fieldName The name of the field
   * @returns Field type information: 'SHORT' for number, 'BOOLEAN' for boolean, or a number for string length
   */
  async getDatabaseFieldSize(
    tableName: string,
    fieldName: string,
  ): Promise<string> {
    try {
      const expression = `GetDatabaseFieldSize("${tableName}", "${fieldName}")`;
      const response = await this.evaluate(expression);

      return response || "";
    } catch (error) {
      console.error(
        `Error fetching field size for ${tableName}.${fieldName}:`,
        error,
      );
      this.handleError(error);
      return "";
    }
  }

  /**
   * Get detailed information about fields in a table, including their types
   * @param tableName The name of the table to get fields from
   * @returns Array of field information objects
   */
  async getDatabaseFieldsWithTypes(
    tableName: string,
  ): Promise<Array<{ name: string; type: string; jsType?: string }>> {
    try {
      // Get all field names first
      const fields = await this.getDatabaseFields(tableName);
      const fieldInfos = [];

      // For each field, get its size/type
      for (const field of fields) {
        const sizeType = await this.getDatabaseFieldSize(tableName, field);
        let jsType: string | undefined;

        // Map MoneyWorks types to JavaScript types
        switch (sizeType) {
          case "SHORT":
          case "LONG":
          case "INT48":
          case "FLOAT":
          case "DOUBLE":
            jsType = "number";
            break;
          case "BOOLEAN":
            jsType = "boolean";
            break;
          case "DATE":
          case "TIME":
            jsType = "Date";
            break;
          default:
            // Check if it's a string length (numeric)
            if (!Number.isNaN(Number(sizeType))) {
              jsType = "string";
            } else {
              // Unknown type - throw an error
              throw new Error(
                `Unknown field type "${sizeType}" for field "${field}" in table "${tableName}"`,
              );
            }
        }

        fieldInfos.push({
          name: field,
          type: sizeType,
          jsType,
        });
      }

      return fieldInfos;
    } catch (error) {
      console.error(
        `Error fetching fields with types for table ${tableName}:`,
        error,
      );
      this.handleError(error);
      return [];
    }
  }

  /**
   * Export data from MoneyWorks
   *
   * @param table The table to export (name, transaction, account, etc.)
   * @param params Query parameters (limit, start, search, sort, etc.)
   * @returns Parsed response data
   */
  async export<T extends object = object>(
    table: string,
    params: MoneyWorksQueryParams<T> = {},
  ): Promise<{
    data: T[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      next: number;
      prev: number;
    };
  }> {
    try {
      // If fields were provided, we'll use custom format (TSV with specific fields)
      // otherwise default to XML verbose format
      const queryParams = {
        ...params,
        format: params.fields ? undefined : params.format || "xml-verbose",
      };

      const exportTable =
        table.toLowerCase() === "detail" ? "transaction" : table;
      const parent = table.toLowerCase() === "detail" ? "Detail" : undefined;

      const url = `${this.getBaseUrl()}/export/table=${exportTable}&${this.buildQueryParams(queryParams, parent)}`;
      const authHeaders = this.createAuthHeaders();

      // When using fields or non-XML format, we need to ensure the response is text
      const responseType =
        params.fields ||
        (queryParams.format && !queryParams.format.startsWith("xml"))
          ? "text"
          : undefined;

      const response = await axios.get(url, {
        headers: authHeaders,
        responseType,
      });

      // For XML format
      if (
        !params.fields &&
        queryParams.format &&
        queryParams.format.startsWith("xml")
      ) {
        const res = this.parser.parse(response.data);
        const data: T[] = res.table[res.table._name.toLowerCase()] ?? [];
        const limit: number = res.table._count;
        const total: number = res.table._found;
        const offset: number = res.table._start;
        return {
          data: data,
          pagination: {
            total,
            limit,
            offset,
            next: offset + limit,
            prev: offset - limit > 0 ? offset - limit : 0,
          },
        };
      }

      // If we're using custom fields with specific fields array or tsv format
      if (!params.fields) {
        throw new Error("Custom fields not supported for XML format");
      }
      const fields = params.fields;
      const data: T[] = [];
      const rawData = response.data;

      // Start parsing
      for (const line of rawData.split("\n")) {
        if (!line.trim()) continue; // Skip empty lines
        const record: Record<string, string | number | boolean | null> = {};
        const values = line.split("\t");
        for (let i = 0; i < fields.length; i++) {
          record[fields[i]] = values[i];
        }
        data.push(record as T);
      }

      return {
        data,
        pagination: {
          total: data.length,
          limit: params.limit || data.length,
          offset: params.start || 0,
          next: (params.start || 0) + (params.limit || data.length),
          prev:
            (params.start || 0) - (params.limit || data.length) > 0
              ? (params.start || 0) - (params.limit || data.length)
              : 0,
        },
      };
    } catch (error) {
      console.error(error);
      this.handleError(error);
    }
    return {
      data: [],
      pagination: { total: 0, limit: 0, offset: 0, next: 0, prev: 0 },
    };
  }

  /**
   * Export data from MoneyWorks and return the raw response
   * This is useful for comparing different export formats
   *
   * @param table The table to export (name, transaction, account, etc.)
   * @param params Query parameters (limit, start, search, sort, etc.)
   * @returns Raw response as string
   */
  async exportRaw(
    table: string,
    params: MoneyWorksQueryParams = {},
  ): Promise<string> {
    try {
      // If fields were provided, we'll use custom format (fields with square brackets)
      // otherwise use the specified format
      const queryParams = {
        ...params,
        format: params.fields ? undefined : params.format,
      };

      const exportTable =
        table.toLowerCase() === "detail" ? "transaction" : table;
      const parent = table.toLowerCase() === "detail" ? "Detail" : undefined;

      const url = `${this.getBaseUrl()}/export/table=${exportTable}&${this.buildQueryParams(queryParams, parent)}`;
      const authHeaders = this.createAuthHeaders();

      const response = await axios.get(url, {
        headers: authHeaders,
        responseType: "text",
      });

      return response.data;
    } catch (error) {
      console.error(error);
      this.handleError(error);
      return "";
    }
  }

  /**
   * Import data into MoneyWorks
   *
   * @param table The table to import into
   * @param data XML data to import
   * @param returnSeq Whether to return the sequence number
   * @returns Response data
   */
  async import(table: string, data: string, returnSeq = false) {
    try {
      const url = `${this.getBaseUrl()}/import${returnSeq ? "/return_seq=true" : ""}`;
      const headers = {
        ...this.createAuthHeaders(),
        "Content-Type": "text/xml",
      };

      // Wrap data in table element if not already wrapped
      const xmlData = data.startsWith("<?xml")
        ? data
        : `<?xml version="1.0"?>
<table name="${table}">
${data}
</table>`;

      const response = await axios.post(url, xmlData, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle error from API request
   */
  private handleError(error: ANY) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `MoneyWorks API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        );
      }
      if (error.request) {
        throw new Error(
          `MoneyWorks API Error: No response received - ${error.message}`,
        );
      }
    }

    throw new Error(`MoneyWorks API Error: ${error.message}`);
  }
}
