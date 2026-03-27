#!/usr/bin/env tsx
/**
 * Quick Chart of Accounts Fetch - Simple Example
 * 
 * A minimal example showing how to fetch the chart of accounts from MoneyWorks
 */

import { SmartMoneyWorksClient } from './packages/data/src/client/moneyworks-smart-client';
import type { MoneyWorksConfig } from './packages/data/src/config/types';

// Configuration - Update these for your MoneyWorks setup
const config: MoneyWorksConfig = {
  host: 'localhost',        // Your MoneyWorks server
  port: 6710,              // Default MoneyWorks REST API port
  dataFile: 'acme.moneyworks', // Your data file name
  username: 'admin',        // Your username
  password: '',            // Document password (if any)
};

async function quickFetchChartOfAccounts() {
  console.log('🔗 Connecting to MoneyWorks...');
  
  const client = new SmartMoneyWorksClient(config);
  
  // Test connection
  if (!(await client.testConnection())) {
    throw new Error('Failed to connect to MoneyWorks');
  }
  
  console.log('✅ Connected! Fetching chart of accounts...');
  
  // Fetch all accounts
  const accounts = await client.smartExport('Account', {
    exportFormat: 'full'  // Returns objects with field names
  });
  
  console.log(`📊 Found ${accounts.length} accounts:\n`);
  
  // Display first 10 accounts as example
  accounts.slice(0, 10).forEach((account: any) => {
    console.log(`${account.Code} | ${account.Description} | ${account.Type}`);
  });
  
  if (accounts.length > 10) {
    console.log(`... and ${accounts.length - 10} more accounts`);
  }
  
  return accounts;
}

// Run the example
quickFetchChartOfAccounts()
  .then(accounts => {
    console.log('\n✅ Chart of accounts fetched successfully!');
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });