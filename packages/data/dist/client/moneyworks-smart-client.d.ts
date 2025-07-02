/**
 * Smart MoneyWorks REST Client
 *
 * Uses field discovery to handle any table without hardcoded field mappings
 *
 * @moneyworks-dsl PURE
 */
import { MoneyWorksRESTClient, ExportOptions } from '../client/moneyworks-rest-client';
import { MoneyWorksConfig } from '../config/types';
export declare class SmartMoneyWorksClient extends MoneyWorksRESTClient {
    private discoveryCache;
    constructor(config: MoneyWorksConfig);
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
    smartExport(table: string, options?: ExportOptions): Promise<any[] | any[][] | any>;
    /**
     * Ensure we have field structure for a table
     *
     * @param table - Table name
     */
    private ensureFieldStructure;
    /**
     * Export with explicit format choice
     * Falls back to base implementation
     */
    exportWithFormat(table: string, format: 'tsv' | 'xml-terse' | 'xml-verbose', options?: Omit<ExportOptions, 'format'>): Promise<any[] | string>;
    /**
     * Get discovered field structure for a table
     *
     * @param table - Table name
     * @returns Field structure or undefined if not discovered
     */
    getFieldStructure(table: string): import("..").TableStructure | undefined;
    /**
     * Pre-discover multiple tables
     * Useful for initialization
     *
     * @param tables - Array of table names to discover
     */
    preDiscoverTables(tables: string[]): Promise<void>;
}
/**
 * Create a smart MoneyWorks client
 */
export declare function createSmartClient(config: MoneyWorksConfig): SmartMoneyWorksClient;
//# sourceMappingURL=moneyworks-smart-client.d.ts.map