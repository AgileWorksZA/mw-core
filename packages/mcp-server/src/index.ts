#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TicketService } from "./services/ticket-service";

// Core consolidated table tools (manually verified)
import { accountTool } from "./tools/account";
import { transactionTool } from "./tools/transaction";
import { nameTool } from "./tools/name";
import { buildTool } from "./tools/build";

// Essential system tools
import {
	describeEndpointTool,
	initializeApiEndpointsTools,
	listEndpointsTool,
} from "./tools/api-endpoints";
import {
	getCompanyInformationTool,
	listCompanyInformationFieldsTool,
} from "./tools/company-information";
import {
	convertCurrencyTool,
	getCurrencyFormattingTool,
	getCurrencyInfoTool,
	getExchangeRatesTool,
	getMoneyWorksCurrencySettingsTool,
	initializeCurrencyInfoTools,
} from "./tools/currency-info";
import {
	getDateFormatsTool,
	getSupportedDateFormatsTool,
	getTableDateFieldsTool,
	initializeDateFormatsTools,
	parseDateStringTool,
} from "./tools/date-formats";
import {
	getEnumUsagePatternsTool,
	getEnumValuesTool,
	getTableEnumFieldsTool,
	initializeEnumValuesTools,
	searchEnumValuesTool,
} from "./tools/enum-values";
import {
	evaluateExpressionTool,
	evaluateTemplateTool,
	listCommonExpressionsTool,
} from "./tools/evaluate";
import {
	checkUserPermissionsTool,
	getPermissionInfoTool,
	getSecurityAuditInfoTool,
	getTablePermissionsTool,
	getUserRolesTool,
	initializePermissionInfoTools,
} from "./tools/permission-info";
import {
	generateReportTool,
	getReportParametersTool,
	listCommonReportsTool,
} from "./tools/report";
import {
	getApiCapabilitiesTool,
	getSystemInfoTool,
	getSystemStatusTool,
	initializeSystemInfoTools,
} from "./tools/system-info";
import {
	generateAllLabelsTool,
	getTableLabelsTool,
	listAvailableTablesTool,
	listSupportedLanguagesTool,
} from "./tools/system-labels";
import {
	describeTableSchemaTool,
	getFieldMetadataTool,
	getTableRelationshipsTool,
	initializeTableSchemaTools,
	listTablesTool,
} from "./tools/table-schema";
import {
	getBusinessRulesTool,
	getTableValidationRulesTool,
	getValidationRulesTool,
	initializeValidationRulesTools,
} from "./tools/validation-rules";
import {
	logTicketTool,
	initializeLogTicketTool,
} from "./tools/log-ticket";

// Configuration
const TICKETS_DB_PATH = process.env.TICKETS_DB_PATH || "./data/tickets.db";

// Initialize services
const ticketService = new TicketService(TICKETS_DB_PATH);

// Initialize all tools with ticket service
initializeTableSchemaTools(ticketService);
initializeApiEndpointsTools(ticketService);
initializeSystemInfoTools(ticketService);
initializeValidationRulesTools(ticketService);
initializeEnumValuesTools(ticketService);
initializeDateFormatsTools(ticketService);
initializeCurrencyInfoTools(ticketService);
initializePermissionInfoTools(ticketService);
initializeLogTicketTool(ticketService);

// Session tracking
const sessionId = Date.now().toString();

// Initialize MCP server
const server = new McpServer({
	name: "moneyworks-assistant",
	version: "1.0.0",
});

// Helper function to register a consolidated tool
function registerConsolidatedTool(toolName: string, tool: any) {
	// Extract the shape from the Zod object schema
	const schemaShape = tool.inputSchema.shape || tool.inputSchema._def?.shape || tool.inputSchema;
	
	server.tool(
		toolName,
		tool.description,
		schemaShape,
		async (args: any, extra: any) => {
			try {
				const result = await tool.execute(args);
				return {
					content: [
						{ type: "text" as const, text: JSON.stringify(result, null, 2) },
					],
				};
			} catch (error) {
				return await handleToolError(toolName, args, error);
			}
		},
	);
}

// Register core consolidated table tools (4 tools)
registerConsolidatedTool('accounts', accountTool);
registerConsolidatedTool('transactions', transactionTool);
registerConsolidatedTool('names', nameTool);
registerConsolidatedTool('builds', buildTool);

