/**
 * MoneyWorks List Tables Tool for MCP
 * 
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from '@moneyworks/data';
import type { MoneyWorksTablesResult } from '@moneyworks/mcp-server/types';

// Currently vetted entities
const VETTED_ENTITIES = ['TaxRate'];

// Upcoming entities (being worked on)
const UPCOMING_ENTITIES = [
  'Account',
  'Transaction',
  'Name',
  'Product',
  'Job',
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