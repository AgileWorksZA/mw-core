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
export function parseMoneyWorksXML(xml: string): {
  tableName: string;
  records: any[];
  fieldNames: string[];
} {
  // Extract table name
  const tableMatch = xml.match(/<table\s+name="([^"]+)"/);
  if (!tableMatch) {
    throw new Error('Could not find table name in XML');
  }
  const tableName = tableMatch[1];

  // Extract table content
  const tableContentMatch = xml.match(/<table[^>]*>([\s\S]*?)<\/table>/);
  if (!tableContentMatch) {
    throw new Error('Could not find table content in XML');
  }
  const tableContent = tableContentMatch[1];

  // Find all records
  const records: any[] = [];
  const fieldNamesSet = new Set<string>();
  
  // MoneyWorks uses lowercase table name for record elements
  // e.g., <taxrate> for TaxRate table
  const recordTagName = tableName.toLowerCase();
  const recordRegex = new RegExp(`<${recordTagName}>([\\s\\S]*?)<\/${recordTagName}>`, 'g');
  let recordMatch;

  while ((recordMatch = recordRegex.exec(tableContent)) !== null) {
    const recordContent = recordMatch[1];
    const record: any = {};
    
    // Extract fields from record
    const fieldRegex = /<(\w+)(?:\s+[^>]*)?>([^<]*)<\/\1>/g;
    let fieldMatch;
    
    while ((fieldMatch = fieldRegex.exec(recordContent)) !== null) {
      const fieldName = fieldMatch[1];
      const fieldValue = fieldMatch[2];
      
      fieldNamesSet.add(fieldName);
      record[fieldName] = fieldValue;
    }
    
    // Also check for self-closing empty elements
    const emptyFieldRegex = /<(\w+)\s*\/>/g;
    let emptyMatch;
    
    while ((emptyMatch = emptyFieldRegex.exec(recordContent)) !== null) {
      const fieldName = emptyMatch[1];
      fieldNamesSet.add(fieldName);
      record[fieldName] = '';
    }
    
    if (Object.keys(record).length > 0) {
      records.push(record);
    }
  }

  return {
    tableName,
    records,
    fieldNames: Array.from(fieldNamesSet).sort()
  };
}

/**
 * Extract field order from MoneyWorks XML
 * This is critical for mapping TSV columns
 * 
 * @param xml - Sample XML with at least one record
 * @returns Ordered array of field names as they appear in the record
 */
export function extractFieldOrder(xml: string): string[] {
  // Extract table name first to get the record tag name
  const tableMatch = xml.match(/<table\s+name="([^"]+)"/);
  if (!tableMatch) {
    throw new Error('Could not find table name in XML');
  }
  const tableName = tableMatch[1];
  const recordTagName = tableName.toLowerCase();
  
  const tableContentMatch = xml.match(/<table[^>]*>([\s\S]*?)<\/table>/);
  if (!tableContentMatch) {
    throw new Error('Could not find table content in XML');
  }
  
  // Find first record with the correct tag name
  const recordRegex = new RegExp(`<${recordTagName}>([\\s\\S]*?)<\/${recordTagName}>`);
  const firstRecordMatch = tableContentMatch[1].match(recordRegex);
  if (!firstRecordMatch) {
    throw new Error('No records found in XML');
  }
  
  const recordContent = firstRecordMatch[1];
  const fieldOrder: string[] = [];
  
  // Extract fields in order using simpler approach
  // Split by < and process each potential field
  const parts = recordContent.split('<');
  
  for (const part of parts) {
    if (!part.trim()) continue;
    
    // Match field name
    const fieldMatch = part.match(/^(\w+)(?:\s[^>]*)?>([^<]*)/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1];
      if (!fieldOrder.includes(fieldName)) {
        fieldOrder.push(fieldName);
      }
    }
  }
  
  return fieldOrder;
}

/**
 * Convert XML field names to PascalCase
 * MoneyWorks XML uses lowercase, but TSV uses PascalCase
 */
export function xmlFieldToPascalCase(xmlField: string): string {
  // Special cases based on MoneyWorks conventions
  const specialCases: Record<string, string> = {
    'sequencenumber': 'Sequencenumber',
    'lastmodifiedtime': 'LastModifiedTime',
    'taxcode': 'TaxCode',
    'paidaccount': 'PaidAccount',
    'recaccount': 'RecAccount',
    'rate1': 'Rate1',
    'date': 'Date',
    'rate2': 'Rate2',
    'combinerate1': 'CombineRate1',
    'combinerate2': 'CombineRate2',
    'gstreceived': 'GSTReceived',
    'netreceived': 'NetReceived',
    'gstpaid': 'GSTPaid',
    'netpaid': 'NetPaid',
    'ratename': 'Ratename',
    'reportcyclestart': 'Reportcyclestart',
    'reportcycleend': 'Reportcycleend',
    'reportdate': 'Reportdate',
    'pstreceived': 'PSTReceived',
    'pstpaid': 'PSTPaid',
    'type': 'Type',
    'combination': 'Combination',
    'usernum': 'UserNum',
    'usertext': 'UserText',
    'taggedtext': 'TaggedText',
    'aliascode': 'Aliascode',
    'aliascountry': 'Aliascountry',
    'reversedrate1': 'Reversedrate1',
    'reversedrate2': 'Reversedrate2'
  };
  
  const lower = xmlField.toLowerCase();
  if (specialCases[lower]) {
    return specialCases[lower];
  }
  
  // General case - capitalize first letter of each word
  return xmlField
    .replace(/(?:^|[-_])(\w)/g, (_, char) => char.toUpperCase());
}

/**
 * Build field mapping from XML field order
 * This creates the mapping needed for TSV parsing
 */
export function buildFieldMapping(xmlFieldOrder: string[]): Array<{
  position: number;
  xmlName: string;
  pascalName: string;
}> {
  return xmlFieldOrder.map((xmlField, index) => ({
    position: index,
    xmlName: xmlField,
    pascalName: xmlFieldToPascalCase(xmlField)
  }));
}