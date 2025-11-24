/**
 * MoneyWorks Semantic Transaction Entity - AI-First MCP Optimized
 *
 * This represents the next evolution of our transaction types, designed for:
 * - Optimal LLM/MCP interaction with rich semantic context
 * - Natural language business operations
 * - Token-efficient semantic compression
 * - Intent-driven business workflows
 *
 * Based on: SEMANTIC-MCP-OPTIMIZATION-ANALYSIS.md
 * Source: MoneyWorks Official Documentation + Semantic Enhancement
 */

// ============================================================================
// SEMANTIC BUSINESS LAYER - The New Foundation
// ============================================================================

/** Business intent classification for natural language understanding */
export enum BusinessIntent {
	// Payment intents
	SUPPLIER_PAYMENT = "supplier_payment",
	CUSTOMER_RECEIPT = "customer_receipt",
	EMPLOYEE_EXPENSE = "employee_expense",
	BANK_TRANSFER = "bank_transfer",

	// Invoice intents
	CUSTOMER_BILLING = "customer_billing",
	SUPPLIER_INVOICING = "supplier_invoicing",
	SERVICE_BILLING = "service_billing",
	PRODUCT_SALE = "product_sale",

	// Operational intents
	INVENTORY_ADJUSTMENT = "inventory_adjustment",
	DEPRECIATION_ENTRY = "depreciation_entry",
	TAX_ADJUSTMENT = "tax_adjustment",
	PERIOD_CLOSING = "period_closing",

	// Order management intents
	PURCHASE_ORDER = "purchase_order",
	SALES_ORDER = "sales_order",
	QUOTE_GENERATION = "quote_generation",
	ORDER_FULFILLMENT = "order_fulfillment",
}

/** Transaction state for semantic understanding */
export enum TransactionState {
	DRAFT = "draft", // Unposted, editable
	POSTED = "posted", // Posted to ledger, locked
	ON_HOLD = "on_hold", // Temporarily suspended
	CANCELLED = "cancelled", // Voided transaction
	RECONCILED = "reconciled", // Bank reconciled
	PAID = "paid", // Invoice fully paid
	PARTIALLY_PAID = "partially_paid", // Invoice partially paid
	OVERDUE = "overdue", // Past due date
}

/** MoneyWorks entity types for semantic relationships */
export enum MoneyWorksEntityType {
	CUSTOMER = "customer",
	SUPPLIER = "supplier",
	EMPLOYEE = "employee",
	BANK = "bank",
	INTERNAL = "internal",
}

/** Business context for LLM understanding */
export interface BusinessContext {
	/** What business process is this transaction part of? */
	process: BusinessProcess;

	/** What accounts are affected and how? */
	accountingImpact: AccountingImpact[];

	/** What business rules apply? */
	applicableRules: BusinessRule[];

	/** What compliance requirements must be met? */
	complianceRequirements: ComplianceRequirement[];

	/** Related business documents */
	relatedDocuments: BusinessDocument[];
}

export interface BusinessProcess {
	name: string; // "Customer Payment Processing"
	stage: string; // "Payment Received"
	nextSteps: string[]; // ["Update Customer Balance", "Generate Receipt"]
	owner: string; // "Accounts Receivable"
}

export interface AccountingImpact {
	account: string; // "1200 - Accounts Receivable"
	effect: "increase" | "decrease"; // Semantic direction
	amount: number; // Impact amount
	reason: string; // "Customer payment reduces outstanding balance"
}

export interface BusinessRule {
	rule: string; // "Customer credit limit check"
	status: "satisfied" | "warning" | "violation";
	details: string; // Human-readable explanation
}

export interface ComplianceRequirement {
	requirement: string; // "Tax reporting compliance"
	status: "compliant" | "review_required" | "non_compliant";
	actions: string[]; // Required actions for compliance
}

export interface BusinessDocument {
	type: "invoice" | "receipt" | "order" | "contract";
	reference: string; // Document identifier
	relationship: "generated_from" | "generates" | "supports";
}

/** Semantic tags for enhanced LLM context */
export interface SemanticTag {
	category: "process" | "party" | "amount" | "timing" | "compliance";
	tag: string; // "high_value", "urgent", "recurring"
	confidence: number; // 0-1 confidence score
}

