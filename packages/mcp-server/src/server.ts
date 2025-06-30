/**
 * MoneyWorks MCP Server Implementation
 * 
 * @moneyworks-dsl PURE
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSmartClient, type SmartMoneyWorksClient, loadConfig } from '@moneyworks/data';
import { 
  exportTool, 
  evalTool, 
  schemaTool, 
  listTablesTool 
} from '@moneyworks/mcp-server/tools';
import { moneyworksDocsResource } from '@moneyworks/mcp-server/resources/moneyworks-docs';

export class MoneyWorksMCPServer {
  private server: Server;
  private client: SmartMoneyWorksClient | null = null;
  
  constructor() {
    this.server = new Server({
      name: 'moneyworks-mcp',
      version: '0.1.0'
    }, {
      capabilities: {
        tools: {},
        resources: {}
      }
    });
    
    this.setupHandlers();
  }
  
  private async getClient(): Promise<SmartMoneyWorksClient> {
    if (!this.client) {
      // Load config from environment or default location
      const configPath = process.env.MW_CONFIG_PATH || './mw-config.json';
      const config = await loadConfig(configPath);
      this.client = createSmartClient(config);
    }
    return this.client;
  }
  
  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        exportTool.definition,
        evalTool.definition,
        schemaTool.definition,
        listTablesTool.definition
      ]
    }));
    
    // Handle tool calls
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;
      const client = await this.getClient();
      
      switch (name) {
        case 'mw_export':
          return await exportTool.handler(client, args);
          
        case 'mw_eval':
          return await evalTool.handler(client, args);
          
        case 'mw_schema':
          return await schemaTool.handler(client, args);
          
        case 'mw_list_tables':
          return await listTablesTool.handler(client, args);
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
    
    // List available resources
    this.server.setRequestHandler('resources/list', async () => ({
      resources: [moneyworksDocsResource.definition]
    }));
    
    // Handle resource reads
    this.server.setRequestHandler('resources/read', async (request) => {
      const { uri } = request.params;
      
      if (uri === moneyworksDocsResource.definition.uri) {
        return moneyworksDocsResource.handler();
      }
      
      throw new Error(`Unknown resource: ${uri}`);
    });
  }
  
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('MoneyWorks MCP Server started');
  }
}

// Export for use in index.ts
export async function startServer() {
  const server = new MoneyWorksMCPServer();
  await server.start();
}