import { z } from "zod";
import { SchemaService } from "../services/schema.service";
import type { TicketService } from "../services/ticket-service";

const schemaService = new SchemaService();
let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializeValidationRulesTools(ticketSvc: TicketService) {
	ticketService = ticketSvc;
}

// Helper function for error tracking
async function trackError(error: unknown, toolName: string, args: unknown) {
	if (!ticketService) return;

	try {
		await ticketService.createTicket({
			type: "bug",
			severity: "medium",
			status: "open",
			user_prompt: `Tool ${toolName} failed with args: ${JSON.stringify(args)}`,
			ai_attempted_action: `Execute ${toolName}`,
			mcp_tool_used: toolName,
			error_message: error instanceof Error ? error.message : String(error),
			error_stack: error instanceof Error ? error.stack : undefined,
			session_id: process.env.SESSION_ID,
		});
	} catch (trackingError) {
		console.error("Failed to track error:", trackingError);
	}
}

// Validation rule interfaces
interface ValidationRule {
	type:
		| "required"
		| "maxLength"
		| "minLength"
		| "minimum"
		| "maximum"
		| "pattern"
		| "enum"
		| "format"
		| "custom";
	constraint: any;
	message: string;
	severity: "error" | "warning";
	enforced: boolean;
}

interface FieldValidation {
	tableName: string;
	fieldName: string;
	fieldType: string;
	nullable: boolean;
	rules: ValidationRule[];
	businessRules: Array<{
		description: string;
		condition: string;
		action: string;
	}>;
	examples: {
		valid: string[];
		invalid: string[];
	};
}

// Get validation rules for a specific field
const getValidationRulesInputSchema = z.object({
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
});

export const getValidationRulesTool = {
	description:
		"Get comprehensive validation rules for a specific field in a MoneyWorks table",
	inputSchema: getValidationRulesInputSchema,

	async execute(args: z.infer<typeof getValidationRulesInputSchema>) {
		try {
			const validation = await getFieldValidationRules(
				args.tableName,
				args.fieldName,
				args.includeBusinessRules,
				args.includeExamples,
			);

			// Calculate validation complexity score
			const complexityScore = calculateValidationComplexity(validation.rules);

			return {
				validation: validation,
				summary: {
					totalRules: validation.rules.length,
					requiredField: !validation.nullable,
					complexityScore: complexityScore,
					enforcedRules: validation.rules.filter((r) => r.enforced).length,
					warningRules: validation.rules.filter((r) => r.severity === "warning")
						.length,
					errorRules: validation.rules.filter((r) => r.severity === "error")
						.length,
				},
				recommendations: generateValidationRecommendations(validation),
			};
		} catch (error) {
			await trackError(error, "getValidationRules", args);
			throw error;
		}
	},
};

// Get validation rules for all fields in a table
const getTableValidationRulesInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	includeBusinessRules: z
		.boolean()
		.default(false)
		.describe("Include business logic rules"),
	severity: z
		.enum(["all", "error", "warning"])
		.default("all")
		.describe("Filter by severity level"),
});

export const getTableValidationRulesTool = {
	description: "Get validation rules for all fields in a MoneyWorks table",
	inputSchema: getTableValidationRulesInputSchema,

	async execute(args: z.infer<typeof getTableValidationRulesInputSchema>) {
		try {
			const tableSchema = await schemaService.getTableSchema(args.tableName);
			const validations: Record<string, FieldValidation> = {};

			for (const field of tableSchema.fields) {
				const validation = await getFieldValidationRules(
					args.tableName,
					field.name,
					args.includeBusinessRules,
					false,
				);

				// Filter by severity if specified
				if (args.severity !== "all") {
					validation.rules = validation.rules.filter(
						(r) => r.severity === args.severity,
					);
				}

				validations[field.name] = validation;
			}

			// Generate table-level statistics
			const stats = generateTableValidationStats(validations);

			return {
				tableName: args.tableName,
				fieldValidations: validations,
				statistics: stats,
				summary: {
					totalFields: Object.keys(validations).length,
					requiredFields: Object.values(validations).filter((v) => !v.nullable)
						.length,
					fieldsWithRules: Object.values(validations).filter(
						(v) => v.rules.length > 0,
					).length,
					totalRules: Object.values(validations).reduce(
						(sum, v) => sum + v.rules.length,
						0,
					),
				},
			};
		} catch (error) {
			await trackError(error, "getTableValidationRules", args);
			throw error;
		}
	},
};

// Get business rules for a table
const getBusinessRulesInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	category: z
		.enum(["all", "integrity", "business", "formatting", "security"])
		.default("all")
		.describe("Filter by rule category"),
});

