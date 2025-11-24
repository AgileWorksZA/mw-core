/**
 * MoneyWorks Semantic Account Entity - AI-First MCP Optimized
 *
 * This represents the semantic evolution of MoneyWorks account data, designed for:
 * - Optimal LLM/MCP interaction with rich business context
 * - Natural language account operations and analysis
 * - Token-efficient semantic compression
 * - Intent-driven financial management workflows
 *
 * Based on: SEMANTIC-MCP-OPTIMIZATION-ANALYSIS.md
 * Source: MoneyWorks Official Account Structure + Semantic Enhancement
 */

// ============================================================================
// SEMANTIC BUSINESS LAYER - Account Intelligence
// ============================================================================

/** Business purpose classification for natural language understanding */
export enum AccountPurpose {
	// Asset purposes
	CASH_MANAGEMENT = "cash_management",
	BANK_OPERATIONS = "bank_operations",
	CUSTOMER_RECEIVABLES = "customer_receivables",
	INVENTORY_TRACKING = "inventory_tracking",
	EQUIPMENT_ASSETS = "equipment_assets",
	PROPERTY_ASSETS = "property_assets",
	INVESTMENT_HOLDINGS = "investment_holdings",

	// Liability purposes
	SUPPLIER_PAYABLES = "supplier_payables",
	TAX_OBLIGATIONS = "tax_obligations",
	LOAN_MANAGEMENT = "loan_management",
	CREDIT_FACILITIES = "credit_facilities",
	ACCRUED_EXPENSES = "accrued_expenses",

	// Equity purposes
	OWNER_EQUITY = "owner_equity",
	RETAINED_EARNINGS = "retained_earnings",
	CAPITAL_CONTRIBUTIONS = "capital_contributions",

	// Income purposes
	PRODUCT_SALES = "product_sales",
	SERVICE_REVENUE = "service_revenue",
	INVESTMENT_INCOME = "investment_income",
	OTHER_INCOME = "other_income",

	// Expense purposes
	OPERATING_EXPENSES = "operating_expenses",
	COST_OF_GOODS = "cost_of_goods",
	ADMINISTRATIVE_COSTS = "administrative_costs",
	MARKETING_EXPENSES = "marketing_expenses",
	DEPRECIATION_COSTS = "depreciation_costs",
}

/** Account category for semantic grouping */
export enum AccountCategory {
	CURRENT_ASSET = "current_asset",
	FIXED_ASSET = "fixed_asset",
	CURRENT_LIABILITY = "current_liability",
	LONG_TERM_LIABILITY = "long_term_liability",
	EQUITY = "equity",
	OPERATING_INCOME = "operating_income",
	NON_OPERATING_INCOME = "non_operating_income",
	OPERATING_EXPENSE = "operating_expense",
	NON_OPERATING_EXPENSE = "non_operating_expense",
}

/** Financial behavior classification */
export enum FinancialBehavior {
	INCREASES_WITH_DEBITS = "increases_with_debits", // Assets, Expenses
	INCREASES_WITH_CREDITS = "increases_with_credits", // Liabilities, Equity, Income
	CONTRA_ACCOUNT = "contra_account", // Allowances, Accumulated Depreciation
}

/** Account status for workflow management */
export enum AccountStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	ARCHIVED = "archived",
	HEADING_ONLY = "heading_only",
	CONTROL_ACCOUNT = "control_account",
}

/** Business context for LLM understanding */
export interface AccountBusinessContext {
	/** What is this account used for in business operations? */
	businessPurpose: AccountPurpose;

	/** How does this account behave financially? */
	financialBehavior: FinancialBehavior;

	/** What accounts are related to this one? */
	relatedAccounts: AccountRelationship[];

	/** What business rules apply to this account? */
	businessRules: AccountRule[];

	/** What reports typically include this account? */
	reportingContexts: ReportingContext[];

	/** What compliance requirements apply? */
	complianceRequirements: ComplianceRequirement[];

