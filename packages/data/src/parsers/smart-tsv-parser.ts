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
export function parseTSVWithStructure(
  tsvData: string,
  structure: TableStructure
): any[] {
  const lines = tsvData.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = structure.fields
    .sort((a, b) => a.position - b.position)
    .map(field => field.name);
  
  const results: any[] = [];
  
  // Parse each line
  for (const line of lines) {
    const values = line.split('\t');
    const record: any = {};
    
    // Map values to field names based on structure
    structure.fields.forEach((field) => {
      const value = values[field.position] || '';
      record[field.name] = parseFieldValue(value, field.dataType);
    });
    
    results.push(record);
  }
  
  return results;
}

/**
 * Parse field value based on known data type
 */
function parseFieldValue(
  value: string,
  dataType: 'string' | 'number' | 'boolean' | 'date'
): any {
  if (value === '') {
    return dataType === 'string' ? '' : null;
  }
  
  switch (dataType) {
    case 'number':
      // Handle MoneyWorks numeric format
      if (value.includes('.')) {
        return parseFloat(value);
      }
      return parseInt(value, 10);
      
    case 'boolean':
      return value === '1';
      
    case 'date':
      // Keep as YYYYMMDD string
      return value;
      
    default:
      return value;
  }
}

/**
 * Validate TSV data against expected structure
 * 
 * @param tsvData - Raw TSV data
 * @param structure - Expected table structure
 * @returns Validation result with any warnings
 */
export function validateTSVStructure(
  tsvData: string,
  structure: TableStructure
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const lines = tsvData.trim().split('\n');
  
  if (lines.length === 0) {
    return { valid: true, warnings: ['No data to validate'] };
  }
  
  // Check first line field count
  const firstLineFields = lines[0].split('\t');
  const expectedFieldCount = structure.fields.length;
  
  if (firstLineFields.length !== expectedFieldCount) {
    warnings.push(
      `Field count mismatch: expected ${expectedFieldCount}, got ${firstLineFields.length}`
    );
  }
  
  // Check if first field looks like data (not headers)
  const firstValue = firstLineFields[0];
  if (isNaN(Number(firstValue)) && structure.fields[0].dataType === 'number') {
    warnings.push('First field appears to be a header, but TSV should not have headers');
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
}