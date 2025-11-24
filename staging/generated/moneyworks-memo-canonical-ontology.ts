/**
 * MoneyWorks Memo Entity - Canonical Ontology
 *
 * PURE MoneyWorks canonical definitions extracted from official manual
 * Source: moneyworks_appendix_memo_file.html
 * Authority: MoneyWorks Manual - Memo File Field Descriptions
 *
 * CRITICAL DISCOVERY: MoneyWorks Memo entity provides structured note-taking
 * and reminder functionality that extends the Names entity contact management.
 * This is a subfile relationship where memos belong to specific Names.
 *
 * ARCHITECTURAL INSIGHT:
 * - Memo records are linked to Names via NameSeq (sequence number reference)
 * - Supports both documentation (memo text) and time-based reminders (recall date)
 * - Creates an audit trail with last modified tracking
 * - Simple but effective CRM functionality for customer/supplier relationship management
 */

// ============================================================================
// CANONICAL MONEYWORKS MEMO FIELD DEFINITIONS
// ============================================================================

/**
 * Core MoneyWorks memo fields as defined in manual
 * Source: moneyworks_appendix_memo_file.html - Memo table
 */
export const MONEYWORKS_MEMO_FIELDS = [
	{
		fieldName: "LastModifiedTime",
		dataType: "S" as const,
		canonicalDescription:
			"The date and time that this record was last changed.",
		manualSource: "moneyworks_appendix_memo_file.html",
		isRequired: false,
		isSystemManaged: true,
	},
	{
		fieldName: "NameSeq",
		dataType: "N" as const,
		canonicalDescription:
			"The sequence number of the Name record to which the memo belongs",
		manualSource: "moneyworks_appendix_memo_file.html",
		isRequired: true,
		isIndexed: true,
		relationshipTarget: "Names",
		relationshipRule:
			"Must reference valid Names.Seq (primary key of Names entity)",
	},
	{
		fieldName: "Date",
		dataType: "D" as const,
		canonicalDescription: "Date of memo",
		manualSource: "moneyworks_appendix_memo_file.html",
		isRequired: true,
	},
	{
		fieldName: "RecallDate",
		dataType: "D" as const,
		canonicalDescription: "Date of reminder",
		manualSource: "moneyworks_appendix_memo_file.html",
		isRequired: false,
	},
	{
		fieldName: "Text",
		dataType: "T" as const,
		maxLength: 255,
		canonicalDescription: "The memo text",
		manualSource: "moneyworks_appendix_memo_file.html",
		isRequired: true,
	},
] as const;

// ============================================================================
// CANONICAL MONEYWORKS MEMO TERMINOLOGY CLARIFICATION
// ============================================================================

/**
 * CRITICAL ARCHITECTURAL INSIGHT:
 *
 * MoneyWorks Memo entity reveals sophisticated contact relationship management:
 *
 * SUBFILE RELATIONSHIP ARCHITECTURE:
 * - Memos are NOT standalone entities but subfiles of Names
 * - Each memo MUST reference a Names record via NameSeq
 * - Creates one-to-many relationship: One Name can have multiple memos
 * - Internal name "Memo" distinguishes from other memo fields in system
 *
 * MEMO vs NAMES MEMO FIELDS:
 * - Names entity has built-in Memo/Memo2 fields (255 chars each)
 * - Memo entity provides unlimited memo records per Name
 * - Dual-layer memo architecture similar to Names/Contacts pattern
 *
 * CRM FUNCTIONALITY:
 * - Date: When memo was created/relevant
 * - RecallDate: Future reminder/follow-up date
 * - Text: 255 character memo content
 * - LastModifiedTime: Audit trail for memo changes
 *
 * BUSINESS APPLICATIONS:
 * - Customer interaction history
 * - Supplier communication notes
 * - Follow-up reminders and tasks
 * - Relationship management documentation
 * - Sales and support activity tracking
 */

export const MONEYWORKS_MEMO_CANONICAL_TERMS = {
	// Entity identification (MoneyWorks canonical)
	MEMO_RECORD: "Memo Record", // Individual memo entry
	MEMO_FILE: "Memo File", // Internal file name
	NAME_SEQUENCE: "Name Sequence", // Reference to parent Names record

	// Temporal management (MoneyWorks canonical)
	MEMO_DATE: "Memo Date", // When memo was created/relevant
	RECALL_DATE: "Recall Date", // Reminder/follow-up date
	LAST_MODIFIED: "Last Modified Time", // Audit trail timestamp

	// Content management (MoneyWorks canonical)
	MEMO_TEXT: "Memo Text", // Content of memo (255 chars)

	// Relationship management (MoneyWorks canonical)
	PARENT_NAME: "Parent Name", // Names entity that owns memo
	MEMO_ATTACHMENT: "Memo Attachment", // Memo belongs to specific Name

	// CRM functionality (MoneyWorks canonical)
	CUSTOMER_NOTE: "Customer Note", // Memo for customer/debtor
	SUPPLIER_NOTE: "Supplier Note", // Memo for supplier/creditor
	FOLLOW_UP_REMINDER: "Follow-up Reminder", // Recall date functionality
	INTERACTION_HISTORY: "Interaction History", // Collection of memos per Name

	// Audit and tracking (MoneyWorks canonical)
	MEMO_TRAIL: "Memo Trail", // Historical record of communications
	CHANGE_TRACKING: "Change Tracking", // LastModifiedTime functionality
	RELATIONSHIP_DOCUMENTATION: "Relationship Documentation", // Business purpose
} as const;