	/** What typical transactions use this account? */
	typicalTransactions: TransactionPattern[];
}

export interface AccountRelationship {
	relationshipType: "parent" | "child" | "control" | "subsidiary" | "contra";
	relatedAccountCode: string;
	relatedAccountName: string;
	purpose: string; // "Rolls up to", "Controls", "Offsets"
}

export interface AccountRule {
	rule: string; // "Requires job code", "Tax code mandatory"
	type: "validation" | "workflow" | "reporting" | "compliance";
	enforcement: "required" | "warning" | "informational";
	explanation: string; // Human-readable business reason
}

export interface ReportingContext {
	reportType: string; // "Balance Sheet", "P&L", "Cash Flow"
	section: string; // "Current Assets", "Operating Income"
	sortOrder: number; // Position within section
	aggregationLevel: "detail" | "summary" | "total";
}

export interface ComplianceRequirement {
	requirement: string; // "Tax reporting", "Audit trail"
	jurisdiction: string; // "US GAAP", "IFRS", "Local Tax"
	frequency: string; // "Monthly", "Quarterly", "Annual"
	actions: string[]; // Required compliance actions
}

export interface TransactionPattern {
	transactionType: string; // "Customer Payment", "Supplier Invoice"
	frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "ad_hoc";
	typicalAmount: "low" | "medium" | "high" | "variable";
	businessProcess: string; // "Sales Process", "Purchasing Process"
}

/** Semantic tags for enhanced discovery */
export interface AccountSemanticTag {
	category:
		| "balance_sheet"
		| "income_statement"
		| "cash_flow"
		| "tax"
		| "management";
	tag: string; // "liquid_asset", "recurring_income", "controllable_expense"
	confidence: number; // 0-1 confidence score
	businessImpact: "high" | "medium" | "low";
}

// ============================================================================
// ENHANCED ACCOUNT TYPES
// ============================================================================

/** Enhanced account type with semantic meaning */
export enum SemanticAccountType {
	// Assets with business context
	CASH_ACCOUNT = "A",
	CHECKING_ACCOUNT = "A",
	SAVINGS_ACCOUNT = "A",
	CUSTOMER_RECEIVABLES = "A",
	INVENTORY_STOCK = "A",
	PREPAID_EXPENSES = "A",
	OFFICE_EQUIPMENT = "F",
	BUILDINGS_PROPERTY = "F",
	ACCUMULATED_DEPRECIATION = "F",
	TERM_INVESTMENTS = "T",

	// Liabilities with purpose clarity
	ACCOUNTS_PAYABLE = "L",
	ACCRUED_EXPENSES = "L",
	TAX_PAYABLE = "L",
	SHORT_TERM_LOANS = "L",
	LONG_TERM_DEBT = "M",
	MORTGAGE_PAYABLE = "M",

	// Equity with ownership context
	OWNER_EQUITY = "H",
	RETAINED_EARNINGS = "H",
	CAPITAL_STOCK = "H",

	// Income with revenue classification
	PRODUCT_SALES = "S",
	SERVICE_REVENUE = "S",
	CONSULTING_INCOME = "S",
	INVESTMENT_INCOME = "I",
	OTHER_INCOME = "I",

	// Expenses with operational context
	COST_OF_GOODS_SOLD = "C",
	MATERIALS_COST = "C",
	OFFICE_EXPENSES = "E",
	MARKETING_EXPENSES = "E",
	PROFESSIONAL_FEES = "E",
	DEPRECIATION_EXPENSE = "E",
}

/** System account classification */
export enum SystemAccountType {
	BANK_ACCOUNT = "K",
	ACCOUNTS_RECEIVABLE = "A",
	ACCOUNTS_PAYABLE = "L",
	TAX_PAID = "P",
	TAX_RECEIVED = "R",
	PROFIT_LOSS = "F",
	NONE = " ",
}

// ============================================================================
// SEMANTIC ACCOUNT INTERFACE
// ============================================================================

