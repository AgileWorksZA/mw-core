/**
 * Name operations tool for MCP server using @moneyworks/core
 * Handles customers, suppliers, and contacts
 */

import { z } from "zod";
import { NameService } from "../../services/tables/name.service";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const nameInputSchema = z.object({
  operation: z.enum(["search", "get", "listFields", "getByType", "getWithBalance"]).describe("Operation to perform"),
  
  // Search parameters
  searchTerm: z.string().optional().describe("Search term for name, company, email, or phone"),
  code: z.string().optional().describe("Name code for get operation"),
  
  // Filter parameters
  nameType: z.enum(["customer", "supplier", "both", "all"]).optional().describe("Filter by customer/supplier type"),
  category: z.string().optional().describe("Filter by category"),
  
  // Status filters
  onlyActive: z.boolean().optional().describe("Only show active names"),
  withBalance: z.boolean().optional().describe("Only show names with outstanding balance"),
  onHold: z.boolean().optional().describe("Filter by credit hold status"),
  
  // Search type
  searchIn: z.enum(["name", "email", "phone", "all"]).optional().describe("Field to search in"),
  
  // Pagination
  limit: z.number().optional().describe("Maximum number of results"),
  offset: z.number().optional().describe("Number of results to skip"),
});

export function registerNameTool(server: McpServer, nameService: NameService) {
  server.tool(
    "name_operations",
    "Search, retrieve and analyze customers, suppliers, and contacts in MoneyWorks",
    nameInputSchema,
    async (params: unknown) => {
      const input = nameInputSchema.parse(params);
      
      try {
        switch (input.operation) {
          case "search": {
            let names;
            
            // Handle different search scenarios
            if (input.code) {
              const name = await nameService.getByCode(input.code);
              names = name ? [name] : [];
            } else if (input.searchTerm) {
              // Search based on searchIn parameter
              switch (input.searchIn) {
                case "email":
                  names = await nameService.searchByEmail(input.searchTerm);
                  break;
                case "phone":
                  names = await nameService.searchByPhone(input.searchTerm);
                  break;
                case "name":
                case "all":
                default:
                  names = await nameService.searchByName(input.searchTerm);
                  break;
              }
            } else if (input.nameType) {
              // Filter by type
              switch (input.nameType) {
                case "customer":
                  names = await nameService.getCustomers();
                  break;
                case "supplier":
                  names = await nameService.getSuppliers();
                  break;
                case "both":
                  names = await nameService.getCustomersAndSuppliers();
                  break;
                default:
                  names = await nameService.list({ orderBy: "Name" });
                  break;
              }
            } else if (input.category) {
              names = await nameService.getByCategory(input.category);
            } else if (input.withBalance) {
              names = await nameService.getWithBalance();
            } else if (input.onHold !== undefined) {
              names = await nameService.getByCreditStatus(input.onHold);
            } else {
              // Default to all names
              names = await nameService.list({
                limit: input.limit || 100,
                offset: input.offset || 0,
                orderBy: "Name",
              });
            }

            // Apply additional filters
            if (input.onlyActive && names.length > 0) {
              names = names.filter(n => !n.inactive);
            }

            // Apply limit if we got names through other methods
            if (input.limit && names.length > input.limit) {
              names = names.slice(0, input.limit);
            }

            // Enrich with additional info
            const enrichedNames = names.map(name => ({
              ...name,
              type: getNameType(name),
              hasBalance: name.balance !== 0,
              creditStatus: name.hold ? "On Hold" : "Active",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  count: enrichedNames.length,
                  names: enrichedNames,
                  hasMore: enrichedNames.length === (input.limit || 100),
                }, null, 2)
              }]
            };
          }

          case "get": {
            if (!input.code) {
              throw new Error("Name code is required for get operation");
            }

            const name = await nameService.getByCode(input.code);
            
            if (!name) {
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: `Name with code '${input.code}' not found`,
                  }, null, 2)
                }]
              };
            }

            // Enrich with additional info
            const enrichedName = {
              ...name,
              type: getNameType(name),
              hasBalance: name.balance !== 0,
              creditStatus: name.hold ? "On Hold" : "Active",
            };

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  name: enrichedName,
                }, null, 2)
              }]
            };
          }

          case "getByType": {
            if (!input.nameType) {
              throw new Error("Name type is required for this operation");
            }

            let names;
            switch (input.nameType) {
              case "customer":
                names = await nameService.getCustomers();
                break;
              case "supplier":
                names = await nameService.getSuppliers();
                break;
              case "both":
                names = await nameService.getCustomersAndSuppliers();
                break;
              default:
                names = await nameService.list({ orderBy: "Name" });
                break;
            }

            const enrichedNames = names.map(name => ({
              ...name,
              type: getNameType(name),
              hasBalance: name.balance !== 0,
              creditStatus: name.hold ? "On Hold" : "Active",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  nameType: input.nameType,
                  count: enrichedNames.length,
                  names: enrichedNames,
                }, null, 2)
              }]
            };
          }

          case "getWithBalance": {
            const names = await nameService.getWithBalance();
            
            const enrichedNames = names.map(name => ({
              ...name,
              type: getNameType(name),
              creditStatus: name.hold ? "On Hold" : "Active",
            }));

            // Sort by balance descending
            enrichedNames.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  count: enrichedNames.length,
                  totalOutstanding: enrichedNames.reduce((sum, n) => sum + n.balance, 0),
                  names: enrichedNames,
                }, null, 2)
              }]
            };
          }

          case "listFields": {
            const fields = nameService.getFieldList();
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  fields,
                  totalFields: fields.length,
                  keyFields: ["Code", "Name", "Company", "Customer", "Supplier", "Balance", "CreditLimit"],
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

// Helper function to determine name type
function getNameType(name: any): string {
  if (name.customer && name.supplier) {
    return "Customer & Supplier";
  } else if (name.customer) {
    return "Customer";
  } else if (name.supplier) {
    return "Supplier";
  } else {
    return "Contact";
  }
}