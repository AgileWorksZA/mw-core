/**
 * Account operations tool for MCP server using @moneyworks/core
 * Now with improved self-documenting schemas
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AccountService } from "../../services/tables/account.service";
import { 
  accountOperationSchema,
  getAccountTypeCode,
  type AccountType
} from "@moneyworks/core/schemas";
import { accountExamples } from "../schemas/examples";

/**
 * Account type display names
 */
const ACCOUNT_TYPE_DISPLAY: Record<string, string> = {
  IN: "Income",
  SA: "Sales",
  EX: "Expense", 
  CS: "Cost of Sales",
  CA: "Current Asset",
  CL: "Current Liability",
  FA: "Fixed Asset",
  TA: "Term Asset",
  TL: "Term Liability",
  SF: "Shareholder's Funds",
};

export function registerAccountTool(server: McpServer, accountService: AccountService) {
  const description = `Search, retrieve and analyze accounts in MoneyWorks.

Examples:
• List all: ${accountExamples.listAll}
• Get account: ${accountExamples.getByCode}
• Search: ${accountExamples.searchBank}
• Count by type: ${accountExamples.countExpenses}`;

  server.tool(
    "account_operations",
    description,
    accountOperationSchema,
    async (params: unknown) => {
      const input = accountOperationSchema.parse(params);
      
      try {
        switch (input.operation) {
          case "list": {
            // Build filter
            const filters: string[] = [];
            
            if ('includeInactive' in input && !input.includeInactive) {
              filters.push('Inactive=0');
            }
            if ('onlyInactive' in input && input.onlyInactive) {
              filters.push('Inactive=1');
            }
            if ('accountType' in input && input.accountType) {
              const typeCode = getAccountTypeCode(input.accountType);
              filters.push(`Type="${typeCode}"`);
            }
            if ('withBalance' in input && input.withBalance) {
              filters.push('Balance<>0');
            }
            if ('parentCode' in input && input.parentCode) {
              filters.push(`ParentAccount="${input.parentCode}"`);
            }
            
            const accounts = await accountService.list({
              filter: filters.length > 0 ? filters.join(' AND ') : undefined,
              limit: input.limit,
              offset: input.offset,
              orderBy: input.orderBy || 'Code',
            });
            
            // Enrich with display names
            const enrichedAccounts = accounts.map(account => ({
              ...account,
              typeDisplay: ACCOUNT_TYPE_DISPLAY[account.type] || account.type,
            }));
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  accounts: enrichedAccounts,
                  count: enrichedAccounts.length,
                  hasMore: enrichedAccounts.length === (input.limit || 100),
                }, null, 2)
              }]
            };
          }
          
          case "get": {
            const account = await accountService.getByCode(input.code);
            
            if (!account) {
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: `Account with code '${input.code}' not found`
                  }, null, 2)
                }]
              };
            }
            
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
          
          case "search": {
            const searchFields = input.searchIn || ["Code", "Description", "Comment"];
            const searchConditions = searchFields
              .map(field => `${field}~"${input.query}"`)
              .join(' OR ');
            
            const filters: string[] = [`(${searchConditions})`];
            
            if ('includeInactive' in input && !input.includeInactive) {
              filters.push('Inactive=0');
            }
            if ('accountType' in input && input.accountType) {
              const typeCode = getAccountTypeCode(input.accountType);
              filters.push(`Type="${typeCode}"`);
            }
            if ('withBalance' in input && input.withBalance) {
              filters.push('Balance<>0');
            }
            
            const accounts = await accountService.list({
              filter: filters.join(' AND '),
              limit: input.limit,
              offset: input.offset,
              orderBy: input.orderBy,
            });
            
            const enrichedAccounts = accounts.map(account => ({
              ...account,
              typeDisplay: ACCOUNT_TYPE_DISPLAY[account.type] || account.type,
            }));
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  accounts: enrichedAccounts,
                  count: enrichedAccounts.length,
                  query: input.query,
                  searchedIn: searchFields,
                }, null, 2)
              }]
            };
          }
          
          case "count": {
            const filters: string[] = [];
            
            if ('includeInactive' in input && !input.includeInactive) {
              filters.push('Inactive=0');
            }
            if ('accountType' in input && input.accountType) {
              const typeCode = getAccountTypeCode(input.accountType);
              filters.push(`Type="${typeCode}"`);
            }
            if ('withBalance' in input && input.withBalance) {
              filters.push('Balance<>0');
            }
            if (input.filter) {
              filters.push(input.filter);
            }
            
            const count = await accountService.count({
              filter: filters.length > 0 ? filters.join(' AND ') : undefined,
            });
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  count,
                  criteria: {
                    accountType: input.accountType,
                    includeInactive: input.includeInactive,
                    withBalance: input.withBalance,
                    customFilter: input.filter,
                  }
                }, null, 2)
              }]
            };
          }
          
          case "export": {
            const filters: string[] = [];
            
            if (!input.includeInactive) {
              filters.push('Inactive=0');
            }
            if (input.accountType) {
              const typeCode = getAccountTypeCode(input.accountType);
              filters.push(`Type="${typeCode}"`);
            }
            if (input.withBalance) {
              filters.push('Balance<>0');
            }
            
            const result = await accountService.export({
              format: input.format,
              filter: filters.length > 0 ? filters.join(' AND ') : undefined,
              fields: input.fields,
              filename: input.filename,
            });
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  format: input.format,
                  filename: result.filename,
                  recordCount: result.count,
                  data: result.data, // Will be string for CSV/XML, object for JSON
                }, null, 2)
              }]
            };
          }
          
          case "types": {
            const types = Object.entries(ACCOUNT_TYPE_DISPLAY).map(([code, name]) => ({
              code,
              name,
              friendlyName: Object.entries(getAccountTypeCode).find(([_, c]) => c === code)?.[0] || code.toLowerCase(),
              statementType: ["IN", "SA", "EX", "CS"].includes(code) ? "income" : "balance_sheet",
            }));
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  types,
                }, null, 2)
              }]
            };
          }
          
          case "hierarchy": {
            const startFilter = input.parentCode 
              ? `ParentAccount="${input.parentCode}"`
              : 'ParentAccount=""';
              
            const accounts = await accountService.list({
              filter: startFilter,
              orderBy: 'Code',
            });
            
            // Recursively build hierarchy
            const buildHierarchy = async (parentCode: string, depth: number): Promise<any[]> => {
              if (depth === 0) return [];
              
              const children = await accountService.list({
                filter: `ParentAccount="${parentCode}"`,
                orderBy: 'Code',
              });
              
              return Promise.all(children.map(async child => ({
                ...child,
                typeDisplay: ACCOUNT_TYPE_DISPLAY[child.type] || child.type,
                children: await buildHierarchy(child.code, depth - 1),
              })));
            };
            
            const hierarchy = await Promise.all(accounts.map(async account => ({
              ...account,
              typeDisplay: ACCOUNT_TYPE_DISPLAY[account.type] || account.type,
              children: await buildHierarchy(account.code, input.depth - 1),
            })));
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  hierarchy,
                  startingFrom: input.parentCode || "root",
                  depth: input.depth,
                }, null, 2)
              }]
            };
          }
          
          case "balances": {
            const filters: string[] = [];
            
            if (input.accountType) {
              const typeCode = getAccountTypeCode(input.accountType);
              filters.push(`Type="${typeCode}"`);
            }
            if (!input.includeZero) {
              filters.push('Balance<>0');
            }
            
            const accounts = await accountService.list({
              filter: filters.length > 0 ? filters.join(' AND ') : undefined,
              orderBy: 'Balance DESC',
            });
            
            // Group by type or parent
            const grouped = accounts.reduce((acc, account) => {
              const key = input.groupBy === 'parent' 
                ? account.parentAccount || 'root'
                : account.type;
              
              if (!acc[key]) {
                acc[key] = {
                  accounts: [],
                  totalBalance: 0,
                  count: 0,
                };
              }
              
              acc[key].accounts.push(account);
              acc[key].totalBalance += account.balance || 0;
              acc[key].count++;
              
              return acc;
            }, {} as Record<string, any>);
            
            const summary = Object.entries(grouped).map(([key, data]) => ({
              group: key,
              displayName: input.groupBy === 'type' ? ACCOUNT_TYPE_DISPLAY[key] || key : key,
              ...data,
            }));
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  balances: input.groupBy === 'none' ? accounts : summary,
                  groupBy: input.groupBy,
                  totalBalance: accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
                  accountCount: accounts.length,
                }, null, 2)
              }]
            };
          }
          
          default:
            // TypeScript ensures this is never reached
            throw new Error(`Unknown operation: ${(input as any).operation}`);
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
              operation: input.operation,
            }, null, 2)
          }]
        };
      }
    }
  );
}