/** Core semantic account with rich business context */
export interface SemanticAccount {
	// === CORE IDENTIFICATION ===
	sequenceNumber: number;
	code: string;
	description: string;

	// === SEMANTIC BUSINESS LAYER ===
	/** What is the business purpose of this account? */
	purpose: AccountPurpose;

	/** Current operational status */
	status: AccountStatus;

	/** Type with semantic meaning */
	type: SemanticAccountType;

	/** Category for financial statement grouping */
	category: AccountCategory;

	/** Financial behavior for accounting rules */
	financialBehavior: FinancialBehavior;

	/** Rich business context for LLM understanding */
	businessContext: AccountBusinessContext;

	/** Human-readable account story */
	businessStory: string; // "Primary checking account for daily operations"

	/** Semantic tags for enhanced discovery */
	semanticTags: AccountSemanticTag[];

	// === FINANCIAL CLASSIFICATION ===
	classification: {
		moneyWorksType: string; // "A", "L", "H", "I", "S", "E", "C"
		systemType: SystemAccountType; // Control account designation
		profitLossAccount?: string; // Year-end transfer account
		parentAccount?: string; // Hierarchical parent
		isControlAccount: boolean; // Controls subsidiary accounts
		isHeading: boolean; // Heading/summary account only
	};

	// === OPERATIONAL DETAILS ===
	operational: {
		currency: string; // Account currency
		isMultiCurrency: boolean;
		taxCode?: string; // Default tax code
		requiresJobCode: boolean; // Job costing required
		requiresApproval: boolean; // Transaction approval needed
		balanceLimit?: number; // Credit/overdraft limit
	};

	// === BANKING INFORMATION ===
	banking?: {
		bankAccountNumber?: string;
		manualChequeNumber?: string;
		printedChequeNumber?: string;
		lastStatementImport?: Date;
		feedId?: string; // Bank feed identifier
		importFormat?: string; // Statement import format
	};

	// === REPORTING CONTEXT ===
	reporting: {
		cashFlowCategory?: string; // Operating/Investing/Financing
		cashForecastPattern?: string; // Cash flow timing pattern
		ebitdaClassification?: string; // EBITDA categorization
		customCategories: string[]; // User-defined categories
		accountantCode?: string; // External mapping code
	};

	// === AUDIT TRAIL ===
	audit: {
		created: Date;
		lastModified: Date;
		securityLevel: number;
		color: number; // Visual identification
	};

	// === USER CUSTOMIZATION ===
	custom: {
		comments?: string;
		userNumber?: number;
		userText?: string;
		taggedData?: string; // Key-value pairs
	};

	// === MCP OPTIMIZATION ===
	/** Pre-computed semantic vector for similarity search */
	semanticVector?: number[];

	/** Account classification confidence scores */
	classificationConfidence?: Array<{
		purpose: AccountPurpose;
		confidence: number;
	}>;

	/** Quick access to common business questions */
	businessInsights?: {
		primaryUse: string; // "Track customer payments and outstanding invoices"
		balanceEffect: string; // "Increases with customer payments, decreases with sales"
		relatedProcesses: string[]; // ["Sales Process", "Collections Process"]
		complianceStatus: string; // "Compliant - Proper receivables tracking"
		recommendations: string[]; // ["Monitor aging", "Regular reconciliation"]
	};

	// === BACKWARDS COMPATIBILITY ===
	/** Raw MoneyWorks data for legacy compatibility */
	raw?: {
		Type: string;
		System: string;
		Group: string;
		Category: string;
		[key: string]: any;
	};
}

// ============================================================================
// NATURAL LANGUAGE QUERY INTERFACE
// ============================================================================

/** Natural language query types for account operations */
export type AccountQuery =
	| "all bank accounts with positive balances"
	| "expense accounts for office overhead"
	| "accounts receivable aging analysis"
	| "fixed assets requiring depreciation"
	| "liability accounts for tax reporting"
	| "income accounts for quarterly reporting"
	| "accounts requiring job code tracking"
	| string; // Allow arbitrary natural language

