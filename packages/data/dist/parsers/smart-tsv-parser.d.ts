/**
 * Smart TSV Parser for MoneyWorks
 *
 * Uses field discovery to parse headerless TSV data
 *
 * @moneyworks-dsl PURE
 */
import { TableStructure } from '../parsers/field-discovery';
/**
 * Parse TSV data using discovered field structure
 *
 * @param tsvData - Raw TSV data from MoneyWorks (no headers)
 * @param structure - Table structure from field discovery
 * @returns Parsed records with proper field names
 */
export declare function parseTSVWithStructure(tsvData: string, structure: TableStructure): any[];
/**
 * Validate TSV data against expected structure
 *
 * @param tsvData - Raw TSV data
 * @param structure - Expected table structure
 * @returns Validation result with any warnings
 */
export declare function validateTSVStructure(tsvData: string, structure: TableStructure): {
    valid: boolean;
    warnings: string[];
};
//# sourceMappingURL=smart-tsv-parser.d.ts.map