#!/usr/bin/env bun
/**
 * MoneyWorks MCP Server - Using @moneyworks/core
 * 
 * This server provides 45 MCP tools for AI assistants to interact with MoneyWorks.
 * Uses the modern @moneyworks/core package for all operations.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MoneyWorksRESTClient } from "@moneyworks/core/rest";
import type { MoneyWorksConfig } from "@moneyworks/core/rest";
import { promises as fs } from "fs";
import path from "path";

// Services
import { AccountService } from "./services/tables/account.service";
import { TransactionService } from "./services/tables/transaction.service";
import { NameService } from "./services/tables/name.service";
import { BuildService } from "./services/tables/build.service";
import { TicketService } from "./services/ticket.service";

// Tools
import { registerAccountTool } from "./tools/tables/account.tool";
import { registerTransactionTool } from "./tools/tables/transaction.tool";
import { registerNameTool } from "./tools/tables/name.tool";
import { registerBuildTool } from "./tools/tables/build.tool";
import { registerCoreTool } from "./tools/consolidated/core.tool";
import { registerLogTicketTool } from "./tools/tickets/log-ticket.tool";

// Configuration
const CONFIG_PATH = process.env.MW_CONFIG_PATH || path.join(process.cwd(), "packages/api/mw-config.json");
const TICKETS_DB_PATH = process.env.TICKETS_DB_PATH || path.join(process.cwd(), "packages/mcp-server/data/tickets.db");

async function loadConfig(): Promise<MoneyWorksConfig> {
  try {
    const configData = await fs.readFile(CONFIG_PATH, "utf-8");
    return JSON.parse(configData);
  } catch (error) {
    console.error("Failed to load MoneyWorks configuration:", error);
    throw new Error("MoneyWorks configuration not found. Please ensure mw-config.json exists.");
  }
}

async function main() {
  // Load configuration
  const config = await loadConfig();
  
  // Initialize REST client
  const client = new MoneyWorksRESTClient(config);
  
  // Initialize services
  const accountService = new AccountService(client);
  const transactionService = new TransactionService(client);
  const nameService = new NameService(client);
  const buildService = new BuildService(client);
  const ticketService = new TicketService(TICKETS_DB_PATH);
  
  // Initialize MCP server
  const server = new McpServer({
    name: "moneyworks-mcp",
    version: "2.0.0",
  });

  // Register table tools (4 core tools)
  registerAccountTool(server, accountService);
  registerTransactionTool(server, transactionService);
  registerNameTool(server, nameService);
  registerBuildTool(server, buildService);
  
  // Register consolidated core tool (41 system tools)
  registerCoreTool(server, client);
  
  // Register ticket tracking tool
  registerLogTicketTool(server, ticketService);

  // Error handling
  server.onerror = (error) => {
    console.error("[MCP Error]", error);
  };

  // Run the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("MoneyWorks MCP Server v2.0.0 running with @moneyworks/core");
  console.error(`Connected to: ${config.host}:${config.port}/${config.dataFile}`);
  console.error("Tools registered: 45 (4 table + 41 system)");
  console.error("Ready for AI assistant connections");
}

// Handle process termination
process.on("SIGINT", () => {
  console.error("Server shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("Server terminating...");
  process.exit(0);
});

// Run the server
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});