export const getBusinessRulesTool = {
	description:
		"Get business rules and constraints that apply to a MoneyWorks table",
	inputSchema: getBusinessRulesInputSchema,

	async execute(args: z.infer<typeof getBusinessRulesInputSchema>) {
		try {
			const businessRules = getTableBusinessRules(
				args.tableName,
				args.category,
			);

			// Group rules by category
			const byCategory = groupRulesByCategory(businessRules);

			return {
				tableName: args.tableName,
				rules: businessRules,
				byCategory: byCategory,
				summary: {
					totalRules: businessRules.length,
					categories: Object.keys(byCategory),
					critical: businessRules.filter((r) => r.severity === "critical")
						.length,
					moderate: businessRules.filter((r) => r.severity === "moderate")
						.length,
					low: businessRules.filter((r) => r.severity === "low").length,
				},
				compliance: {
					accounting: businessRules.filter((r) => r.domain === "accounting")
						.length,
					regulatory: businessRules.filter((r) => r.domain === "regulatory")
						.length,
					operational: businessRules.filter((r) => r.domain === "operational")
						.length,
				},
			};
		} catch (error) {
			await trackError(error, "getBusinessRules", args);
			throw error;
		}
	},
};

// Helper function to get field validation rules
async function getFieldValidationRules(
	tableName: string,
	fieldName: string,
	includeBusinessRules: boolean,
	includeExamples: boolean,
): Promise<FieldValidation> {
	const tableSchema = await schemaService.getTableSchema(tableName);
	const field = tableSchema.fields.find(
		(f) => f.name.toLowerCase() === fieldName.toLowerCase(),
	);

	if (!field) {
		throw new Error(`Field '${fieldName}' not found in table '${tableName}'`);
	}

	const rules: ValidationRule[] = [];

	// Required field validation
	if (field.required) {
		rules.push({
			type: "required",
			constraint: true,
			message: `${fieldName} is required and cannot be empty`,
			severity: "error",
			enforced: true,
		});
	}

	// String length validations
	if (field.type === "string" && field.maxLength) {
		rules.push({
			type: "maxLength",
			constraint: field.maxLength,
			message: `${fieldName} cannot exceed ${field.maxLength} characters`,
			severity: "error",
			enforced: true,
		});
	}

	// Numeric range validations
	if (
		(field.type === "number" || field.type === "integer") &&
		field.minimum !== undefined
	) {
		rules.push({
			type: "minimum",
			constraint: field.minimum,
			message: `${fieldName} must be at least ${field.minimum}`,
			severity: "error",
			enforced: true,
		});
	}

	if (
		(field.type === "number" || field.type === "integer") &&
		field.maximum !== undefined
	) {
		rules.push({
			type: "maximum",
			constraint: field.maximum,
			message: `${fieldName} cannot exceed ${field.maximum}`,
			severity: "error",
			enforced: true,
		});
	}

	// Enum validations
	if (field.enum && field.enum.length > 0) {
		rules.push({
			type: "enum",
			constraint: field.enum,
			message: `${fieldName} must be one of: ${field.enum.join(", ")}`,
			severity: "error",
			enforced: true,
		});
	}

	// Add field-specific validations
	rules.push(...getFieldSpecificValidations(tableName, fieldName, field));

	const validation: FieldValidation = {
		tableName: tableName,
		fieldName: fieldName,
		fieldType: field.type,
		nullable: field.nullable,
		rules: rules,
		businessRules: includeBusinessRules
			? getFieldBusinessRules(tableName, fieldName)
			: [],
		examples: includeExamples
			? generateValidationExamples(tableName, fieldName, field, rules)
			: { valid: [], invalid: [] },
	};

	return validation;
}

