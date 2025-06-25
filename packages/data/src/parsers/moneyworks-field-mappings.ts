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
  { position: 0, xmlName: 'sequencenumber', pascalName: 'Sequencenumber', dataType: 'number' as const },
  { position: 1, xmlName: 'lastmodifiedtime', pascalName: 'LastModifiedTime', dataType: 'number' as const },
  { position: 2, xmlName: '_timestamp', pascalName: '_Timestamp', dataType: 'string' as const }, // Formatted timestamp
  { position: 3, xmlName: 'taxcode', pascalName: 'TaxCode', dataType: 'string' as const },
  { position: 4, xmlName: 'paidaccount', pascalName: 'PaidAccount', dataType: 'string' as const },
  { position: 5, xmlName: 'recaccount', pascalName: 'RecAccount', dataType: 'string' as const },
  { position: 6, xmlName: 'rate1', pascalName: 'Rate1', dataType: 'number' as const },
  { position: 7, xmlName: 'date', pascalName: 'Date', dataType: 'date' as const },
  { position: 8, xmlName: 'rate2', pascalName: 'Rate2', dataType: 'number' as const },
  { position: 9, xmlName: 'combinerate1', pascalName: 'CombineRate1', dataType: 'number' as const },
  { position: 10, xmlName: 'combinerate2', pascalName: 'CombineRate2', dataType: 'number' as const },
  { position: 11, xmlName: 'gstreceived', pascalName: 'GSTReceived', dataType: 'number' as const },
  { position: 12, xmlName: 'netreceived', pascalName: 'NetReceived', dataType: 'number' as const },
  { position: 13, xmlName: 'gstpaid', pascalName: 'GSTPaid', dataType: 'number' as const },
  { position: 14, xmlName: 'netpaid', pascalName: 'NetPaid', dataType: 'number' as const },
  { position: 15, xmlName: 'ratename', pascalName: 'Ratename', dataType: 'string' as const },
  { position: 16, xmlName: 'reportcyclestart', pascalName: 'Reportcyclestart', dataType: 'number' as const },
  { position: 17, xmlName: 'reportcycleend', pascalName: 'Reportcycleend', dataType: 'number' as const },
  { position: 18, xmlName: 'reportdate', pascalName: 'Reportdate', dataType: 'date' as const },
  { position: 19, xmlName: 'pstreceived', pascalName: 'PSTReceived', dataType: 'number' as const },
  { position: 20, xmlName: 'pstpaid', pascalName: 'PSTPaid', dataType: 'number' as const },
  { position: 21, xmlName: 'type', pascalName: 'Type', dataType: 'number' as const },
  { position: 22, xmlName: 'combination', pascalName: 'Combination', dataType: 'string' as const },
  { position: 23, xmlName: 'usernum', pascalName: 'UserNum', dataType: 'number' as const },
  { position: 24, xmlName: 'usertext', pascalName: 'UserText', dataType: 'string' as const },
  { position: 25, xmlName: 'taggedtext', pascalName: 'TaggedText', dataType: 'string' as const },
  { position: 26, xmlName: 'aliascode', pascalName: 'Aliascode', dataType: 'string' as const },
  { position: 27, xmlName: 'aliascountry', pascalName: 'Aliascountry', dataType: 'string' as const },
  { position: 28, xmlName: 'reversedrate1', pascalName: 'Reversedrate1', dataType: 'number' as const },
  { position: 29, xmlName: 'reversedrate2', pascalName: 'Reversedrate2', dataType: 'number' as const }
];

/**
 * Get TSV field mapping for a table
 */
export function getTSVFieldMapping(tableName: string) {
  switch (tableName.toUpperCase()) {
    case 'TAXRATE':
      return TAXRATE_TSV_FIELD_MAPPING;
    default:
      // For other tables, we'll need to discover dynamically
      return null;
  }
}