/** Semantic query result with business context */
export interface AccountQueryResult {
	accounts: SemanticAccount[];
	businessInsights: {
		totalCount: number;
		accountCategories: { [key: string]: number };
		balanceTotals: { [key: string]: number };
		patterns: AccountPattern[];
		recommendations: string[];
	};
	query: {
		original: string; // Original natural language
		interpreted: string; // How we understood it
		filters: QueryFilter[]; // Applied filters
	};
}

export interface AccountPattern {
	pattern: string; // "Monthly recurring expenses"
	frequency: number; // How often this pattern occurs
	significance: "high" | "medium" | "low";
	examples: string[]; // Example accounts
}

export interface QueryFilter {
	field: string; // "purpose", "category", "type"
	operator: string; // "equals", "contains", "in_category"
	value: any; // Filter value
	humanReadable: string; // "Asset accounts only"
}

// ============================================================================
// MCP-OPTIMIZED INTERFACES
// ============================================================================

/** MCP tool interface designed for natural language account interaction */
export interface MoneyWorksAccountSemanticMCP {
	// === NATURAL LANGUAGE QUERIES ===
	/** Find accounts using natural language */
	find_accounts(query: AccountQuery): Promise<AccountQueryResult>;

	/** Understand account purpose from natural language */
	understand_account_purpose(description: string): Promise<AccountPurpose>;

	/** Analyze chart of accounts structure */
	analyze_chart_of_accounts(context?: any): Promise<ChartAnalysis>;

	// === BUSINESS INTELLIGENCE ===
	/** Analyze account balances and trends */
	analyze_account_balances(
		period: string,
		accountCodes?: string[],
	): Promise<BalanceAnalysis>;

	/** Generate account insights */
	get_account_insights(query: AccountQuery): Promise<AccountInsight[]>;

	/** Check account setup compliance */
	check_account_compliance(account: SemanticAccount): Promise<ComplianceReport>;

	// === CONVERSATIONAL HELPERS ===
	/** Explain an account in business terms */
	explain_account(code: string): Promise<string>;

	/** Suggest accounts for a business scenario */
	suggest_accounts(scenario: BusinessScenario): Promise<AccountSuggestion[]>;

	/** Get contextual help for account management */
	get_account_help(context: AccountSituation): Promise<ContextualHelp>;
}

export interface ChartAnalysis {
	structure: {
		totalAccounts: number;
		activeAccounts: number;
		accountsByType: { [key: string]: number };
		depth: number; // Hierarchy levels
	};
	healthCheck: {
		missingControlAccounts: string[];
		unusedAccounts: string[];
		duplicateDescriptions: string[];
		inconsistentNaming: string[];
	};
	recommendations: string[];
}

export interface BalanceAnalysis {
	period: string;
	balances: {
		assets: number;
		liabilities: number;
		equity: number;
		income: number;
		expenses: number;
	};
	trends: AccountTrend[];
	alerts: BalanceAlert[];
	recommendations: string[];
}

export interface AccountTrend {
	accountCode: string;
	accountName: string;
	trend: "increasing" | "decreasing" | "stable" | "volatile";
	magnitude: number; // Percentage change
	significance: "high" | "medium" | "low";
}

export interface BalanceAlert {
	accountCode: string;
	alertType:
		| "negative_asset"
		| "credit_limit"
		| "unusual_balance"
		| "zero_balance";
	severity: "warning" | "error" | "info";
	message: string;
	recommendation: string;
}

export interface AccountInsight {
	insight: string; // "Office expenses increasing 20% monthly"
	category: "trend" | "anomaly" | "opportunity" | "risk";
	confidence: number; // 0-1
	impact: "high" | "medium" | "low";
	actions: string[]; // Suggested actions
}

export interface AccountSuggestion {
	accountCode: string;
	accountName: string;
	purpose: AccountPurpose;
	reason: string; // Why this account is suggested
	setup: string[]; // Setup instructions
}

