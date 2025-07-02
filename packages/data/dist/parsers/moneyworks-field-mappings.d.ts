/**
 * MoneyWorks TSV Field Mappings
 *
 * MoneyWorks TSV exports have NO headers and the field order
 * doesn't always match the XML field order. These mappings
 * define the actual TSV column positions for each table.
 *
 * @moneyworks-dsl PURE
 */
/**
 * TaxRate table TSV field mapping
 * Based on actual MoneyWorks export observation
 */
export declare const TAXRATE_TSV_FIELD_MAPPING: ({
    position: number;
    xmlName: string;
    pascalName: string;
    dataType: "number";
} | {
    position: number;
    xmlName: string;
    pascalName: string;
    dataType: "string";
} | {
    position: number;
    xmlName: string;
    pascalName: string;
    dataType: "date";
})[];
/**
 * Get TSV field mapping for a table
 */
export declare function getTSVFieldMapping(tableName: string): ({
    position: number;
    xmlName: string;
    pascalName: string;
    dataType: "number";
} | {
    position: number;
    xmlName: string;
    pascalName: string;
    dataType: "string";
} | {
    position: number;
    xmlName: string;
    pascalName: string;
    dataType: "date";
})[] | null;
//# sourceMappingURL=moneyworks-field-mappings.d.ts.map