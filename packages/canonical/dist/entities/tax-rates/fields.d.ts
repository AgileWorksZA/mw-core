/**
 * MoneyWorks Tax Rate Field Definitions
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-manual moneyworks_appendix_tax_rate.html
 * @ai-instruction Use these field definitions as the source of truth for TaxRate fields
 * @ai-critical NEVER add fields not listed here. These are ALL the TaxRate fields.
 */
import { MoneyWorksFieldMetadata } from '../../common/data-types';
/**
 * Complete field definitions for MoneyWorks Tax Rate entity
 * Source: moneyworks_appendix_tax_rate.html - Tax Rate Field Descriptions
 *
 * @ai-instruction When describing TaxRate fields, reference this constant
 * @ai-example Say "TaxCode is a Text field (T) with max length 5" not "TaxCode is a string"
 */
export declare const MONEYWORKS_TAX_RATE_FIELDS: readonly MoneyWorksFieldMetadata[];
/**
 * Get field metadata by field name
 *
 * @ai-instruction Use this to get exact field specifications
 */
export declare function getFieldMetadata(fieldName: string): MoneyWorksFieldMetadata | undefined;
/**
 * Get all required fields
 *
 * @ai-instruction These are the minimum fields needed to create a TaxRate
 */
export declare function getRequiredFields(): readonly MoneyWorksFieldMetadata[];
/**
 * Get all indexed fields
 *
 * @ai-instruction These fields can be used for efficient lookups
 */
export declare function getIndexedFields(): readonly MoneyWorksFieldMetadata[];
//# sourceMappingURL=fields.d.ts.map