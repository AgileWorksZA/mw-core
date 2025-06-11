/**
 * XML Builder for MoneyWorks
 * 
 * Builds MoneyWorks XML import format from TypeScript objects.
 */

import type { TableName, TableMapCamel } from '../tables';
import { Builder } from 'xml2js';
import { convertCamelToPascal } from '../converters/field-converter';
import { validateDetailFieldLengths } from '../tables/detail';

export interface XMLBuildOptions {
  mode?: 'create' | 'update' | 'upsert';
  workItOut?: string[];
  calculated?: Record<string, string>;
}

/**
 * XML Builder for MoneyWorks imports
 */
export class XMLBuilder {
  /**
   * Build XML import document
   */
  static build<T extends TableName>(
    table: T,
    records: Partial<TableMapCamel[T]>[],
    options: XMLBuildOptions = {}
  ): string {
    // Convert records to PascalCase
    const pascalRecords = records.map(record => 
      convertCamelToPascal(table, record)
    );
    
    // Build XML structure
    const xmlObj = this.buildXMLStructure(table, pascalRecords, options);
    
    // Convert to XML string
    const builder = new Builder({
      renderOpts: {
        pretty: true,
        indent: '  ',
        newline: '\n'
      },
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8'
      },
      headless: false
    });
    
    return builder.buildObject(xmlObj);
  }
  
  /**
   * Build XML structure
   */
  private static buildXMLStructure(
    table: TableName,
    records: Record<string, unknown>[],
    options: XMLBuildOptions
  ): Record<string, unknown> {
    const tableElement = {
      $: {
        name: table.toLowerCase(),
        ...(options.mode && { mode: options.mode })
      },
      [table.toLowerCase()]: records.map(record => 
        this.processRecord(table, record, options)
      )
    };
    
    return {
      import: {
        table: tableElement
      }
    };
  }
  
  /**
   * Process individual record
   */
  private static processRecord(
    table: TableName,
    record: Record<string, unknown>,
    options: XMLBuildOptions
  ): Record<string, unknown> {
    const processed: Record<string, unknown> = {};
    
    // Add work-it-out attribute if needed
    if (options.workItOut?.length) {
      processed.$ = {
        'work-it-out': options.workItOut.join(',')
      };
    }
    
    // Process each field
    for (const [field, value] of Object.entries(record)) {
      if (value === undefined || value === null) {
        continue;
      }
      
      // Handle calculated fields
      if (options.calculated?.[field]) {
        processed[field] = {
          $: { calculated: options.calculated[field] }
        };
        continue;
      }
      
      // Handle special field types
      if (field === 'subfile' && Array.isArray(value)) {
        processed.subfile = this.buildSubfile(value);
        continue;
      }
      
      // Format value based on type
      processed[field] = this.formatValue(field, value);
    }
    
    return processed;
  }
  
  /**
   * Build subfile structure (for transaction details)
   */
  private static buildSubfile(details: any[]): any {
    return {
      $: { name: 'detail' },
      detail: details.map(detail => {
        const pascalDetail = convertCamelToPascal('Detail', detail);
        const formatted: Record<string, unknown> = {};
        
        for (const [field, value] of Object.entries(pascalDetail)) {
          if (value !== undefined && value !== null) {
            formatted[field] = this.formatValue(field, value);
          }
        }
        
        return formatted;
      })
    };
  }
  
  /**
   * Format field value for XML
   */
  private static formatValue(field: string, value: unknown): string {
    // Handle dates
    if (value instanceof Date) {
      return this.formatDate(value);
    }
    
    // Handle booleans
    if (typeof value === 'boolean') {
      return value ? '1' : '0';
    }
    
    // Handle numbers
    if (typeof value === 'number') {
      // Check if it's a monetary field
      if (this.isMonetaryField(field)) {
        return value.toFixed(2);
      }
      return value.toString();
    }
    
    // Handle strings
    return String(value);
  }
  
  /**
   * Format date to YYYYMMDD
   */
  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
  }
  
  /**
   * Check if field is monetary
   */
  private static isMonetaryField(field: string): boolean {
    const monetaryFields = [
      'gross', 'net', 'tax', 'amount', 'debit', 'credit',
      'balance', 'price', 'cost', 'total', 'subtotal',
      'discount', 'freight', 'ourAmount', 'theirAmount'
    ];
    
    return monetaryFields.some(f => 
      field.toLowerCase().includes(f.toLowerCase())
    );
  }
  
  /**
   * Build transaction with details
   */
  static buildTransactionWithDetails(
    transaction: Partial<TableMapCamel['Transaction']>,
    details: Partial<TableMapCamel['Detail']>[],
    options: XMLBuildOptions = {}
  ): string {
    // Add details as subfile
    const transWithDetails = {
      ...transaction,
      subfile: details
    };
    
    return this.build('Transaction', [transWithDetails], options);
  }
  
  /**
   * Validate before building
   */
  static validate<T extends TableName>(
    table: T,
    record: Partial<TableMapCamel[T]>
  ): string[] {
    const errors: string[] = [];
    
    // Table-specific validation
    if (table === 'Detail') {
      const pascalRecord = convertCamelToPascal(table, record);
      const detailErrors = validateDetailFieldLengths(pascalRecord as any);
      errors.push(...detailErrors);
    }
    
    // Add more table-specific validations as needed
    
    return errors;
  }
}