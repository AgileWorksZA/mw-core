import type { ActionFunctionArgs } from "react-router";
import { getMCPClient } from "~/lib/mcp-client";
import { streamText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z, type ZodObject } from "zod";

function jsonResponse(data: any, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export function getSystemPrompt(tools: any[], hasTicketTool = false) {
  const basePrompt = `You are a MoneyWorks AI Assistant with DIRECT ACCESS to live MoneyWorks data through function calls. Only answer the question, DO NOT say stuff like "feel free to ask!"

CRITICAL INSTRUCTIONS:
1. You MUST use the provided functions to answer ANY question about MoneyWorks data
2. NEVER provide hypothetical or example data - ALWAYS use the functions to get real data
3. When asked about transactions, accounts, names, or any MoneyWorks data, you MUST call the appropriate function
4. Do NOT explain how to find information - USE THE FUNCTIONS to find it and present the actual data
5. For date-based queries like "last month", use the current date to calculate the appropriate filter
6. Today's date is ${new Date().toISOString().split("T")[0]}
7. IMPORTANT: Display the actual dates from the data returned by the functions - do not modify or assume dates

## MoneyWorks Overview
MoneyWorks is a comprehensive accounting and ERP system. Key concepts:
- **Accounts**: Chart of accounts with codes like "1100" for Bank Account
- **Names**: Customers and suppliers with unique codes
- **Transactions**: Financial records with types like SI (Sales Invoice), PI (Purchase Invoice), etc.
- **Account Types**: I=Income, S=Sales, E=Expense, C=Cost of Sales, A=Current Asset, L=Current Liability, etc.`;

  if (tools.length > 0 || hasTicketTool) {
    const toolList = tools
      .map((t) => `- ${t.name}: ${t.description}`)
      .join("\n");
    const ticketToolDesc = hasTicketTool
      ? "- createTicket: Create a support ticket for bugs, issues, or feature requests"
      : "";

    return `${basePrompt}

## AVAILABLE FUNCTIONS (YOU MUST USE THESE):
${toolList}
${ticketToolDesc}

If you encounter issues with the data, please log a ticket using the createTicket function for that or any other bug. And if there is a gap in the functionality, please log a feature request ticket using the createTicket function.
if you are unable to retrieve the data due to a technical issue with the system, please log a ticket using the createTicket function with the category "api_error" and provide details about the issue.

Add the returned data to the ticket or the error message, so that the support team can investigate and resolve the issue.
Include the error or the data in the ticket description, so that the support team can investigate and resolve the issue.
Include the details of the tool you tried.

# MoneyWorks MWScript Evaluation System Prompt

## Overview
MoneyWorks provides powerful server-side scripting capabilities through MWScript, a proprietary language designed for accounting automation. You can execute MWScript expressions and custom scripts through the evaluation endpoints.

## Available Endpoints

### 1. Execute MWScript Expression
**Endpoint**: \`POST /api/evaluate\`

Use this endpoint to execute any MWScript expression on the MoneyWorks server.

**Request Format**:
\`\`\`json
{
  "expression": "your_mwscript_expression_here"
}
\`\`\`

**Common Expression Examples**:

#### System Information
\`\`\`json
{ "expression": "GetCompanyName()" }
{ "expression": "GetDatabaseFiles()" }
{ "expression": "GetDatabaseFields(\\"Account\\")" }
{ "expression": "GetVersion()" }
{ "expression": "GetPeriod()" }
\`\`\`

#### Data Queries
\`\`\`json
{ "expression": "CountSelection(CreateSelection(\\"Name\\", \\"Kind=1\\"))" }
{ "expression": "GetFieldValue(\\"Name\\", \\"DBalance\\", \\"Code='ACME001'\\")" }
{ "expression": "SumSelection(CreateSelection(\\"Transaction\\", \\"Type='SI' and Status='OP'\\"), \\"Gross\\")" }
\`\`\`

#### Date/Time Operations
\`\`\`json
{ "expression": "DateToString(Today())" }
{ "expression": "CurrentTime()" }
{ "expression": "DayOfWeek(Today())" }
{ "expression": "AddMonths(Today(), -1)" }
\`\`\`

#### String Operations
\`\`\`json
{ "expression": "Concat(\\"Invoice \\", \\"#\\", \\"12345\\")" }
{ "expression": "Upper(\\"convert to uppercase\\")" }
{ "expression": "Replace(\\"Hello World\\", \\"World\\", \\"MoneyWorks\\")" }
\`\`\`

#### Mathematical Operations
\`\`\`json
{ "expression": "Round(123.456, 2)" }
{ "expression": "Min(100, 200, 50)" }
{ "expression": "Random(1, 100)" }
\`\`\`

### 2. Execute Script Handlers
For more complex operations, you can call script handlers:

\`\`\`json
{
  "expression": "MyScript:CalculateTax(1000, 0.15)"
}
\`\`\`

### 3. Evaluate Templates Against Tables
**Endpoint**: \`POST /api/eval/{table}\`

Use this to apply a template to all records in a table.

**Request Format**:
\`\`\`json
{
  "template": "[FieldName1] - [FieldName2]"
}
\`\`\`

**Examples**:
\`\`\`json
// For accounts table
POST /api/eval/account
{ "template": "[Code] - [Description] ([Type])" }

// For names table  
POST /api/eval/name
{ "template": "[Code]: [Name] - Balance: @[DBalance]" }

// For transactions
POST /api/eval/transaction
{ "template": "[TransDate] [OurRef] - [Description] @[Gross]" }
\`\`\`

## MWScript Syntax Guide

### Data Selection and Queries
\`\`\`mwscript
// Create a selection of records
CreateSelection("TableName", "SearchExpression")

// Count records
CountSelection(selection)

// Get field value
GetFieldValue("TableName", "FieldName", "SearchExpression")

// Sum values
SumSelection(selection, "FieldName")
\`\`\`

### Conditional Logic
\`\`\`mwscript
// If-then-else (in expression form)
If(condition, trueValue, falseValue)

// Example
If(GetFieldValue("Name", "Hold", "Code='CUST001'") = 1, "ON HOLD", "ACTIVE")
\`\`\`

### Working with Dates
\`\`\`mwscript
Today()                    // Current date
CurrentTime()             // Current timestamp
DateToString(date)        // Convert date to string
StringToDate("20240115")  // Convert string to date
AddDays(date, days)       // Add days to date
AddMonths(date, months)   // Add months to date
DayOfWeek(date)          // Get day of week (1-7)
\`\`\`

### String Manipulation
\`\`\`mwscript
Concat(str1, str2, ...)   // Concatenate strings
Upper(string)             // Convert to uppercase
Lower(string)             // Convert to lowercase
Left(string, length)      // Get left substring
Right(string, length)     // Get right substring
Mid(string, start, len)   // Get middle substring
Replace(str, find, repl)  // Replace text
Trim(string)              // Remove whitespace
\`\`\`

### Mathematical Functions
\`\`\`mwscript
Round(number, decimals)   // Round to decimals
Trunc(number)            // Truncate to integer
Abs(number)              // Absolute value
Min(n1, n2, ...)         // Minimum value
Max(n1, n2, ...)         // Maximum value
Random(min, max)         // Random number
\`\`\`

## Best Practices

### 1. Error Handling
Always be prepared for expressions that might fail:
- Invalid field names
- Records not found
- Division by zero
- Type mismatches

### 2. Performance Considerations
- Use specific search criteria to limit record sets
- Avoid complex calculations on large selections
- Cache results when possible

### 3. Common Use Cases

#### Check Customer Balance
\`\`\`json
{
  "expression": "GetFieldValue(\\"Name\\", \\"DBalance\\", \\"Code='CUST001'\\")"
}
\`\`\`

#### Count Open Invoices
\`\`\`json
{
  "expression": "CountSelection(CreateSelection(\\"Transaction\\", \\"Type='SI' and Status='OP'\\"))"
}
\`\`\`

#### Get Total Sales This Month
\`\`\`json
{
  "expression": "SumSelection(CreateSelection(\\"Transaction\\", \\"Type='SI' and Period=GetPeriod()\\"), \\"Gross\\")"
}
\`\`\`

#### Check if Account Exists
\`\`\`json
{
  "expression": "CountSelection(CreateSelection(\\"Account\\", \\"Code='1000'\\")) > 0"
}
\`\`\`

### 4. Script Handler Calls
When calling custom script handlers:
- Ensure the script is installed on the server
- Pass parameters in the correct order and type
- Handle return values appropriately

Example:
\`\`\`json
{
  "expression": "UtilityScripts:ValidateEmail('user@example.com')"
}
\`\`\`

### 5. Security Notes
- Expressions execute with the authenticated user's permissions
- Cannot access files outside allowed directories
- Cannot perform GUI operations
- Network access limited to configured endpoints

## Response Handling

### Successful Response
\`\`\`json
{
  "result": "Company ABC Limited"
}
\`\`\`

### Error Response
If an expression fails, you'll receive an error with details about what went wrong.

## Advanced Examples

### Complex Calculation
\`\`\`json
{
  "expression": "Round(SumSelection(CreateSelection(\\"Transaction\\", \\"Type='SI' and TransDate >= AddMonths(Today(), -3)\\"), \\"Gross\\") / 3, 2)"
}
\`\`\`
This calculates the average monthly sales for the last 3 months.

### Conditional Customer Status
\`\`\`json
{
  "expression": "If(GetFieldValue(\\"Name\\", \\"D90Plus\\", \\"Code='CUST001'\\") > 0, \\"OVERDUE\\", If(GetFieldValue(\\"Name\\", \\"Hold\\", \\"Code='CUST001'\\") = 1, \\"ON HOLD\\", \\"ACTIVE\\"))"
}
\`\`\`

### Business Logic Example
\`\`\`json
{
  "expression": "If(CountSelection(CreateSelection(\\"Product\\", \\"Code='WIDGET' and StockOnHand < ReorderLevel\\")) > 0, \\"REORDER NEEDED\\", \\"STOCK OK\\")"
}
\`\`\`

## Tips for AI Assistants

1. **Start Simple**: Test with basic expressions like \`GetCompanyName()\` before complex queries
2. **Check Table Names**: Use \`GetDatabaseFiles()\` to verify available tables
3. **Verify Field Names**: Use \`GetDatabaseFields("TableName")\` to check field availability
4. **Quote String Values**: Always quote string values in search expressions: \`"Code='ABC'"\`
5. **Date Formats**: Use YYYYMMDD format for date comparisons
6. **Test Incrementally**: Build complex expressions step by step

`;
  }

  return basePrompt;
}

// Initialize MCP client on first use
let mcpInitialized = false;
let mcpInitializing = false;
export let mcpTools: any[] = [];

async function initializeMCP() {
  if (mcpInitialized || mcpInitializing) return;
  
  mcpInitializing = true;

  try {
    const mwConfigPath = process.env.MW_CONFIG_PATH;
    console.log("MCP initialization starting...", {
      MW_CONFIG_PATH: mwConfigPath,
      MCP_SERVER_PATH: process.env.MCP_SERVER_PATH,
      MW_API_MODE: process.env.MW_API_MODE,
      MW_API_BASE_URL: process.env.MW_API_BASE_URL,
      MW_BEARER_TOKEN: process.env.MW_BEARER_TOKEN ? "***set***" : "not set"
    });
    
    if (!mwConfigPath) {
      console.warn("MW_CONFIG_PATH not set, MCP features will be disabled");
      return;
    }

    const mcpServerPath = process.env.MCP_SERVER_PATH ||
      "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/mcp-server/src/index-api-mode.ts";
    
    console.log("Creating MCP client with server path:", mcpServerPath);
    
    const mcpClient = getMCPClient({
      command: "bun",
      args: ["run", mcpServerPath],
      env: {
        MW_CONFIG_PATH: mwConfigPath,
        MW_API_BASE_URL: process.env.MW_API_BASE_URL || "http://localhost:3131",
        TICKETS_DB_PATH: process.env.TICKETS_DB_PATH || "./data/tickets.db",
        MCP_DEBUG: "true",
        MCP_LOG_FILE: "./mcp-debug.log",
      },
    });

    await mcpClient.connect();
    console.log("MCP client connected, waiting for server to be ready...");
    
    // Give the server time to fully initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get available tools from MCP server
    try {
      mcpTools = await mcpClient.listTools();
      console.log(
        "Available MCP tools:",
        mcpTools.map((t) => t.name),
      );
      
      mcpInitialized = true;
      console.log(
        "MoneyWorks MCP server connected with",
        mcpTools.length,
        "tools",
      );
    } catch (toolError) {
      console.error("Failed to list MCP tools:", toolError);
      throw new Error(`MCP connected but failed to list tools: ${toolError.message}`);
    }
  } catch (error) {
    console.error("Failed to initialize MCP:", error);
    // Store the error for debugging
    if (error instanceof Error) {
      console.error("MCP Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    // Don't set mcpInitialized to true if it failed
    mcpInitialized = false;
    mcpInitializing = false;
    mcpTools = [];
  } finally {
    mcpInitializing = false;
  }
}

const ready = initializeMCP();

// Convert MCP tools to AI SDK tools
function createAISDKTools() {
  const tools: Record<string, any> = {};

  // Check if logTicket tool exists in MCP tools
  const hasLogTicketTool = mcpTools.some(tool => tool.name === "logTicket");
  
  if (!hasLogTicketTool) {
    // Add a wrapper for ticket creation if MCP's logTicket is not available
    tools.createTicket = tool({
      description:
        "Create a support ticket for bugs, issues, or feature requests",
      parameters: z.object({
        title: z.string().describe("Brief title for the ticket"),
        description: z
          .string()
          .describe("Detailed description of the issue or request"),
        category: z
          .enum([
            "api_error",
            "missing_feature",
            "unclear_query",
            "data_issue",
            "authentication",
            "other",
          ])
          .describe("Category of the ticket"),
        userQuery: z
          .string()
          .describe("The original user query that prompted this ticket"),
        aiResponse: z
          .string()
          .optional()
          .describe("The AI's response or attempted response"),
        priority: z
          .enum(["low", "medium", "high", "critical"])
          .optional()
          .describe("Priority level of the ticket"),
        metadata: z
          .record(z.any())
          .optional()
          .describe("Additional metadata for the ticket"),
      }),
      execute: async ({
        title,
        description,
        category,
        userQuery,
        aiResponse,
        priority = "medium",
        metadata,
      }) => {
        try {
          // Map to MCP's logTicket schema
          const mcpClient = getMCPClient();
          const result = await mcpClient.callTool("logTicket", {
            type: category === "missing_feature" ? "feature_request" : 
                  category === "api_error" || category === "data_issue" ? "bug" : "improvement",
            severity: priority || "medium",
            title,
            description,
            userPrompt: userQuery,
            attemptedAction: aiResponse,
            metadata: JSON.stringify(metadata || {}),
          });
          
          return {
            success: true,
            ticketId: result.ticketId,
            message: `Ticket created successfully: ${title}`,
          };
        } catch (error) {
          console.error("Failed to create ticket:", error);
          return {
            success: false,
            message: `Failed to create ticket: ${error.message}`,
          };
        }
      },
    });
  }

  for (const mcpTool of mcpTools) {
    // Create a more specific schema based on the tool
    let parameters: ZodObject<any>;

    // Add specific schemas for known tools based on MCP server structure (note: tool names are plural)
    if (mcpTool.name === "accounts") {
      parameters = z.object({
        operation: z.enum(["search", "get", "listFields"]).describe("The operation to perform"),
        // Parameters at top level as expected by MCP server
        query: z.string().optional().describe("Search query for account code or description"),
        type: z.enum(["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"]).optional().describe("Account type filter"),
        category: z.string().optional().describe("Category code filter"),
        limit: z.number().min(1).max(100).default(50).describe("Maximum number of results"),
        offset: z.number().min(0).default(0).describe("Number of results to skip"),
        code: z.string().optional().describe("The account code to retrieve (get operation only)"),
      });
    } else if (mcpTool.name === "transactions") {
      parameters = z.object({
        operation: z.enum(["search", "get", "listFields"]).describe("The operation to perform"),
        // Transaction tool parameters
        filter: z.string().optional().describe("MoneyWorks search expression"),
        startDate: z.string().optional().describe("Start date (YYYYMMDD format)"),
        endDate: z.string().optional().describe("End date (YYYYMMDD format)"),
        type: z.string().optional().describe("Transaction type filter"),
        status: z.enum(["ALL", "POSTED", "UNPOSTED", "LOCKED"]).optional().describe("Transaction status filter"),
        limit: z.number().min(1).max(100).default(50).describe("Maximum number of results"),
        offset: z.number().min(0).default(0).describe("Number of results to skip"),
        sequenceNumber: z.number().optional().describe("The sequence number to retrieve (get operation only)"),
      });
    } else if (mcpTool.name === "names") {
      parameters = z.object({
        operation: z.enum(["search", "get", "listFields"]).describe("The operation to perform"),
        // Name tool parameters
        query: z.string().optional().describe("Search query for name code or description"),
        type: z.enum(["Customer", "Supplier", "Both"]).optional().describe("Name type filter"),
        limit: z.number().min(1).max(100).default(50).describe("Maximum number of results"),
        offset: z.number().min(0).default(0).describe("Number of results to skip"),
        code: z.string().optional().describe("The name code to retrieve (get operation only)"),
      });
    } else {
      // Default schema for other tools
      parameters = z.object({}).passthrough();
    }

    tools[mcpTool.name] = tool({
      description: mcpTool.description,
      parameters,
      execute: async (args) => {
        console.log(`Executing MCP tool: ${mcpTool.name} with args:`, args);
        try {
          const mcpClient = getMCPClient();
          const result = await mcpClient.callTool(mcpTool.name, args);
          console.log("MCP tool result:", result);
          return result;
        } catch (error) {
          console.error("MCP tool call failed:", error);
          throw error;
        }
      },
    });
  }

  return tools;
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("=== MoneyWorks AI API Request ===");

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { messages, chatId } = body;
    console.log("Received messages:", messages.length, "chatId:", chatId);

    if (!messages || !Array.isArray(messages)) {
      return jsonResponse({ error: "Invalid request body" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonResponse(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    // Initialize MCP if not already done (optional - errors won't block chat)
    try {
      await ready;
      console.log(
        "MCP initialized successfully, tools available:",
        mcpTools.length,
      );
    } catch (error) {
      console.warn(
        "MCP initialization failed, continuing without MCP features:",
        error,
      );
    }

    // Create AI SDK tools from MCP tools
    let tools = {};
    try {
      tools = createAISDKTools();
      console.log(`Using ${Object.keys(tools).length} tools with AI SDK`);
    } catch (toolError) {
      console.error("Error creating AI SDK tools:", toolError);
      // Continue without tools
    }

    const hasTicketTool = "createTicket" in tools || mcpTools.some(t => t.name === "logTicket");

    console.log(
      "System prompt preview:",
      `${getSystemPrompt(mcpTools, hasTicketTool).substring(0, 500)}...`,
    );
    console.log("User message:", messages[messages.length - 1]?.content);

    // Create OpenAI provider with API key
    const openai = createOpenAI({
      apiKey,
    });

    // Use AI SDK's streamText with tools
    const result = await streamText({
      model: openai("gpt-4o"),
      system: getSystemPrompt(mcpTools, hasTicketTool),
      messages,
      tools: Object.keys(tools).length > 0 ? tools : undefined,
      toolChoice: "auto",
      maxSteps: 5, // Allow multiple tool calls if needed
    });

    console.log("StreamText result created, converting to response...");

    // Use toDataStreamResponse which properly handles the AI SDK data stream protocol
    const response = result.toDataStreamResponse();

    // Add headers to ensure proper streaming
    response.headers.set("Content-Type", "text/event-stream");
    response.headers.set("Cache-Control", "no-cache");
    response.headers.set("Connection", "keep-alive");

    return response;
  } catch (error: any) {
    console.error("MoneyWorks AI API error:", error);
    console.error("Error stack:", error.stack);
    return jsonResponse(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
