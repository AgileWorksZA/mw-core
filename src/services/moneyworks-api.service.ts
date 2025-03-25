import axios from 'axios';
import {MoneyWorksConfig, MoneyWorksQueryParams} from '../types/moneyworks';
import {XMLParser} from 'fast-xml-parser';
import {tableNames} from "../moneyworks/constants";

function yyyyMmDdToDate(yyyyMmDd_?: number | string | Date): Date {
  const yyyyMmDd = String(yyyyMmDd_)
  if (!yyyyMmDd) return new Date(-1);

  if (/^\d{8}$/.test((yyyyMmDd))) {
    const year = parseInt(yyyyMmDd.slice(0, 4), 10);
    const month = parseInt(yyyyMmDd.slice(4, 6), 10) - 1; // JS months are 0-based
    const day = parseInt(yyyyMmDd.slice(6, 8), 10);
    return new Date(year, month, day);
  }

  // Try standard date parsing
  return new Date((yyyyMmDd));
}

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
    const documentAuth = `Basic ${Buffer.from(documentCredentials).toString('base64')}`;

    // Folder auth (only if configured)
    if (this.config.folderAuth) {
      const {folderName, password} = this.config.folderAuth;
      const folderCredentials = `${folderName}:Datacentre:${password}`;
      const folderAuth = `Basic ${Buffer.from(folderCredentials).toString('base64')}`;

      // Return combined auth headers
      return {
        'Authorization': `${documentAuth}, ${folderAuth}`
      };
    }

    // Return document auth only
    return {
      'Authorization': documentAuth
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
  private buildQueryParams(params: MoneyWorksQueryParams): string {
    const queryParts: string[] = [];

    if (params.limit !== undefined) {
      queryParts.push(`limit=${params.limit}`);
    }

    if (params.start !== undefined) {
      queryParts.push(`start=${params.start}`);
    }

    if (params.search) {
      queryParts.push(`search=${encodeURIComponent(params.search)}`);
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

    return queryParts.join('&');
  }

  /**
   * Export data from MoneyWorks
   *
   * @param table The table to export (name, transaction, account, etc.)
   * @param params Query parameters (limit, start, search, sort, etc.)
   * @returns Parsed response data
   */
  async export<T>(table: string, params: MoneyWorksQueryParams = {}): Promise<{
    data: T[],
    pagination: { total: number, limit: number, offset: number, next?: number | null, prev?: number | null }
  }> {
    try {
      // Default to XML verbose format if not specified
      const queryParams = {
        ...params,
        format: params.format || 'xml-verbose'
      };

      const url = `${this.getBaseUrl()}/export/table=${table}&${this.buildQueryParams(queryParams)}`;
      const headers = this.createAuthHeaders();

      const response = await axios.get(url, {headers});

      console.log(response.data);
      if (queryParams.format.startsWith('xml')) {
        const res = this.parser.parse(response.data);
        console.log(res);
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
            prev: offset - limit,
          }
        }
      }

      return response as unknown as {
        data: T[],
        pagination: { total: number, limit: number, offset: number, next?: number | null, prev?: number | null }
      };
    } catch (error) {
      console.error(error);
      this.handleError(error);
    }
    return {data: [], pagination: {total: 0, limit: 0, offset: 0}};
  }

  /**
   * Parse response data
   */
  parseResponse<T extends Record<string, any>>(data: T[]): T[] {
    return data.map((record) => {
      const result: any = {};

      // Loop through all properties in the record
      for (const [key, value] of Object.entries(record)) {
        // Skip attributes and nested objects
        if (key === "$" || key === "_") continue;

        if (typeof value === "object" && value !== null) {
          if (value['#text'] !== undefined) {
            // console.log(key, value, value['#text']);
            if (key.toLowerCase().includes('date')) {
              result[key as keyof T] = yyyyMmDdToDate(value['#text']);
            } else {
              result[key as keyof T] = value['#text'];
            }
          }
        } else if (key.toLowerCase().includes('date')) {
          console.log(key, value);
          // Date will have format of yyyymmdd
          result[key as keyof T] = yyyyMmDdToDate(value);
        } else {
          console.log(key, value, "?");
          result[key as keyof T] = value;
        }

        // For everything else, just copy the value

      }

      // console.log(result);
      return result as T;
    });
  }

  /**
   * Import data into MoneyWorks
   *
   * @param table The table to import into
   * @param data XML data to import
   * @param returnSeq Whether to return the sequence number
   * @returns Response data
   */
  async import(table: string, data: string, returnSeq: boolean = false) {
    try {
      const url = `${this.getBaseUrl()}/import${returnSeq ? '/return_seq=true' : ''}`;
      const headers = {
        ...this.createAuthHeaders(),
        'Content-Type': 'text/xml'
      };

      // Wrap data in table element if not already wrapped
      const xmlData = data.startsWith('<?xml') ? data : `<?xml version="1.0"?>
<table name="${table}">
${data}
</table>`;

      const response = await axios.post(url, xmlData, {headers});
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Evaluate expression in MoneyWorks
   *
   * @param expression The expression to evaluate
   * @returns Evaluation result
   */
  async evaluate(expression: string) {
    try {
      const url = `${this.getBaseUrl()}/evaluate/expr=${encodeURIComponent(expression)}`;
      const headers = this.createAuthHeaders();

      const response = await axios.get(url, {headers});
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Post a transaction in MoneyWorks
   *
   * @param seqnum Sequence number of the transaction to post
   * @returns Response data
   */
  async post(seqnum: number) {
    try {
      const url = `${this.getBaseUrl()}/post/seqnum=${seqnum}`;
      const headers = this.createAuthHeaders();

      const response = await axios.post(url, '', {headers});
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generate a form in MoneyWorks
   *
   * @param form Form name
   * @param search Search expression to identify record
   * @returns PDF data as Buffer
   */
  async doForm(form: string, search: string) {
    try {
      const url = `${this.getBaseUrl()}/doform/form=${encodeURIComponent(form)}&search=${encodeURIComponent(search)}`;
      const headers = this.createAuthHeaders();

      const response = await axios.get(url, {
        headers,
        responseType: 'arraybuffer'
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get server version
   *
   * @returns Server version
   */
  async getVersion() {
    try {
      // Note: version endpoint is on server, not document
      const baseUrl = `http://${this.config.host}:${this.config.port}/REST`;
      const url = `${baseUrl}/server/version`;
      const headers = this.createAuthHeaders();

      const response = await axios.get(url, {headers});
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle error from API request
   */
  private handleError(error: any) {
    console.error('MoneyWorks API Error:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`MoneyWorks API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error(`MoneyWorks API Error: No response received - ${error.message}`);
      }
    }

    throw new Error(`MoneyWorks API Error: ${error.message}`);
  }
}
