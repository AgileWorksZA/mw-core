/**
 * Smart MoneyWorks REST Client
 * 
 * Uses field discovery to handle any table without hardcoded field mappings
 * 
 * @moneyworks-dsl PURE
 */

import { MoneyWorksRESTClient, ExportOptions } from './moneyworks-rest-client.ts';
import { MoneyWorksConfig } from '../config/types.ts';
import { discoverTableStructure, getCachedStructure } from '../parsers/field-discovery.ts';

/**
 * Parse field value based on data type
 */
function parseFieldValue(value: string, dataType: 'string' | 'number' | 'boolean' | 'date'): any {
  if (value === '') {
    return dataType === 'string' ? '' : null;
  }
  
  switch (dataType) {
    case 'number':
      return value.includes('.') ? parseFloat(value) : parseInt(value, 10);
    case 'boolean':
      return value === '1';
    case 'date':
      return value; // Keep as YYYYMMDD string
    default:
      return value;
  }
}

export class SmartMoneyWorksClient extends MoneyWorksRESTClient {
  private discoveryCache = new Map<string, boolean>();

  constructor(config: MoneyWorksConfig) {
    super(config);
  }

  /**
   * Smart export that discovers field structure automatically
   * 
   * @param table - Table name to export
   * @param options - Export options
   * @returns Parsed records with proper field names
   */
  async smartExport(
    table: string,
    options: ExportOptions = {}
  ): Promise<any[]> {
    // Ensure we have field structure for this table
    await this.ensureFieldStructure(table);
    
    // Get cached structure
    const structure = getCachedStructure(table);
    if (!structure) {
      throw new Error(`Field structure not found for table ${table}`);
    }
    
    // Now export as TSV for efficiency
    const tsvOptions = { ...options, format: 'tsv' as const };
    const rawData = await this.export(table, tsvOptions);
    
    // The REST client returns arrays for TSV format
    if (!Array.isArray(rawData)) {
      throw new Error('Unexpected response format from TSV export');
    }
    
    // Convert raw arrays to objects using discovered structure
    return rawData.map(row => {
      const record: any = {};
      structure.fields.forEach(field => {
        const value = row[field.position] || '';
        record[field.name] = parseFieldValue(value, field.dataType);
      });
      return record;
    });
  }

  /**
   * Ensure we have field structure for a table
   * 
   * @param table - Table name
   */
  private async ensureFieldStructure(table: string): Promise<void> {
    // Check if we already discovered this table
    if (this.discoveryCache.has(table)) {
      return;
    }
    
    // Discover field structure
    await discoverTableStructure(this, table);
    this.discoveryCache.set(table, true);
  }

  /**
   * Export with explicit format choice
   * Falls back to base implementation
   */
  async exportWithFormat(
    table: string,
    format: 'tsv' | 'xml-terse' | 'xml-verbose',
    options: Omit<ExportOptions, 'format'> = {}
  ): Promise<any[] | string> {
    return this.export(table, { ...options, format });
  }

  /**
   * Get discovered field structure for a table
   * 
   * @param table - Table name
   * @returns Field structure or undefined if not discovered
   */
  getFieldStructure(table: string) {
    return getCachedStructure(table);
  }

  /**
   * Pre-discover multiple tables
   * Useful for initialization
   * 
   * @param tables - Array of table names to discover
   */
  async preDiscoverTables(tables: string[]): Promise<void> {
    for (const table of tables) {
      await this.ensureFieldStructure(table);
    }
  }
}

/**
 * Create a smart MoneyWorks client
 */
export function createSmartClient(config: MoneyWorksConfig): SmartMoneyWorksClient {
  return new SmartMoneyWorksClient(config);
}