// Register essential system tools (40 tools)
registerConsolidatedTool('listTables', listTablesTool);
registerConsolidatedTool('describeTableSchema', describeTableSchemaTool);
registerConsolidatedTool('getFieldMetadata', getFieldMetadataTool);
registerConsolidatedTool('getTableRelationships', getTableRelationshipsTool);
registerConsolidatedTool('listEndpoints', listEndpointsTool);
registerConsolidatedTool('describeEndpoint', describeEndpointTool);
registerConsolidatedTool('getSystemInfo', getSystemInfoTool);
registerConsolidatedTool('getApiCapabilities', getApiCapabilitiesTool);
registerConsolidatedTool('getSystemStatus', getSystemStatusTool);
registerConsolidatedTool('getValidationRules', getValidationRulesTool);
registerConsolidatedTool('getTableValidationRules', getTableValidationRulesTool);
registerConsolidatedTool('getBusinessRules', getBusinessRulesTool);
registerConsolidatedTool('getEnumValues', getEnumValuesTool);
registerConsolidatedTool('searchEnumValues', searchEnumValuesTool);
registerConsolidatedTool('getTableEnumFields', getTableEnumFieldsTool);
registerConsolidatedTool('getEnumUsagePatterns', getEnumUsagePatternsTool);
registerConsolidatedTool('getDateFormats', getDateFormatsTool);
registerConsolidatedTool('getTableDateFields', getTableDateFieldsTool);
registerConsolidatedTool('getSupportedDateFormats', getSupportedDateFormatsTool);
registerConsolidatedTool('parseDateString', parseDateStringTool);
registerConsolidatedTool('getCurrencyInfo', getCurrencyInfoTool);
registerConsolidatedTool('getCurrencyFormatting', getCurrencyFormattingTool);
registerConsolidatedTool('getExchangeRates', getExchangeRatesTool);
registerConsolidatedTool('convertCurrency', convertCurrencyTool);
registerConsolidatedTool('getMoneyWorksCurrencySettings', getMoneyWorksCurrencySettingsTool);
registerConsolidatedTool('getPermissionInfo', getPermissionInfoTool);
registerConsolidatedTool('getTablePermissions', getTablePermissionsTool);
registerConsolidatedTool('getUserRoles', getUserRolesTool);
registerConsolidatedTool('checkUserPermissions', checkUserPermissionsTool);
registerConsolidatedTool('getSecurityAuditInfo', getSecurityAuditInfoTool);
registerConsolidatedTool('evaluateExpression', evaluateExpressionTool);
registerConsolidatedTool('evaluateTemplate', evaluateTemplateTool);
registerConsolidatedTool('listCommonExpressions', listCommonExpressionsTool);
registerConsolidatedTool('generateReport', generateReportTool);
registerConsolidatedTool('getReportParameters', getReportParametersTool);
registerConsolidatedTool('listCommonReports', listCommonReportsTool);
registerConsolidatedTool('getTableLabels', getTableLabelsTool);
registerConsolidatedTool('listAvailableTables', listAvailableTablesTool);
registerConsolidatedTool('listSupportedLanguages', listSupportedLanguagesTool);
registerConsolidatedTool('generateAllLabels', generateAllLabelsTool);
registerConsolidatedTool('getCompanyInformation', getCompanyInformationTool);
registerConsolidatedTool('listCompanyInformationFields', listCompanyInformationFieldsTool);

// Register the ticket logging tool
registerConsolidatedTool('logTicket', logTicketTool);

// Helper function to handle tool errors and log to ticketing system
async function handleToolError(
	toolName: string,
	args: unknown,
	error: unknown,
) {
	const err = error as Error & { code?: number; details?: unknown };
	const errorType = err.code === 404 ? "feature_request" : "bug";
	const severity = err.code && err.code >= 500 ? "high" : "medium";

	// Log error to ticket system
	const ticketId = await ticketService.createTicket({
		type: errorType,
		severity,
		status: "open",
		user_prompt: JSON.stringify(args) || "No user prompt available (automatic error tracking)",
		ai_attempted_action: `Execute tool: ${toolName}`,
		mcp_tool_used: toolName,
		api_endpoint: `${toolName} operation`,
		error_message: err.message || "Unknown error",
		error_stack: err.stack,
		api_response_code: err.code,
		api_response_body: JSON.stringify(err.details || err),
		session_id: sessionId,
		api_version: "1.0.0",
	});

	// Add context
	await ticketService.addContext(ticketId, "request", args);
	if (err.details) {
		await ticketService.addContext(ticketId, "response", err.details);
	}

	// Add tags based on error type
	const tags = [toolName];
	if (err.code === 404) tags.push("not-found");
	if (err.code === 401) tags.push("auth-error");
	if (err.code && err.code >= 500) tags.push("server-error");
	if (err.message?.includes("not found")) tags.push("missing-feature");
	await ticketService.addTags(ticketId, tags);

	// Return user-friendly error
	return {
		content: [
			{
				type: "text" as const,
				text: `Error executing ${toolName}: ${err.message}. This issue has been logged for improvement (Ticket #${ticketId}).`,
			},
		],
		isError: true,
	};
}

// Start server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("MoneyWorks MCP server started");
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});