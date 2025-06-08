#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

// Read the current index.ts file
const indexPath = path.join(__dirname, "src", "index.ts");
const indexContent = fs.readFileSync(indexPath, "utf8");

// Define the consolidated tools (the ones we've actually consolidated)
const consolidatedTools = {
	account: ["searchAccountsTool", "getAccountTool", "listAccountFieldsTool"],
	transaction: [
		"searchTransactionsTool",
		"getTransactionTool",
		"getTransactionByRefTool",
		"listTransactionFieldsTool",
		"getTransactionSummaryTool",
	],
	name: ["searchNamesTool", "getNameTool", "listNameFieldsTool"],
	build: ["searchBuildsTool", "getBuildTool", "listBuildFieldsTool"],
	// Auto-consolidated tools from script
	product: ["searchProductsTool", "getProductTool", "listProductFieldsTool"],
	job: ["searchJobsTool", "getJobTool", "listJobFieldsTool"],
	detail: ["searchDetailsTool", "getDetailTool", "listDetailFieldsTool"],
	taxrate: ["searchTaxRatesTool", "getTaxRateTool", "listTaxRateFieldsTool"],
	department: [
		"searchDepartmentsTool",
		"getDepartmentTool",
		"listDepartmentFieldsTool",
	],
	payment: [
		"searchPaymentsTool",
		"getPaymentTool",
		"listPaymentFieldsTool",
		"getPaymentSummaryTool",
		"getPaymentsByCashTransTool",
		"getPaymentsByInvoiceTool",
	],
	bankrec: ["searchBankRecsTool", "getBankRecTool", "listBankRecFieldsTool"],
	ledger: ["searchLedgerTool", "getLedgerEntryTool", "listLedgerFieldsTool"],
	jobsheet: [
		"searchJobSheetsTool",
		"getJobSheetTool",
		"listJobSheetFieldsTool",
	],
	contact: ["searchContactsTool", "getContactTool", "listContactFieldsTool"],
	inventory: [
		"searchInventoryTool",
		"getInventoryItemTool",
		"listInventoryFieldsTool",
	],
	general: [
		"searchGeneralTool",
		"getGeneralSettingTool",
		"listGeneralFieldsTool",
	],
	login: ["searchLoginsTool", "getLoginTool", "listLoginFieldsTool"],
	message: ["searchMessagesTool", "getMessageTool", "listMessageFieldsTool"],
	list: ["searchListsTool", "getListTool", "listListFieldsTool"],
	user: ["searchUsersTool", "getUserTool", "listUserFieldsTool"],
	filter: ["searchFiltersTool", "getFilterTool", "listFilterFieldsTool"],
	memo: ["searchMemosTool", "getMemoTool", "listMemoFieldsTool"],
	user2: ["searchUser2sTool", "getUser2Tool", "listUser2FieldsTool"],
	stickie: ["searchStickiesTool", "getStickieTool", "listStickieFieldsTool"],
	offledger: [
		"searchOffLedgerTool",
		"getOffLedgerEntryTool",
		"listOffLedgerFieldsTool",
	],
	autosplit: [
		"searchAutoSplitsTool",
		"getAutoSplitTool",
		"listAutoSplitFieldsTool",
	],
	link: ["searchLinksTool", "getLinkTool", "listLinkFieldsTool"],
	log: ["searchLogsTool", "getLogTool", "listLogFieldsTool"],
	asset: ["searchAssetsTool", "getAssetTool", "listAssetFieldsTool"],
	assetcat: [
		"searchAssetCatsTool",
		"getAssetCatTool",
		"listAssetCatFieldsTool",
	],
	assetlog: [
		"searchAssetLogsTool",
		"getAssetLogTool",
		"listAssetLogFieldsTool",
	],
};

