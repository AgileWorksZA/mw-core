/**
 * Account operations tool for MCP server using @moneyworks/core
 * FIXED VERSION - Using correct schema format for MCP SDK
 */

import { z } from "zod";
import { AccountService } from "../../services/tables/account.service";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { accountTypeEnum } from "@moneyworks/core/tables/accounts";

// Map display codes to internal codes
const ACCOUNT_TYPE_MAP: Record<string, string> = {
  // Asset types
  "BA": "BA", // Bank Account
  "CA": "CA", // Current Asset
  "FA": "FA", // Fixed Asset
  "OA": "OA", // Other Asset
  "AS": "AS", // Asset (header)
  
  // Liability types  
  "CL": "CL", // Current Liability
  "TL": "TL", // Term Liability
  "LI": "LI", // Liability (header)
  
  // Equity types
  "EQ": "EQ", // Equity
  
  // Income types
  "IN": "IN", // Income
  "OI": "OI", // Other Income
  
  // Expense types
  "CO": "CO", // Cost of Sales
  "EX": "EX", // Expense
  "OE": "OE", // Other Expense
};

// Reverse map for display
const ACCOUNT_TYPE_DISPLAY: Record<string, string> = {
  "BA": "Bank Account",
  "CA": "Current Asset", 
  "FA": "Fixed Asset",
  "OA": "Other Asset",
  "AS": "Asset",
  "CL": "Current Liability",
  "TL": "Term Liability",
  "LI": "Liability",
  "EQ": "Equity",
  "IN": "Income",
  "OI": "Other Income",
  "CO": "Cost of Sales",
  "EX": "Expense",
  "OE": "Other Expense",
};

// CORRECT: Define the raw shape for MCP SDK
const accountInputShape = {
  operation: z.enum(["search", "get", "listFields"]).describe("Operation to perform"),
  searchTerm: z.string().optional().describe("Search term for account code or description"),
  code: z.string().optional().describe("Account code for get operation"),
  accountType: z.string().optional().describe("Filter by account type (e.g., BA, CA, FA, CL, IN, EX)"),
  onlyActive: z.boolean().optional().describe("Only return active accounts"),
  withBalance: z.boolean().optional().describe("Only return accounts with non-zero balance"),
  parentCode: z.string().optional().describe("Get child accounts of this parent"),
  limit: z.number().optional().describe("Maximum number of results"),
  offset: z.number().optional().describe("Number of results to skip"),
};

// Create the schema object for validation (optional, for internal use)
const accountInputSchema = z.object(accountInputShape);

export function registerAccountToolFixed(server: McpServer, accountService: AccountService) {
  server.tool(
    "account_operations",
    "Search, retrieve and analyze accounts in MoneyWorks. Includes chart of accounts, bank accounts, income/expense categories, and balance information.",
    accountInputShape, // CORRECT: Pass the raw shape, not the z.object() result
    async (params: unknown) => {
      // We can still use the schema object for parsing/validation
      const input = accountInputSchema.parse(params);
      
      try {
        switch (input.operation) {
          case "search": {
            let filter = "";
            const filters: string[] = [];

            // Search in code or description
            if (input.searchTerm) {
              filters.push(`(Code~"${input.searchTerm}" OR Description~"${input.searchTerm}")`);
            }

            // Filter by account type
            if (input.accountType) {
              const internalType = ACCOUNT_TYPE_MAP[input.accountType] || input.accountType;
              filters.push(`Type="${internalType}"`);
            }

            // Filter by active status
            if (input.onlyActive) {
              filters.push("Inactive=0");
            }

            // Filter by balance
            if (input.withBalance) {
              filters.push("Balance<>0");
            }

            // Filter by parent
            if (input.parentCode) {
              filters.push(`ParentAccount="${input.parentCode}"`);
            }

            // Combine filters
            if (filters.length > 0) {
              filter = filters.join(" AND ");
            }

            const accounts = await accountService.list({
              filter,
              limit: input.limit || 100,
              offset: input.offset || 0,
              orderBy: "Code",
            });

            // Add display type to results
            const enrichedAccounts = accounts.map(account => ({
              ...account,
              typeDisplay: ACCOUNT_TYPE_DISPLAY[account.type] || account.type,
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  count: enrichedAccounts.length,
                  accounts: enrichedAccounts,
                  hasMore: enrichedAccounts.length === (input.limit || 100),
                }, null, 2)
              }]
            };
          }

          case "get": {
            if (!input.code) {
              throw new Error("Account code is required for get operation");
            }

            const account = await accountService.getByCode(input.code);
            
            if (!account) {
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: `Account with code '${input.code}' not found`,
                  }, null, 2)
                }]
              };
            }

            // Add display type
            const enrichedAccount = {
              ...account,
              typeDisplay: ACCOUNT_TYPE_DISPLAY[account.type] || account.type,
            };

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  account: enrichedAccount,
                }, null, 2)
              }]
            };
          }

          case "listFields": {
            const fields = accountService.getFieldList();
            const typeInfo = Object.entries(ACCOUNT_TYPE_MAP).map(([code, internal]) => ({
              code,
              internal,
              description: ACCOUNT_TYPE_DISPLAY[code],
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  fields,
                  accountTypes: typeInfo,
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

// Alternative approach using .shape property
export function registerAccountToolAlternative(server: McpServer, accountService: AccountService) {
  // Define schema as z.object
  const schema = z.object({
    operation: z.enum(["search", "get", "listFields"]).describe("Operation to perform"),
    searchTerm: z.string().optional().describe("Search term for account code or description"),
    code: z.string().optional().describe("Account code for get operation"),
    accountType: z.string().optional().describe("Filter by account type (e.g., BA, CA, FA, CL, IN, EX)"),
    onlyActive: z.boolean().optional().describe("Only return active accounts"),
    withBalance: z.boolean().optional().describe("Only return accounts with non-zero balance"),
    parentCode: z.string().optional().describe("Get child accounts of this parent"),
    limit: z.number().optional().describe("Maximum number of results"),
    offset: z.number().optional().describe("Number of results to skip"),
  });

  // Extract the shape using .shape property
  server.tool(
    "account_operations_alt",
    "Alternative implementation using .shape",
    schema.shape, // Use .shape to get the raw shape
    async (params: unknown) => {
      const input = schema.parse(params);
      // ... rest of the implementation
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: true, message: "Using .shape approach" }, null, 2)
        }]
      };
    }
  );
}