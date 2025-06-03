#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TicketService } from "./services/ticket-service";
import {
	getAccountTool,
	listAccountFieldsTool,
	searchAccountsTool,
} from "./tools/account";
import {
	describeEndpointTool,
	initializeApiEndpointsTools,
	listEndpointsTool,
} from "./tools/api-endpoints";
import {
	getAssetTool,
	listAssetFieldsTool,
	searchAssetsTool,
} from "./tools/asset";
import {
	getAssetCatTool,
	listAssetCatFieldsTool,
	searchAssetCatsTool,
} from "./tools/asset-cat";
import {
	getAssetLogTool,
	listAssetLogFieldsTool,
	searchAssetLogsTool,
} from "./tools/asset-log";
import {
	getAutoSplitTool,
	listAutoSplitFieldsTool,
	searchAutoSplitsTool,
} from "./tools/auto-split";
import {
	getBankRecTool,
	listBankRecFieldsTool,
	searchBankRecsTool,
} from "./tools/bank-rec";
import {
	getBuildTool,
	listBuildFieldsTool,
	searchBuildsTool,
} from "./tools/build";
import {
	getCompanyInformationTool,
	listCompanyInformationFieldsTool,
} from "./tools/company-information";
import {
	getContactTool,
	listContactFieldsTool,
	searchContactsTool,
} from "./tools/contact";
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
	getDepartmentTool,
	listDepartmentFieldsTool,
	searchDepartmentsTool,
} from "./tools/department";
import {
	getDetailTool,
	listDetailFieldsTool,
	searchDetailsTool,
} from "./tools/detail";
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
	getFilterTool,
	listFilterFieldsTool,
	searchFiltersTool,
} from "./tools/filter";
import {
	getGeneralSettingTool,
	listGeneralFieldsTool,
	searchGeneralTool,
} from "./tools/general";
import {
	getInventoryItemTool,
	listInventoryFieldsTool,
	searchInventoryTool,
} from "./tools/inventory";
import { getJobTool, listJobFieldsTool, searchJobsTool } from "./tools/job";
import {
	getJobSheetTool,
	listJobSheetFieldsTool,
	searchJobSheetsTool,
} from "./tools/job-sheet";
import {
	getLedgerEntryTool,
	listLedgerFieldsTool,
	searchLedgerTool,
} from "./tools/ledger";
import { getLinkTool, listLinkFieldsTool, searchLinksTool } from "./tools/link";
import { getListTool, listListFieldsTool, searchListsTool } from "./tools/list";
import { getLogTool, listLogFieldsTool, searchLogsTool } from "./tools/log";
import {
	getLoginTool,
	listLoginFieldsTool,
	searchLoginsTool,
} from "./tools/login";
import { getMemoTool, listMemoFieldsTool, searchMemosTool } from "./tools/memo";
import {
	getMessageTool,
	listMessageFieldsTool,
	searchMessagesTool,
} from "./tools/message";
import { getNameTool, listNameFieldsTool, searchNamesTool } from "./tools/name";
import {
	getOffLedgerEntryTool,
	listOffLedgerFieldsTool,
	searchOffLedgerTool,
} from "./tools/off-ledger";
import {
	getPaymentSummaryTool,
	getPaymentTool,
	getPaymentsByCashTransTool,
	getPaymentsByInvoiceTool,
	listPaymentFieldsTool,
	searchPaymentsTool,
} from "./tools/payment";
import {
	checkUserPermissionsTool,
	getPermissionInfoTool,
	getSecurityAuditInfoTool,
	getTablePermissionsTool,
	getUserRolesTool,
	initializePermissionInfoTools,
} from "./tools/permission-info";
import {
	getProductTool,
	listProductFieldsTool,
	searchProductsTool,
} from "./tools/product";
import {
	generateReportTool,
	getReportParametersTool,
	listCommonReportsTool,
} from "./tools/report";
import {
	getStickieTool,
	listStickieFieldsTool,
	searchStickiesTool,
} from "./tools/stickie";
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
	getTaxRateTool,
	listTaxRateFieldsTool,
	searchTaxRatesTool,
} from "./tools/tax-rate";
import {
	getTransactionByRefTool,
	getTransactionSummaryTool,
	getTransactionTool,
	listTransactionFieldsTool,
	searchTransactionsTool,
} from "./tools/transaction";
import { getUserTool, listUserFieldsTool, searchUsersTool } from "./tools/user";
import {
	getUser2Tool,
	listUser2FieldsTool,
	searchUser2sTool,
} from "./tools/user2";
import {
	getBusinessRulesTool,
	getTableValidationRulesTool,
	getValidationRulesTool,
	initializeValidationRulesTools,
} from "./tools/validation-rules";

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

// Session tracking
const sessionId = Date.now().toString();

// Initialize MCP server
const server = new McpServer({
	name: "moneyworks-assistant",
	version: "1.0.0",
});

// Register searchAccounts tool
server.tool(
	"searchAccounts",
	"Search for accounts in MoneyWorks by code, description, type, or category",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for account code or description"),
		type: z
			.enum(["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"])
			.optional()
			.describe(
				"Account type filter: IN=Income, SA=Sales, EX=Expense, CS=Cost of Sales, CA=Current Asset, CL=Current Liability, FA=Fixed Asset, TA=Term Asset, TL=Term Liability, SF=Shareholders Funds",
			),
		category: z.string().optional().describe("Category code filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchAccountsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchAccounts", args, error);
		}
	},
);

// Register getAccount tool
server.tool(
	"getAccount",
	"Get a specific account by its code",
	{
		code: z.string().describe("The account code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getAccountTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getAccount", args, error);
		}
	},
);

// Register listAccountFields tool
server.tool(
	"listAccountFields",
	"List all available fields for accounts",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listAccountFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listAccountFields", {}, error);
		}
	},
);

// Register searchAssets tool
server.tool(
	"searchAssets",
	"Search for assets in MoneyWorks by code, description, category, status, type, location, department, or financial criteria",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for asset code or description"),
		category: z.string().optional().describe("Category code filter"),
		status: z
			.enum(["ACTIVE", "DISPOSED", "PENDING"])
			.optional()
			.describe(
				"Asset status filter: ACTIVE=Active, DISPOSED=Disposed, PENDING=Pending",
			),
		type: z
			.enum(["DIMINISHING", "STRAIGHT_LINE", "NONE"])
			.optional()
			.describe(
				"Asset type filter: DIMINISHING=Diminishing value, STRAIGHT_LINE=Straight line, NONE=No depreciation",
			),
		location: z.string().optional().describe("Location filter"),
		dept: z.string().optional().describe("Department code filter"),
		fromAcquisitionDate: z
			.string()
			.optional()
			.describe("Filter assets acquired from this date (YYYY-MM-DD)"),
		toAcquisitionDate: z
			.string()
			.optional()
			.describe("Filter assets acquired up to this date (YYYY-MM-DD)"),
		fromDisposalDate: z
			.string()
			.optional()
			.describe("Filter assets disposed from this date (YYYY-MM-DD)"),
		toDisposalDate: z
			.string()
			.optional()
			.describe("Filter assets disposed up to this date (YYYY-MM-DD)"),
		minCost: z.number().optional().describe("Minimum cost filter"),
		maxCost: z.number().optional().describe("Maximum cost filter"),
		minBookValue: z.number().optional().describe("Minimum book value filter"),
		maxBookValue: z.number().optional().describe("Maximum book value filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchAssetsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchAssets", args, error);
		}
	},
);

