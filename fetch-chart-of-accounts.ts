#!/usr/bin/env tsx
/**
 * Fetch Chart of Accounts from MoneyWorks
 * 
 * This script connects to a MoneyWorks data file and retrieves the complete 
 * chart of accounts using the Smart MoneyWorks Client.
 */

import { SmartMoneyWorksClient } from './packages/data/src/client/moneyworks-smart-client';
import type { MoneyWorksConfig } from './packages/data/src/config/types';
import { 
  MoneyWorksAccountType, 
  MoneyWorksSystemAccountType,
  getCanonicalAccountTypeExplanation,
  getCanonicalSystemAccountTypeExplanation,
  getCanonicalFinancialStatementSection
} from './staging/generated/moneyworks-accounts-canonical-ontology';

/**
 * Configuration for MoneyWorks connection
 * Update these values to match your MoneyWorks setup
 */
const config: MoneyWorksConfig = {
  host: 'localhost',
  port: 6710,
  protocol: 'http',
  dataFile: 'acme.moneyworks', // Change to your actual data file
  username: 'admin',            // Change to your MoneyWorks username
  password: '',                 // Change to your document password (if any)
  timeout: 30000
};

/**
 * Represents an account from the MoneyWorks chart of accounts
 */
interface ChartOfAccountsEntry {
  code: string;
  description: string;
  type: string;
  systemType: string;
  category?: string;
  group?: string;
  currency?: string;
  accountantsCode?: string;
  pandL?: string;
  taxCode?: string;
  bankAccountNumber?: string;
  ebitda?: string;
  comments?: string;
  created?: string;
  lastModified?: string;
  securityLevel?: number;
  // Additional fields as needed
}

/**
 * Enhanced chart of accounts entry with canonical information
 */
interface EnhancedChartEntry extends ChartOfAccountsEntry {
  canonicalInfo: {
    accountTypeName: string;
    accountTypeExplanation: string;
    systemTypeName: string;
    systemTypeExplanation: string;
    financialStatementSection: string;
    normalBalance: 'debit' | 'credit';
    isBalanceSheetAccount: boolean;
    isIncomeStatementAccount: boolean;
  };
}

/**
 * Fetch the complete chart of accounts from MoneyWorks
 */
async function fetchChartOfAccounts(): Promise<ChartOfAccountsEntry[]> {
  console.log('🔗 Connecting to MoneyWorks...');
  
  const client = new SmartMoneyWorksClient(config);
  
  // Test the connection first
  const connectionOk = await client.testConnection();
  if (!connectionOk) {
    throw new Error('❌ Failed to connect to MoneyWorks. Please check your configuration.');
  }
  
  console.log('✅ Connected to MoneyWorks successfully');
  
  // Fetch the chart of accounts from the Account table
  console.log('📊 Fetching chart of accounts...');
  
  try {
    const accounts = await client.smartExport('Account', {
      exportFormat: 'full', // Get full objects with field names
      // You can add search criteria here if needed
      // search: "Type='CA'", // Example: Only Current Assets
      // sort: 'Code'          // Sort by account code
    });
    
    console.log(`✅ Retrieved ${accounts.length} accounts from MoneyWorks`);
    
    // Transform the raw data to our chart of accounts format
    const chartOfAccounts: ChartOfAccountsEntry[] = accounts.map((account: any) => ({
      code: String(account.Code || ''),
      description: String(account.Description || ''),
      type: String(account.Type || ''),
      systemType: String(account.System || ''),
      category: account.Category ? String(account.Category) : undefined,
      group: account.Group ? String(account.Group) : undefined,
      currency: account.Currency ? String(account.Currency) : undefined,
      accountantsCode: account.AccountantsCode ? String(account.AccountantsCode) : undefined,
      pandL: account.PandL ? String(account.PandL) : undefined,
      taxCode: account.TaxCode ? String(account.TaxCode) : undefined,
      bankAccountNumber: account.BankAccountNumber ? String(account.BankAccountNumber) : undefined,
      ebitda: account.EBITDA ? String(account.EBITDA) : undefined,
      comments: account.Comments ? String(account.Comments) : undefined,
      created: account.Created ? String(account.Created) : undefined,
      lastModified: account.LastModifiedTime ? String(account.LastModifiedTime) : undefined,
      securityLevel: account.SecurityLevel || undefined
    }));
    
    return chartOfAccounts;
    
  } catch (error) {
    console.error('❌ Error fetching chart of accounts:', error);
    throw error;
  }
}

/**
 * Enhance chart of accounts entries with canonical MoneyWorks information
 */
function enhanceChartOfAccounts(accounts: ChartOfAccountsEntry[]): EnhancedChartEntry[] {
  return accounts.map(account => {
    const accountType = account.type as MoneyWorksAccountType;
    const systemType = account.systemType as MoneyWorksSystemAccountType;
    
    // Get canonical information
    const accountTypeExplanation = getCanonicalAccountTypeExplanation(accountType);
    const systemTypeExplanation = getCanonicalSystemAccountTypeExplanation(systemType);
    const financialStatementSection = getCanonicalFinancialStatementSection(accountType);
    
    // Determine normal balance (simplified logic)
    const isAsset = ['CA', 'FA', 'TA'].includes(accountType);
    const isExpense = ['EX', 'CS'].includes(accountType);
    const normalBalance = (isAsset || isExpense) ? 'debit' : 'credit' as const;
    
    // Determine statement classification
    const isBalanceSheetAccount = ['CA', 'CL', 'FA', 'TA', 'TL', 'SF'].includes(accountType);
    const isIncomeStatementAccount = ['IN', 'SA', 'EX', 'CS'].includes(accountType);
    
    return {
      ...account,
      canonicalInfo: {
        accountTypeName: getAccountTypeName(accountType),
        accountTypeExplanation,
        systemTypeName: getSystemTypeName(systemType),
        systemTypeExplanation,
        financialStatementSection,
        normalBalance,
        isBalanceSheetAccount,
        isIncomeStatementAccount
      }
    };
  });
}

