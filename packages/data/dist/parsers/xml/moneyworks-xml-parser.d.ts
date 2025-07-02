/**
 * MoneyWorks XML Parser
 *
 * Handles MoneyWorks-specific XML format parsing
 * This is the "heavy lifting" for understanding MoneyWorks data structures
 *
 * @moneyworks-dsl PURE
 */
/**
 * Parse MoneyWorks XML export format
 *
 * MoneyWorks XML structure:
 * - Field names are lowercase in XML (unlike TSV which uses PascalCase)
 * - Values can be in element text or '_' attribute
 * - Empty values are empty elements
 * - Subfiles (like transaction details) have nested structure
 */
export declare function parseMoneyWorksXML(xml: string): {
    tableName: string;
    records: any[];
    fieldNames: string[];
};
/**
 * Extract field order from MoneyWorks XML
 * This is critical for mapping TSV columns
 *
 * @param xml - Sample XML with at least one record
 * @returns Ordered array of field names as they appear in the record
 */
export declare function extractFieldOrder(xml: string): string[];
/**
 * Convert XML field names to PascalCase
 * MoneyWorks XML uses lowercase, but TSV uses PascalCase
 */
export declare function xmlFieldToPascalCase(xmlField: string): string;
/**
 * Build field mapping from XML field order
 * This creates the mapping needed for TSV parsing
 */
export declare function buildFieldMapping(xmlFieldOrder: string[]): Array<{
    position: number;
    xmlName: string;
    pascalName: string;
}>;
//# sourceMappingURL=moneyworks-xml-parser.d.ts.map