/**
 * MoneyWorks REST API Client (Proper Implementation)
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This client correctly implements MoneyWorks REST API
 * @ai-critical MoneyWorks defaults to TSV format, supports XML and custom formats
 */
import type { MoneyWorksConfig, MoneyWorksQueryParams } from '../config/types';
import type { ImportOptions, ImportResult, ExportFormat } from '../client/types';
export interface ExportOptions extends MoneyWorksQueryParams {
    format?: ExportFormat;
    noLinger?: boolean;
    /**
     * Our extended export format option
     * @ai-instruction This overrides format for our custom formats
     */
    exportFormat?: 'compact' | 'compact-headers' | 'full' | 'schema';
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
export declare class MoneyWorksRESTClient {
    private config;
    private baseUrl;
    private authHeaders;
    constructor(config: MoneyWorksConfig);
    /**
     * Parse TSV response from MoneyWorks
     *
     * @ai-instruction MoneyWorks TSV format:
     * - NO HEADERS - field order must be known in advance
     * - Tab-separated values (\t)
     * - Empty fields are empty strings between tabs
     * - Returns raw arrays, not objects with field names
     */
    private parseTSV;
    /**
     * Export data from MoneyWorks table
     *
     * @ai-instruction MoneyWorks export endpoint:
     * - Endpoint: /export
     * - Query params: table, search, start, limit, orderby, format
     * - Default format is TSV when format param is omitted
     */
    export(table: string, options?: ExportOptions): Promise<any[] | string>;
    /**
     * Evaluate a MoneyWorks expression
     *
     * @ai-instruction MoneyWorks evaluate endpoint:
     * - Endpoint: /evaluate
     * - Query param: expr (the MWScript expression)
     * - Returns plain text result
     */
    evaluate(expression: string): Promise<string>;
    /**
     * Import records into MoneyWorks table
     *
     * @ai-instruction MoneyWorks import endpoint:
     * - Endpoint: /import
     * - Method: POST
     * - Body: TSV or XML data
     * - Query params: table, mode, work_it_out, calculated
     */
    import(table: string, records: any[], options?: ImportOptions): Promise<ImportResult>;
    /**
     * Get MoneyWorks server version
     *
     * @ai-instruction MoneyWorks version endpoint:
     * - Endpoint: /version
     * - Returns plain text version info
     */
    getVersion(): Promise<string>;
    /**
     * List available documents/data files
     *
     * @ai-instruction MoneyWorks list endpoint:
     * - Endpoint: /list (at server level, not document level)
     * - Returns list of accessible documents
     */
    listDocuments(): Promise<string[]>;
    /**
     * Convert records array to TSV format for import
     * @private
     */
    private recordsToTSV;
    /**
     * Test connection to MoneyWorks
     */
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=moneyworks-rest-client.d.ts.map