/**
 * MoneyWorks Field Discovery
 *
 * Since MoneyWorks TSV exports have NO headers, we must discover
 * field names and order from XML exports. This is the only way
 * to dynamically determine the structure of any table.
 *
 * @moneyworks-dsl PURE
 * @ai-instruction This is critical infrastructure for parsing MoneyWorks data
 */
import { MoneyWorksRESTClient } from '../client/moneyworks-rest-client';
export interface FieldInfo {
    name: string;
    position: number;
    dataType: 'string' | 'number' | 'boolean' | 'date';
}
export interface TableStructure {
    tableName: string;
    fields: FieldInfo[];
    discoveredAt: Date;
    sampleRecord?: any;
}
/**
 * Discover field structure for a MoneyWorks table
 *
 * @ai-instruction MoneyWorks only provides field names in XML format
 * @param client - MoneyWorks REST client
 * @param tableName - Table to discover (e.g., 'TaxRate')
 * @param useCache - Whether to use cached structure if available
 * @returns Table structure with field names and positions
 */
export declare function discoverTableStructure(client: MoneyWorksRESTClient, tableName: string, useCache?: boolean): Promise<TableStructure>;
/**
 * Clear the field structure cache
 */
export declare function clearFieldCache(): void;
/**
 * Get cached structure if available
 */
export declare function getCachedStructure(tableName: string): TableStructure | undefined;
/**
 * Build TSV headers array from table structure
 * This creates the headers array needed for TSV parsing
 */
export declare function buildTSVHeaders(structure: TableStructure): string[];
//# sourceMappingURL=field-discovery.d.ts.map