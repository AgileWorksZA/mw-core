/**
 * MoneyWorks MCP Server Implementation
 *
 * @moneyworks-dsl PURE
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	ListToolsRequestSchema,
	CallToolRequestSchema,
	ListResourcesRequestSchema,
	ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
	type SmartMoneyWorksClient,
	createSmartClient,
	loadConfig,
} from "@moneyworks/data";
import { moneyworksDocsResource } from "./resources/moneyworks-docs";
import {
	evalTool,
	exportTool,
	listTablesTool,
	schemaTool,
	companyInfoTool,
} from "./tools/index";

export class MoneyWorksMCPServer {
	private server: Server;
	private client: SmartMoneyWorksClient | null = null;

	constructor() {
		this.server = new Server(
			{
				name: "moneyworks-mcp",
				version: "0.1.0",
			},
			{
				capabilities: {
					tools: {},
					resources: {},
				},
			},
		);

		this.setupHandlers();
	}

	private async getClient(): Promise<SmartMoneyWorksClient> {
		if (!this.client) {
			// Load config from environment or default location
			const configPath = process.env.MW_CONFIG_PATH || "./mw-config.json";
			const config = await loadConfig(configPath);
			this.client = createSmartClient(config);
		}
		return this.client;
	}

	private setupHandlers() {
		// List available tools
		this.server.setRequestHandler(
			ListToolsRequestSchema,
			async () => ({
				tools: [
					exportTool.definition,
					evalTool.definition,
					schemaTool.definition,
					listTablesTool.definition,
					companyInfoTool.definition,
				],
			}),
		);

		// Handle tool calls
		this.server.setRequestHandler(
			CallToolRequestSchema,
			async (request) => {
				const { name, arguments: args } = request.params;
				const client = await this.getClient();

				switch (name) {
					case "mw_export":
						return await exportTool.handler(client, args as any);

					case "mw_eval":
						return await evalTool.handler(client, args as any);

					case "mw_schema":
						return await schemaTool.handler(client, args as any);

					case "mw_list_tables":
						return await listTablesTool.handler(client, args as any);

					case "mw_company_info":
						return await companyInfoTool.handler(client, args as any);

					default:
						throw new Error(`Unknown tool: ${name}`);
				}
			},
		);

		// List available resources
		this.server.setRequestHandler(
			ListResourcesRequestSchema,
			async () => ({
				resources: [moneyworksDocsResource.definition],
			}),
		);

		// Handle resource reads
		this.server.setRequestHandler(
			ReadResourceRequestSchema,
			async (request) => {
				const { uri } = request.params;

				if (uri === moneyworksDocsResource.definition.uri) {
					return moneyworksDocsResource.handler();
				}

				throw new Error(`Unknown resource: ${uri}`);
			},
		);
	}

	async start() {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);

		console.error("MoneyWorks MCP Server started");
	}
}

// Export for use in index.ts
export async function startServer() {
	const server = new MoneyWorksMCPServer();
	await server.start();
}