// ============================================================================
// ENHANCED TRANSACTION TYPES
// ============================================================================

/** Enhanced transaction type with semantic meaning */
export enum SemanticTransactionType {
	// Cash transactions with intent clarity
	CASH_SUPPLIER_PAYMENT = "CP",
	CASH_CUSTOMER_RECEIPT = "CR",
	CASH_CREDITOR_PAYMENT = "CPC",
	CASH_CREDITOR_REFUND = "CRC",
	CASH_DEBTOR_PAYMENT = "CRD",
	CASH_DEBTOR_REFUND = "CPD",

	// Invoice transactions with business context
	SUPPLIER_INVOICE_COMPLETE = "CIC",
	SUPPLIER_INVOICE_DRAFT = "CII",
	CUSTOMER_INVOICE_COMPLETE = "DIC",
	CUSTOMER_INVOICE_DRAFT = "DII",

	// Journal entries with purpose clarity
	GENERAL_JOURNAL_ENTRY = "JN",
	INVENTORY_ADJUSTMENT = "JNS",

	// Orders with workflow state
	PURCHASE_ORDER_COMPLETE = "POC",
	PURCHASE_ORDER_PENDING = "POI",
	SALES_ORDER_COMPLETE = "SOC",
	SALES_ORDER_PENDING = "SOI",
	CUSTOMER_QUOTE = "QU",
}

// ============================================================================
// SEMANTIC TRANSACTION INTERFACE
// ============================================================================

/** Core semantic transaction with rich business context */
export interface SemanticTransaction {
	// === CORE IDENTIFICATION ===
	sequenceNumber: number;
	ourReference: string;
	theirReference: string;

	// === SEMANTIC BUSINESS LAYER ===
	/** What is the business intent of this transaction? */
	intent: BusinessIntent;

	/** Current state in business workflow */
	state: TransactionState;

	/** Type with semantic meaning */
	type: SemanticTransactionType;

	/** Who is involved in this transaction? */
	party: {
		code: string; // "CUST001"
		name: string; // "ABC Corporation"
		type: MoneyWorksEntityType; // CUSTOMER
		relationship: string; // "Primary customer for office supplies"
	};

	/** Rich business context for LLM understanding */
	businessContext: BusinessContext;

	/** Human-readable business story */
	businessStory: string; // "Payment received from ABC Corp for June office supplies invoice"

	/** Semantic tags for enhanced discovery */
	semanticTags: SemanticTag[];

	// === FINANCIAL DETAILS ===
	amounts: {
		gross: number;
		tax: number;
		net: number;
		outstanding: number; // For invoices
	};

	currency: {
		code: string; // "USD"
		exchangeRate: number; // 1.0 for base currency
		isBaseCurrency: boolean;
	};

	// === TIMING & WORKFLOW ===
	dates: {
		transaction: Date;
		entry: Date;
		due?: Date; // For invoices
		paid?: Date; // When fully paid
	};

	period: {
		number: number; // MoneyWorks period
		name: string; // "June 2025"
		year: number;
		month: number;
	};

	// === OPERATIONAL DETAILS ===
	description: string;
	analysis: string;
	department?: string;
	salesperson?: string;

	// === WORKFLOW STATE ===
	workflow: {
		isPosted: boolean;
		isOnHold: boolean;
		isRecurring: boolean;
		approvals: ApprovalStatus[];
	};

	// === AUDIT TRAIL ===
	audit: {
		enteredBy: string;
		postedBy?: string;
		lastModified: Date;
		version: number;
	};

	// === MCP OPTIMIZATION ===
	/** Pre-computed semantic vector for similarity search */
	semanticVector?: number[];

	/** Intent classification confidence scores */
	intentClassification?: Array<{
		intent: BusinessIntent;
		confidence: number;
	}>;

	/** Quick access to common business questions */
	businessInsights?: {
		accountingEffect: string; // "Increases Cash $1,000, Decreases A/R $1,000"
		complianceStatus: string; // "Compliant - All tax requirements met"
		nextActions: string[]; // ["Generate receipt", "Update customer balance"]
		relatedTransactions: number[]; // Related transaction sequence numbers
	};