// Register getAsset tool
server.tool(
	"getAsset",
	"Get a specific asset by its code",
	{
		code: z.string().describe("The asset code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getAssetTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getAsset", args, error);
		}
	},
);

// Register listAssetFields tool
server.tool(
	"listAssetFields",
	"List all available fields for assets",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listAssetFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listAssetFields", {}, error);
		}
	},
);

// Register searchAssetCats tool
server.tool(
	"searchAssetCats",
	"Search for asset categories in MoneyWorks by code, description, group, type, accounts, or depreciation criteria",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for category code or description"),
		group: z.string().optional().describe("Group filter"),
		type: z
			.enum(["DIMINISHING", "STRAIGHT_LINE", "NONE"])
			.optional()
			.describe(
				"Category type filter: DIMINISHING=Diminishing value, STRAIGHT_LINE=Straight line, NONE=No depreciation",
			),
		assetAccount: z
			.string()
			.optional()
			.describe("Filter by asset account code"),
		depExpense: z
			.string()
			.optional()
			.describe("Filter by depreciation expense account"),
		accumDep: z
			.string()
			.optional()
			.describe("Filter by accumulated depreciation account"),
		gainLoss: z.string().optional().describe("Filter by gain/loss account"),
		minRate: z
			.number()
			.min(0)
			.max(100)
			.optional()
			.describe("Minimum depreciation rate filter (percentage)"),
		maxRate: z
			.number()
			.min(0)
			.max(100)
			.optional()
			.describe("Maximum depreciation rate filter (percentage)"),
		lastDepreciatedFrom: z
			.string()
			.optional()
			.describe(
				"Filter categories last depreciated from this date (YYYY-MM-DD)",
			),
		lastDepreciatedTo: z
			.string()
			.optional()
			.describe(
				"Filter categories last depreciated up to this date (YYYY-MM-DD)",
			),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchAssetCatsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchAssetCats", args, error);
		}
	},
);

// Register getAssetCat tool
server.tool(
	"getAssetCat",
	"Get a specific asset category by its code",
	{
		code: z.string().describe("The asset category code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getAssetCatTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getAssetCat", args, error);
		}
	},
);

// Register listAssetCatFields tool
server.tool(
	"listAssetCatFields",
	"List all available fields for asset categories",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listAssetCatFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listAssetCatFields", {}, error);
		}
	},
);

// Register searchAssetLogs tool
server.tool(
	"searchAssetLogs",
	"Search for asset logs in MoneyWorks by parent asset, action type, date range, transaction, or memo",
	{
		parentSeq: z
			.number()
			.optional()
			.describe("Parent asset sequence number to filter logs"),
		action: z
			.enum([
				"DEPRECIATION",
				"ADJUSTMENT",
				"REVALUATION",
				"DISPOSAL",
				"PURCHASE",
				"PRIVATE_USE",
			])
			.optional()
			.describe(
				"Action type filter: DEPRECIATION=Depreciation, ADJUSTMENT=Adjustment, REVALUATION=Revaluation, DISPOSAL=Disposal, PURCHASE=Purchase, PRIVATE_USE=Private use",
			),
		fromDate: z
			.string()
			.optional()
			.describe("Filter logs from this date (YYYY-MM-DD)"),
		toDate: z
			.string()
			.optional()
			.describe("Filter logs up to this date (YYYY-MM-DD)"),
		transactionSeq: z
			.number()
			.optional()
			.describe("Transaction sequence number filter"),
		memo: z.string().optional().describe("Search query for memo field"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchAssetLogsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchAssetLogs", args, error);
		}
	},
);

// Register getAssetLog tool
server.tool(
	"getAssetLog",
	"Get a specific asset log by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The asset log sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getAssetLogTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getAssetLog", args, error);
		}
	},
);

// Register listAssetLogFields tool
server.tool(
	"listAssetLogFields",
	"List all available fields for asset logs",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listAssetLogFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listAssetLogFields", {}, error);
		}
	},
);

// Register searchAutoSplits tool
server.tool(
	"searchAutoSplits",
	"Search for auto splits in MoneyWorks by match name, match function, or other criteria",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for match name or match function"),
		matchName: z
			.string()
			.optional()
			.describe("Match name filter (max 12 characters)"),
		splitMode: z.number().optional().describe("Split mode filter"),
		priority: z.number().optional().describe("Priority filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchAutoSplitsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchAutoSplits", args, error);
		}
	},
);

// Register getAutoSplit tool
server.tool(
	"getAutoSplit",
	"Get a specific auto split by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The sequence number of the auto split to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getAutoSplitTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getAutoSplit", args, error);
		}
	},
);

// Register listAutoSplitFields tool
server.tool(
	"listAutoSplitFields",
	"List all available fields for auto splits",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listAutoSplitFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listAutoSplitFields", {}, error);
		}
	},
);

// Register searchBankRecs tool
server.tool(
	"searchBankRecs",
	"Search for bank reconciliations in MoneyWorks by account, date range, or discrepancy status",
	{
		account: z
			.string()
			.optional()
			.describe("Account code to filter bank reconciliations"),
		dateFrom: z
			.string()
			.optional()
			.describe("Start date for reconciliation search (YYYY-MM-DD format)"),
		dateTo: z
			.string()
			.optional()
			.describe("End date for reconciliation search (YYYY-MM-DD format)"),
		hasDiscrepancy: z
			.boolean()
			.optional()
			.describe("Filter for reconciliations with discrepancies"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchBankRecsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchBankRecs", args, error);
		}
	},
);

// Register getBankRec tool
server.tool(
	"getBankRec",
	"Get a specific bank reconciliation by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The sequence number of the bank reconciliation"),
	},
	async (args, extra) => {
		try {
			const result = await getBankRecTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getBankRec", args, error);
		}
	},
);

// Register listBankRecFields tool
server.tool(
	"listBankRecFields",
	"List all available fields for bank reconciliations",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listBankRecFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listBankRecFields", {}, error);
		}
	},
);

// Register searchBuilds tool
server.tool(
	"searchBuilds",
	"Search for build entries in MoneyWorks by product sequence, part code, or order",
	{
		productSeq: z
			.number()
			.optional()
			.describe("Filter by product sequence number"),
		partCode: z.string().optional().describe("Search by part code"),
		order: z.number().optional().describe("Filter by order number"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchBuildsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchBuilds", args, error);
		}
	},
);

// Register getBuild tool
server.tool(
	"getBuild",
	"Get a specific build by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The build sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getBuildTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getBuild", args, error);
		}
	},
);

// Register listBuildFields tool
server.tool(
	"listBuildFields",
	"List all available fields for builds",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listBuildFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listBuildFields", {}, error);
		}
	},
);

// Register searchJobs tool
server.tool(
	"searchJobs",
	"Search for jobs in MoneyWorks by code, description, client, status, or other criteria",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for job code or description"),
		client: z.string().optional().describe("Client code filter"),
		status: z
			.enum(["ACTIVE", "COMPLETE", "INACTIVE", "QUOTE"])
			.optional()
			.describe(
				"Job status filter: ACTIVE=Active, COMPLETE=Complete, INACTIVE=Inactive, QUOTE=Quote",
			),
		manager: z.string().optional().describe("Manager code filter"),
		project: z.string().optional().describe("Project code filter"),
		category1: z.string().optional().describe("Category 1 filter"),
		category2: z.string().optional().describe("Category 2 filter"),
		category3: z.string().optional().describe("Category 3 filter"),
		category4: z.string().optional().describe("Category 4 filter"),
		fromStartDate: z
			.string()
			.optional()
			.describe("Filter jobs starting from this date (YYYY-MM-DD)"),
		toStartDate: z
			.string()
			.optional()
			.describe("Filter jobs starting up to this date (YYYY-MM-DD)"),
		fromEndDate: z
			.string()
			.optional()
			.describe("Filter jobs ending from this date (YYYY-MM-DD)"),
		toEndDate: z
			.string()
			.optional()
			.describe("Filter jobs ending up to this date (YYYY-MM-DD)"),
		minQuote: z.number().optional().describe("Minimum quote amount"),
		maxQuote: z.number().optional().describe("Maximum quote amount"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchJobsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchJobs", args, error);
		}
	},
);

