/**
 * MoneyWorks List Tables Tool for MCP
 * 
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { MoneyWorksTablesResult } from '../types/index.js';

// Currently vetted entities
const VETTED_ENTITIES = [
  'TaxRate',
  'Account',
  'Transaction',
  'Name',
  'Product',
  'Job',
  'Contact',
  'Department',
  'General',
  'Inventory',
  'Payment'
];

// Upcoming entities (being worked on)
const UPCOMING_ENTITIES = [
  'Asset',
  'AssetCategory',
  'AssetLog',
  'AutoSplit',
  'Build',
  'Detail',
  'JobSheet',
  'Login',
  'Memo',
  'OffLedger',
  'Reconciliation',
  'User',
  'Category1',
  'Category2'
];

export const listTablesTool = {
  definition: {
    name: 'mw_list_tables',
    description: 'List available MoneyWorks tables/entities',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  
  async handler(_client: SmartMoneyWorksClient, _params: {}): Promise<{ content: MoneyWorksTablesResult[] }> {
    const result: MoneyWorksTablesResult = {
      available: VETTED_ENTITIES,
      vetted: VETTED_ENTITIES,
      upcoming: UPCOMING_ENTITIES
    };
    
    return {
      content: [result]
    };
  }
};