	// === BACKWARDS COMPATIBILITY ===
	/** Raw MoneyWorks data for legacy compatibility */
	raw?: {
		Type: string;
		Status: string;
		NameCode: string;
		[key: string]: any;
	};
}

export interface ApprovalStatus {
	level: number; // 1, 2, etc.
	approver: string; // User initials
	timestamp?: Date;
	status: "pending" | "approved" | "rejected";
}

// ============================================================================
// SEMANTIC DETAIL LINES
// ============================================================================

export interface SemanticDetailLine {
	// === CORE IDENTIFICATION ===
	sequenceNumber: number;
	parentTransaction: number;
	sortOrder: number;

	// === SEMANTIC BUSINESS CONTEXT ===
	/** What is this line item for? */
	purpose: DetailPurpose;

	/** Account with business context */
	account: {
		code: string; // "5000"
		name: string; // "Office Supplies Expense"
		type: "asset" | "liability" | "equity" | "income" | "expense";
		businessPurpose: string; // "Track day-to-day office supply costs"
	};

	/** Product/service details if applicable */
	item?: {
		code: string; // "PAPER001"
		name: string; // "A4 Copy Paper"
		category: string; // "Office Supplies"
		isInventoried: boolean;
	};

	// === FINANCIAL DETAILS ===
	amounts: {
		gross: number;
		tax: number;
		net: number;
		unitPrice?: number;
		discount?: number;
	};

	quantities?: {
		ordered: number;
		shipped: number;
		unit: string; // "box", "each", "hour"
	};

	// === BUSINESS CONTEXT ===
	description: string;
	department?: string;
	job?: string; // Job costing

	/** Human-readable line explanation */
	businessExplanation: string; // "Office paper supplies for admin department"

	// === ACCOUNTING IMPACT ===
	accounting: {
		debitAmount: number;
		creditAmount: number;
		effect: "increase" | "decrease";
		impactDescription: string; // "Increases office expense, decreases cash"
	};

	// === BACKWARDS COMPATIBILITY ===
	raw?: {
		[key: string]: any; // Raw MoneyWorks detail fields
	};
}

export enum DetailPurpose {
	PRODUCT_SALE = "product_sale",
	SERVICE_CHARGE = "service_charge",
	TAX_CHARGE = "tax_charge",
	DISCOUNT_APPLIED = "discount_applied",
	FREIGHT_CHARGE = "freight_charge",
	EXPENSE_ALLOCATION = "expense_allocation",
	ASSET_PURCHASE = "asset_purchase",
	LIABILITY_PAYMENT = "liability_payment",
}

// ============================================================================
// NATURAL LANGUAGE QUERY INTERFACE
// ============================================================================

/** Natural language query types for MCP optimization */
export type BusinessQuery =
	| "unpaid customer invoices from last month"
	| "cash payments to suppliers containing office supplies"
	| "journal entries affecting cash accounts"
	| "overdue invoices over $1000"
	| "recurring transactions for rent payments"
	| "transactions awaiting approval"
	| "high-value purchases requiring review"
	| string; // Allow arbitrary natural language

/** Semantic query result with business context */
export interface SemanticQueryResult {
	transactions: SemanticTransaction[];
	businessInsights: {
		totalCount: number;
		totalValue: number;
		averageValue: number;
		patterns: BusinessPattern[];
		recommendations: string[];
	};
	query: {
		original: string; // Original natural language
		interpreted: string; // How we understood it
		filters: QueryFilter[]; // Applied filters
	};
}

export interface BusinessPattern {
	pattern: string; // "Monthly recurring supplier payments"
	frequency: number; // How often this pattern occurs
	significance: "high" | "medium" | "low";
	examples: string[]; // Example transactions
}

export interface QueryFilter {
	field: string; // "intent", "state", "party.type"
	operator: string; // "equals", "contains", "greater_than"
	value: any; // Filter value
	humanReadable: string; // "Customer transactions only"
}

// ============================================================================
// MCP-OPTIMIZED INTERFACES
// ============================================================================

/** MCP tool interface designed for natural language interaction */
export interface MoneyWorksSemanticMCP {
	// === NATURAL LANGUAGE QUERIES ===
	/** Find transactions using natural language */
	find_transactions(query: BusinessQuery): Promise<SemanticQueryResult>;

	/** Understand business intent from natural language */
	understand_business_request(request: string): Promise<BusinessIntent>;