/**
 * Get human-readable account type name
 */
function getAccountTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    'IN': 'Income',
    'SA': 'Sales',
    'EX': 'Expense',
    'CS': 'Cost of Sales',
    'CA': 'Current Asset',
    'CL': 'Current Liability',
    'FA': 'Fixed Asset',
    'TA': 'Term Asset',
    'TL': 'Term Liability',
    'SF': 'Shareholder\'s Funds'
  };
  return typeNames[type] || type;
}

/**
 * Get human-readable system type name
 */
function getSystemTypeName(systemType: string): string {
  const systemNames: Record<string, string> = {
    'BK': 'Bank Account',
    'PL': 'Profit & Loss',
    'AR': 'Accounts Receivable',
    'AP': 'Accounts Payable',
    'GR': 'GST Received',
    'GP': 'GST Paid',
    '  ': 'Ordinary Account'
  };
  return systemNames[systemType] || 'Unknown';
}

/**
 * Display chart of accounts in a formatted table
 */
function displayChartOfAccounts(accounts: EnhancedChartEntry[]): void {
  console.log('\n📋 CHART OF ACCOUNTS');
  console.log('='.repeat(120));
  
  // Group accounts by type for better organization
  const groupedAccounts = accounts.reduce((groups, account) => {
    const type = account.canonicalInfo.accountTypeName;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<string, EnhancedChartEntry[]>);
  
  // Display each group
  for (const [typeName, typeAccounts] of Object.entries(groupedAccounts)) {
    console.log(`\n🏷️  ${typeName.toUpperCase()} (${typeAccounts.length} accounts)`);
    console.log('-'.repeat(80));
    
    typeAccounts
      .sort((a, b) => a.code.localeCompare(b.code))
      .forEach(account => {
        const systemInfo = account.systemType !== '  ' ? ` [${account.canonicalInfo.systemTypeName}]` : '';
        const categoryInfo = account.category ? ` (${account.category})` : '';
        
        console.log(`  ${account.code.padEnd(10)} | ${account.description.padEnd(35)} | ${account.canonicalInfo.normalBalance.padEnd(6)} | ${account.canonicalInfo.financialStatementSection}${systemInfo}${categoryInfo}`);
        
        if (account.comments) {
          console.log(`             📝 ${account.comments}`);
        }
      });
  }
}

/**
 * Display summary statistics
 */
function displaySummaryStats(accounts: EnhancedChartEntry[]): void {
  console.log('\n📊 SUMMARY STATISTICS');
  console.log('='.repeat(60));
  
  const totalAccounts = accounts.length;
  const balanceSheetAccounts = accounts.filter(a => a.canonicalInfo.isBalanceSheetAccount).length;
  const incomeStatementAccounts = accounts.filter(a => a.canonicalInfo.isIncomeStatementAccount).length;
  const systemAccounts = accounts.filter(a => a.systemType !== '  ').length;
  const bankAccounts = accounts.filter(a => a.systemType === 'BK').length;
  
  console.log(`Total Accounts:           ${totalAccounts}`);
  console.log(`Balance Sheet Accounts:   ${balanceSheetAccounts}`);
  console.log(`Income Statement Accounts: ${incomeStatementAccounts}`);
  console.log(`System Accounts:          ${systemAccounts}`);
  console.log(`Bank Accounts:            ${bankAccounts}`);
  
  // Account type breakdown
  const typeBreakdown = accounts.reduce((breakdown, account) => {
    const typeName = account.canonicalInfo.accountTypeName;
    breakdown[typeName] = (breakdown[typeName] || 0) + 1;
    return breakdown;
  }, {} as Record<string, number>);
  
  console.log('\n📈 Account Type Breakdown:');
  Object.entries(typeBreakdown)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
}

/**
 * Export chart of accounts to JSON file
 */
async function exportToJson(accounts: EnhancedChartEntry[], filename: string = 'chart-of-accounts.json'): Promise<void> {
  const fs = await import('fs/promises');
  
  const exportData = {
    exportDate: new Date().toISOString(),
    totalAccounts: accounts.length,
    dataFile: config.dataFile,
    accounts: accounts
  };
  
  await fs.writeFile(filename, JSON.stringify(exportData, null, 2), 'utf8');
  console.log(`\n💾 Chart of accounts exported to: ${filename}`);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 MoneyWorks Chart of Accounts Fetcher');
    console.log('=====================================');
    
    // Validate configuration
    if (!config.dataFile || !config.username) {
      console.error('❌ Please update the configuration with your MoneyWorks connection details');
      process.exit(1);
    }
    
    console.log(`📁 Data File: ${config.dataFile}`);
    console.log(`🌐 Server: ${config.protocol}://${config.host}:${config.port}`);
    console.log(`👤 User: ${config.username}`);
    
    // Fetch chart of accounts
    const rawAccounts = await fetchChartOfAccounts();
    
    // Enhance with canonical information
    const enhancedAccounts = enhanceChartOfAccounts(rawAccounts);
    
    // Display results
    displayChartOfAccounts(enhancedAccounts);
    displaySummaryStats(enhancedAccounts);
    
    // Export to JSON
    await exportToJson(enhancedAccounts);
    
    console.log('\n✅ Chart of accounts fetch completed successfully!');
    
  } catch (error) {
    console.error('💥 Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

// Export for use as a module
export {
  fetchChartOfAccounts,
  enhanceChartOfAccounts,
  type ChartOfAccountsEntry,
  type EnhancedChartEntry
};