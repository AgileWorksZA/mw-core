/**
 * Transaction operations tool for MCP server using @moneyworks/core
 */

import { z } from "zod";
import { TransactionService } from "../../services/tables/transaction.service";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { transactionTypeEnum } from "@moneyworks/core/tables/transactions";

// Transaction type mappings
const TRANSACTION_TYPE_MAP: Record<string, string> = {
  // Debtor transactions
  "DI": "DI", // Debtor Invoice
  "DC": "DC", // Debtor Credit
  "DP": "DP", // Debtor Payment
  "DJ": "DJ", // Debtor Journal
  
  // Creditor transactions
  "CI": "CI", // Creditor Invoice
  "CC": "CC", // Creditor Credit
  "CP": "CP", // Creditor Payment
  "CJ": "CJ", // Creditor Journal
  
  // General transactions
  "PC": "PC", // Petty Cash
  "PD": "PD", // Paid
  "SO": "SO", // Standing Order
  "JO": "JO", // Journal
  "TD": "TD", // Time & Disbursement
  "BR": "BR", // Bank Receipt
  "BP": "BP", // Bank Payment
  "BT": "BT", // Bank Transfer
};

const TRANSACTION_TYPE_DISPLAY: Record<string, string> = {
  "DI": "Sales Invoice",
  "DC": "Sales Credit",
  "DP": "Customer Payment",
  "DJ": "Sales Journal",
  "CI": "Purchase Invoice",
  "CC": "Purchase Credit",
  "CP": "Supplier Payment",
  "CJ": "Purchase Journal",
  "PC": "Petty Cash",
  "PD": "Paid",
  "SO": "Standing Order",
  "JO": "Journal",
  "TD": "Time & Disbursement",
  "BR": "Bank Receipt",
  "BP": "Bank Payment",
  "BT": "Bank Transfer",
};

const transactionInputSchema = z.object({
  operation: z.enum(["search", "get", "listFields", "getByPeriod", "getByAccount", "getByName"]).describe("Operation to perform"),
  
  // Search parameters
  searchTerm: z.string().optional().describe("Search term for description"),
  sequenceNumber: z.number().optional().describe("Transaction sequence number"),
  transactionType: z.string().optional().describe("Transaction type (e.g., DI, CI, JO)"),
  
  // Filter parameters
  accountCode: z.string().optional().describe("Account code to filter by"),
  nameCode: z.string().optional().describe("Customer/supplier code to filter by"),
  period: z.number().optional().describe("Period number to filter by"),
  fromDate: z.string().optional().describe("Start date (YYYYMMDD)"),
  toDate: z.string().optional().describe("End date (YYYYMMDD)"),
  
  // Status filters
  onlyPosted: z.boolean().optional().describe("Only show posted transactions"),
  onlyUnposted: z.boolean().optional().describe("Only show unposted transactions"),
  onlyOutstanding: z.boolean().optional().describe("Only show outstanding invoices"),
  
  // Pagination
  limit: z.number().optional().describe("Maximum number of results"),
  offset: z.number().optional().describe("Number of results to skip"),
});