export interface BusinessScenario {
	intent: string; // "Track office expenses", "Manage customer payments"
	industry?: string;
	businessSize: "small" | "medium" | "large";
	context: string; // Additional context
}

export interface AccountSituation {
	currentAccount?: SemanticAccount;
	userIntent?: string;
	context?: string;
}

export interface ContextualHelp {
	help: string; // Contextual guidance
	relatedAccounts: string[]; // Related account codes
	documentation: string[]; // Relevant docs
	examples: string[]; // Usage examples
}

export interface ComplianceReport {
	overall: "compliant" | "warning" | "non_compliant";
	checks: ComplianceCheck[];
	recommendations: string[];
}

export interface ComplianceCheck {
	rule: string;
	status: "pass" | "warning" | "fail";
	details: string;
	remedy?: string; // How to fix if failed
}

// ============================================================================
// SEMANTIC UTILITY FUNCTIONS
// ============================================================================

/** Convert natural language to account purpose */
export function parseAccountPurpose(naturalLanguage: string): AccountPurpose {
	const lower = naturalLanguage.toLowerCase();

	// Cash and banking
	if (
		lower.includes("cash") ||
		lower.includes("bank") ||
		lower.includes("checking")
	) {
		return AccountPurpose.CASH_MANAGEMENT;
	}

	// Customer related
	if (
		lower.includes("customer") ||
		lower.includes("receivable") ||
		lower.includes("debtor")
	) {
		return AccountPurpose.CUSTOMER_RECEIVABLES;
	}

	// Supplier related
	if (
		lower.includes("supplier") ||
		lower.includes("payable") ||
		lower.includes("creditor")
	) {
		return AccountPurpose.SUPPLIER_PAYABLES;
	}

	// Sales and revenue
	if (
		lower.includes("sales") ||
		lower.includes("revenue") ||
		lower.includes("income")
	) {
		if (lower.includes("product")) return AccountPurpose.PRODUCT_SALES;
		if (lower.includes("service")) return AccountPurpose.SERVICE_REVENUE;
		return AccountPurpose.PRODUCT_SALES;
	}

	// Expenses
	if (lower.includes("expense") || lower.includes("cost")) {
		if (lower.includes("office") || lower.includes("admin"))
			return AccountPurpose.ADMINISTRATIVE_COSTS;
		if (lower.includes("marketing") || lower.includes("advertising"))
			return AccountPurpose.MARKETING_EXPENSES;
		if (lower.includes("goods") || lower.includes("material"))
			return AccountPurpose.COST_OF_GOODS;
		return AccountPurpose.OPERATING_EXPENSES;
	}

	// Assets
	if (
		lower.includes("asset") ||
		lower.includes("equipment") ||
		lower.includes("property")
	) {
		if (lower.includes("equipment") || lower.includes("computer"))
			return AccountPurpose.EQUIPMENT_ASSETS;
		if (lower.includes("property") || lower.includes("building"))
			return AccountPurpose.PROPERTY_ASSETS;
		return AccountPurpose.EQUIPMENT_ASSETS;
	}

	// Default fallback
	return AccountPurpose.OPERATING_EXPENSES;
}

/** Generate human-readable account story */
export function generateAccountStory(account: SemanticAccount): string {
	const purpose = account.purpose;
	const description = account.description;

	switch (purpose) {
		case AccountPurpose.CASH_MANAGEMENT:
			return `${description} - manages cash flow and daily financial operations`;
		case AccountPurpose.CUSTOMER_RECEIVABLES:
			return `${description} - tracks money owed by customers for goods and services sold`;
		case AccountPurpose.SUPPLIER_PAYABLES:
			return `${description} - tracks money owed to suppliers for goods and services received`;
		case AccountPurpose.PRODUCT_SALES:
			return `${description} - records revenue from product sales to customers`;
		case AccountPurpose.SERVICE_REVENUE:
			return `${description} - records revenue from services provided to customers`;
		case AccountPurpose.OPERATING_EXPENSES:
			return `${description} - tracks ongoing operational costs for business activities`;
		default:
			return `${description} - ${purpose.replace(/_/g, " ")} account for business operations`;
	}
}