// Register getJob tool
server.tool(
	"getJob",
	"Get a specific job by its code",
	{
		code: z.string().describe("The job code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getJobTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getJob", args, error);
		}
	},
);

// Register listJobFields tool
server.tool(
	"listJobFields",
	"List all available fields for jobs",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listJobFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listJobFields", {}, error);
		}
	},
);

// Register searchJobSheets tool
server.tool(
	"searchJobSheets",
	"Search for job sheets in MoneyWorks by job, resource, status, date range, or other criteria",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for job code, resource, or memo"),
		job: z.string().optional().describe("Job code filter"),
		resource: z.string().optional().describe("Resource code filter"),
		status: z
			.enum(["PENDING", "APPROVED", "REJECTED", "PROCESSED"])
			.optional()
			.describe(
				"Job sheet status filter: PENDING=Pending, APPROVED=Approved, REJECTED=Rejected, PROCESSED=Processed",
			),
		type: z
			.enum(["TIME", "MATERIAL", "EXPENSE", "OTHER"])
			.optional()
			.describe(
				"Job sheet type filter: TIME=Time, MATERIAL=Material, EXPENSE=Expense, OTHER=Other",
			),
		fromDate: z
			.string()
			.optional()
			.describe("Filter job sheets from this date (YYYY-MM-DD)"),
		toDate: z
			.string()
			.optional()
			.describe("Filter job sheets up to this date (YYYY-MM-DD)"),
		enteredBy: z.string().optional().describe("Filter by user who entered"),
		costCentre: z.string().optional().describe("Cost centre filter"),
		activityCode: z.string().optional().describe("Activity code filter"),
		minBillValue: z.number().optional().describe("Minimum bill value"),
		maxBillValue: z.number().optional().describe("Maximum bill value"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchJobSheetsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchJobSheets", args, error);
		}
	},
);

// Register getJobSheet tool
server.tool(
	"getJobSheet",
	"Get a specific job sheet by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The job sheet sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getJobSheetTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getJobSheet", args, error);
		}
	},
);

// Register listJobSheetFields tool
server.tool(
	"listJobSheetFields",
	"List all available fields for job sheets",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listJobSheetFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listJobSheetFields", {}, error);
		}
	},
);

// Register searchLedger tool
server.tool(
	"searchLedger",
	"Search for ledger entries in MoneyWorks by account, department, category, classification, or type",
	{
		accountCode: z.string().optional().describe("Account code to filter by"),
		department: z.string().optional().describe("Department code to filter by"),
		category: z.string().optional().describe("Category code to filter by"),
		classification: z
			.string()
			.optional()
			.describe("Classification code to filter by"),
		type: z.string().optional().describe("Ledger type to filter by"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchLedgerTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchLedger", args, error);
		}
	},
);

// Register getLedgerEntry tool
server.tool(
	"getLedgerEntry",
	"Get a specific ledger entry by account code and optional filters",
	{
		accountCode: z.string().describe("The account code to retrieve"),
		department: z.string().optional().describe("Department code to filter by"),
		category: z.string().optional().describe("Category code to filter by"),
		classification: z
			.string()
			.optional()
			.describe("Classification code to filter by"),
	},
	async (args, extra) => {
		try {
			const result = await getLedgerEntryTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getLedgerEntry", args, error);
		}
	},
);

// Register listLedgerFields tool
server.tool(
	"listLedgerFields",
	"List all available fields for ledger entries",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listLedgerFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listLedgerFields", {}, error);
		}
	},
);

// Register searchLists tool
server.tool(
	"searchLists",
	"Search for lists in MoneyWorks by List ID, item, or comment. Lists are used for custom fields and dropdown menus.",
	{
		listId: z.string().optional().describe("Filter by specific List ID"),
		item: z
			.string()
			.optional()
			.describe("Search for specific item within lists"),
		comment: z.string().optional().describe("Search within list comments"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchListsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchLists", args, error);
		}
	},
);

// Register getList tool
server.tool(
	"getList",
	"Get a specific list by its List ID, optionally filtered by item",
	{
		listId: z.string().describe("The List ID to retrieve"),
		item: z
			.string()
			.optional()
			.describe("Optional: specific item within the list"),
	},
	async (args, extra) => {
		try {
			const result = await getListTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getList", args, error);
		}
	},
);

// Register listListFields tool
server.tool(
	"listListFields",
	"List all available fields for lists",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listListFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listListFields", {}, error);
		}
	},
);

// Register searchLogins tool
server.tool(
	"searchLogins",
	"Search for logins/users in MoneyWorks by initials, name, email, role, or security level",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for initials, name, or email"),
		role: z.string().optional().describe("Role code filter"),
		category: z.string().optional().describe("Category filter"),
		securityLevel: z.number().optional().describe("Filter by security level"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchLoginsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchLogins", args, error);
		}
	},
);

// Register getLogin tool
server.tool(
	"getLogin",
	"Get a specific login/user by their initials",
	{
		initials: z.string().describe("The login initials to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getLoginTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getLogin", args, error);
		}
	},
);

// Register listLoginFields tool
server.tool(
	"listLoginFields",
	"List all available fields for logins/users",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listLoginFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listLoginFields", {}, error);
		}
	},
);

// Register searchNames tool
server.tool(
	"searchNames",
	"Search for names (customers/suppliers) in MoneyWorks",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for name code, name, or contact"),
		customerType: z.number().optional().describe("Customer type filter"),
		supplierType: z.number().optional().describe("Supplier type filter"),
		kind: z
			.number()
			.optional()
			.describe("Kind filter (0=Customer, 1=Supplier, 2=Both)"),
		category1: z.string().optional().describe("Category 1 filter"),
		category2: z.string().optional().describe("Category 2 filter"),
		category3: z.string().optional().describe("Category 3 filter"),
		category4: z.string().optional().describe("Category 4 filter"),
		hold: z.boolean().optional().describe("Filter by hold status"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchNamesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchNames", args, error);
		}
	},
);

// Register getName tool
server.tool(
	"getName",
	"Get a specific name (customer/supplier) by code",
	{
		code: z.string().describe("The name code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getNameTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getName", args, error);
		}
	},
);

// Register listNameFields tool
server.tool(
	"listNameFields",
	"List all available fields for names (customers/suppliers)",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listNameFieldsTool.execute({});
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listNameFields", {}, error);
		}
	},
);

// Register searchPayments tool
server.tool(
	"searchPayments",
	"Search for payments in MoneyWorks by invoice ID, cash transaction, date range, or amount",
	{
		invoiceId: z.number().optional().describe("Filter payments by invoice ID"),
		cashTrans: z
			.number()
			.optional()
			.describe("Filter payments by cash transaction number"),
		fromDate: z
			.string()
			.optional()
			.describe("Filter payments from this date (YYYY-MM-DD)"),
		toDate: z
			.string()
			.optional()
			.describe("Filter payments up to this date (YYYY-MM-DD)"),
		minAmount: z.number().optional().describe("Minimum payment amount"),
		maxAmount: z.number().optional().describe("Maximum payment amount"),
		gstCycle: z.number().optional().describe("Filter by GST cycle"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchPaymentsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchPayments", args, error);
		}
	},
);