	/** Execute a business workflow */
	execute_workflow(
		intent: BusinessIntent,
		context: any,
	): Promise<WorkflowResult>;

	// === BUSINESS INTELLIGENCE ===
	/** Analyze cash flow patterns */
	analyze_cash_flow(period: string, context?: any): Promise<CashFlowAnalysis>;

	/** Generate business insights */
	get_business_insights(query: BusinessQuery): Promise<BusinessInsight[]>;

	/** Check compliance status */
	check_compliance(transaction: SemanticTransaction): Promise<ComplianceReport>;

	// === CONVERSATIONAL HELPERS ===
	/** Explain a transaction in business terms */
	explain_transaction(id: number): Promise<string>;

	/** Suggest next actions for a business scenario */
	suggest_actions(scenario: BusinessScenario): Promise<ActionSuggestion[]>;

	/** Get contextual help for current situation */
	get_contextual_help(context: BusinessSituation): Promise<ContextualHelp>;
}

export interface WorkflowResult {
	success: boolean;
	result: any;
	nextSteps: string[];
	warnings: string[];
	errors: string[];
}

export interface CashFlowAnalysis {
	period: string;
	totalInflow: number;
	totalOutflow: number;
	netFlow: number;
	patterns: BusinessPattern[];
	projections: string[];
	recommendations: string[];
}