// Function to create new import statements for consolidated tools
function createNewImportSection() {
	const imports = [];

	// Add non-consolidated tool imports first
	imports.push(`#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TicketService } from "./services/ticket-service";

// Consolidated table tools
import { accountTool } from "./tools/account";
import { transactionTool } from "./tools/transaction";
import { nameTool } from "./tools/name";
import { buildTool } from "./tools/build";
import { productTool } from "./tools/product";
import { jobTool } from "./tools/job";
import { detailTool } from "./tools/detail";
import { taxrateTool } from "./tools/tax-rate";
import { departmentTool } from "./tools/department";
import { paymentTool } from "./tools/payment";
import { bankrecTool } from "./tools/bank-rec";
import { ledgerTool } from "./tools/ledger";
import { jobsheetTool } from "./tools/job-sheet";
import { contactTool } from "./tools/contact";
import { inventoryTool } from "./tools/inventory";
import { generalTool } from "./tools/general";
import { loginTool } from "./tools/login";
import { messageTool } from "./tools/message";
import { listTool } from "./tools/list";
import { userTool } from "./tools/user";
import { filterTool } from "./tools/filter";
import { memoTool } from "./tools/memo";
import { user2Tool } from "./tools/user2";
import { stickieTool } from "./tools/stickie";
import { offledgerTool } from "./tools/off-ledger";
import { autosplitTool } from "./tools/auto-split";
import { linkTool } from "./tools/link";
import { logTool } from "./tools/log";
import { assetTool } from "./tools/asset";
import { assetcatTool } from "./tools/asset-cat";
import { assetlogTool } from "./tools/asset-log";

// System and metadata tools (non-consolidated)
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
} from "./tools/validation-rules";`);

	return imports.join("\n");
}

// Function to create consolidated tool registrations
function createConsolidatedToolRegistrations() {
	const registrations = [];

	// Helper function to register a consolidated tool
	const registerTool = (toolName, varName) => {
		registrations.push(`
// Register ${toolName} tool (consolidated)
server.tool(
	"${toolName}",
	${varName}.description,
	${varName}.inputSchema,
	async (args, extra) => {
		try {
			const result = await ${varName}.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("${toolName}", args, error);
		}
	},
);`);
	};

	// Register consolidated tools
	registerTool("accounts", "accountTool");
	registerTool("transactions", "transactionTool");
	registerTool("names", "nameTool");
	registerTool("builds", "buildTool");
	registerTool("products", "productTool");
	registerTool("jobs", "jobTool");
	registerTool("details", "detailTool");
	registerTool("taxRates", "taxrateTool");
	registerTool("departments", "departmentTool");
	registerTool("payments", "paymentTool");
	registerTool("bankRecs", "bankrecTool");
	registerTool("ledger", "ledgerTool");
	registerTool("jobSheets", "jobsheetTool");
	registerTool("contacts", "contactTool");
	registerTool("inventory", "inventoryTool");
	registerTool("general", "generalTool");
	registerTool("logins", "loginTool");
	registerTool("messages", "messageTool");
	registerTool("lists", "listTool");
	registerTool("users", "userTool");
	registerTool("filters", "filterTool");
	registerTool("memos", "memoTool");
	registerTool("user2", "user2Tool");
	registerTool("stickies", "stickieTool");
	registerTool("offLedger", "offledgerTool");
	registerTool("autoSplits", "autosplitTool");
	registerTool("links", "linkTool");
	registerTool("logs", "logTool");
	registerTool("assets", "assetTool");
	registerTool("assetCategories", "assetcatTool");
	registerTool("assetLogs", "assetlogTool");

	return registrations.join("\n");
}

// Extract the error handling and service setup code
const serviceSetupMatch = indexContent.match(
	/(\/\/ Configuration[\s\S]*?\/\/ Initialize all tools with ticket service[\s\S]*?initializePermissionInfoTools\(ticketService\);)/,
);
const errorHandlingMatch = indexContent.match(
	/(async function handleToolError[\s\S]*?}[\s\S]*?\/\/ Start the server[\s\S]*$)/,
);

if (!serviceSetupMatch || !errorHandlingMatch) {
	console.error("Could not extract service setup or error handling code");
	process.exit(1);
}

