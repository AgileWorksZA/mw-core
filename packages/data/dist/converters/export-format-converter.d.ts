/**
 * Export Format Converters for MoneyWorks Data
 *
 * @moneyworks-dsl PURE
 * @ai-instruction These converters transform between different export formats
 * @ai-critical Maintain field order and data integrity during conversions
 */
import type { FieldInfo, TableStructure } from '../parsers/field-discovery';
import type { SchemaEnrichedExport } from '../client/types';
/**
 * Convert array data to object format using field information
 *
 * @param data - Raw array data from MoneyWorks TSV export
 * @param fields - Field information from discovery
 * @returns Array of objects with proper field names
 *
 * @example
 * const arrays = [["GST10", "1400", "2400", ...]];
 * const fields = [{ name: "TaxCode", position: 0, ... }];
 * const objects = arrayToObject(arrays, fields);
 * // Result: [{ TaxCode: "GST10", PaidAccount: "1400", ... }]
 */
export declare function arrayToObject(data: any[][], fields: FieldInfo[]): any[];
/**
 * Convert object data to array format using field information
 *
 * @param data - Object data with field names
 * @param fields - Field information for ordering
 * @returns Array of arrays in correct field order
 *
 * @example
 * const objects = [{ TaxCode: "GST10", PaidAccount: "1400", ... }];
 * const arrays = objectToArray(objects, fields);
 * // Result: [["GST10", "1400", "2400", ...]]
 */
export declare function objectToArray(data: any[], fields: FieldInfo[]): any[][];
/**
 * Add header row to array data
 *
 * @param data - Array data without headers
 * @param fields - Field information
 * @returns Array data with header row as first element
 *
 * @example
 * const data = [["GST10", "1400", ...]];
 * const withHeaders = addHeaders(data, fields);
 * // Result: [["TaxCode", "PaidAccount", ...], ["GST10", "1400", ...]]
 */
export declare function addHeaders(data: any[][], fields: FieldInfo[]): any[][];
/**
 * Enrich data with schema information
 *
 * @param data - Object data
 * @param structure - Table structure with field metadata
 * @param table - Table name
 * @returns Schema-enriched export format
 *
 * @example
 * const enriched = enrichWithSchema(data, structure, "TaxRate");
 * // Result: { schema: {...}, data: [...], metadata: {...} }
 */
export declare function enrichWithSchema<T>(data: T[], structure: TableStructure, table: string): SchemaEnrichedExport<T>;
/**
 * Convert between export formats
 *
 * @param data - Input data in any supported format
 * @param fromFormat - Current format of the data
 * @param toFormat - Desired output format
 * @param structure - Table structure (required for conversions)
 * @returns Data in the requested format
 *
 * @ai-instruction This is the main conversion function
 * @example
 * const objects = convertExportFormat(arrays, 'compact', 'full', structure);
 */
export declare function convertExportFormat(data: any, fromFormat: 'compact' | 'compact-headers' | 'full' | 'schema', toFormat: 'compact' | 'compact-headers' | 'full' | 'schema', structure: TableStructure, table?: string): any;
//# sourceMappingURL=export-format-converter.d.ts.map