export interface BusinessInsight {
	insight: string; // "Supplier payments increasing 15% monthly"
	category: "trend" | "anomaly" | "opportunity" | "risk";
	confidence: number; // 0-1
	impact: "high" | "medium" | "low";
	actions: string[]; // Suggested actions
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

export interface BusinessScenario {
	intent: BusinessIntent;
	parties: string[]; // Party codes involved
	amounts: number[];
	context: string; // Additional context
}

export interface ActionSuggestion {
	action: string; // "Generate customer receipt"
	priority: "high" | "medium" | "low";
	reason: string; // Why this action is suggested
	steps: string[]; // How to execute
}

export interface BusinessSituation {
	currentTransaction?: SemanticTransaction;
	userIntent?: string;
	context?: string;
}

export interface ContextualHelp {
	help: string; // Contextual guidance
	relatedActions: string[]; // Available actions
	documentation: string[]; // Relevant docs
	examples: string[]; // Usage examples
}

// ============================================================================
// SEMANTIC UTILITY FUNCTIONS
// ============================================================================

/** Convert natural language to business intent */
export function parseBusinessIntent(naturalLanguage: string): BusinessIntent {
	const lower = naturalLanguage.toLowerCase();

	// Payment detection
	if (lower.includes("pay") || lower.includes("payment")) {
		if (lower.includes("supplier") || lower.includes("vendor")) {
			return BusinessIntent.SUPPLIER_PAYMENT;
		}
		if (lower.includes("employee") || lower.includes("expense")) {
			return BusinessIntent.EMPLOYEE_EXPENSE;
		}
	}

	// Receipt detection
	if (lower.includes("receipt") || lower.includes("receive")) {
		return BusinessIntent.CUSTOMER_RECEIPT;
	}

	// Invoice detection
	if (lower.includes("invoice") || lower.includes("bill")) {
		if (
			lower.includes("customer") ||
			lower.includes("client") ||
			lower.includes("unpaid")
		) {
			return BusinessIntent.CUSTOMER_BILLING;
		}
		if (lower.includes("supplier") || lower.includes("vendor")) {
			return BusinessIntent.SUPPLIER_INVOICING;
		}
	}

	// Order detection
	if (lower.includes("order")) {
		if (lower.includes("purchase") || lower.includes("buy")) {
			return BusinessIntent.PURCHASE_ORDER;
		}
		if (lower.includes("sales") || lower.includes("sell")) {
			return BusinessIntent.SALES_ORDER;
		}
	}

	// Default fallback - analyze context
	if (lower.includes("approval")) return BusinessIntent.CUSTOMER_BILLING;
	if (lower.includes("cash")) return BusinessIntent.CUSTOMER_RECEIPT;

	return BusinessIntent.CUSTOMER_RECEIPT; // Safe default
}

/** Generate human-readable business story */
export function generateBusinessStory(
	transaction: SemanticTransaction,
): string {
	const party = transaction.party.name;
	const amount = formatCurrency(transaction.amounts.gross);
	const intent = transaction.intent;

	switch (intent) {
		case BusinessIntent.SUPPLIER_PAYMENT:
			return `Payment of ${amount} made to ${party} for goods/services received`;
		case BusinessIntent.CUSTOMER_RECEIPT:
			return `Received ${amount} from ${party} for outstanding invoice`;
		case BusinessIntent.CUSTOMER_BILLING:
			return `Invoice of ${amount} sent to ${party} for goods/services provided`;
		default:
			return `${intent.replace("_", " ")} transaction with ${party} for ${amount}`;
	}
}

/** Get accounting effect in human terms */
export function getAccountingEffect(transaction: SemanticTransaction): string {
	const amount = formatCurrency(transaction.amounts.gross);

	switch (transaction.intent) {
		case BusinessIntent.SUPPLIER_PAYMENT:
			return `Decreases Cash ${amount}, Decreases Accounts Payable ${amount}`;
		case BusinessIntent.CUSTOMER_RECEIPT:
			return `Increases Cash ${amount}, Decreases Accounts Receivable ${amount}`;
		case BusinessIntent.CUSTOMER_BILLING:
			return `Increases Accounts Receivable ${amount}, Increases Revenue ${amount}`;
		default:
			return "Financial impact varies by transaction type";
	}
}

/** Determine transaction state from MoneyWorks data */
export function determineTransactionState(
	transaction: SemanticTransaction,
): TransactionState {
	if (!transaction.workflow.isPosted) return TransactionState.DRAFT;
	if (transaction.workflow.isOnHold) return TransactionState.ON_HOLD;

	// Invoice-specific states
	if (
		transaction.intent === BusinessIntent.CUSTOMER_BILLING ||
		transaction.intent === BusinessIntent.SUPPLIER_INVOICING
	) {
		if (transaction.amounts.outstanding <= 0) return TransactionState.PAID;
		if (transaction.amounts.outstanding < transaction.amounts.gross)
			return TransactionState.PARTIALLY_PAID;
		if (transaction.dates.due && new Date() > transaction.dates.due)
			return TransactionState.OVERDUE;
	}

	return TransactionState.POSTED;
}

/** Generate semantic tags for enhanced discovery */
export function generateSemanticTags(
	transaction: SemanticTransaction,
): SemanticTag[] {
	const tags: SemanticTag[] = [];

	// Amount-based tags
	if (transaction.amounts.gross > 10000) {
		tags.push({ category: "amount", tag: "high_value", confidence: 1.0 });
	}

	// Timing-based tags
	if (transaction.workflow.isRecurring) {
		tags.push({ category: "timing", tag: "recurring", confidence: 1.0 });
	}

	// Party-based tags
	if (transaction.party.type === MoneyWorksEntityType.CUSTOMER) {
		tags.push({
			category: "party",
			tag: "customer_transaction",
			confidence: 1.0,
		});
	}

	// Process-based tags
	if (transaction.intent === BusinessIntent.SUPPLIER_PAYMENT) {
		tags.push({ category: "process", tag: "cash_outflow", confidence: 1.0 });
	}

	return tags;
}

/** Format currency for display */
function formatCurrency(amount: number, currency = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
	}).format(amount);
}

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/** Convert legacy Transaction to SemanticTransaction */
export function upgradeToSemantic(legacy: any): SemanticTransaction {
	// Determine business intent from transaction type and description
	const intent = determineBusinessIntentFromType(
		legacy.Type,
		legacy.Description || "",
	);

	// Determine party type from transaction type
	const partyType = determinePartyType(legacy.Type);

	return {
		sequenceNumber: legacy.SequenceNumber,
		ourReference: legacy.OurRef || "",
		theirReference: legacy.TheirRef || "",

		intent: intent,
		state:
			legacy.Status === "P" ? TransactionState.POSTED : TransactionState.DRAFT,
		type: legacy.Type as SemanticTransactionType,

		party: {
			code: legacy.NameCode || "",
			name: legacy.NameCode || "", // Would need lookup
			type: partyType,
			relationship: "",
		},

		businessContext: {
			process: { name: "", stage: "", nextSteps: [], owner: "" },
			accountingImpact: [],
			applicableRules: [],
			complianceRequirements: [],
			relatedDocuments: [],
		},

		businessStory: legacy.Description || "",
		semanticTags: [],

		amounts: {
			gross: legacy.Gross || 0,
			tax: legacy.TaxAmount || 0,
			net: (legacy.Gross || 0) - (legacy.TaxAmount || 0),
			outstanding: (legacy.Gross || 0) - (legacy.AmtPaid || 0),
		},

		currency: {
			code: legacy.Currency || "USD",
			exchangeRate: legacy.ExchangeRate || 1,
			isBaseCurrency: !legacy.Currency || legacy.Currency === "USD",
		},

		dates: {
			transaction: new Date(legacy.TransDate),
			entry: new Date(legacy.EnterDate),
			due: legacy.DueDate ? new Date(legacy.DueDate) : undefined,
			paid: legacy.DatePaid ? new Date(legacy.DatePaid) : undefined,
		},

		period: {
			number: legacy.Period || 0,
			name: "", // Would need calculation
			year: Math.floor((legacy.Period || 0) / 100),
			month: (legacy.Period || 0) % 100,
		},

		description: legacy.Description || "",
		analysis: legacy.Analysis || "",
		department: legacy.Dept || undefined,
		salesperson: legacy.Salesperson || undefined,

		workflow: {
			isPosted: legacy.Status === "P",
			isOnHold: legacy.Hold || false,
			isRecurring: legacy.Recurring || false,
			approvals: [],
		},

		audit: {
			enteredBy: legacy.EnteredBy || "",
			postedBy: legacy.PostedBy || undefined,
			lastModified: new Date(legacy.LastModifiedTime || Date.now()),
			version: 1,
		},

		raw: legacy, // Preserve original data
	};
}