// Register getPayment tool
server.tool(
	"getPayment",
	"Get a specific payment by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The payment sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getPaymentTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getPayment", args, error);
		}
	},
);

// Register getPaymentsByInvoice tool
server.tool(
	"getPaymentsByInvoice",
	"Get all payments for a specific invoice",
	{
		invoiceId: z.number().describe("The invoice ID to get payments for"),
	},
	async (args, extra) => {
		try {
			const result = await getPaymentsByInvoiceTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getPaymentsByInvoice", args, error);
		}
	},
);

// Register getPaymentsByCashTrans tool
server.tool(
	"getPaymentsByCashTrans",
	"Get all payments for a specific cash transaction",
	{
		cashTrans: z
			.number()
			.describe("The cash transaction number to get payments for"),
	},
	async (args, extra) => {
		try {
			const result = await getPaymentsByCashTransTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getPaymentsByCashTrans", args, error);
		}
	},
);

// Register listPaymentFields tool
server.tool(
	"listPaymentFields",
	"List all available fields for payments",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listPaymentFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listPaymentFields", {}, error);
		}
	},
);

// Register getPaymentSummary tool
server.tool(
	"getPaymentSummary",
	"Get a summary of payments with totals and statistics",
	{
		fromDate: z
			.string()
			.optional()
			.describe("Summary from this date (YYYY-MM-DD)"),
		toDate: z.string().optional().describe("Summary to this date (YYYY-MM-DD)"),
		gstCycle: z.number().optional().describe("Filter by GST cycle"),
	},
	async (args, extra) => {
		try {
			const result = await getPaymentSummaryTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getPaymentSummary", args, error);
		}
	},
);

// Register searchProducts tool
server.tool(
	"searchProducts",
	"Search for products in MoneyWorks by code, description, category, supplier, or barcode",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for product code or description"),
		category1: z.string().optional().describe("Category 1 filter"),
		category2: z.string().optional().describe("Category 2 filter"),
		category3: z.string().optional().describe("Category 3 filter"),
		category4: z.string().optional().describe("Category 4 filter"),
		supplier: z.string().optional().describe("Supplier code filter"),
		barCode: z.string().optional().describe("Barcode filter"),
		type: z.string().optional().describe("Product type filter"),
		includeOutOfStock: z
			.boolean()
			.optional()
			.default(true)
			.describe("Include products with zero stock on hand"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchProductsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchProducts", args, error);
		}
	},
);

// Register getProduct tool
server.tool(
	"getProduct",
	"Get a specific product by its code",
	{
		code: z.string().describe("The product code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getProductTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getProduct", args, error);
		}
	},
);

// Register listProductFields tool
server.tool(
	"listProductFields",
	"List all available fields for products",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listProductFieldsTool.execute({});
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listProductFields", {}, error);
		}
	},
);

// Register searchTransactions tool
server.tool(
	"searchTransactions",
	"Search for transactions in MoneyWorks by reference, type, status, date range, or amount",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for reference, description, or name"),
		type: z
			.enum([
				"SI",
				"SC",
				"SR",
				"SD",
				"PI",
				"PC",
				"PP",
				"PD",
				"JN",
				"JC",
				"BR",
				"BP",
				"BT",
				"ST",
				"SO",
				"PO",
			] as const)
			.optional()
			.describe(
				"Transaction type: SI=Sales Invoice, SC=Sales Credit, SR=Sales Receipt, SD=Sales Deposit, PI=Purchase Invoice, PC=Purchase Credit, PP=Purchase Payment, PD=Purchase Deposit, JN=Journal, JC=Journal Correction, BR=Bank Receipt, BP=Bank Payment, BT=Bank Transfer, ST=Stock Transfer, SO=Sales Order, PO=Purchase Order",
			),
		status: z
			.enum(["OP", "CL", "PA", "CA", "DR"] as const)
			.optional()
			.describe(
				"Transaction status: OP=Open, CL=Closed, PA=Partial, CA=Cancelled, DR=Draft",
			),
		nameCode: z.string().optional().describe("Customer/Supplier code filter"),
		fromDate: z
			.string()
			.optional()
			.describe("Filter transactions from this date (YYYY-MM-DD)"),
		toDate: z
			.string()
			.optional()
			.describe("Filter transactions up to this date (YYYY-MM-DD)"),
		period: z.number().optional().describe("Accounting period filter"),
		minAmount: z.number().optional().describe("Minimum transaction amount"),
		maxAmount: z.number().optional().describe("Maximum transaction amount"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchTransactionsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchTransactions", args, error);
		}
	},
);

// Register getTransaction tool
server.tool(
	"getTransaction",
	"Get a specific transaction by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The transaction sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getTransactionTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTransaction", args, error);
		}
	},
);

// Register getTransactionByRef tool
server.tool(
	"getTransactionByRef",
	"Get a specific transaction by its reference (OurRef)",
	{
		reference: z
			.string()
			.describe("The transaction reference (OurRef) to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getTransactionByRefTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTransactionByRef", args, error);
		}
	},
);

// Register listTransactionFields tool
server.tool(
	"listTransactionFields",
	"List all available fields for transactions",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listTransactionFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listTransactionFields", {}, error);
		}
	},
);

// Register getTransactionSummary tool
server.tool(
	"getTransactionSummary",
	"Get a summary of transactions with totals by type and status",
	{
		nameCode: z
			.string()
			.optional()
			.describe("Filter by customer/supplier code"),
		type: z
			.enum([
				"SI",
				"SC",
				"SR",
				"SD",
				"PI",
				"PC",
				"PP",
				"PD",
				"JN",
				"JC",
				"BR",
				"BP",
				"BT",
				"ST",
				"SO",
				"PO",
			] as const)
			.optional()
			.describe("Filter by transaction type"),
		fromDate: z
			.string()
			.optional()
			.describe("Summary from this date (YYYY-MM-DD)"),
		toDate: z.string().optional().describe("Summary to this date (YYYY-MM-DD)"),
	},
	async (args, extra) => {
		try {
			const result = await getTransactionSummaryTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTransactionSummary", args, error);
		}
	},
);
// Register searchDetails tool
server.tool(
	"searchDetails",
	"Search for details in MoneyWorks by description, stock code, account, job, or parent transaction",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for description or stock code"),
		parentSeq: z
			.number()
			.optional()
			.describe("Parent sequence number to filter details by"),
		account: z.string().optional().describe("Account code filter"),
		stockCode: z.string().optional().describe("Stock code filter"),
		jobCode: z.string().optional().describe("Job code filter"),
		transactionType: z.string().optional().describe("Transaction type filter"),
		dateFrom: z
			.string()
			.optional()
			.describe("Filter details from this date (YYYY-MM-DD)"),
		dateTo: z
			.string()
			.optional()
			.describe("Filter details up to this date (YYYY-MM-DD)"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchDetailsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchDetails", args, error);
		}
	},
);

// Register getDetail tool
server.tool(
	"getDetail",
	"Get a specific detail by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The detail sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getDetailTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getDetail", args, error);
		}
	},
);

// Register listDetailFields tool
server.tool(
	"listDetailFields",
	"List all available fields for details",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listDetailFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listDetailFields", {}, error);
		}
	},
);

