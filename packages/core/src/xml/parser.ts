/**
 * XML Parser for MoneyWorks
 * 
 * Parses MoneyWorks XML export format into TypeScript objects.
 */

import type { TableName, TableMapCamel } from '../tables';
import { parseStringPromise } from 'xml2js';
import { ParseError } from '../rest/errors';
import { convertPascalToCamel } from '../converters/field-converter';

/**
 * XML Parser for MoneyWorks data
 */
export class XMLParser {
  /**
   * Parse XML export into typed objects
   */
  static async parse<T extends TableName>(
    xml: string,
    table: T,
    format: 'xml-terse' | 'xml-verbose'
  ): Promise<TableMapCamel[T][]> {
    try {
      // Parse XML to JavaScript object
      const parsed = await parseStringPromise(xml, {
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: true,
        tagNameProcessors: [
          (name) => name // Keep original case for now
        ],
        attrNameProcessors: [
          (name) => name
        ],
        valueProcessors: [
          (value) => {
            // Handle MoneyWorks special values
            if (value === '') return undefined;
            if (value === 'true') return true;
            if (value === 'false') return false;
            
            // Try to parse numbers
            const num = Number(value);
            if (!isNaN(num) && value !== '') {
              return num;
            }
            
            return value;
          }
        ]
      });
      
      // Extract records based on structure
      const records = this.extractRecords(parsed, table);
      
      // Convert to camelCase
      return records.map(record => 
        convertPascalToCamel(table, record) as TableMapCamel[T]
      );
      
    } catch (error) {
      throw new ParseError(
        `Failed to parse ${format} XML for ${table}`,
        format,
        xml.substring(0, 500),
        error
      );
    }
  }
  
  /**
   * Extract records from parsed XML structure
   */
  private static extractRecords(
    parsed: any,
    table: TableName
  ): Record<string, unknown>[] {
    // Handle different XML structures
    // Structure 1: <table><record>...</record><record>...</record></table>
    if (parsed.table && parsed.table[table.toLowerCase()]) {
      const tableData = parsed.table[table.toLowerCase()];
      return Array.isArray(tableData) ? tableData : [tableData];
    }
    
    // Structure 2: <export><table name="..."><record>...</record></table></export>
    if (parsed.export && parsed.export.table) {
      const tables = Array.isArray(parsed.export.table) 
        ? parsed.export.table 
        : [parsed.export.table];
        
      const targetTable = tables.find(t => 
        t.name === table || t.name === table.toLowerCase()
      );
      
      if (targetTable) {
        const recordKey = table.toLowerCase();
        const records = targetTable[recordKey];
        return Array.isArray(records) ? records : [records];
      }
    }
    
    // Structure 3: Direct records under root
    const rootKey = table.toLowerCase();
    if (parsed[rootKey]) {
      return Array.isArray(parsed[rootKey]) ? parsed[rootKey] : [parsed[rootKey]];
    }
    
    // Structure 4: Records under plural form
    const pluralKey = rootKey + 's';
    if (parsed[pluralKey] && parsed[pluralKey][rootKey]) {
      const records = parsed[pluralKey][rootKey];
      return Array.isArray(records) ? records : [records];
    }
    
    // No records found
    return [];
  }
  
  /**
   * Parse transaction with details (special handling)
   */
  static async parseTransactionWithDetails(
    xml: string
  ): Promise<Array<{
    transaction: TableMapCamel['Transaction'];
    details: TableMapCamel['Detail'][];
  }>> {
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true
    });
    
    const transactions = this.extractRecords(parsed, 'Transaction');
    
    return transactions.map(trans => {
      // Extract details from subfile
      const details: any[] = [];
      
      // Check for detail subfile
      if (trans.subfile) {
        const subfiles = Array.isArray(trans.subfile) ? trans.subfile : [trans.subfile];
        const detailSubfile = subfiles.find((s: any) => s.name === 'detail');
        
        if (detailSubfile && detailSubfile.detail) {
          const detailRecords = Array.isArray(detailSubfile.detail) 
            ? detailSubfile.detail 
            : [detailSubfile.detail];
          details.push(...detailRecords);
        }
        
        // Remove subfile from transaction
        delete trans.subfile;
      }
      
      return {
        transaction: convertPascalToCamel('Transaction', trans) as TableMapCamel['Transaction'],
        details: details.map(d => 
          convertPascalToCamel('Detail', d) as TableMapCamel['Detail']
        )
      };
    });
  }
  
  /**
   * Parse MoneyWorks date format (YYYYMMDD)
   */
  static parseDate(dateStr: string | undefined): Date | undefined {
    if (!dateStr || dateStr.length !== 8) {
      return undefined;
    }
    
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // 0-based
    const day = parseInt(dateStr.substring(6, 8));
    
    return new Date(year, month, day);
  }
  
  /**
   * Parse MoneyWorks time format (HHMMSS)
   */
  static parseTime(timeStr: string | undefined): string | undefined {
    if (!timeStr || timeStr.length !== 6) {
      return undefined;
    }
    
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    const seconds = timeStr.substring(4, 6);
    
    return `${hours}:${minutes}:${seconds}`;
  }
  
  /**
   * Parse MoneyWorks boolean (0/1)
   */
  static parseBoolean(value: string | number | undefined): boolean {
    return value === 1 || value === '1' || value === true;
  }
  
  /**
   * Parse MoneyWorks amount with sign encoding
   */
  static parseAmount(value: number | undefined, hasSignBit: boolean = false): number {
    if (value === undefined) return 0;
    
    if (hasSignBit) {
      // Check high bit for sign (overpayment in Payments table)
      const MAX_INT = 2147483647;
      if (value > MAX_INT) {
        return -(value - MAX_INT * 2);
      }
    }
    
    return value;
  }
}