/**
 * MoneyWorks Tax Rate Field Definitions
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-manual moneyworks_appendix_tax_rate.html
 * @ai-instruction Use these field definitions as the source of truth for TaxRate fields
 * @ai-critical NEVER add fields not listed here. These are ALL the TaxRate fields.
 */
import { MoneyWorksDataType } from '../../common/data-types';
/**
 * Complete field definitions for MoneyWorks Tax Rate entity
 * Source: moneyworks_appendix_tax_rate.html - Tax Rate Field Descriptions
 *
 * @ai-instruction When describing TaxRate fields, reference this constant
 * @ai-example Say "TaxCode is a Text field (T) with max length 5" not "TaxCode is a string"
 */
export const MONEYWORKS_TAX_RATE_FIELDS = [
    {
        fieldName: "TaxCode",
        dataType: MoneyWorksDataType.TEXT,
        maxLength: 5,
        canonicalDescription: "The tax code",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: true,
        isIndexed: true
    },
    {
        fieldName: "PaidAccount",
        dataType: MoneyWorksDataType.TEXT,
        maxLength: 7,
        canonicalDescription: "The control account for GST paid out under this rate",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: true
    },
    {
        fieldName: "RecAccount",
        dataType: MoneyWorksDataType.TEXT,
        maxLength: 7,
        canonicalDescription: "The control account for GST received under this rate",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: true
    },
    {
        fieldName: "Date",
        dataType: MoneyWorksDataType.DATE,
        canonicalDescription: "Tax rate changeover date",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: true
    },
    {
        fieldName: "Rate1",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Rate used before changeover date",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: true
    },
    {
        fieldName: "Rate2",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Rate used on or after changeover date",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: true
    },
    {
        fieldName: "Combine",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Flags (how 2nd tier tax is combined)",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "CombineRate1",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "2nd tier rate used before changeover date (PST)",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "CombineRate2",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "2nd tier rate used after changeover date (PST)",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "GSTPaid",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Total GST paid for taxcode in last GST finalisation",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "GSTReceived",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Total GST received for taxcode in last GST finalisation",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "NetPaid",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Net paid for taxcode in last GST finalisation",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "NetReceived",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Net received for taxcode in last GST finalisation",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "LastModifiedTime",
        dataType: MoneyWorksDataType.TIMESTAMP,
        canonicalDescription: "The date and time that this record was last changed",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "UserNum",
        dataType: MoneyWorksDataType.NUMERIC,
        canonicalDescription: "Scriptable number",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "UserText",
        dataType: MoneyWorksDataType.TEXT,
        maxLength: 255,
        canonicalDescription: "Scriptable text",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    },
    {
        fieldName: "TaggedText",
        dataType: MoneyWorksDataType.TEXT,
        maxLength: 255,
        canonicalDescription: "Scriptable tag storage",
        manualSource: "moneyworks_appendix_tax_rate.html",
        isRequired: false
    }
];
/**
 * Get field metadata by field name
 *
 * @ai-instruction Use this to get exact field specifications
 */
export function getFieldMetadata(fieldName) {
    return MONEYWORKS_TAX_RATE_FIELDS.find(f => f.fieldName === fieldName);
}
/**
 * Get all required fields
 *
 * @ai-instruction These are the minimum fields needed to create a TaxRate
 */
export function getRequiredFields() {
    return MONEYWORKS_TAX_RATE_FIELDS.filter(f => f.isRequired);
}
/**
 * Get all indexed fields
 *
 * @ai-instruction These fields can be used for efficient lookups
 */
export function getIndexedFields() {
    return MONEYWORKS_TAX_RATE_FIELDS.filter(f => f.isIndexed);
}