// Register searchInventory tool
server.tool(
	"searchInventory",
	"Search for inventory items in MoneyWorks by identifier, location, quantity, or expiry date",
	{
		identifier: z
			.string()
			.optional()
			.describe("Product identifier/SKU to search for"),
		location: z.string().optional().describe("Location code filter"),
		productSeq: z
			.number()
			.optional()
			.describe("Product sequence number filter"),
		minQty: z.number().optional().describe("Minimum quantity filter"),
		maxQty: z.number().optional().describe("Maximum quantity filter"),
		expiryBefore: z
			.string()
			.optional()
			.describe("Filter items expiring before this date (ISO 8601 format)"),
		expiryAfter: z
			.string()
			.optional()
			.describe("Filter items expiring after this date (ISO 8601 format)"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchInventoryTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchInventory", args, error);
		}
	},
);

// Register getInventoryItem tool
server.tool(
	"getInventoryItem",
	"Get a specific inventory item by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The sequence number of the inventory item"),
	},
	async (args, extra) => {
		try {
			const result = await getInventoryItemTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getInventoryItem", args, error);
		}
	},
);

// Register listInventoryFields tool
server.tool(
	"listInventoryFields",
	"List all available fields for inventory items",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listInventoryFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listInventoryFields", {}, error);
		}
	},
);

// Register getCompanyInformation tool
server.tool(
	"getCompanyInformation",
	"Get company information from MoneyWorks including name, address, tax details, and system configuration",
	{
		fields: z
			.array(z.string())
			.optional()
			.describe(
				"Specific fields to retrieve. If not provided, all fields will be returned",
			),
	},
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

// Register listCompanyInformationFields tool
server.tool(
	"listCompanyInformationFields",
	"List all available fields for company information",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listCompanyInformationFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listCompanyInformationFields", {}, error);
		}
	},
);

// Register searchContacts tool
server.tool(
	"searchContacts",
	"Search for contacts in MoneyWorks by name, email, phone, parent name, or role",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for contact name, email, or phone"),
		parentSeq: z
			.number()
			.optional()
			.describe("Parent Name sequence number to filter contacts by"),
		role: z
			.number()
			.optional()
			.describe("Role bitmask filter (corresponds to Name.Role)"),
		email: z.string().optional().describe("Email address filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchContactsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchContacts", args, error);
		}
	},
);

// Register getContact tool
server.tool(
	"getContact",
	"Get a specific contact by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The contact sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getContactTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getContact", args, error);
		}
	},
);

// Register listContactFields tool
server.tool(
	"listContactFields",
	"List all available fields for contacts",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listContactFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listContactFields", {}, error);
		}
	},
);

// Register getTableLabels tool
server.tool(
	"getTableLabels",
	"Get field labels for a specific MoneyWorks table in the specified language",
	{
		tableName: z
			.string()
			.describe(
				"The MoneyWorks table name (e.g., 'Transaction', 'Name', 'Product', 'Account')",
			),
		language: z
			.string()
			.default("en")
			.describe(
				"Language code for labels. Default is 'en' (English). Other supported languages include fr, de, es, it, pt, nl, sv, da, no, fi, ru, af, ar",
			),
	},
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

// Register generateAllLabels tool
server.tool(
	"generateAllLabels",
	"Generate and cache field labels for all MoneyWorks tables in English",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await generateAllLabelsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("generateAllLabels", {}, error);
		}
	},
);

// Register listSupportedLanguages tool
server.tool(
	"listSupportedLanguages",
	"List all languages supported for field label translation",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listSupportedLanguagesTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listSupportedLanguages", {}, error);
		}
	},
);

// Register listAvailableTables tool
server.tool(
	"listAvailableTables",
	"List all MoneyWorks tables that support field labels",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listAvailableTablesTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listAvailableTables", {}, error);
		}
	},
);

// Register searchDepartments tool
server.tool(
	"searchDepartments",
	"Search for departments in MoneyWorks by code, description, classification, or custom fields",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for department code or description"),
		classification: z.string().optional().describe("Classification filter"),
		custom1: z.string().optional().describe("Custom1 field filter"),
		custom2: z.string().optional().describe("Custom2 field filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchDepartmentsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchDepartments", args, error);
		}
	},
);

// Register getDepartment tool
server.tool(
	"getDepartment",
	"Get a specific department by its code",
	{
		code: z.string().describe("The department code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getDepartmentTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getDepartment", args, error);
		}
	},
);

// Register listDepartmentFields tool
server.tool(
	"listDepartmentFields",
	"List all available fields for departments",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listDepartmentFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listDepartmentFields", {}, error);
		}
	},
);

// Register searchTaxRates tool
server.tool(
	"searchTaxRates",
	"Search for tax rates in MoneyWorks by tax code, rate name, type, or effective date",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for tax code or rate name"),
		taxCode: z.string().optional().describe("Tax code filter"),
		type: z.number().optional().describe("Tax rate type filter"),
		aliasCode: z.string().optional().describe("Alias code filter"),
		aliasCountry: z.string().optional().describe("Alias country filter"),
		fromDate: z
			.string()
			.optional()
			.describe("Filter tax rates effective from this date (YYYY-MM-DD)"),
		toDate: z
			.string()
			.optional()
			.describe("Filter tax rates effective up to this date (YYYY-MM-DD)"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchTaxRatesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchTaxRates", args, error);
		}
	},
);

// Register getTaxRate tool
server.tool(
	"getTaxRate",
	"Get a specific tax rate by its tax code",
	{
		taxCode: z.string().describe("The tax code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getTaxRateTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getTaxRate", args, error);
		}
	},
);

// Register listTaxRateFields tool
server.tool(
	"listTaxRateFields",
	"List all available fields for tax rates",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listTaxRateFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listTaxRateFields", {}, error);
		}
	},
);

// Register evaluateExpression tool
server.tool(
	"evaluateExpression",
	"Evaluate a MoneyWorks expression and return the result. Supports system functions, calculations, and data queries",
	{
		expression: z
			.string()
			.describe(
				"The MoneyWorks expression to evaluate (e.g., 'GetPeriod()', 'CurrentUser()', 'Date()', mathematical expressions, etc.)",
			),
	},
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

// Register evaluateTemplate tool
server.tool(
	"evaluateTemplate",
	"Evaluate a custom template against a specific MoneyWorks table. Returns an array of evaluated results for each record",
	{
		table: z
			.string()
			.describe(
				"The MoneyWorks table to evaluate the template against (e.g., 'account', 'transaction', 'name', 'product')",
			),
		template: z
			.string()
			.describe(
				"The custom template to evaluate. Use MoneyWorks field names and expressions within the template",
			),
	},
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

// Register listCommonExpressions tool
server.tool(
	"listCommonExpressions",
	"List common MoneyWorks expressions and functions that can be used with the evaluate tool",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listCommonExpressionsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listCommonExpressions", {}, error);
		}
	},
);

// Register generateReport tool
server.tool(
	"generateReport",
	"Generate a MoneyWorks report in HTML format. Returns the complete HTML report content",
	{
		reportName: z
			.string()
			.describe(
				"The name of the MoneyWorks report to generate (e.g., 'Profit & Loss', 'Balance Sheet', 'Trial Balance', 'Customer Statement')",
			),
	},
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

// Register listCommonReports tool
server.tool(
	"listCommonReports",
	"List common MoneyWorks reports that can be generated using the generateReport tool",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listCommonReportsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listCommonReports", {}, error);
		}
	},
);

// Register getReportParameters tool
server.tool(
	"getReportParameters",
	"Get information about the default parameters used when generating reports",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await getReportParametersTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getReportParameters", {}, error);
		}
	},
);

