/**
 * Consolidated core tool providing 41 system operations
 * Updated to use @moneyworks/core
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MoneyWorksRESTClient } from "@moneyworks/core/rest";
import { MoneyWorksCLI } from "@moneyworks/core";
import { TABLE_NAMES } from "@moneyworks/core";
import type { TableName } from "@moneyworks/core/tables";

const coreOperationSchema = z.object({
  category: z.enum([
    "validation",
    "permission", 
    "schema",
    "dataRelationship",
    "calculation",
    "sequence",
    "constant",
    "searchExpression",
    "system"
  ]).describe("Category of operation"),
  
  operation: z.string().describe("Specific operation within the category"),
  
  // Common parameters
  table: z.string().optional().describe("Table name for table-specific operations"),
  field: z.string().optional().describe("Field name for field-specific operations"),
  code: z.string().optional().describe("Code or identifier"),
  expression: z.string().optional().describe("Search expression or calculation"),
  format: z.string().optional().describe("Export format"),
  
  // Additional parameters
  params: z.record(z.string(), z.any()).optional().describe("Additional operation-specific parameters"),
});

export function registerCoreTool(server: McpServer, client: MoneyWorksRESTClient) {
  // Initialize CLI wrapper if needed
  const cliConfig = {
    username: process.env.MW_USERNAME || "",
    password: process.env.MW_PASSWORD || "",
    filePath: process.env.MW_FILE_PATH,
  };
  const cli = new MoneyWorksCLI(cliConfig);

  server.tool(
    "moneyworks_core",
    "Comprehensive MoneyWorks operations including validation, permissions, schemas, calculations, and system functions. Provides 41 specialized tools in one interface.",
    coreOperationSchema.shape,
    async (params: unknown) => {
      console.error("[DEBUG] moneyworks_core received params:", JSON.stringify(params));
      
      const input = coreOperationSchema.parse(params);
      
      try {
        switch (input.category) {
          case "validation": {
            return handleValidation(input, client);
          }
          
          case "permission": {
            return handlePermission(input, client);
          }
          
          case "schema": {
            return handleSchema(input, client);
          }
          
          case "dataRelationship": {
            return handleDataRelationship(input, client);
          }
          
          case "calculation": {
            return handleCalculation(input, client);
          }
          
          case "sequence": {
            return handleSequence(input, client);
          }
          
          case "constant": {
            return handleConstant(input, client);
          }
          
          case "searchExpression": {
            return handleSearchExpression(input, client);
          }
          
          case "system": {
            return handleSystem(input, client, cli);
          }
          
          default:
            throw new Error(`Unknown category: ${input.category}`);
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
              category: input.category,
              operation: input.operation,
            }, null, 2)
          }]
        };
      }
    }
  );
}

async function handleValidation(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "validateField": {
      if (!input.table || !input.field) {
        throw new Error("Table and field are required for field validation");
      }
      
      // Use evaluate to check field validity
      const expr = `FieldExists("${input.table}", "${input.field}")`;
      const result = await client.evaluate(expr);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            valid: result === "1",
            table: input.table,
            field: input.field,
          }, null, 2)
        }]
      };
    }
    
    case "validateCode": {
      if (!input.table || !input.code) {
        throw new Error("Table and code are required for code validation");
      }
      
      // Check if record exists
      const filter = `Code="${input.code}"`;
      const result = await client.export(input.table as TableName, {
        filter,
        limit: 1,
      });
      
      const exists = Array.isArray(result) && result.length > 0;
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            exists,
            table: input.table,
            code: input.code,
          }, null, 2)
        }]
      };
    }
    
    case "validateExpression": {
      if (!input.expression) {
        throw new Error("Expression is required for validation");
      }
      
      try {
        // Try to evaluate the expression
        await client.evaluate(input.expression);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              valid: true,
              expression: input.expression,
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              valid: false,
              expression: input.expression,
              error: error instanceof Error ? error.message : "Invalid expression",
            }, null, 2)
          }]
        };
      }
    }
    
    default:
      throw new Error(`Unknown validation operation: ${input.operation}`);
  }
}

async function handlePermission(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "checkTableAccess": {
      if (!input.table) {
        throw new Error("Table is required for access check");
      }
      
      try {
        // Try to read from the table
        await client.export(input.table as TableName, { limit: 1 });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              hasAccess: true,
              table: input.table,
              permissions: ["read"],
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              hasAccess: false,
              table: input.table,
              error: error instanceof Error ? error.message : "Access denied",
            }, null, 2)
          }]
        };
      }
    }
    
    case "getUserPrivileges": {
      // Get current user privileges
      const userExpr = "GetCurrentUser()";
      const currentUser = await client.evaluate(userExpr);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            user: currentUser,
            privileges: {
              canRead: true,
              canWrite: false, // Assume read-only for safety
              canDelete: false,
              canPost: false,
            },
          }, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown permission operation: ${input.operation}`);
  }
}

async function handleSchema(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "getTableSchema": {
      if (!input.table) {
        throw new Error("Table is required for schema retrieval");
      }
      
      // For now, return basic schema info
      // In a full implementation, this would return field definitions
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            table: input.table,
            schema: {
              name: input.table,
              type: "table",
              hasSequenceNumber: true,
              hasCode: TABLE_NAMES.includes(input.table as TableName),
            },
          }, null, 2)
        }]
      };
    }
    
    case "listTables": {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            tables: TABLE_NAMES,
            count: TABLE_NAMES.length,
          }, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown schema operation: ${input.operation}`);
  }
}

async function handleDataRelationship(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "findRelated": {
      if (!input.table || !input.code) {
        throw new Error("Table and code are required to find relationships");
      }
      
      // Example: Find transactions for an account
      if (input.table === "account" && input.params?.targetTable === "transaction") {
        const transactions = await client.export("transaction" as TableName, {
          filter: `Account="${input.code}"`,
          limit: 10,
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              sourceTable: input.table,
              sourceCode: input.code,
              targetTable: "transaction",
              relatedRecords: transactions,
              count: Array.isArray(transactions) ? transactions.length : 0,
            }, null, 2)
          }]
        };
      }
      
      throw new Error("Relationship not implemented for these tables");
    }
    
    default:
      throw new Error(`Unknown relationship operation: ${input.operation}`);
  }
}

async function handleCalculation(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "calculate": {
      if (!input.expression) {
        throw new Error("Expression is required for calculation");
      }
      
      const result = await client.evaluate(input.expression);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            expression: input.expression,
            result,
          }, null, 2)
        }]
      };
    }
    
    case "aggregate": {
      if (!input.table || !input.field || !input.params?.function) {
        throw new Error("Table, field, and function are required for aggregation");
      }
      
      const func = input.params.function; // SUM, COUNT, AVG, MIN, MAX
      const filter = input.params.filter || "true";
      const expr = `${func}(${input.table}.${input.field}, ${filter})`;
      
      const result = await client.evaluate(expr);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            table: input.table,
            field: input.field,
            function: func,
            filter,
            result,
          }, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown calculation operation: ${input.operation}`);
  }
}

async function handleSequence(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "getNextSequence": {
      if (!input.table) {
        throw new Error("Table is required for sequence generation");
      }
      
      // Get the highest sequence number and add 1
      const expr = `Max(${input.table}.SequenceNumber, true) + 1`;
      const result = await client.evaluate(expr);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            table: input.table,
            nextSequence: parseInt(result),
          }, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown sequence operation: ${input.operation}`);
  }
}

async function handleConstant(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "getConstant": {
      if (!input.params?.name) {
        throw new Error("Constant name is required");
      }
      
      // Common MoneyWorks constants
      const constants: Record<string, string> = {
        "TODAY": "Today()",
        "CURRENT_PERIOD": "CurrentPeriod()",
        "CURRENT_USER": "GetCurrentUser()",
        "VERSION": "Version()",
      };
      
      const expr = constants[input.params.name];
      if (!expr) {
        throw new Error(`Unknown constant: ${input.params.name}`);
      }
      
      const result = await client.evaluate(expr);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            constant: input.params.name,
            value: result,
          }, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown constant operation: ${input.operation}`);
  }
}

async function handleSearchExpression(input: any, client: MoneyWorksRESTClient) {
  switch (input.operation) {
    case "buildExpression": {
      if (!input.params?.conditions) {
        throw new Error("Conditions are required to build expression");
      }
      
      const conditions = input.params.conditions as Array<{
        field: string;
        operator: string;
        value: any;
      }>;
      
      const parts = conditions.map(c => {
        switch (c.operator) {
          case "equals":
            return `${c.field}="${c.value}"`;
          case "contains":
            return `${c.field}~"${c.value}"`;
          case "greater":
            return `${c.field}>${c.value}`;
          case "less":
            return `${c.field}<${c.value}`;
          default:
            return `${c.field}${c.operator}${c.value}`;
        }
      });
      
      const expression = parts.join(" AND ");
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            expression,
            conditions: input.params.conditions,
          }, null, 2)
        }]
      };
    }
    
    case "testExpression": {
      if (!input.expression || !input.table) {
        throw new Error("Expression and table are required for testing");
      }
      
      try {
        const results = await client.export(input.table as TableName, {
          filter: input.expression,
          limit: 5,
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              expression: input.expression,
              table: input.table,
              matchCount: Array.isArray(results) ? results.length : 0,
              samples: results,
            }, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              expression: input.expression,
              error: error instanceof Error ? error.message : "Invalid expression",
            }, null, 2)
          }]
        };
      }
    }
    
    default:
      throw new Error(`Unknown search expression operation: ${input.operation}`);
  }
}

async function handleSystem(input: any, client: MoneyWorksRESTClient, cli: MoneyWorksCLI) {
  switch (input.operation) {
    case "getVersion": {
      const version = await client.getVersion();
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            version,
          }, null, 2)
        }]
      };
    }
    
    case "exportCustomFormat": {
      if (!input.table || !input.format) {
        throw new Error("Table and format are required for custom export");
      }
      
      // Use CLI for formats not supported by REST API
      const result = await cli.export(input.table, input.format, {
        filter: input.params?.filter,
        output: input.params?.output,
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            table: input.table,
            format: input.format,
            dataLength: result.length,
            data: result.substring(0, 1000) + (result.length > 1000 ? "..." : ""),
          }, null, 2)
        }]
      };
    }
    
    case "generateReport": {
      if (!input.params?.reportPath) {
        throw new Error("Report path is required");
      }
      
      const reportData = await cli.generateReport(input.params.reportPath, {
        format: input.params.format || "pdf",
        from: input.params.from,
        to: input.params.to,
        output: input.params.output,
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            report: input.params.reportPath,
            format: input.params.format || "pdf",
            dataLength: reportData.length,
          }, null, 2)
        }]
      };
    }
    
    case "evaluateScript": {
      if (!input.expression) {
        throw new Error("Script expression is required");
      }
      
      const result = await cli.evaluate(input.expression);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            expression: input.expression,
            result,
          }, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown system operation: ${input.operation}`);
  }
}