// Get field-specific validation rules
function getFieldSpecificValidations(
	tableName: string,
	fieldName: string,
	field: any,
): ValidationRule[] {
	const rules: ValidationRule[] = [];

	// Account-specific validations
	if (tableName.toLowerCase() === "account") {
		if (fieldName === "Code") {
			rules.push({
				type: "pattern",
				constraint: "^[0-9A-Za-z-]+$",
				message: "Account code can only contain letters, numbers, and hyphens",
				severity: "error",
				enforced: true,
			});
		} else if (fieldName === "Type") {
			rules.push({
				type: "enum",
				constraint: ["A", "L", "I", "E", "P"],
				message:
					"Account type must be A (Asset), L (Liability), I (Income), E (Expense), or P (Equity)",
				severity: "error",
				enforced: true,
			});
		}
	}

	// Name-specific validations
	if (tableName.toLowerCase() === "name") {
		if (fieldName === "Code") {
			rules.push({
				type: "pattern",
				constraint: "^[A-Za-z0-9_-]+$",
				message: "Name code should be alphanumeric with underscores or hyphens",
				severity: "warning",
				enforced: false,
			});
		}
	}

	// Date field validations
	if (fieldName.toLowerCase().includes("date")) {
		rules.push({
			type: "format",
			constraint: "date",
			message: `${fieldName} must be a valid date`,
			severity: "error",
			enforced: true,
		});

		if (fieldName.toLowerCase().includes("future")) {
			rules.push({
				type: "custom",
				constraint: "date >= today",
				message: `${fieldName} cannot be in the past`,
				severity: "error",
				enforced: true,
			});
		}
	}

	// Amount/currency field validations
	if (
		fieldName.toLowerCase().includes("amount") ||
		fieldName.toLowerCase().includes("total")
	) {
		rules.push({
			type: "minimum",
			constraint: -999999999,
			message: `${fieldName} is outside reasonable range`,
			severity: "warning",
			enforced: false,
		});

		rules.push({
			type: "maximum",
			constraint: 999999999,
			message: `${fieldName} is outside reasonable range`,
			severity: "warning",
			enforced: false,
		});
	}

	return rules;
}

// Get business rules for a field
function getFieldBusinessRules(
	tableName: string,
	fieldName: string,
): Array<{
	description: string;
	condition: string;
	action: string;
}> {
	const rules: Array<{
		description: string;
		condition: string;
		action: string;
	}> = [];

	// Common business rules by table and field
	if (tableName.toLowerCase() === "transaction" && fieldName === "Amount") {
		rules.push({
			description: "Balance validation for journal entries",
			condition: "SUM(Amount) WHERE Type = 'Journal'",
			action: "Must equal zero for each journal entry",
		});
	}

	if (tableName.toLowerCase() === "account" && fieldName === "Type") {
		rules.push({
			description: "Account hierarchy validation",
			condition: "Type changes",
			action: "Must not have child accounts with transactions",
		});
	}

	if (fieldName.toLowerCase().includes("code")) {
		rules.push({
			description: "Unique code constraint",
			condition: "Code already exists",
			action: "Must use a different code value",
		});
	}

	return rules;
}

// Generate validation examples
function generateValidationExamples(
	tableName: string,
	fieldName: string,
	field: any,
	rules: ValidationRule[],
): {
	valid: string[];
	invalid: string[];
} {
	const valid: string[] = [];
	const invalid: string[] = [];

	// Generate examples based on field type and rules
	if (field.type === "string") {
		if (field.maxLength) {
			valid.push(`"Sample text (${Math.min(10, field.maxLength)} chars)"`);
			if (field.maxLength > 5) {
				invalid.push(
					`"Text that is too long and exceeds the ${field.maxLength} character limit by being unnecessarily verbose"`,
				);
			}
		}

		if (field.enum) {
			valid.push(`"${field.enum[0]}" (from allowed values)`);
			invalid.push('"INVALID" (not in allowed values)');
		}
	}

	if (field.type === "number" || field.type === "integer") {
		if (field.minimum !== undefined && field.maximum !== undefined) {
			const mid = Math.floor((field.minimum + field.maximum) / 2);
			valid.push(`${mid} (within range)`);
			invalid.push(`${field.minimum - 1} (below minimum)`);
			invalid.push(`${field.maximum + 1} (above maximum)`);
		}
	}

	// Field-specific examples
	if (tableName.toLowerCase() === "account" && fieldName === "Code") {
		valid.push('"1100", "2000-01", "CASH"');
		invalid.push('"1 100" (contains space)', '"@#$%" (invalid characters)');
	}

	if (fieldName.toLowerCase().includes("date")) {
		valid.push('"2025-05-31", "31/05/2025"');
		invalid.push('"32/05/2025" (invalid date)', '"not-a-date" (wrong format)');
	}

	return { valid, invalid };
}

// Calculate validation complexity score
function calculateValidationComplexity(rules: ValidationRule[]): number {
	let score = 0;

	for (const rule of rules) {
		switch (rule.type) {
			case "required":
				score += 1;
				break;
			case "maxLength":
			case "minLength":
			case "minimum":
			case "maximum":
				score += 2;
				break;
			case "pattern":
			case "format":
				score += 3;
				break;
			case "enum":
				score += 2;
				break;
			case "custom":
				score += 5;
				break;
		}

		if (rule.severity === "error") score += 1;
		if (rule.enforced) score += 1;
	}

	return Math.min(score, 10); // Cap at 10
}

