/**
 * MoneyWorks MCP Server Implementation
 *
 * @moneyworks-dsl PURE
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	type SmartMoneyWorksClient,
	createSmartClient,
	loadConfig,
} from "@moneyworks/data";
import { moneyworksDocsResource } from "./resources/moneyworks-docs.ts";
import {
	evalTool,
	exportTool,
	listTablesTool,
	schemaTool,
} from "./tools/index.ts";

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
		// @ts-expect-error MCP SDK types are incorrect
		this.server.setRequestHandler({
			method: "tools/list",
			handler: async () => ({
				tools: [
					exportTool.definition,
					evalTool.definition,
					schemaTool.definition,
					listTablesTool.definition,
				],
			}),
		});

		// Handle tool calls
		// @ts-expect-error MCP SDK types are incorrect
		this.server.setRequestHandler({
			method: "tools/call",
			handler: async (request: {
				params: { name: string; arguments: unknown };
			}) => {
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

					default:
						throw new Error(`Unknown tool: ${name}`);
				}
			},
		});

		// List available resources
		// @ts-expect-error MCP SDK types are incorrect
		this.server.setRequestHandler({
			method: "resources/list",
			handler: async () => ({
				resources: [moneyworksDocsResource.definition],
			}),
		});

		// Handle resource reads
		// @ts-expect-error MCP SDK types are incorrect
		this.server.setRequestHandler({
			method: "resources/read",
			handler: async (request: { params: { uri: string } }) => {
				const { uri } = request.params;

				if (uri === moneyworksDocsResource.definition.uri) {
					return moneyworksDocsResource.handler();
				}

				throw new Error(`Unknown resource: ${uri}`);
			},
		});
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