// Register searchGeneral tool
server.tool(
	"searchGeneral",
	"Search for general entries in MoneyWorks by code, description, or date range",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for code or description"),
		code: z.string().optional().describe("Code filter"),
		description: z.string().optional().describe("Description filter"),
		dateFrom: z.string().optional().describe("Date from filter (YYYY-MM-DD)"),
		dateTo: z.string().optional().describe("Date to filter (YYYY-MM-DD)"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchGeneralTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchGeneral", args, error);
		}
	},
);

// Register getGeneralSetting tool
server.tool(
	"getGeneralSetting",
	"Get a specific general entry by its code",
	{
		code: z.string().describe("The general entry code to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getGeneralSettingTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getGeneralSetting", args, error);
		}
	},
);

// Register listGeneralFields tool
server.tool(
	"listGeneralFields",
	"List all available fields for general entries",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listGeneralFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listGeneralFields", {}, error);
		}
	},
);

// Register searchMessages tool
server.tool(
	"searchMessages",
	"Search for messages in MoneyWorks by content, user, dates, or type",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for message content or user text"),
		user: z.string().optional().describe("Filter by user code"),
		startDate: z
			.string()
			.optional()
			.describe("Filter messages starting from this date (YYYY-MM-DD)"),
		endDate: z
			.string()
			.optional()
			.describe("Filter messages ending before this date (YYYY-MM-DD)"),
		nextDate: z
			.string()
			.optional()
			.describe("Filter messages by next scheduled date (YYYY-MM-DD)"),
		type: z.number().optional().describe("Message type filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchMessagesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchMessages", args, error);
		}
	},
);

// Register getMessage tool
server.tool(
	"getMessage",
	"Get a specific message by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The message sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getMessageTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getMessage", args, error);
		}
	},
);

// Register listMessageFields tool
server.tool(
	"listMessageFields",
	"List all available fields for messages",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listMessageFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listMessageFields", {}, error);
		}
	},
);

// Register searchMemos tool
server.tool(
	"searchMemos",
	"Search for memos in MoneyWorks by text content, name association, dates, or recall dates",
	{
		query: z.string().optional().describe("Search query for memo text content"),
		nameSeq: z.number().optional().describe("Filter by name sequence number"),
		startDate: z
			.string()
			.optional()
			.describe("Filter memos from this date (YYYY-MM-DD)"),
		endDate: z
			.string()
			.optional()
			.describe("Filter memos up to this date (YYYY-MM-DD)"),
		recallStartDate: z
			.string()
			.optional()
			.describe("Filter by recall date starting from (YYYY-MM-DD)"),
		recallEndDate: z
			.string()
			.optional()
			.describe("Filter by recall date ending before (YYYY-MM-DD)"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchMemosTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchMemos", args, error);
		}
	},
);

// Register getMemo tool
server.tool(
	"getMemo",
	"Get a specific memo by its sequence number",
	{
		sequenceNumber: z.number().describe("The memo sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getMemoTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getMemo", args, error);
		}
	},
);

// Register listMemoFields tool
server.tool(
	"listMemoFields",
	"List all available fields for memos",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listMemoFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listMemoFields", {}, error);
		}
	},
);

// Register searchStickies tool
server.tool(
	"searchStickies",
	"Search for stickies in MoneyWorks by message content, user, owner, colour, or file number",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for message content or user"),
		user: z
			.string()
			.optional()
			.describe("Filter by user code (4 characters max)"),
		ownerSeq: z.number().optional().describe("Filter by owner sequence number"),
		colour: z.number().optional().describe("Filter by colour value"),
		fileNum: z.number().optional().describe("Filter by file number"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchStickiesTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchStickies", args, error);
		}
	},
);

// Register getStickie tool
server.tool(
	"getStickie",
	"Get a specific stickie by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The stickie sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getStickieTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getStickie", args, error);
		}
	},
);

// Register listStickieFields tool
server.tool(
	"listStickieFields",
	"List all available fields for stickies",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listStickieFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listStickieFields", {}, error);
		}
	},
);

// Register searchFilters tool
server.tool(
	"searchFilters",
	"Search for filters in MoneyWorks by name, user, file, tabset, tab, or type",
	{
		query: z.string().optional().describe("Search query for filter name"),
		file: z.number().optional().describe("File number filter"),
		tabSet: z.number().optional().describe("TabSet number filter"),
		tab: z.number().optional().describe("Tab number filter"),
		type: z.number().optional().describe("Type number filter"),
		user: z.string().max(4).optional().describe("User code filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchFiltersTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchFilters", args, error);
		}
	},
);

// Register getFilter tool
server.tool(
	"getFilter",
	"Get a specific filter by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The filter sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getFilterTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getFilter", args, error);
		}
	},
);

// Register listFilterFields tool
server.tool(
	"listFilterFields",
	"List all available fields for filters",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listFilterFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listFilterFields", {}, error);
		}
	},
);

// Register searchUsers tool
server.tool(
	"searchUsers",
	"Search for users in MoneyWorks by key or data content",
	{
		query: z.string().optional().describe("Search query for user key or data"),
		key: z.string().optional().describe("Filter by specific key"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchUsersTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchUsers", args, error);
		}
	},
);

// Register getUser tool
server.tool(
	"getUser",
	"Get a specific user by their key",
	{
		key: z.string().describe("The user key to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getUserTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getUser", args, error);
		}
	},
);

// Register listUserFields tool
server.tool(
	"listUserFields",
	"List all available fields for users",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listUserFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listUserFields", {}, error);
		}
	},
);

// Register searchUser2s tool
server.tool(
	"searchUser2s",
	"Search for User2 entries in MoneyWorks by key, text fields, dates, or numeric values",
	{
		key: z.string().optional().describe("Key field to search for"),
		devKey: z.number().optional().describe("DevKey filter"),
		text1: z.string().optional().describe("Text1 field content to search"),
		text2: z.string().optional().describe("Text2 field content to search"),
		text: z.string().optional().describe("Text field content to search"),
		dateFrom: z
			.string()
			.optional()
			.describe("Filter entries with Date1 after this date (ISO 8601 format)"),
		dateTo: z
			.string()
			.optional()
			.describe("Filter entries with Date1 before this date (ISO 8601 format)"),
		minInt1: z.number().optional().describe("Minimum Int1 value filter"),
		maxInt1: z.number().optional().describe("Maximum Int1 value filter"),
		minFloat1: z.number().optional().describe("Minimum Float1 value filter"),
		maxFloat1: z.number().optional().describe("Maximum Float1 value filter"),
		colour: z.number().optional().describe("Colour value filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchUser2sTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchUser2s", args, error);
		}
	},
);

// Register getUser2 tool
server.tool(
	"getUser2",
	"Get a specific User2 entry by its sequence number",
	{
		sequenceNumber: z
			.number()
			.describe("The sequence number of the User2 entry"),
	},
	async (args, extra) => {
		try {
			const result = await getUser2Tool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getUser2", args, error);
		}
	},
);

// Register listUser2Fields tool
server.tool(
	"listUser2Fields",
	"List all available fields for User2 entries",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listUser2FieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listUser2Fields", {}, error);
		}
	},
);

// Register searchOffLedger tool
server.tool(
	"searchOffLedger",
	"Search for off-ledger entries in MoneyWorks by name, description, or kind",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for name or description"),
		kind: z.string().optional().describe("Kind filter (4 character code)"),
		includeBalances: z
			.boolean()
			.default(false)
			.describe("Include all balance fields in response"),
		includeBudgets: z
			.boolean()
			.default(false)
			.describe("Include all budget fields in response"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchOffLedgerTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchOffLedger", args, error);
		}
	},
);

