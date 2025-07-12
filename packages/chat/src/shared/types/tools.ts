import { z } from 'zod';

// Tool parameter schemas
export const getTransactionsSchema = z.object({
  type: z.enum(['DII', 'CIC', 'DIP', 'CIP', 'ALL']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  nameCode: z.string().optional(),
  status: z.enum(['U', 'P', 'C']).optional(),
  limit: z.number().min(1).max(100).default(20),
});

export const getTaxRateSchema = z.object({
  taxCode: z.string(),
});

export const listTaxRatesSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
});

export const getAccountSchema = z.object({
  accountCode: z.string(),
});

export const searchNamesSchema = z.object({
  query: z.string(),
  type: z.enum(['customer', 'supplier', 'both']).default('both'),
  limit: z.number().min(1).max(50).default(10),
});

export const runReportSchema = z.object({
  reportType: z.enum([
    'aged_receivables', 
    'aged_payables',
    'profit_loss', 
    'balance_sheet',
    'gst_summary',
    'trial_balance'
  ]),
  period: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// Tool names enum for type safety
export enum MoneyWorksTools {
  GET_TRANSACTIONS = 'getTransactions',
  GET_TAX_RATE = 'getTaxRate',
  LIST_TAX_RATES = 'listTaxRates',
  GET_ACCOUNT = 'getAccount',
  SEARCH_NAMES = 'searchNames',
  RUN_REPORT = 'runReport',
  EVALUATE_EXPRESSION = 'evaluateExpression',
}

// Type definitions for tool results
export type ToolSchemas = {
  [MoneyWorksTools.GET_TRANSACTIONS]: typeof getTransactionsSchema;
  [MoneyWorksTools.GET_TAX_RATE]: typeof getTaxRateSchema;
  [MoneyWorksTools.LIST_TAX_RATES]: typeof listTaxRatesSchema;
  [MoneyWorksTools.GET_ACCOUNT]: typeof getAccountSchema;
  [MoneyWorksTools.SEARCH_NAMES]: typeof searchNamesSchema;
  [MoneyWorksTools.RUN_REPORT]: typeof runReportSchema;
};