/** Get financial behavior explanation */
export function getFinancialBehavior(account: SemanticAccount): string {
	switch (account.financialBehavior) {
		case FinancialBehavior.INCREASES_WITH_DEBITS:
			return `${account.description} increases with debits (left side) and decreases with credits (right side)`;
		case FinancialBehavior.INCREASES_WITH_CREDITS:
			return `${account.description} increases with credits (right side) and decreases with debits (left side)`;
		case FinancialBehavior.CONTRA_ACCOUNT:
			return `${account.description} is a contra account that offsets the balance of its related account`;
		default:
			return `${account.description} follows standard accounting rules for its account type`;
	}
}

/** Determine account category from MoneyWorks type */
export function determineAccountCategory(type: string): AccountCategory {
	switch (type) {
		case "A":
			return AccountCategory.CURRENT_ASSET;
		case "F":
			return AccountCategory.FIXED_ASSET;
		case "T":
			return AccountCategory.CURRENT_ASSET; // Term assets
		case "L":
			return AccountCategory.CURRENT_LIABILITY;
		case "M":
			return AccountCategory.LONG_TERM_LIABILITY;
		case "H":
			return AccountCategory.EQUITY;
		case "S":
			return AccountCategory.OPERATING_INCOME;
		case "I":
			return AccountCategory.NON_OPERATING_INCOME;
		case "C":
			return AccountCategory.OPERATING_EXPENSE; // Cost of sales
		case "E":
			return AccountCategory.OPERATING_EXPENSE;
		default:
			return AccountCategory.OPERATING_EXPENSE;
	}
}

/** Determine financial behavior from account type */
export function determineFinancialBehavior(type: string): FinancialBehavior {
	switch (type) {
		case "A": // Assets
		case "F": // Fixed Assets
		case "T": // Term Assets
		case "E": // Expenses
		case "C": // Cost of Sales
			return FinancialBehavior.INCREASES_WITH_DEBITS;
		case "L": // Liabilities
		case "M": // Term Liabilities
		case "H": // Equity
		case "S": // Sales
		case "I": // Income
			return FinancialBehavior.INCREASES_WITH_CREDITS;
		default:
			return FinancialBehavior.INCREASES_WITH_DEBITS;
	}
}

