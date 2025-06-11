/**
 * Export Builder
 * 
 * Fluent API for building export queries.
 */

import type { TableName, TableMapCamel } from '../tables';
import type { ExportFormat, ExportOptions } from '../rest/types';
import { MoneyWorksRESTClient } from '../rest/client';

/**
 * Type-safe export builder
 */
export class ExportBuilder<T extends TableName> {
  private table: T;
  private options: ExportOptions = {};
  
  constructor(table: T) {
    this.table = table;
  }
  
  /**
   * Set export format
   */
  format(format: ExportFormat): this {
    this.options.format = format;
    return this;
  }
  
  /**
   * Add filter expression
   */
  where(filter: string): this {
    this.options.filter = filter;
    return this;
  }
  
  /**
   * Filter by field value
   */
  whereField<K extends keyof TableMapCamel[T]>(
    field: K,
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE',
    value: TableMapCamel[T][K]
  ): this {
    const filterExpr = `${String(field)}${operator}${this.formatValue(value)}`;
    
    if (this.options.filter) {
      this.options.filter += ` AND ${filterExpr}`;
    } else {
      this.options.filter = filterExpr;
    }
    
    return this;
  }
  
  /**
   * Set starting record
   */
  start(offset: number): this {
    this.options.start = offset;
    return this;
  }
  
  /**
   * Set record limit
   */
  limit(count: number): this {
    this.options.limit = count;
    return this;
  }
  
  /**
   * Order by field
   */
  orderBy<K extends keyof TableMapCamel[T]>(
    field: K,
    direction: 'ASC' | 'DESC' = 'ASC'
  ): this {
    this.options.orderBy = `${String(field)} ${direction}`;
    return this;
  }
  
  /**
   * Include calculated fields
   */
  includeCalculated(): this {
    this.options.includeCalculated = true;
    return this;
  }
  
  /**
   * Don't maintain connection
   */
  noLinger(): this {
    this.options.noLinger = true;
    return this;
  }
  
  /**
   * Execute export with client
   */
  async execute(client: MoneyWorksRESTClient): Promise<TableMapCamel[T][]> {
    const result = await client.export(this.table, this.options);
    
    // Ensure we get typed array
    if (typeof result === 'string') {
      throw new Error(`Export format returned string instead of records`);
    }
    
    return result;
  }
  
  /**
   * Execute and get raw string result
   */
  async executeRaw(client: MoneyWorksRESTClient): Promise<string> {
    const result = await client.export(this.table, this.options);
    
    // Convert to string if needed
    if (typeof result !== 'string') {
      throw new Error(`Export format returned records instead of string`);
    }
    
    return result;
  }
  
  /**
   * Get built options
   */
  getOptions(): ExportOptions {
    return { ...this.options };
  }
  
  /**
   * Format value for filter
   */
  private formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }
    
    if (typeof value === 'string') {
      // Escape quotes
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    
    if (value instanceof Date) {
      // Format as YYYYMMDD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `"${year}${month}${day}"`;
    }
    
    if (typeof value === 'boolean') {
      return value ? '1' : '0';
    }
    
    return String(value);
  }
}

/**
 * Create export builder for a table
 */
export function exportFrom<T extends TableName>(table: T): ExportBuilder<T> {
  return new ExportBuilder(table);
}