/** Generate business context from transaction data */
export function enrichBusinessContext(
	transaction: SemanticTransaction,
): BusinessContext {
	// This would integrate with MoneyWorks business rules engine
	// For now, return basic structure
	return {
		process: {
			name: `${transaction.intent} Process`,
			stage: transaction.state,
			nextSteps: [],
			owner: "Finance Department",
		},
		accountingImpact: [
			{
				account: "Various",
				effect: "increase",
				amount: transaction.amounts.gross,
				reason: getAccountingEffect(transaction),
			},
		],
		applicableRules: [],
		complianceRequirements: [],
		relatedDocuments: [],
	};
}

/** Determine business intent from MoneyWorks transaction type */
export function determineBusinessIntentFromType(
	type: string,
	description: string,
): BusinessIntent {
	switch (type) {
		case "CP":
		case "CPC":
			return BusinessIntent.SUPPLIER_PAYMENT;
		case "CR":
		case "CRD":
			return BusinessIntent.CUSTOMER_RECEIPT;
		case "DI":
		case "DIC":
			return BusinessIntent.CUSTOMER_BILLING;
		case "CI":
		case "CIC":
			return BusinessIntent.SUPPLIER_INVOICING;
		case "PO":
		case "POC":
		case "POI":
			return BusinessIntent.PURCHASE_ORDER;
		case "SO":
		case "SOC":
		case "SOI":
			return BusinessIntent.SALES_ORDER;
		case "QU":
			return BusinessIntent.QUOTE_GENERATION;
		case "JN":
			// For journals, try to parse from description
			return parseBusinessIntent(description);
		case "JNS":
			return BusinessIntent.INVENTORY_ADJUSTMENT;
		default:
			return parseBusinessIntent(description);
	}
}

/** Determine party type from MoneyWorks transaction type */
export function determinePartyType(type: string): MoneyWorksEntityType {
	switch (type) {
		case "CP":
		case "CPC":
		case "CI":
		case "CIC":
		case "PO":
		case "POC":
		case "POI":
			return MoneyWorksEntityType.SUPPLIER;
		case "CR":
		case "CRD":
		case "DI":
		case "DIC":
		case "SO":
		case "SOC":
		case "SOI":
		case "QU":
			return MoneyWorksEntityType.CUSTOMER;
		case "JN":
		case "JNS":
			return MoneyWorksEntityType.INTERNAL;
		default:
			return MoneyWorksEntityType.CUSTOMER; // Safe default
	}
}

export default SemanticTransaction;
