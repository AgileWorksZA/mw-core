/**
 * Smart MoneyWorks REST Client
 * 
 * Uses field discovery to handle any table without hardcoded field mappings
 * 
 * @moneyworks-dsl PURE
 */

import { MoneyWorksRESTClient, ExportOptions } from '../client/moneyworks-rest-client';
import { MoneyWorksConfig } from '../config/types';
import { discoverTableStructure, getCachedStructure } from '../parsers/field-discovery';
import { arrayToObject, addHeaders, enrichWithSchema } from '../converters';

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
   * @param options - Export options including exportFormat
   * @returns Data in the requested format
   * 
   * @example
   * // Get full objects (default)
   * const data = await client.smartExport('TaxRate');
   * 
   * // Get compact arrays
   * const arrays = await client.smartExport('TaxRate', { exportFormat: 'compact' });
   * 
   * // Get arrays with headers
   * const withHeaders = await client.smartExport('TaxRate', { exportFormat: 'compact-headers' });
   * 
   * // Get schema-enriched data
   * const enriched = await client.smartExport('TaxRate', { exportFormat: 'schema' });
   */
  async smartExport(
    table: string,
    options: ExportOptions = {}
  ): Promise<any[] | any[][] | any> {
    // Ensure we have field structure for this table
    await this.ensureFieldStructure(table);
    
    // Get cached structure
    const structure = getCachedStructure(table);
    if (!structure) {
      throw new Error(`Field structure not found for table ${table}`);
    }
    
    // Extract our custom format option
    const { exportFormat = 'full', ...restOptions } = options;
    
    // Now export as TSV for efficiency
    const tsvOptions = { ...restOptions, format: 'tsv' as const };
    const rawData = await this.export(table, tsvOptions);
    
    // The REST client returns arrays for TSV format
    if (!Array.isArray(rawData)) {
      throw new Error('Unexpected response format from TSV export');
    }
    
    // Handle different export formats
    switch (exportFormat) {
      case 'compact':
        // Return raw arrays as-is
        return rawData;
        
      case 'compact-headers':
        // Add headers to the arrays
        return addHeaders(rawData, structure.fields);
        
      case 'full':
        // Convert to objects (default behavior)
        return arrayToObject(rawData, structure.fields);
        
      case 'schema':
        // Convert to objects first, then enrich with schema
        const objects = arrayToObject(rawData, structure.fields);
        return enrichWithSchema(objects, structure, table);
        
      default:
        throw new Error(`Unsupported export format: ${exportFormat}`);
    }
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