// Register getOffLedgerEntry tool
server.tool(
	"getOffLedgerEntry",
	"Get a specific off-ledger entry by its name",
	{
		name: z.string().describe("The off-ledger entry name to retrieve"),
		includeBalances: z
			.boolean()
			.default(true)
			.describe("Include all balance fields in response"),
		includeBudgets: z
			.boolean()
			.default(true)
			.describe("Include all budget fields in response"),
	},
	async (args, extra) => {
		try {
			const result = await getOffLedgerEntryTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getOffLedgerEntry", args, error);
		}
	},
);

// Register listOffLedgerFields tool
server.tool(
	"listOffLedgerFields",
	"List available fields for off-ledger entries",
	{
		category: z
			.enum(["core", "balances", "budgets", "all"])
			.default("all")
			.describe("Category of fields to list"),
	},
	async (args, extra) => {
		try {
			const result = await listOffLedgerFieldsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listOffLedgerFields", args, error);
		}
	},
);

// Register searchLinks tool
server.tool(
	"searchLinks",
	"Search for links in MoneyWorks by department or group",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for department or group"),
		dept: z.string().optional().describe("Department code filter"),
		group: z.string().optional().describe("Group code filter"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchLinksTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchLinks", args, error);
		}
	},
);

// Register getLink tool
server.tool(
	"getLink",
	"Get a specific link by its sequence number",
	{
		sequenceNumber: z.number().describe("The link sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getLinkTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getLink", args, error);
		}
	},
);

// Register listLinkFields tool
server.tool(
	"listLinkFields",
	"List all available fields for links",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listLinkFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listLinkFields", {}, error);
		}
	},
);

// Register searchLogs tool
server.tool(
	"searchLogs",
	"Search for log entries in MoneyWorks by description, who, or date range",
	{
		query: z
			.string()
			.optional()
			.describe("Search query for log description or info fields"),
		who: z.string().optional().describe("Filter by who created the log entry"),
		startDate: z
			.string()
			.optional()
			.describe("Filter logs after this date (ISO format)"),
		endDate: z
			.string()
			.optional()
			.describe("Filter logs before this date (ISO format)"),
		limit: z
			.number()
			.min(1)
			.max(100)
			.default(50)
			.describe("Maximum number of results"),
		offset: z.number().min(0).default(0).describe("Number of results to skip"),
	},
	async (args, extra) => {
		try {
			const result = await searchLogsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("searchLogs", args, error);
		}
	},
);

// Register getLog tool
server.tool(
	"getLog",
	"Get a specific log entry by its sequence number",
	{
		sequenceNumber: z.number().describe("The log sequence number to retrieve"),
	},
	async (args, extra) => {
		try {
			const result = await getLogTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getLog", args, error);
		}
	},
);

// Register listLogFields tool
server.tool(
	"listLogFields",
	"List all available fields for log entries",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listLogFieldsTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listLogFields", {}, error);
		}
	},
);

// Register describeTableSchema tool
server.tool(
	"describeTableSchema",
	"Get the full Eden schema for a MoneyWorks table, including field types, descriptions, and constraints",
	{
		tableName: z
			.string()
			.describe(
				"The name of the table to describe (e.g., 'Account', 'Transaction', 'Name')",
			),
		includeRelationships: z
			.boolean()
			.default(true)
			.describe("Whether to include foreign key relationships"),
	},
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

// Register listTables tool
server.tool(
	"listTables",
	"List all available MoneyWorks tables that can be queried",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await listTablesTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("listTables", {}, error);
		}
	},
);

