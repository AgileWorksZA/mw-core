/**
 * MoneyWorks Connection Configuration
 * 
 * @moneyworks-dsl PURE
 * @ai-instruction Use MoneyWorks terminology for connection settings
 */

/**
 * MoneyWorks connection configuration
 * 
 * @ai-term Say "MoneyWorks connection", NEVER "database connection"
 * @ai-term Say "dataFile", NEVER "database name"
 */
export interface MoneyWorksConfig {
  /**
   * MoneyWorks Datacentre server host
   * @example "localhost" or "server.company.com"
   */
  host: string;
  
  /**
   * MoneyWorks REST API port
   * @default 6710
   * @ai-term Say "REST API port", NEVER "database port"
   */
  port: number;
  
  /**
   * Protocol for connection
   * @default "http"
   */
  protocol?: 'http' | 'https';
  
  /**
   * MoneyWorks data file name
   * @example "acme.moneyworks"
   * @ai-term Say "data file", NEVER "database"
   */
  dataFile: string;
  
  /**
   * MoneyWorks user name
   * @ai-term Say "MoneyWorks user", NEVER "database user"
   */
  username: string;
  
  /**
   * MoneyWorks document password
   * @ai-term Say "document password", NEVER "user password"
   */
  password: string;
  
  /**
   * Folder authentication (if required)
   * @ai-term Say "folder authentication", NEVER "schema authentication"
   */
  folderAuth?: {
    folderName: string;
    folderPassword: string;
  };
  
  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * MoneyWorks REST API response format
 * 
 * @ai-instruction MoneyWorks returns data in TSV or XML format
 */
export interface MoneyWorksResponse<T = any> {
  /**
   * Response data (parsed from TSV/XML)
   */
  data: T[];
  
  /**
   * Total count of records (if available)
   */
  count?: number;
  
  /**
   * Response metadata
   */
  metadata?: {
    table: string;
    fields: string[];
    format: 'tsv' | 'xml';
  };
}

/**
 * MoneyWorks query parameters
 * 
 * @ai-instruction Use MoneyWorks search syntax
 */
export interface MoneyWorksQueryParams {
  /**
   * MoneyWorks search expression
   * @example "TaxCode='GST10'"
   * @ai-term Say "search expression", NEVER "WHERE clause"
   */
  search?: string;
  
  /**
   * Maximum records to return
   * @ai-term Say "limit", NEVER "page size"
   */
  limit?: number;
  
  /**
   * Number of records to skip
   * @ai-term Say "offset", NEVER "skip"
   */
  offset?: number;
  
  /**
   * Sort field
   * @example "TaxCode"
   * @ai-term Use exact MoneyWorks field names
   */
  sort?: string;
  
  /**
   * Sort direction
   * @default "asc"
   */
  order?: 'asc' | 'desc';
}

/**
 * MoneyWorks error response
 * 
 * @ai-instruction MoneyWorks returns specific error codes
 */
export interface MoneyWorksError {
  /**
   * MoneyWorks error code
   */
  code: string;
  
  /**
   * Error message
   */
  message: string;
  
  /**
   * Additional error details
   */
  details?: Record<string, unknown>;
}