/** Generate semantic tags for enhanced discovery */
export function generateAccountSemanticTags(
	account: SemanticAccount,
): AccountSemanticTag[] {
	const tags: AccountSemanticTag[] = [];

	// Balance sheet vs income statement
	if (
		["A", "L", "F", "T", "M", "H"].includes(
			account.classification.moneyWorksType,
		)
	) {
		tags.push({
			category: "balance_sheet",
			tag: "balance_sheet_account",
			confidence: 1.0,
			businessImpact: "high",
		});
	} else {
		tags.push({
			category: "income_statement",
			tag: "income_statement_account",
			confidence: 1.0,
			businessImpact: "high",
		});
	}

	// Liquidity tags
	if (
		account.purpose === AccountPurpose.CASH_MANAGEMENT ||
		account.purpose === AccountPurpose.BANK_OPERATIONS
	) {
		tags.push({
			category: "cash_flow",
			tag: "liquid_asset",
			confidence: 1.0,
			businessImpact: "high",
		});
	}

	// Control account tags
	if (account.classification.isControlAccount) {
		tags.push({
			category: "management",
			tag: "control_account",
			confidence: 1.0,
			businessImpact: "medium",
		});
	}

	// Tax relevance
	if (account.operational.taxCode) {
		tags.push({
			category: "tax",
			tag: "tax_relevant",
			confidence: 1.0,
			businessImpact: "medium",
		});
	}

	return tags;
}

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/** Convert legacy Account to SemanticAccount */
export function upgradeAccountToSemantic(legacy: any): SemanticAccount {
	const purpose = parseAccountPurpose(legacy.Description || "");
	const category = determineAccountCategory(legacy.Type);
	const financialBehavior = determineFinancialBehavior(legacy.Type);

	return {
		sequenceNumber: legacy.SequenceNumber,
		code: legacy.Code,
		description: legacy.Description || "",

		purpose: purpose,
		status:
			legacy.Flags & 0x1 ? AccountStatus.HEADING_ONLY : AccountStatus.ACTIVE,
		type: legacy.Type as SemanticAccountType,
		category: category,
		financialBehavior: financialBehavior,

		businessContext: {
			businessPurpose: purpose,
			financialBehavior: financialBehavior,
			relatedAccounts: [],
			businessRules: [],
			reportingContexts: [],
			complianceRequirements: [],
			typicalTransactions: [],
		},

		businessStory: generateAccountStory({
			description: legacy.Description,
			purpose: purpose,
		} as SemanticAccount),

		semanticTags: [],

		classification: {
			moneyWorksType: legacy.Type,
			systemType: legacy.System as SystemAccountType,
			profitLossAccount: legacy.PandL || undefined,
			isControlAccount: ["A", "L", "P", "R", "K"].includes(legacy.System),
			isHeading: !!(legacy.Flags & 0x1),
		},

		operational: {
			currency: legacy.Currency || "USD",
			isMultiCurrency: !!(legacy.Currency && legacy.Currency !== ""),
			taxCode: legacy.TaxCode || undefined,
			requiresJobCode: !!(legacy.Flags & 0x2),
			requiresApproval: false, // Would need to determine from flags
			balanceLimit: legacy.BalanceLimit || undefined,
		},

		banking:
			legacy.System === "K"
				? {
						bankAccountNumber: legacy.BankAccountNumber,
						manualChequeNumber: legacy.ManualChequeNumber,
						printedChequeNumber: legacy.PrintedChequeNumber,
						lastStatementImport: legacy.LastStatementImport,
						feedId: legacy.FeedID,
						importFormat: legacy.ImportFormat,
					}
				: undefined,

		reporting: {
			cashFlowCategory: legacy.Cashflow,
			cashForecastPattern: legacy.Cashforecast,
			ebitdaClassification: legacy.EBITDA,
			customCategories: [
				legacy.Category,
				legacy.Category2,
				legacy.Category3,
				legacy.Category4,
			].filter(Boolean),
			accountantCode: legacy.AccountantCode,
		},

		audit: {
			created: new Date(legacy.Created),
			lastModified: new Date(legacy.LastModifiedTime),
			securityLevel: legacy.SecurityLevel || 0,
			color: legacy.Colour || 0,
		},

		custom: {
			comments: legacy.Comments,
			userNumber: legacy.UserNum,
			userText: legacy.UserText,
			taggedData: legacy.TaggedText,
		},

		raw: legacy, // Preserve original data
	};
}

/** Generate business context from account data */
export function enrichAccountBusinessContext(
	account: SemanticAccount,
): AccountBusinessContext {
	// This would integrate with MoneyWorks business rules engine
	// For now, return basic structure based on account type
	const relatedAccounts: AccountRelationship[] = [];

	// Add typical relationships based on purpose
	if (account.purpose === AccountPurpose.CUSTOMER_RECEIVABLES) {
		relatedAccounts.push({
			relationshipType: "control",
			relatedAccountCode: "SALES",
			relatedAccountName: "Sales Revenue",
			purpose: "Records sales that create receivables",
		});
	}

	return {
		businessPurpose: account.purpose,
		financialBehavior: account.financialBehavior,
		relatedAccounts,
		businessRules: [],
		reportingContexts: [],
		complianceRequirements: [],
		typicalTransactions: [],
	};
}

export default SemanticAccount;
