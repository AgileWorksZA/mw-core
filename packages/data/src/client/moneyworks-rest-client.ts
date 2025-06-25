/**
 * MoneyWorks REST API Client (Proper Implementation)
 * 
 * @moneyworks-dsl PURE
 * @ai-instruction This client correctly implements MoneyWorks REST API
 * @ai-critical MoneyWorks defaults to TSV format, supports XML and custom formats
 */

import type { MoneyWorksConfig, MoneyWorksResponse, MoneyWorksQueryParams, MoneyWorksError } from '../config/types';

export type ExportFormat = 'tsv' | 'xml-terse' | 'xml-verbose' | { template: string } | { script: string };

export interface ExportOptions extends MoneyWorksQueryParams {
  format?: ExportFormat;
  noLinger?: boolean;
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
      protocol: 'http',
      timeout: 30000,
      ...config
    };
    
    // Build base URL with authentication embedded
    // Format: http://host:port/REST/username:password@datafile
    const encodedDataFile = this.config.dataFile.replace(/\//g, '%2f');
    const encodedUsername = encodeURIComponent(this.config.username);
    const encodedPassword = encodeURIComponent(this.config.password || '');
    this.baseUrl = `${this.config.protocol}://${this.config.host}:${this.config.port}/REST/${encodedUsername}:${encodedPassword}@${encodedDataFile}`;
    
    // Build headers (no auth in headers when using URL auth)
    this.authHeaders = {
      'Accept': 'text/plain' // MoneyWorks defaults to TSV
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
    
    const lines = data.trim().split('\n');
    if (lines.length === 0) return [];
    
    const results: any[] = [];
    
    // Parse each line as array of values
    for (const line of lines) {
      const values = line.split('\t');
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
    options: ExportOptions = {}
  ): Promise<any[] | string> {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('table', table);
    
    if (options.search) {
      params.append('search', options.search);
    }
    if (options.offset !== undefined) {
      params.append('start', options.offset.toString());
    }
    if (options.limit !== undefined) {
      params.append('limit', options.limit.toString());
    }
    if (options.sort) {
      params.append('orderby', options.sort);
    }
    
    // Handle format parameter
    const format = options.format || 'tsv';
    if (format !== 'tsv') {
      if (typeof format === 'object') {
        if ('template' in format) {
          params.append('format', format.template);
        } else if ('script' in format) {
          params.append('format', format.script);
        }
      } else {
        params.append('format', format);
      }
    }
    // If format is TSV, don't add format parameter
    
    if (options.noLinger) {
      params.append('no_linger', 'true');
    }

    const url = `${this.baseUrl}/export?${params.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.authHeaders,
        signal: AbortSignal.timeout(this.config.timeout || 30000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw {
          code: `MW_HTTP_${response.status}`,
          message: errorText || response.statusText,
          details: { status: response.status }
        } as MoneyWorksError;
      }

      const responseText = await response.text();
      
      // Check if response looks like an error
      const trimmed = responseText.trim();
      
      // Empty response could mean no matching records - that's OK for export
      if (trimmed.length === 0) {
        // Return empty array for TSV format
        if (format === 'tsv') {
          return [];
        }
        // Return empty string for other formats
        return responseText;
      }
      
      // Check if response is a single word (likely an error)
      if (trimmed.indexOf(' ') === -1 && trimmed.indexOf('<') === -1 && trimmed.indexOf('\t') === -1) {
        throw new Error(`MoneyWorks error response: ${trimmed}`);
      }
      
      // Parse based on format
      if (format === 'tsv') {
        return this.parseTSV(responseText);
      }
      
      // For XML or custom formats, return raw text
      return responseText;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          code: 'MW_TIMEOUT',
          message: 'Request timed out',
          details: { timeout: this.config.timeout }
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
        method: 'GET',
        headers: this.authHeaders,
        signal: AbortSignal.timeout(this.config.timeout || 30000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw {
          code: `MW_HTTP_${response.status}`,
          message: errorText || response.statusText,
          details: { status: response.status }
        } as MoneyWorksError;
      }

      return await response.text();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          code: 'MW_TIMEOUT',
          message: 'Request timed out',
          details: { timeout: this.config.timeout }
        } as MoneyWorksError;
      }
      throw error;
    }
  }

  /**
   * Test connection to MoneyWorks
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to export one record from TaxRate table
      const result = await this.export('TaxRate', { limit: 1 });
      return Array.isArray(result) && result.length >= 0;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}