// Generate validation recommendations
function generateValidationRecommendations(
	validation: FieldValidation,
): string[] {
	const recommendations: string[] = [];

	if (validation.rules.length === 0) {
		recommendations.push(
			"Consider adding validation rules to ensure data quality",
		);
	}

	const hasRequiredRule = validation.rules.some((r) => r.type === "required");
	if (!hasRequiredRule && !validation.nullable) {
		recommendations.push(
			"Field appears to be required but lacks explicit validation",
		);
	}

	const customRules = validation.rules.filter((r) => r.type === "custom");
	if (customRules.length > 2) {
		recommendations.push("High number of custom rules may impact performance");
	}

	const warningRules = validation.rules.filter(
		(r) => r.severity === "warning" && !r.enforced,
	);
	if (warningRules.length > 0) {
		recommendations.push(
			"Consider enforcing warning-level rules for better data quality",
		);
	}

	if (
		validation.fieldType === "string" &&
		!validation.rules.some((r) => r.type === "maxLength")
	) {
		recommendations.push(
			"Consider adding maximum length constraint for string fields",
		);
	}

	return recommendations;
}

// Get table business rules
function getTableBusinessRules(
	tableName: string,
	category: string,
): Array<{
	id: string;
	description: string;
	category: string;
	severity: "critical" | "moderate" | "low";
	domain: "accounting" | "regulatory" | "operational";
	condition: string;
	action: string;
	enforced: boolean;
}> {
	const rules: Array<{
		id: string;
		description: string;
		category: string;
		severity: "critical" | "moderate" | "low";
		domain: "accounting" | "regulatory" | "operational";
		condition: string;
		action: string;
		enforced: boolean;
	}> = [];

	// Add table-specific business rules
	if (tableName.toLowerCase() === "transaction") {
		rules.push(
			{
				id: "TXN_BALANCE",
				description: "Journal entries must balance",
				category: "integrity",
				severity: "critical",
				domain: "accounting",
				condition: "Transaction type is Journal",
				action: "Sum of all transaction amounts must equal zero",
				enforced: true,
			},
			{
				id: "TXN_DATE_VALID",
				description: "Transaction date must be within fiscal period",
				category: "business",
				severity: "moderate",
				domain: "accounting",
				condition: "Transaction date is set",
				action: "Date must fall within open accounting period",
				enforced: true,
			},
		);
	}

	if (tableName.toLowerCase() === "account") {
		rules.push(
			{
				id: "ACC_UNIQUE_CODE",
				description: "Account codes must be unique",
				category: "integrity",
				severity: "critical",
				domain: "operational",
				condition: "New account is created",
				action: "Verify code is not already in use",
				enforced: true,
			},
			{
				id: "ACC_TYPE_CONSISTENCY",
				description: "Account type determines behavior",
				category: "business",
				severity: "moderate",
				domain: "accounting",
				condition: "Account type is modified",
				action: "Ensure transactions comply with account type rules",
				enforced: true,
			},
		);
	}

	// Filter by category if specified
	if (category !== "all") {
		return rules.filter((r) => r.category === category);
	}

	return rules;
}

// Group rules by category
function groupRulesByCategory(rules: Array<any>): Record<string, Array<any>> {
	const grouped: Record<string, Array<any>> = {};

	for (const rule of rules) {
		if (!grouped[rule.category]) {
			grouped[rule.category] = [];
		}
		grouped[rule.category].push(rule);
	}

	return grouped;
}

// Generate table validation statistics
function generateTableValidationStats(
	validations: Record<string, FieldValidation>,
): {
	complexity: { low: number; medium: number; high: number };
	coverage: { validated: number; unvalidated: number; percentage: number };
	rules: { total: number; byType: Record<string, number> };
} {
	const fields = Object.values(validations);

	// Complexity distribution
	const complexity = { low: 0, medium: 0, high: 0 };

	for (const field of fields) {
		const score = calculateValidationComplexity(field.rules);
		if (score <= 3) complexity.low++;
		else if (score <= 6) complexity.medium++;
		else complexity.high++;
	}

	// Coverage statistics
	const validated = fields.filter((f) => f.rules.length > 0).length;
	const coverage = {
		validated: validated,
		unvalidated: fields.length - validated,
		percentage: Math.round((validated / fields.length) * 100),
	};

	// Rule type distribution
	const ruleTypes: Record<string, number> = {};
	let totalRules = 0;

	for (const field of fields) {
		totalRules += field.rules.length;
		for (const rule of field.rules) {
			ruleTypes[rule.type] = (ruleTypes[rule.type] || 0) + 1;
		}
	}

	return {
		complexity,
		coverage,
		rules: { total: totalRules, byType: ruleTypes },
	};
}