// Register getFieldMetadata tool
server.tool(
	"getFieldMetadata",
	"Get detailed metadata about a specific field in a MoneyWorks table",
	{
		tableName: z.string().describe("The name of the table"),
		fieldName: z.string().describe("The name of the field to get metadata for"),
	},
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

// Register getTableRelationships tool
server.tool(
	"getTableRelationships",
	"Get all foreign key relationships for a MoneyWorks table",
	{
		tableName: z
			.string()
			.describe("The name of the table to get relationships for"),
	},
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

// Register listEndpoints tool
server.tool(
	"listEndpoints",
	"List all available MoneyWorks API endpoints and their basic information",
	{
		category: z
			.string()
			.optional()
			.describe(
				"Filter endpoints by category (tables, system, metadata, evaluate, reports)",
			),
		method: z
			.enum(["GET", "POST", "PUT", "DELETE"])
			.optional()
			.describe("Filter by HTTP method"),
	},
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

// Register describeEndpoint tool
server.tool(
	"describeEndpoint",
	"Get detailed information about a specific MoneyWorks API endpoint including parameters and response schema",
	{
		path: z
			.string()
			.describe(
				"The API endpoint path (e.g., '/tables/{table}/search', '/system/company-info')",
			),
		method: z
			.enum(["GET", "POST", "PUT", "DELETE"])
			.optional()
			.describe("HTTP method (defaults to most common for the path)"),
	},
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

// Register getSystemInfo tool
server.tool(
	"getSystemInfo",
	"Get comprehensive MoneyWorks system information including version, capabilities, and status",
	{
		includePerformance: z
			.boolean()
			.default(true)
			.describe("Include performance metrics"),
		includeEnvironment: z
			.boolean()
			.default(true)
			.describe("Include environment information"),
		includeDatabase: z
			.boolean()
			.default(true)
			.describe("Include database information"),
	},
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

// Register getApiCapabilities tool
server.tool(
	"getApiCapabilities",
	"Get detailed information about available API capabilities and features",
	{}, // Empty parameters object
	async (args, extra) => {
		try {
			const result = await getApiCapabilitiesTool.execute();
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError("getApiCapabilities", {}, error);
		}
	},
);

// Register getSystemStatus tool
server.tool(
	"getSystemStatus",
	"Get current system status and health information",
	{
		includeHealth: z
			.boolean()
			.default(true)
			.describe("Include health check information"),
	},
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

// Register getValidationRules tool
server.tool(
	"getValidationRules",
	"Get comprehensive validation rules for a specific field in a MoneyWorks table",
	{
		tableName: z.string().describe("The name of the table"),
		fieldName: z
			.string()
			.describe("The name of the field to get validation rules for"),
		includeBusinessRules: z
			.boolean()
			.default(true)
			.describe("Include business logic rules"),
		includeExamples: z
			.boolean()
			.default(true)
			.describe("Include valid/invalid examples"),
	},
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

// Register getTableValidationRules tool
server.tool(
	"getTableValidationRules",
	"Get validation rules for all fields in a MoneyWorks table",
	{
		tableName: z.string().describe("The name of the table"),
		includeBusinessRules: z
			.boolean()
			.default(false)
			.describe("Include business logic rules"),
		severity: z
			.enum(["all", "error", "warning"])
			.default("all")
			.describe("Filter by severity level"),
	},
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

// Register getBusinessRules tool
server.tool(
	"getBusinessRules",
	"Get business rules and constraints that apply to a MoneyWorks table",
	{
		tableName: z.string().describe("The name of the table"),
		category: z
			.enum(["all", "integrity", "business", "formatting", "security"])
			.default("all")
			.describe("Filter by rule category"),
	},
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

// Register getEnumValues tool
server.tool(
	"getEnumValues",
	"Get all possible enumerated values for a specific enum field in a MoneyWorks table",
	{
		tableName: z.string().describe("The name of the table"),
		fieldName: z.string().describe("The name of the enum field"),
		includeDeprecated: z
			.boolean()
			.default(false)
			.describe("Include deprecated enum values"),
		includeDescriptions: z
			.boolean()
			.default(true)
			.describe("Include detailed descriptions"),
	},
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

// Register getTableEnumFields tool
server.tool(
	"getTableEnumFields",
	"Get all enum fields in a MoneyWorks table and their possible values",
	{
		tableName: z.string().describe("The name of the table"),
		includeValues: z
			.boolean()
			.default(true)
			.describe("Include the actual enum values"),
		includeDeprecated: z
			.boolean()
			.default(false)
			.describe("Include deprecated values"),
	},
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

// Register searchEnumValues tool
server.tool(
	"searchEnumValues",
	"Search for enum values across MoneyWorks tables by value or description",
	{
		searchTerm: z
			.string()
			.describe("Term to search for in enum values or descriptions"),
		tables: z
			.array(z.string())
			.optional()
			.describe("Limit search to specific tables"),
		exactMatch: z
			.boolean()
			.default(false)
			.describe("Require exact match vs. partial match"),
	},
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

// Register getEnumUsagePatterns tool
server.tool(
	"getEnumUsagePatterns",
	"Get usage patterns and statistics for enum values in a specific field",
	{
		tableName: z.string().describe("The name of the table"),
		fieldName: z.string().describe("The name of the enum field"),
	},
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

// Register getDateFormats tool
server.tool(
	"getDateFormats",
	"Get date format information for a specific date field in a MoneyWorks table",
	{
		tableName: z.string().describe("The name of the table"),
		fieldName: z.string().describe("The name of the date field"),
		locale: z
			.string()
			.default("en-US")
			.describe("Locale for date formatting (e.g., 'en-US', 'en-GB', 'fr-FR')"),
		includeExamples: z
			.boolean()
			.default(true)
			.describe("Include format examples"),
	},
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

// Register getTableDateFields tool
server.tool(
	"getTableDateFields",
	"Get all date/time fields in a MoneyWorks table and their format information",
	{
		tableName: z.string().describe("The name of the table"),
		locale: z.string().default("en-US").describe("Locale for date formatting"),
		includeTime: z
			.boolean()
			.default(true)
			.describe("Include datetime and time fields"),
	},
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

// Register getSupportedDateFormats tool
server.tool(
	"getSupportedDateFormats",
	"Get all supported date formats in MoneyWorks for different locales and types",
	{
		locale: z.string().default("en-US").describe("Locale for date formatting"),
		type: z
			.enum(["date", "datetime", "time", "all"])
			.default("all")
			.describe("Type of formats to return"),
	},
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

// Register parseDateString tool
server.tool(
	"parseDateString",
	"Parse and validate a date string according to MoneyWorks date format rules",
	{
		dateString: z.string().describe("The date string to parse"),
		expectedFormat: z.string().optional().describe("Expected format pattern"),
		locale: z.string().default("en-US").describe("Locale for parsing"),
		strict: z.boolean().default(false).describe("Strict parsing mode"),
	},
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

// Register getCurrencyInfo tool
server.tool(
	"getCurrencyInfo",
	"Get comprehensive currency information including formatting rules and exchange rates",
	{
		currencyCode: z
			.string()
			.optional()
			.describe("ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP')"),
		includeFormatting: z
			.boolean()
			.default(true)
			.describe("Include formatting rules and examples"),
		includeExchangeRates: z
			.boolean()
			.default(false)
			.describe("Include current exchange rates"),
	},
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

// Register getCurrencyFormatting tool
server.tool(
	"getCurrencyFormatting",
	"Get detailed currency formatting rules and examples for a specific currency and locale",
	{
		currencyCode: z.string().describe("ISO 4217 currency code"),
		locale: z
			.string()
			.default("en-US")
			.describe("Locale for formatting (e.g., 'en-US', 'en-GB', 'de-DE')"),
		amount: z
			.number()
			.optional()
			.describe("Specific amount to format as example"),
	},
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

// Register getExchangeRates tool
server.tool(
	"getExchangeRates",
	"Get current and historical exchange rates between currencies",
	{
		baseCurrency: z.string().describe("Base currency code (e.g., 'USD')"),
		targetCurrencies: z
			.array(z.string())
			.optional()
			.describe(
				"Target currency codes. If not provided, returns rates for all major currencies",
			),
		includeHistorical: z
			.boolean()
			.default(false)
			.describe("Include historical rate information"),
	},
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

// Register convertCurrency tool
server.tool(
	"convertCurrency",
	"Convert an amount from one currency to another using current or historical exchange rates",
	{
		amount: z.number().describe("Amount to convert"),
		fromCurrency: z.string().describe("Source currency code"),
		toCurrency: z.string().describe("Target currency code"),
		includeFormatting: z
			.boolean()
			.default(true)
			.describe("Include formatted output"),
		rateDate: z
			.string()
			.optional()
			.describe("Specific date for exchange rate (YYYY-MM-DD)"),
	},
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

// Register getMoneyWorksCurrencySettings tool
server.tool(
	"getMoneyWorksCurrencySettings",
	"Get MoneyWorks-specific currency settings and multi-currency configuration",
	{
		includeMultiCurrency: z
			.boolean()
			.default(true)
			.describe("Include multi-currency configuration"),
	},
	async (args, extra) => {
		try {
			const result = await getMoneyWorksCurrencySettingsTool.execute(args);
			return {
				content: [
					{ type: "text" as const, text: JSON.stringify(result, null, 2) },
				],
			};
		} catch (error) {
			return await handleToolError(
				"getMoneyWorksCurrencySettings",
				args,
				error,
			);
		}
	},
);

// Register getPermissionInfo tool
server.tool(
	"getPermissionInfo",
	"Get required permissions for a specific MoneyWorks operation or API endpoint",
	{
		operation: z
			.string()
			.describe(
				"Operation name (e.g., 'searchAccounts', 'getTransaction', 'createName')",
			),
		tableName: z
			.string()
			.optional()
			.describe("Table name if operation is table-specific"),
		includeAlternatives: z
			.boolean()
			.default(true)
			.describe("Include alternative permission combinations"),
	},
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

// Register getTablePermissions tool
server.tool(
	"getTablePermissions",
	"Get all required permissions for accessing a specific MoneyWorks table",
	{
		tableName: z.string().describe("The name of the table"),
		operationType: z
			.enum(["read", "write", "delete", "all"])
			.default("all")
			.describe("Type of operations to check"),
		includeFieldLevel: z
			.boolean()
			.default(false)
			.describe("Include field-level permissions"),
	},
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

// Register getUserRoles tool
server.tool(
	"getUserRoles",
	"Get information about MoneyWorks user roles and their permissions",
	{
		includeBuiltIn: z
			.boolean()
			.default(true)
			.describe("Include built-in system roles"),
		includeCustom: z
			.boolean()
			.default(true)
			.describe("Include custom user-defined roles"),
		roleId: z.string().optional().describe("Get details for a specific role"),
	},
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

// Register checkUserPermissions tool
server.tool(
	"checkUserPermissions",
	"Check if a specific user has permissions to perform an operation",
	{
		userId: z.string().describe("User identifier"),
		operation: z.string().describe("Operation to check permissions for"),
		tableName: z.string().optional().describe("Table name if applicable"),
		includeContext: z
			.boolean()
			.default(true)
			.describe("Include security context information"),
	},
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

// Register getSecurityAuditInfo tool
server.tool(
	"getSecurityAuditInfo",
	"Get security audit information for permissions and access patterns",
	{
		auditType: z
			.enum(["permissions", "access", "operations", "all"])
			.default("all")
			.describe("Type of audit information"),
		timeframe: z
			.enum(["day", "week", "month", "all"])
			.default("week")
			.describe("Time period for audit data"),
		userId: z.string().optional().describe("Specific user to audit"),
	},
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
		user_prompt: JSON.stringify(args),
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
