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
export const TAXRATE_TSV_FIELD_MAPPING = [
    { position: 0, xmlName: 'sequencenumber', pascalName: 'Sequencenumber', dataType: 'number' },
    { position: 1, xmlName: 'lastmodifiedtime', pascalName: 'LastModifiedTime', dataType: 'number' },
    { position: 2, xmlName: '_timestamp', pascalName: '_Timestamp', dataType: 'string' }, // Formatted timestamp
    { position: 3, xmlName: 'taxcode', pascalName: 'TaxCode', dataType: 'string' },
    { position: 4, xmlName: 'paidaccount', pascalName: 'PaidAccount', dataType: 'string' },
    { position: 5, xmlName: 'recaccount', pascalName: 'RecAccount', dataType: 'string' },
    { position: 6, xmlName: 'rate1', pascalName: 'Rate1', dataType: 'number' },
    { position: 7, xmlName: 'date', pascalName: 'Date', dataType: 'date' },
    { position: 8, xmlName: 'rate2', pascalName: 'Rate2', dataType: 'number' },
    { position: 9, xmlName: 'combinerate1', pascalName: 'CombineRate1', dataType: 'number' },
    { position: 10, xmlName: 'combinerate2', pascalName: 'CombineRate2', dataType: 'number' },
    { position: 11, xmlName: 'gstreceived', pascalName: 'GSTReceived', dataType: 'number' },
    { position: 12, xmlName: 'netreceived', pascalName: 'NetReceived', dataType: 'number' },
    { position: 13, xmlName: 'gstpaid', pascalName: 'GSTPaid', dataType: 'number' },
    { position: 14, xmlName: 'netpaid', pascalName: 'NetPaid', dataType: 'number' },
    { position: 15, xmlName: 'ratename', pascalName: 'Ratename', dataType: 'string' },
    { position: 16, xmlName: 'reportcyclestart', pascalName: 'Reportcyclestart', dataType: 'number' },
    { position: 17, xmlName: 'reportcycleend', pascalName: 'Reportcycleend', dataType: 'number' },
    { position: 18, xmlName: 'reportdate', pascalName: 'Reportdate', dataType: 'date' },
    { position: 19, xmlName: 'pstreceived', pascalName: 'PSTReceived', dataType: 'number' },
    { position: 20, xmlName: 'pstpaid', pascalName: 'PSTPaid', dataType: 'number' },
    { position: 21, xmlName: 'type', pascalName: 'Type', dataType: 'number' },
    { position: 22, xmlName: 'combination', pascalName: 'Combination', dataType: 'string' },
    { position: 23, xmlName: 'usernum', pascalName: 'UserNum', dataType: 'number' },
    { position: 24, xmlName: 'usertext', pascalName: 'UserText', dataType: 'string' },
    { position: 25, xmlName: 'taggedtext', pascalName: 'TaggedText', dataType: 'string' },
    { position: 26, xmlName: 'aliascode', pascalName: 'Aliascode', dataType: 'string' },
    { position: 27, xmlName: 'aliascountry', pascalName: 'Aliascountry', dataType: 'string' },
    { position: 28, xmlName: 'reversedrate1', pascalName: 'Reversedrate1', dataType: 'number' },
    { position: 29, xmlName: 'reversedrate2', pascalName: 'Reversedrate2', dataType: 'number' }
];
/**
 * Get TSV field mapping for a table
 */
export function getTSVFieldMapping(tableName) {
    switch (tableName.toUpperCase()) {
        case 'TAXRATE':
            return TAXRATE_TSV_FIELD_MAPPING;
        default:
            // For other tables, we'll need to discover dynamically
            return null;
    }
}
