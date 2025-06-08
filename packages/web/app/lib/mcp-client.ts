import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export interface MCPConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  bearerToken?: string;
}

export class MCPClient {
  private client: Client | null = null;
  private config: MCPConfig;

  constructor(config: MCPConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Build environment with bearer token if provided
      const env: Record<string, string> = {
        ...process.env,
        ...this.config.env,
      } as Record<string, string>;
      
      if (this.config.bearerToken) {
        env.MW_BEARER_TOKEN = this.config.bearerToken;
      }
      
      const transport = new StdioClientTransport({
        command: this.config.command,
        args: this.config.args,
        env,
      });

      this.client = new Client(
        {
          name: "moneyworks-ai-client",
          version: "1.0.0",
        },
        {
          capabilities: {},
        },
      );

      await this.client.connect(transport);
      console.log("Connected to MoneyWorks MCP server");
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      // Check if it's a database connection error
      if (error instanceof Error && error.message.includes("SQLITE_CANTOPEN")) {
        throw new Error(
          "MCP server failed to start: Database file not found. Please check MW_CONFIG_PATH and database path configuration.",
        );
      }
      throw error;
    }
  }

  async callTool(name: string, args: any): Promise<any> {
    if (!this.client) {
      throw new Error("MCP client not connected");
    }

    try {
      const result = await this.client.callTool({ name, arguments: args });
      return result;
    } catch (error) {
      console.error("MCP tool call failed:", error);
      throw error;
    }
  }

  async listTools(): Promise<any[]> {
    if (!this.client) {
      throw new Error("MCP client not connected");
    }

    const tools = await this.client.listTools();
    return tools.tools;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }
}

// Singleton instance
let mcpClientInstance: MCPClient | null = null;

export function getMCPClient(config?: MCPConfig): MCPClient {
  if (!mcpClientInstance && config) {
    mcpClientInstance = new MCPClient(config);
  }

  if (!mcpClientInstance) {
    throw new Error("MCP client not initialized");
  }

  return mcpClientInstance;
}
