/**
 * Table Registry
 * Central registry for available MoneyWorks tables
 * 
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { TableController } from '../controllers/base-table';
import { TaxRateController } from '../controllers/tax-rate';

export class TableRegistry {
  private tables = new Map<string, TableController>();
  private upcoming = [
    'Account',
    'Transaction', 
    'Name',
    'Product',
    'Job',
    'Category1',
    'Category2'
  ];
  
  constructor(private client: SmartMoneyWorksClient) {
    this.registerTables();
  }
  
  /**
   * Register all available tables
   */
  private registerTables(): void {
    // Register TaxRate (currently the only vetted table)
    this.register(new TaxRateController(this.client));
    
    // Future tables will be registered here as they're vetted
    // this.register(new AccountController(this.client));
    // this.register(new TransactionController(this.client));
  }
  
  /**
   * Register a table controller
   */
  private register(controller: TableController): void {
    this.tables.set(controller.tableName.toLowerCase(), controller);
  }
  
  /**
   * Get a table controller by name
   */
  getTable(tableName: string): TableController | undefined {
    return this.tables.get(tableName.toLowerCase());
  }
  
  /**
   * Check if a table is available
   */
  hasTable(tableName: string): boolean {
    return this.tables.has(tableName.toLowerCase());
  }
  
  /**
   * Get all available table names
   */
  getAvailableTables(): string[] {
    return Array.from(this.tables.values()).map(t => t.tableName);
  }
  
  /**
   * Get vetted table names
   */
  getVettedTables(): string[] {
    // Currently same as available, but this allows for distinction later
    return this.getAvailableTables();
  }
  
  /**
   * Get upcoming table names
   */
  getUpcomingTables(): string[] {
    return this.upcoming;
  }
  
  /**
   * Get table status information
   */
  getTableStatus() {
    return {
      available: this.getAvailableTables(),
      vetted: this.getVettedTables(),
      upcoming: this.getUpcomingTables()
    };
  }
}

/**
 * Create and configure table registry
 */
export function createTableRegistry(client: SmartMoneyWorksClient): TableRegistry {
  return new TableRegistry(client);
}