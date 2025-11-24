/**
 * MoneyWorks MCP Server Implementation
 *
 * @moneyworks-dsl PURE
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListResourcesRequestSchema,
	ListToolsRequestSchema,
	ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
	type SmartMoneyWorksClient,
	createSmartClient,
	loadConfig,
} from "@moneyworks/data";
import { moneyworksDocsResource } from "./resources/moneyworks-docs";
import {
	companyInfoTool,
	evalTool,
	exportTool,
	getBalancesSummaryTool,
	getCreditorsTool,
	getCustomersTool,
	getDebtorsTool,
	getNameByCodeTool,
	getNamesByCategoryTool,
	getOverdueDebtorsTool,
	getSuppliersTool,
	listTablesTool,
	schemaTool,
	searchNamesTool,
	updateCreditLimitTool,
	updateNameHoldStatusTool,
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
		this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
			tools: [
				exportTool.definition,
				evalTool.definition,
				schemaTool.definition,
				listTablesTool.definition,
				companyInfoTool.definition,
				// Name tools
				searchNamesTool.definition,
				getCustomersTool.definition,
				getDebtorsTool.definition,
				getSuppliersTool.definition,
				getCreditorsTool.definition,
				getOverdueDebtorsTool.definition,
				getBalancesSummaryTool.definition,
				getNameByCodeTool.definition,
				getNamesByCategoryTool.definition,
				updateNameHoldStatusTool.definition,
				updateCreditLimitTool.definition,
			],
		}));

		// Handle tool calls
		this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
			try {
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

					// Name tools
					case "mw_search_names":
						return await searchNamesTool.handler(client, args as any);

					case "mw_get_customers":
						return await getCustomersTool.handler(client, args as any);

					case "mw_get_debtors":
						return await getDebtorsTool.handler(client, args as any);

					case "mw_get_suppliers":
						return await getSuppliersTool.handler(client, args as any);

					case "mw_get_creditors":
						return await getCreditorsTool.handler(client, args as any);

					case "mw_get_overdue_debtors":
						return await getOverdueDebtorsTool.handler(client, args as any);

					case "mw_get_balances_summary":
						return await getBalancesSummaryTool.handler(client, args as any);

					case "mw_get_name_by_code":
						return await getNameByCodeTool.handler(client, args as any);

					case "mw_get_names_by_category":
						return await getNamesByCategoryTool.handler(client, args as any);

					case "mw_update_name_hold_status":
						return await updateNameHoldStatusTool.handler(client, args as any);

					case "mw_update_credit_limit":
						return await updateCreditLimitTool.handler(client, args as any);

					default:
						throw new Error(`Unknown tool: ${name}`);
				}
			} catch (error) {
				// Log the error for debugging
				console.error(`Error in tool ${request.params.name}:`, error);

				// Return a structured error response
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(
								{
									error: true,
									message:
										error instanceof Error
											? error.message
											: "Unknown error occurred",
									tool: request.params.name,
									details: error instanceof Error ? error.stack : undefined,
								},
								null,
								2,
							),
						},
					],
					isError: true,
				};
			}
		});

		// List available resources
		this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
			resources: [moneyworksDocsResource.definition],
		}));

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