export function registerTransactionTool(server: McpServer, transactionService: TransactionService) {
  server.tool(
    "transaction_operations",
    "Search, retrieve and analyze transactions including invoices, payments, journals, and bank transactions",
    transactionInputSchema,
    async (params: unknown) => {
      const input = transactionInputSchema.parse(params);
      
      try {
        switch (input.operation) {
          case "search": {
            let transactions;
            
            // Handle different search scenarios
            if (input.sequenceNumber) {
              const transaction = await transactionService.getBySequence(input.sequenceNumber);
              transactions = transaction ? [transaction] : [];
            } else if (input.searchTerm) {
              transactions = await transactionService.searchByDescription(input.searchTerm);
            } else if (input.transactionType) {
              const internalType = TRANSACTION_TYPE_MAP[input.transactionType] || input.transactionType;
              transactions = await transactionService.getByType(internalType);
            } else if (input.onlyPosted) {
              transactions = await transactionService.getPosted();
            } else if (input.onlyUnposted) {
              transactions = await transactionService.getUnposted();
            } else if (input.onlyOutstanding) {
              transactions = await transactionService.getOutstandingInvoices();
            } else if (input.fromDate && input.toDate) {
              transactions = await transactionService.getByDateRange(input.fromDate, input.toDate);
            } else {
              // Default to recent transactions
              transactions = await transactionService.list({
                limit: input.limit || 100,
                offset: input.offset || 0,
                orderBy: "TransDate DESC, SequenceNumber DESC",
              });
            }

            // Apply limit if we got transactions through other methods
            if (input.limit && transactions.length > input.limit) {
              transactions = transactions.slice(0, input.limit);
            }

            // Enrich with display types
            const enrichedTransactions = transactions.map(trans => ({
              ...trans,
              typeDisplay: TRANSACTION_TYPE_DISPLAY[trans.type] || trans.type,
              statusDisplay: trans.status === 1 ? "Posted" : "Unposted",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  count: enrichedTransactions.length,
                  transactions: enrichedTransactions,
                  hasMore: enrichedTransactions.length === (input.limit || 100),
                }, null, 2)
              }]
            };
          }

          case "get": {
            if (!input.sequenceNumber) {
              throw new Error("Sequence number is required for get operation");
            }

            const transaction = await transactionService.getBySequence(input.sequenceNumber);
            
            if (!transaction) {
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: `Transaction with sequence number ${input.sequenceNumber} not found`,
                  }, null, 2)
                }]
              };
            }

            // Enrich with display info
            const enrichedTransaction = {
              ...transaction,
              typeDisplay: TRANSACTION_TYPE_DISPLAY[transaction.type] || transaction.type,
              statusDisplay: transaction.status === 1 ? "Posted" : "Unposted",
            };

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  transaction: enrichedTransaction,
                }, null, 2)
              }]
            };
          }

          case "getByPeriod": {
            if (!input.period) {
              throw new Error("Period is required for this operation");
            }

            const transactions = await transactionService.getByPeriod(input.period);
            
            const enrichedTransactions = transactions.map(trans => ({
              ...trans,
              typeDisplay: TRANSACTION_TYPE_DISPLAY[trans.type] || trans.type,
              statusDisplay: trans.status === 1 ? "Posted" : "Unposted",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  period: input.period,
                  count: enrichedTransactions.length,
                  transactions: enrichedTransactions,
                }, null, 2)
              }]
            };
          }

          case "getByAccount": {
            if (!input.accountCode) {
              throw new Error("Account code is required for this operation");
            }

            const transactions = await transactionService.getByAccount(input.accountCode);
            
            const enrichedTransactions = transactions.map(trans => ({
              ...trans,
              typeDisplay: TRANSACTION_TYPE_DISPLAY[trans.type] || trans.type,
              statusDisplay: trans.status === 1 ? "Posted" : "Unposted",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  accountCode: input.accountCode,
                  count: enrichedTransactions.length,
                  transactions: enrichedTransactions,
                }, null, 2)
              }]
            };
          }

          case "getByName": {
            if (!input.nameCode) {
              throw new Error("Name code is required for this operation");
            }

            const transactions = await transactionService.getByName(input.nameCode);
            
            const enrichedTransactions = transactions.map(trans => ({
              ...trans,
              typeDisplay: TRANSACTION_TYPE_DISPLAY[trans.type] || trans.type,
              statusDisplay: trans.status === 1 ? "Posted" : "Unposted",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  nameCode: input.nameCode,
                  count: enrichedTransactions.length,
                  transactions: enrichedTransactions,
                }, null, 2)
              }]
            };
          }

          case "listFields": {
            const fields = transactionService.getFieldList();
            const typeInfo = Object.entries(TRANSACTION_TYPE_MAP).map(([code, internal]) => ({
              code,
              internal,
              description: TRANSACTION_TYPE_DISPLAY[code],
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  fields,
                  transactionTypes: typeInfo,
                  totalFields: fields.length,
                }, null, 2)
              }]
            };
          }

          default:
            throw new Error(`Unknown operation: ${input.operation}`);
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
            }, null, 2)
          }]
        };
      }
    }
  );
}