// Create the new index.ts content
const newIndexContent = `${createNewImportSection()}

${serviceSetupMatch[1]}

// Session tracking
const sessionId = Date.now().toString();

// Initialize MCP server
const server = new McpServer({
	name: "moneyworks-assistant",
	version: "1.0.0",
});

${createConsolidatedToolRegistrations()}

// Register non-consolidated system tools
server.tool(
	"listTables",
	describeTableSchemaTool.description,
	describeTableSchemaTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await listTablesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listTables", args, error);
		}
	},
);

server.tool(
	"describeTableSchema",
	describeTableSchemaTool.description,
	describeTableSchemaTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await describeTableSchemaTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("describeTableSchema", args, error);
		}
	},
);

server.tool(
	"getFieldMetadata",
	getFieldMetadataTool.description,
	getFieldMetadataTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getFieldMetadataTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getFieldMetadata", args, error);
		}
	},
);

server.tool(
	"getTableRelationships",
	getTableRelationshipsTool.description,
	getTableRelationshipsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getTableRelationshipsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTableRelationships", args, error);
		}
	},
);

server.tool(
	"listEndpoints",
	listEndpointsTool.description,
	listEndpointsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await listEndpointsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listEndpoints", args, error);
		}
	},
);

server.tool(
	"describeEndpoint",
	describeEndpointTool.description,
	describeEndpointTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await describeEndpointTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("describeEndpoint", args, error);
		}
	},
);

server.tool(
	"getSystemInfo",
	getSystemInfoTool.description,
	getSystemInfoTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getSystemInfoTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getSystemInfo", args, error);
		}
	},
);

server.tool(
	"getApiCapabilities",
	getApiCapabilitiesTool.description,
	getApiCapabilitiesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getApiCapabilitiesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getApiCapabilities", args, error);
		}
	},
);

server.tool(
	"getSystemStatus",
	getSystemStatusTool.description,
	getSystemStatusTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getSystemStatusTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getSystemStatus", args, error);
		}
	},
);

server.tool(
	"getValidationRules",
	getValidationRulesTool.description,
	getValidationRulesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getValidationRulesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getValidationRules", args, error);
		}
	},
);

server.tool(
	"getTableValidationRules",
	getTableValidationRulesTool.description,
	getTableValidationRulesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getTableValidationRulesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTableValidationRules", args, error);
		}
	},
);

server.tool(
	"getBusinessRules",
	getBusinessRulesTool.description,
	getBusinessRulesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getBusinessRulesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getBusinessRules", args, error);
		}
	},
);

server.tool(
	"getEnumValues",
	getEnumValuesTool.description,
	getEnumValuesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getEnumValuesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getEnumValues", args, error);
		}
	},
);

server.tool(
	"searchEnumValues",
	searchEnumValuesTool.description,
	searchEnumValuesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await searchEnumValuesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchEnumValues", args, error);
		}
	},
);

server.tool(
	"getTableEnumFields",
	getTableEnumFieldsTool.description,
	getTableEnumFieldsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getTableEnumFieldsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTableEnumFields", args, error);
		}
	},
);

server.tool(
	"getEnumUsagePatterns",
	getEnumUsagePatternsTool.description,
	getEnumUsagePatternsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getEnumUsagePatternsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getEnumUsagePatterns", args, error);
		}
	},
);

server.tool(
	"getDateFormats",
	getDateFormatsTool.description,
	getDateFormatsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getDateFormatsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getDateFormats", args, error);
		}
	},
);

server.tool(
	"getTableDateFields",
	getTableDateFieldsTool.description,
	getTableDateFieldsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getTableDateFieldsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTableDateFields", args, error);
		}
	},
);

server.tool(
	"getSupportedDateFormats",
	getSupportedDateFormatsTool.description,
	getSupportedDateFormatsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getSupportedDateFormatsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getSupportedDateFormats", args, error);
		}
	},
);

server.tool(
	"parseDateString",
	parseDateStringTool.description,
	parseDateStringTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await parseDateStringTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("parseDateString", args, error);
		}
	},
);

server.tool(
	"getCurrencyInfo",
	getCurrencyInfoTool.description,
	getCurrencyInfoTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getCurrencyInfoTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getCurrencyInfo", args, error);
		}
	},
);

server.tool(
	"getCurrencyFormatting",
	getCurrencyFormattingTool.description,
	getCurrencyFormattingTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getCurrencyFormattingTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getCurrencyFormatting", args, error);
		}
	},
);

server.tool(
	"getExchangeRates",
	getExchangeRatesTool.description,
	getExchangeRatesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getExchangeRatesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getExchangeRates", args, error);
		}
	},
);

server.tool(
	"convertCurrency",
	convertCurrencyTool.description,
	convertCurrencyTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await convertCurrencyTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("convertCurrency", args, error);
		}
	},
);

server.tool(
	"getMoneyWorksCurrencySettings",
	getMoneyWorksCurrencySettingsTool.description,
	getMoneyWorksCurrencySettingsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getMoneyWorksCurrencySettingsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getMoneyWorksCurrencySettings", args, error);
		}
	},
);

server.tool(
	"getPermissionInfo",
	getPermissionInfoTool.description,
	getPermissionInfoTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getPermissionInfoTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getPermissionInfo", args, error);
		}
	},
);

server.tool(
	"getTablePermissions",
	getTablePermissionsTool.description,
	getTablePermissionsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getTablePermissionsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTablePermissions", args, error);
		}
	},
);

server.tool(
	"getUserRoles",
	getUserRolesTool.description,
	getUserRolesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getUserRolesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getUserRoles", args, error);
		}
	},
);

server.tool(
	"checkUserPermissions",
	checkUserPermissionsTool.description,
	checkUserPermissionsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await checkUserPermissionsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("checkUserPermissions", args, error);
		}
	},
);

server.tool(
	"getSecurityAuditInfo",
	getSecurityAuditInfoTool.description,
	getSecurityAuditInfoTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getSecurityAuditInfoTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getSecurityAuditInfo", args, error);
		}
	},
);

server.tool(
	"evaluateExpression",
	evaluateExpressionTool.description,
	evaluateExpressionTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await evaluateExpressionTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("evaluateExpression", args, error);
		}
	},
);

server.tool(
	"evaluateTemplate",
	evaluateTemplateTool.description,
	evaluateTemplateTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await evaluateTemplateTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("evaluateTemplate", args, error);
		}
	},
);

server.tool(
	"listCommonExpressions",
	listCommonExpressionsTool.description,
	listCommonExpressionsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await listCommonExpressionsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listCommonExpressions", args, error);
		}
	},
);

server.tool(
	"generateReport",
	generateReportTool.description,
	generateReportTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await generateReportTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("generateReport", args, error);
		}
	},
);

server.tool(
	"getReportParameters",
	getReportParametersTool.description,
	getReportParametersTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getReportParametersTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getReportParameters", args, error);
		}
	},
);

server.tool(
	"listCommonReports",
	listCommonReportsTool.description,
	listCommonReportsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await listCommonReportsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listCommonReports", args, error);
		}
	},
);

server.tool(
	"getTableLabels",
	getTableLabelsTool.description,
	getTableLabelsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getTableLabelsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTableLabels", args, error);
		}
	},
);

server.tool(
	"listAvailableTables",
	listAvailableTablesTool.description,
	listAvailableTablesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await listAvailableTablesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listAvailableTables", args, error);
		}
	},
);

server.tool(
	"listSupportedLanguages",
	listSupportedLanguagesTool.description,
	listSupportedLanguagesTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await listSupportedLanguagesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listSupportedLanguages", args, error);
		}
	},
);

server.tool(
	"generateAllLabels",
	generateAllLabelsTool.description,
	generateAllLabelsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await generateAllLabelsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("generateAllLabels", args, error);
		}
	},
);

server.tool(
	"getCompanyInformation",
	getCompanyInformationTool.description,
	getCompanyInformationTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await getCompanyInformationTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getCompanyInformation", args, error);
		}
	},
);

server.tool(
	"listCompanyInformationFields",
	listCompanyInformationFieldsTool.description,
	listCompanyInformationFieldsTool.inputSchema,
	async (args, extra) => {
		try {
			const result = await listCompanyInformationFieldsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listCompanyInformationFields", args, error);
		}
	},
);

${errorHandlingMatch[1]}`;

// Write the new index.ts file
fs.writeFileSync(indexPath, newIndexContent);

console.log("✓ Updated index.ts with consolidated tools");

// Count new tool registrations
const newToolCount = (newIndexContent.match(/server\.tool\(/g) || []).length;
console.log(`New tool count: ${newToolCount}`);
console.log(
	`Reduced from 140 to ${newToolCount} tools (${140 - newToolCount} tools removed)`,
);
