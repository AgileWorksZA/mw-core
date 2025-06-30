/**
 * MoneyWorks MCP Server Implementation v2
 * Using the correct McpServer API
 * 
 * @moneyworks-dsl PURE
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSmartClient, type SmartMoneyWorksClient, loadConfig } from '@moneyworks/data';
import { z } from 'zod';

// Currently vetted entities
const VETTED_ENTITIES = ['TaxRate'];
const UPCOMING_ENTITIES = ['Account', 'Transaction', 'Name', 'Product', 'Job', 'Category1', 'Category2'];

export class MoneyWorksMCPServer {
  private server: McpServer;
  private client: SmartMoneyWorksClient | null = null;
  
  constructor() {
    this.server = new McpServer({
      name: 'moneyworks-mcp',
      version: '0.1.0'
    });
    
    this.setupTools();
  }
  
  private async getClient(): Promise<SmartMoneyWorksClient> {
    if (!this.client) {
      const configPath = process.env.MW_CONFIG_PATH || './mw-config.json';
      const config = await loadConfig(configPath);
      this.client = createSmartClient(config);
    }
    return this.client;
  }
  
  private setupTools() {
    // Export tool
    this.server.registerTool(
      'mw_export',
      {
        title: 'Export MoneyWorks Data',
        description: 'Export data from MoneyWorks tables',
        inputSchema: {
          table: z.enum(VETTED_ENTITIES as [string, ...string[]]).describe('Table name to export from'),
          exportFormat: z.enum(['compact', 'compact-headers', 'full', 'schema'])
            .optional()
            .default('full')
            .describe('Export format'),
          filter: z.string().optional().describe('MoneyWorks filter expression'),
          limit: z.number().min(1).max(10000).optional().describe('Maximum records to return'),
          offset: z.number().min(0).optional().describe('Number of records to skip'),
          orderBy: z.string().optional().describe('Field to order results by')
        }
      },
      async (params) => {
        const client = await this.getClient();
        const { table, exportFormat = 'full', filter, limit, offset, orderBy } = params;
        
        try {
          const data = await client.smartExport(table, {
            exportFormat: exportFormat as any,
            search: filter,
            limit,
            offset,
            sort: orderBy
          });
          
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                table,
                format: exportFormat,
                recordCount: Array.isArray(data) ? data.length : 0,
                data
              }, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );
    
    // Eval tool
    this.server.registerTool(
      'mw_eval',
      {
        title: 'Evaluate MWScript',
        description: 'Evaluate MWScript expressions in MoneyWorks',
        inputSchema: {
          expression: z.string().describe('MWScript expression to evaluate')
        }
      },
      async (params) => {
        const client = await this.getClient();
        const { expression } = params;
        
        try {
          const result = await client.evaluate(expression);
          
          return {
            content: [{
              type: 'text',
              text: `Expression: ${expression}\nResult: ${result.trim()}`
            }]
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          if (errorMessage.includes('Unknown identifier')) {
            throw new Error(`${errorMessage}. Note: Direct table references may not work in REST context.`);
          }
          
          throw new Error(`Evaluation failed: ${errorMessage}`);
        }
      }
    );
    
    // Schema tool
    this.server.registerTool(
      'mw_schema',
      {
        title: 'Get Table Schema',
        description: 'Get field structure and schema information for MoneyWorks tables',
        inputSchema: {
          table: z.enum(VETTED_ENTITIES as [string, ...string[]]).describe('Table name')
        }
      },
      async (params) => {
        const client = await this.getClient();
        const { table } = params;
        
        try {
          await client.preDiscoverTables([table]);
          const structure = client.getFieldStructure(table);
          
          if (!structure) {
            throw new Error(`Could not retrieve schema for table '${table}'`);
          }
          
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                table,
                fields: structure.fields
              }, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Schema retrieval failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );
    
    // List tables tool
    this.server.registerTool(
      'mw_list_tables',
      {
        title: 'List MoneyWorks Tables',
        description: 'List available MoneyWorks tables/entities',
        inputSchema: {}
      },
      async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            available: VETTED_ENTITIES,
            vetted: VETTED_ENTITIES,
            upcoming: UPCOMING_ENTITIES
          }, null, 2)
        }]
      })
    );
  }
  
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MoneyWorks MCP Server started');
  }
}

export async function startServer() {
  const server = new MoneyWorksMCPServer();
  await server.start();
}