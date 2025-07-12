import { tool } from 'ai';
import { z } from 'zod';
import { SmartMoneyWorksClient } from '@moneyworks/data';
import { d, p } from '@moneyworks/utilities';
import { MoneyWorksChatContext } from '../shared/types';
import {
  getTransactionsSchema,
  getTaxRateSchema,
  listTaxRatesSchema,
  getAccountSchema,
  searchNamesSchema,
  runReportSchema,
  MoneyWorksTools
} from '../shared/types/tools';

export function createMoneyWorksTools(
  client: SmartMoneyWorksClient,
  context: MoneyWorksChatContext
) {
  return {
    [MoneyWorksTools.GET_TRANSACTIONS]: tool({
      description: 'Search and retrieve MoneyWorks transactions with filtering',
      parameters: getTransactionsSchema,
      execute: async (args) => {
        const filters: string[] = [];
        
        if (args.type && args.type !== 'ALL') {
          filters.push(`Type='${args.type}'`);
        }
        if (args.dateFrom) {
          filters.push(`TransDate>='${args.dateFrom}'`);
        }
        if (args.dateTo) {
          filters.push(`TransDate<='${args.dateTo}'`);
        }
        if (args.nameCode) {
          filters.push(`NameCode='${args.nameCode}'`);
        }
        if (args.status) {
          filters.push(`Status='${args.status}'`);
        }
        
        const query = filters.length > 0 ? filters.join(' AND ') : undefined;
        
        try {
          const result = await client.smartExport('Transaction', {
            search: query,
            limit: args.limit,
            exportFormat: 'full'
          });
          
          return Array.isArray(result) ? result : [];
        } catch (error) {
          throw new Error(`Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }),

    [MoneyWorksTools.GET_TAX_RATE]: tool({
      description: 'Get MoneyWorks tax rate information by code',
      parameters: getTaxRateSchema,
      execute: async ({ taxCode }) => {
        try {
          const result = await client.smartExport('TaxRate', {
            search: `TaxCode='${taxCode}'`,
            exportFormat: 'schema', // Include full schema info
            limit: 1
          });
          
          return Array.isArray(result) && result.length > 0 ? result[0] : null;
        } catch (error) {
          throw new Error(`Failed to fetch tax rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }),

    [MoneyWorksTools.LIST_TAX_RATES]: tool({
      description: 'List all tax rates available in MoneyWorks',
      parameters: listTaxRatesSchema,
      execute: async ({ limit }) => {
        try {
          const result = await client.smartExport('TaxRate', {
            exportFormat: 'full',
            limit
          });
          
          return Array.isArray(result) ? result : [];
        } catch (error) {
          throw new Error(`Failed to list tax rates: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }),

    [MoneyWorksTools.GET_ACCOUNT]: tool({
      description: 'Get MoneyWorks account information by code',
      parameters: getAccountSchema,
      execute: async ({ accountCode }) => {
        try {
          const result = await client.smartExport('Account', {
            search: `Code='${accountCode}'`,
            exportFormat: 'full',
            limit: 1
          });
          
          return Array.isArray(result) && result.length > 0 ? result[0] : null;
        } catch (error) {
          throw new Error(`Failed to fetch account: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }),

    [MoneyWorksTools.SEARCH_NAMES]: tool({
      description: 'Search for customers or suppliers by name or code',
      parameters: searchNamesSchema,
      execute: async ({ query, type, limit }) => {
        const filters: string[] = [
          `(Name CONTAINS '${query}' OR Code CONTAINS '${query}')`
        ];
        
        if (type === 'customer') {
          filters.push('CustomerType > 0');
        } else if (type === 'supplier') {
          filters.push('SupplierType > 0');
        }
        
        const filterQuery = filters.join(' AND ');
        
        try {
          const result = await client.smartExport('Name', {
            search: filterQuery,
            limit,
            exportFormat: 'full'
          });
          
          return Array.isArray(result) ? result : [];
        } catch (error) {
          throw new Error(`Failed to search names: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }),

    [MoneyWorksTools.RUN_REPORT]: tool({
      description: 'Run financial reports like aged receivables, P&L, balance sheet',
      parameters: runReportSchema,
      execute: async (args) => {
        // This is a simplified version - real implementation would
        // generate proper MoneyWorks reports
        try {
          switch (args.reportType) {
            case 'aged_receivables':
              return await generateAgedReceivables(client, args);
            case 'aged_payables':
              return await generateAgedPayables(client, args);
            case 'gst_summary':
              return await generateGSTSummary(client, args);
            default:
              throw new Error(`Report type ${args.reportType} not yet implemented`);
          }
        } catch (error) {
          throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }),

    [MoneyWorksTools.EVALUATE_EXPRESSION]: tool({
      description: 'Evaluate a MoneyWorks expression or calculation',
      parameters: z.object({
        expression: z.string().describe('MoneyWorks expression to evaluate')
      }),
      execute: async ({ expression }) => {
        try {
          const result = await client.evaluate(expression);
          return { expression, result };
        } catch (error) {
          throw new Error(`Failed to evaluate expression: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }),
  };
}

// Helper functions for report generation
async function generateAgedReceivables(
  client: SmartMoneyWorksClient, 
  args: any
): Promise<any> {
  const today = d`${new Date()}`;
  
  // Fetch unpaid customer invoices
  const invoices = await client.smartExport('Transaction', {
    search: `Type='DII' AND Status='P' AND Balance > 0`,
    exportFormat: 'full'
  });

  if (!Array.isArray(invoices)) return { error: 'No data returned' };

  // Group by aging buckets
  const buckets = {
    current: [],
    days30: [],
    days60: [],
    days90: [],
    over90: []
  };

  for (const inv of invoices) {
    const dueDate = d`${inv.DueDate}`;
    const daysOverdue = today.subtract(dueDate);
    
    if (daysOverdue <= 0) buckets.current.push(inv);
    else if (daysOverdue <= 30) buckets.days30.push(inv);
    else if (daysOverdue <= 60) buckets.days60.push(inv);
    else if (daysOverdue <= 90) buckets.days90.push(inv);
    else buckets.over90.push(inv);
  }

  return {
    reportType: 'aged_receivables',
    generatedAt: new Date(),
    period: args.period || p`${new Date()}`,
    summary: {
      current: { 
        count: buckets.current.length,
        total: buckets.current.reduce((sum, inv) => sum + inv.Balance, 0)
      },
      days30: {
        count: buckets.days30.length,
        total: buckets.days30.reduce((sum, inv) => sum + inv.Balance, 0)
      },
      days60: {
        count: buckets.days60.length,
        total: buckets.days60.reduce((sum, inv) => sum + inv.Balance, 0)
      },
      days90: {
        count: buckets.days90.length,
        total: buckets.days90.reduce((sum, inv) => sum + inv.Balance, 0)
      },
      over90: {
        count: buckets.over90.length,
        total: buckets.over90.reduce((sum, inv) => sum + inv.Balance, 0)
      }
    },
    details: buckets
  };
}

async function generateAgedPayables(
  client: SmartMoneyWorksClient,
  args: any
): Promise<any> {
  // Similar to aged receivables but for supplier invoices
  const today = d`${new Date()}`;
  
  const invoices = await client.smartExport('Transaction', {
    search: `Type='CIC' AND Status='P' AND Balance > 0`,
    exportFormat: 'full'
  });

  // ... similar aging logic for payables
  return { reportType: 'aged_payables', data: invoices };
}

async function generateGSTSummary(
  client: SmartMoneyWorksClient,
  args: any
): Promise<any> {
  const period = args.period || p`${new Date()}`;
  
  // Fetch all transactions for the period
  const transactions = await client.smartExport('Transaction', {
    search: `Period=${period} AND Status='P'`,
    exportFormat: 'full'
  });

  // Calculate GST collected and paid
  // This is simplified - real implementation would use MW's GST fields
  return {
    reportType: 'gst_summary',
    period,
    data: transactions
  };
}