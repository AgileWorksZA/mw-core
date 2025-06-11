/**
 * Import Builder
 * 
 * Type-safe builder for MoneyWorks imports.
 */

import type { TableName, TableMapCamel } from '../tables';
import type { ImportOptions, ImportResult } from '../rest/types';
import { XMLBuilder, XMLBuildOptions } from '../xml/builder';
import { MoneyWorksRESTClient } from '../rest/client';
import { ImportError } from '../rest/errors';

/**
 * Import builder for type-safe imports
 */
export class ImportBuilder<T extends TableName> {
  private table: T;
  private records: Partial<TableMapCamel[T]>[] = [];
  private options: ImportOptions = {};
  private xmlOptions: XMLBuildOptions = {};
  
  constructor(table: T, options?: ImportOptions) {
    this.table = table;
    if (options) {
      this.options = options;
    }
  }
  
  /**
   * Add a record to import
   */
  add(record: Partial<TableMapCamel[T]>): this {
    this.records.push(record);
    return this;
  }
  
  /**
   * Add multiple records
   */
  addMany(records: Partial<TableMapCamel[T]>[]): this {
    this.records.push(...records);
    return this;
  }
  
  /**
   * Set import mode
   */
  mode(mode: 'create' | 'update' | 'upsert'): this {
    this.xmlOptions.mode = mode;
    return this;
  }
  
  /**
   * Mark fields for auto-calculation
   */
  workItOut(...fields: (keyof TableMapCamel[T])[]): this {
    this.xmlOptions.workItOut = fields as string[];
    return this;
  }
  
  /**
   * Add calculated field expressions
   */
  calculated(fields: Partial<Record<keyof TableMapCamel[T], string>>): this {
    this.xmlOptions.calculated = fields as Record<string, string>;
    return this;
  }
  
  /**
   * Allow duplicate records
   */
  allowDuplicates(): this {
    this.options.allowDuplicates = true;
    return this;
  }
  
  /**
   * Continue on error
   */
  continueOnError(): this {
    this.options.continueOnError = true;
    return this;
  }
  
  /**
   * Build XML for import
   */
  toXML(): string {
    return XMLBuilder.build(this.table, this.records, this.xmlOptions);
  }
  
  /**
   * Validate records before import
   */
  validate(): string[] {
    const errors: string[] = [];
    
    this.records.forEach((record, index) => {
      const recordErrors = XMLBuilder.validate(this.table, record);
      errors.push(...recordErrors.map(err => `Record ${index + 1}: ${err}`));
    });
    
    return errors;
  }
  
  /**
   * Execute import
   */
  async execute(client: MoneyWorksRESTClient): Promise<ImportResult> {
    if (this.records.length === 0) {
      return {
        processed: 0,
        created: 0,
        updated: 0,
        errors: 0
      };
    }
    
    // Validate if requested
    if (this.options.validate) {
      const errors = this.validate();
      if (errors.length > 0) {
        throw new ImportError(
          this.table,
          'Validation failed',
          this.records,
          errors.map((err, i) => ({
            record: Math.floor(i / 10), // Rough estimate
            message: err
          }))
        );
      }
    }
    
    // Execute import
    return client.import(this.table, this.records, this.options);
  }
  
  /**
   * Get record count
   */
  count(): number {
    return this.records.length;
  }
  
  /**
   * Clear all records
   */
  clear(): this {
    this.records = [];
    return this;
  }
  
  /**
   * Get all records
   */
  getRecords(): Partial<TableMapCamel[T]>[] {
    return [...this.records];
  }
}

/**
 * Create import builder
 */
export function importInto<T extends TableName>(
  table: T,
  options?: ImportOptions
): ImportBuilder<T> {
  return new ImportBuilder(table, options);
}