// ============================================================================
// CANONICAL VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate canonical MoneyWorks memo date logic
 */
export function validateMemoDateCanonical(
	memoDate: Date,
	recallDate?: Date,
): {
	isValid: boolean;
	warnings: string[];
	businessInsights: string[];
} {
	const warnings: string[] = [];
	const businessInsights: string[] = [];

	// Validate memo date
	if (!memoDate) {
		warnings.push("Memo Date is required for all memo records");
	}

	// Validate recall date logic
	if (recallDate) {
		if (recallDate < memoDate) {
			warnings.push("Recall Date cannot be before Memo Date");
		}

		const daysDifference = Math.ceil(
			(recallDate.getTime() - memoDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		if (daysDifference === 0) {
			businessInsights.push(
				"Same-day recall suggests immediate follow-up required",
			);
		} else if (daysDifference > 365) {
			businessInsights.push(
				"Recall date more than 1 year in future - confirm intentional long-term reminder",
			);
		}
	}

	return {
		isValid: warnings.length === 0,
		warnings,
		businessInsights,
	};
}

/**
 * Validate canonical MoneyWorks memo text content
 */
export function validateMemoTextCanonical(text: string): {
	isValid: boolean;
	warnings: string[];
	optimization: string[];
} {
	const warnings: string[] = [];
	const optimization: string[] = [];

	if (!text || text.trim().length === 0) {
		warnings.push("Memo Text is required for all memo records");
	} else if (text.length > 255) {
		warnings.push(
			`Memo Text exceeds maximum length of 255 characters (current: ${text.length})`,
		);
	}

	// Business optimization suggestions
	if (text && text.length > 200) {
		optimization.push(
			"Consider breaking long memos into multiple records for better readability",
		);
	}

	if (text?.includes("TODO") || text.includes("FOLLOW UP")) {
		optimization.push("Consider setting RecallDate for actionable memo items");
	}

	return {
		isValid: warnings.length === 0,
		warnings,
		optimization,
	};
}

/**
 * Validate canonical MoneyWorks memo relationship to Names
 */
export function validateMemoNameRelationshipCanonical(nameSeq: number): {
	isValid: boolean;
	warnings: string[];
	requirement: string;
} {
	const warnings: string[] = [];

	if (!nameSeq || nameSeq <= 0) {
		warnings.push("NameSeq is required and must be positive integer");
	}

	return {
		isValid: warnings.length === 0,
		warnings,
		requirement:
			"NameSeq must reference valid Names.Seq (sequence number of existing Name record)",
	};
}

/**
 * Get canonical memo entity relationships for validation
 */
export function getCanonicalMemoEntityRelationships(): {
	requiredReferences: string[];
	optionalReferences: string[];
	businessRules: string[];
} {
	return {
		requiredReferences: ["Names.Seq (NameSeq field - parent Name record)"],
		optionalReferences: [],
		businessRules: [
			"Each memo must belong to exactly one Name record",
			"Names can have multiple memo records (one-to-many relationship)",
			"Memo entity complements Names.Memo/Memo2 built-in fields",
			"RecallDate provides reminder/follow-up functionality",
			"Text field limited to 255 characters for consistent display",
			"LastModifiedTime provides audit trail for memo changes",
			"Memo records should have meaningful Date and Text content",
			"Subfile relationship means memos cannot exist without parent Name",
		],
	};
}

/**
 * Generate canonical memo business context explanation
 */
export function getCanonicalMemoBusinessContext(): {
	purpose: string;
	useCases: string[];
	integration: string[];
	limitations: string[];
} {
	return {
		purpose:
			"MoneyWorks Memo entity provides unlimited note-taking and reminder functionality for Name records, supporting comprehensive customer relationship management",

		useCases: [
			"Customer interaction history and communication logs",
			"Supplier relationship notes and contact details",
			"Follow-up reminders and task management via RecallDate",
			"Sales activity tracking and opportunity notes",
			"Support case documentation and resolution history",
			"Contract negotiation notes and terms discussion",
			"Payment history observations and credit decisions",
			"Relationship milestones and important dates",
		],

		integration: [
			"Extends Names entity contact management capabilities",
			"Complements Names.Memo/Memo2 built-in fields for simple cases",
			"Supports CRM functionality within MoneyWorks ecosystem",
			"Integrates with Names CustomerType/SupplierType classifications",
			"Provides audit trail through LastModifiedTime tracking",
			"Enables time-based workflow through RecallDate functionality",
		],

		limitations: [
			"Text limited to 255 characters per memo record",
			"No direct categorization or tagging system",
			"Must create multiple records for longer documentation",
			"Recall functionality requires external reminder system",
			"No built-in memo templates or standardization",
			"Limited formatting options for text content",
		],
	};
}

/**
 * Check if memo has reminder functionality
 */
export function hasMemoReminder(recallDate?: Date): boolean {
	return !!recallDate && recallDate > new Date();
}

/**
 * Check if memo is overdue for recall
 */
export function isMemoOverdue(recallDate?: Date): boolean {
	return !!recallDate && recallDate < new Date();
}

/**
 * Get memo age in days
 */
export function getMemoAgeInDays(memoDate: Date): number {
	const currentDate = new Date();
	const timeDifference = currentDate.getTime() - memoDate.getTime();
	return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}

export default {
	MONEYWORKS_MEMO_FIELDS,
	MONEYWORKS_MEMO_CANONICAL_TERMS,
};
