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

      // Return combined auth headers
      return {
        Authorization: `${documentAuth}, ${folderAuth}`,
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
    return `http://${this.config.host}:${this.config.port}/REST/${encodeURIComponent(this.config.dataFile)}`;
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

    if (params.format) {
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
      // Default to XML verbose format if not specified
      const queryParams = {
        ...params,
        format: params.format || "xml-verbose",
      };

      const exportTable =
        table.toLowerCase() === "detail" ? "transaction" : table;
      const parent = table.toLowerCase() === "detail" ? "Detail" : undefined;

      const url = `${this.getBaseUrl()}/export/table=${exportTable}&${this.buildQueryParams(queryParams, parent)}`;
      const headers = this.createAuthHeaders();

      const response = await axios.get(url, { headers });

      if (queryParams.format && queryParams.format.startsWith("xml")) {
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

      // For TSV format (when format is empty or not xml)
      // We need to parse the TSV data
      if (!queryParams.format || !queryParams.format.startsWith("xml")) {
        const lines = response.data.split("\n");
        if (lines.length < 2) {
          return {
            data: [],
            pagination: { total: 0, limit: 0, offset: 0, next: 0, prev: 0 },
          };
        }

        const headers = lines[0].split("\t");
        const data: T[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split("\t");
          const record: Record<string, any> = {};
          
          for (let j = 0; j < headers.length; j++) {
            record[headers[j]] = values[j] || "";
          }
          
          data.push(record as T);
        }

        return {
          data,
          pagination: {
            total: data.length,
            limit: data.length,
            offset: 0,
            next: 0,
            prev: 0,
          },
        };
      }

      return response as unknown as {
        data: T[];
        pagination: {
          total: number;
          limit: number;
          offset: number;
          next: number;
          prev: number;
        };
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
      const exportTable =
        table.toLowerCase() === "detail" ? "transaction" : table;
      const parent = table.toLowerCase() === "detail" ? "Detail" : undefined;

      const url = `${this.getBaseUrl()}/export/table=${exportTable}&${this.buildQueryParams(params, parent)}`;
      const headers = this.createAuthHeaders();

      const response = await axios.get(url, { 
        headers,
        responseType: 'text' 
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
