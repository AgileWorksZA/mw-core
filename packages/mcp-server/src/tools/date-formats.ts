import { z } from "zod";
import { SchemaService } from "../services/schema.service";
import type { TicketService } from "../services/ticket-service";

const schemaService = new SchemaService();
let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializeDateFormatsTools(ticketSvc: TicketService) {
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

// Date format interfaces
interface DateFormat {
	format: string;
	pattern: string;
	description: string;
	examples: string[];
	locale: string;
	type: "date" | "datetime" | "time";
	usage: "input" | "output" | "both";
}

interface DateFieldInfo {
	tableName: string;
	fieldName: string;
	fieldType: string;
	formats: DateFormat[];
	constraints: {
		required: boolean;
		nullable: boolean;
		minDate?: string;
		maxDate?: string;
		businessDays?: boolean;
		futureOnly?: boolean;
		pastOnly?: boolean;
	};
	businessRules: Array<{
		rule: string;
		description: string;
		example: string;
	}>;
}

// Get date formats for a specific field
const getDateFormatsInputSchema = z.object({
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
});

export const getDateFormatsTool = {
	description:
		"Get date format information for a specific date field in a MoneyWorks table",
	inputSchema: getDateFormatsInputSchema,

	async execute(args: z.infer<typeof getDateFormatsInputSchema>) {
		try {
			const dateFieldInfo = await getDateFieldInformation(
				args.tableName,
				args.fieldName,
				args.locale,
				args.includeExamples,
			);

			// Generate format validation patterns
			const validation = generateDateValidationPatterns(dateFieldInfo);

			// Create usage guidance
			const guidance = generateDateUsageGuidance(dateFieldInfo);

			return {
				fieldInfo: dateFieldInfo,
				validation: validation,
				guidance: guidance,
				recommendations: generateDateRecommendations(dateFieldInfo),
			};
		} catch (error) {
			await trackError(error, "getDateFormats", args);
			throw error;
		}
	},
};

// Get all date fields in a table
const getTableDateFieldsInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	locale: z.string().default("en-US").describe("Locale for date formatting"),
	includeTime: z
		.boolean()
		.default(true)
		.describe("Include datetime and time fields"),
});

export const getTableDateFieldsTool = {
	description:
		"Get all date/time fields in a MoneyWorks table and their format information",
	inputSchema: getTableDateFieldsInputSchema,

	async execute(args: z.infer<typeof getTableDateFieldsInputSchema>) {
		try {
			const tableSchema = await schemaService.getTableSchema(args.tableName);
			const dateFields: Record<string, DateFieldInfo> = {};

			// Find all date/time fields
			for (const field of tableSchema.fields) {
				if (isDateField(field)) {
					const dateFieldInfo = await getDateFieldInformation(
						args.tableName,
						field.name,
						args.locale,
						true,
					);

					if (args.includeTime || !dateFieldInfo.fieldType.includes("time")) {
						dateFields[field.name] = dateFieldInfo;
					}
				}
			}

			// Generate table-level date statistics
			const statistics = generateTableDateStatistics(dateFields);

			return {
				tableName: args.tableName,
				dateFields: dateFields,
				statistics: statistics,
				summary: {
					totalFields: Object.keys(dateFields).length,
					dateOnly: Object.values(dateFields).filter(
						(f) => f.fieldType === "date",
					).length,
					dateTime: Object.values(dateFields).filter(
						(f) => f.fieldType === "datetime",
					).length,
					timeOnly: Object.values(dateFields).filter(
						(f) => f.fieldType === "time",
					).length,
					required: Object.values(dateFields).filter(
						(f) => f.constraints.required,
					).length,
				},
			};
		} catch (error) {
			await trackError(error, "getTableDateFields", args);
			throw error;
		}
	},
};

// Get supported date formats for MoneyWorks
const getSupportedDateFormatsInputSchema = z.object({
	locale: z.string().default("en-US").describe("Locale for date formatting"),
	type: z
		.enum(["date", "datetime", "time", "all"])
		.default("all")
		.describe("Type of formats to return"),
});

export const getSupportedDateFormatsTool = {
	description:
		"Get all supported date formats in MoneyWorks for different locales and types",
	inputSchema: getSupportedDateFormatsInputSchema,

	async execute(args: z.infer<typeof getSupportedDateFormatsInputSchema>) {
		try {
			const formats = getSupportedFormats(args.locale, args.type);

			// Group formats by type and usage
			const grouped = groupFormatsByType(formats);

			// Generate locale-specific information
			const localeInfo = getLocaleInformation(args.locale);

			return {
				locale: args.locale,
				formats: formats,
				grouped: grouped,
				localeInfo: localeInfo,
				examples: generateFormatExamples(formats),
				conversionTable: generateConversionTable(formats),
			};
		} catch (error) {
			await trackError(error, "getSupportedDateFormats", args);
			throw error;
		}
	},
};

// Parse and validate date string
const parseDateStringInputSchema = z.object({
	dateString: z.string().describe("The date string to parse"),
	expectedFormat: z.string().optional().describe("Expected format pattern"),
	locale: z.string().default("en-US").describe("Locale for parsing"),
	strict: z.boolean().default(false).describe("Strict parsing mode"),
});

export const parseDateStringTool = {
	description:
		"Parse and validate a date string according to MoneyWorks date format rules",
	inputSchema: parseDateStringInputSchema,

	async execute(args: z.infer<typeof parseDateStringInputSchema>) {
		try {
			const parseResult = parseDateString(
				args.dateString,
				args.expectedFormat,
				args.locale,
				args.strict,
			);

			// Generate alternative formats if parsing failed
			const alternatives = parseResult.success
				? []
				: suggestAlternativeFormats(args.dateString, args.locale);

			return {
				input: args.dateString,
				parseResult: parseResult,
				alternatives: alternatives,
				recommendations: generateParsingRecommendations(
					parseResult,
					args.dateString,
				),
			};
		} catch (error) {
			await trackError(error, "parseDateString", args);
			throw error;
		}
	},
};

// Helper function to get date field information
async function getDateFieldInformation(
	tableName: string,
	fieldName: string,
	locale: string,
	includeExamples: boolean,
): Promise<DateFieldInfo> {
	const tableSchema = await schemaService.getTableSchema(tableName);
	const field = tableSchema.fields.find(
		(f) => f.name.toLowerCase() === fieldName.toLowerCase(),
	);

	if (!field) {
		throw new Error(`Field '${fieldName}' not found in table '${tableName}'`);
	}

	if (!isDateField(field)) {
		throw new Error(
			`Field '${fieldName}' in table '${tableName}' is not a date field`,
		);
	}

	// Get appropriate formats for the field type
	const formats = getFieldDateFormats(field.type, locale, includeExamples);

	// Get field constraints
	const constraints = getDateFieldConstraints(tableName, fieldName, field);

	// Get business rules
	const businessRules = getDateFieldBusinessRules(tableName, fieldName);

	return {
		tableName,
		fieldName,
		fieldType: field.type,
		formats,
		constraints,
		businessRules,
	};
}

// Check if a field is a date/time field
function isDateField(field: any): boolean {
	const dateTypes = ["date", "datetime", "time", "timestamp"];
	return (
		dateTypes.includes(field.type.toLowerCase()) ||
		field.name.toLowerCase().includes("date") ||
		field.name.toLowerCase().includes("time")
	);
}

// Get date formats for a specific field type
function getFieldDateFormats(
	fieldType: string,
	locale: string,
	includeExamples: boolean,
): DateFormat[] {
	const formats: DateFormat[] = [];

	// Base formats by type
	if (fieldType === "date" || fieldType === "datetime") {
		formats.push(...getDateFormats(locale, includeExamples));
	}

	if (fieldType === "datetime") {
		formats.push(...getDateTimeFormats(locale, includeExamples));
	}

	if (fieldType === "time") {
		formats.push(...getTimeFormats(locale, includeExamples));
	}

	return formats;
}

// Get date-only formats
function getDateFormats(
	locale: string,
	includeExamples: boolean,
): DateFormat[] {
	const today = new Date();
	const formatMap: Record<string, { pattern: string; description: string }> = {
		"en-US": {
			pattern: "MM/dd/yyyy",
			description: "US format with month first",
		},
		"en-GB": {
			pattern: "dd/MM/yyyy",
			description: "UK format with day first",
		},
		"de-DE": {
			pattern: "dd.MM.yyyy",
			description: "German format with dots",
		},
		"fr-FR": {
			pattern: "dd/MM/yyyy",
			description: "French format",
		},
		"ja-JP": {
			pattern: "yyyy/MM/dd",
			description: "Japanese format with year first",
		},
	};

	const baseFormat = formatMap[locale] || formatMap["en-US"];

	const formats: DateFormat[] = [
		{
			format: "ISO 8601",
			pattern: "yyyy-MM-dd",
			description: "International standard date format",
			examples: includeExamples ? ["2025-05-31", "2025-12-25"] : [],
			locale: "ISO",
			type: "date",
			usage: "both",
		},
		{
			format: "Locale Standard",
			pattern: baseFormat.pattern,
			description: baseFormat.description,
			examples: includeExamples ? generateDateExamples(baseFormat.pattern) : [],
			locale: locale,
			type: "date",
			usage: "both",
		},
		{
			format: "Short Date",
			pattern: baseFormat.pattern.replace(/yyyy/g, "yy"),
			description: "Short year format",
			examples: includeExamples
				? generateDateExamples(baseFormat.pattern.replace(/yyyy/g, "yy"))
				: [],
			locale: locale,
			type: "date",
			usage: "input",
		},
	];

	// Add MoneyWorks specific formats
	formats.push({
		format: "MoneyWorks Default",
		pattern: "dd/MM/yyyy",
		description: "MoneyWorks standard date format",
		examples: includeExamples ? ["31/05/2025", "25/12/2025"] : [],
		locale: "MW",
		type: "date",
		usage: "both",
	});

	return formats;
}

// Get datetime formats
function getDateTimeFormats(
	locale: string,
	includeExamples: boolean,
): DateFormat[] {
	const formats: DateFormat[] = [
		{
			format: "ISO 8601 DateTime",
			pattern: "yyyy-MM-ddTHH:mm:ss",
			description: "International standard datetime format",
			examples: includeExamples
				? ["2025-05-31T14:30:00", "2025-12-25T09:15:30"]
				: [],
			locale: "ISO",
			type: "datetime",
			usage: "both",
		},
		{
			format: "Local DateTime",
			pattern: "dd/MM/yyyy HH:mm:ss",
			description: "Local date with 24-hour time",
			examples: includeExamples
				? ["31/05/2025 14:30:00", "25/12/2025 09:15:30"]
				: [],
			locale: locale,
			type: "datetime",
			usage: "both",
		},
		{
			format: "12-Hour Format",
			pattern: "dd/MM/yyyy hh:mm:ss AM/PM",
			description: "Local date with 12-hour time",
			examples: includeExamples
				? ["31/05/2025 02:30:00 PM", "25/12/2025 09:15:30 AM"]
				: [],
			locale: locale,
			type: "datetime",
			usage: "input",
		},
	];

	return formats;
}

// Get time-only formats
function getTimeFormats(
	locale: string,
	includeExamples: boolean,
): DateFormat[] {
	const formats: DateFormat[] = [
		{
			format: "24-Hour Time",
			pattern: "HH:mm:ss",
			description: "24-hour time format",
			examples: includeExamples ? ["14:30:00", "09:15:30", "23:59:59"] : [],
			locale: locale,
			type: "time",
			usage: "both",
		},
		{
			format: "12-Hour Time",
			pattern: "hh:mm:ss AM/PM",
			description: "12-hour time with AM/PM",
			examples: includeExamples
				? ["02:30:00 PM", "09:15:30 AM", "11:59:59 PM"]
				: [],
			locale: locale,
			type: "time",
			usage: "input",
		},
		{
			format: "Short Time",
			pattern: "HH:mm",
			description: "24-hour time without seconds",
			examples: includeExamples ? ["14:30", "09:15", "23:59"] : [],
			locale: locale,
			type: "time",
			usage: "both",
		},
	];

	return formats;
}

// Generate date examples for a pattern
function generateDateExamples(pattern: string): string[] {
	const examples: string[] = [];
	const today = new Date();
	const christmas = new Date(2025, 11, 25); // December 25, 2025

	// Mock pattern replacement (simplified)
	const formatDate = (date: Date, pattern: string): string => {
		let formatted = pattern;
		formatted = formatted.replace(/yyyy/g, date.getFullYear().toString());
		formatted = formatted.replace(
			/yy/g,
			(date.getFullYear() % 100).toString().padStart(2, "0"),
		);
		formatted = formatted.replace(
			/MM/g,
			(date.getMonth() + 1).toString().padStart(2, "0"),
		);
		formatted = formatted.replace(
			/dd/g,
			date.getDate().toString().padStart(2, "0"),
		);
		return formatted;
	};

	examples.push(formatDate(today, pattern));
	examples.push(formatDate(christmas, pattern));

	return examples;
}

// Get date field constraints
function getDateFieldConstraints(
	tableName: string,
	fieldName: string,
	field: any,
): {
	required: boolean;
	nullable: boolean;
	minDate?: string;
	maxDate?: string;
	businessDays?: boolean;
	futureOnly?: boolean;
	pastOnly?: boolean;
} {
	const constraints = {
		required: field.required || false,
		nullable: field.nullable || false,
	};

	// Add field-specific constraints
	const fieldLower = fieldName.toLowerCase();

	if (fieldLower.includes("start") || fieldLower.includes("begin")) {
		Object.assign(constraints, { futureOnly: false });
	}

	if (
		fieldLower.includes("end") ||
		fieldLower.includes("due") ||
		fieldLower.includes("expiry")
	) {
		Object.assign(constraints, { futureOnly: true });
	}

	if (fieldLower.includes("created") || fieldLower.includes("modified")) {
		Object.assign(constraints, { pastOnly: true });
	}

	if (
		tableName.toLowerCase() === "transaction" &&
		fieldLower.includes("date")
	) {
		Object.assign(constraints, {
			minDate: "1900-01-01",
			maxDate: "2099-12-31",
			businessDays: false,
		});
	}

	return constraints;
}

// Get date field business rules
function getDateFieldBusinessRules(
	tableName: string,
	fieldName: string,
): Array<{
	rule: string;
	description: string;
	example: string;
}> {
	const rules: Array<{
		rule: string;
		description: string;
		example: string;
	}> = [];

	const fieldLower = fieldName.toLowerCase();

	// Common date business rules
	if (fieldLower.includes("transaction") || fieldLower.includes("date")) {
		rules.push({
			rule: "Fiscal Period Validation",
			description: "Date must fall within an open accounting period",
			example: "Transaction date 2025-05-31 must be in open period",
		});
	}

	if (fieldLower.includes("due") || fieldLower.includes("expiry")) {
		rules.push({
			rule: "Future Date Required",
			description: "Due dates must be in the future",
			example: "Due date must be > today's date",
		});
	}

	if (fieldLower.includes("birth") || fieldLower.includes("born")) {
		rules.push({
			rule: "Historical Date",
			description: "Birth dates must be in the past",
			example: "Birth date must be < today's date",
		});
	}

	if (tableName.toLowerCase() === "transaction") {
		rules.push({
			rule: "Sequence Validation",
			description: "Transaction dates should follow logical sequence",
			example: "Invoice date should precede payment date",
		});
	}

	return rules;
}

// Generate date validation patterns
function generateDateValidationPatterns(dateFieldInfo: DateFieldInfo): {
	regex: Record<string, string>;
	validators: Array<{ type: string; rule: string; message: string }>;
} {
	const regex: Record<string, string> = {};
	const validators: Array<{ type: string; rule: string; message: string }> = [];

	// Generate regex patterns for each format
	for (const format of dateFieldInfo.formats) {
		const regexPattern = convertPatternToRegex(format.pattern);
		regex[format.format] = regexPattern;
	}

	// Generate validation rules
	if (dateFieldInfo.constraints.required) {
		validators.push({
			type: "required",
			rule: "value !== null && value !== undefined && value !== ''",
			message: `${dateFieldInfo.fieldName} is required`,
		});
	}

	if (dateFieldInfo.constraints.futureOnly) {
		validators.push({
			type: "future",
			rule: "new Date(value) > new Date()",
			message: `${dateFieldInfo.fieldName} must be in the future`,
		});
	}

	if (dateFieldInfo.constraints.pastOnly) {
		validators.push({
			type: "past",
			rule: "new Date(value) < new Date()",
			message: `${dateFieldInfo.fieldName} must be in the past`,
		});
	}

	return { regex, validators };
}

// Convert date pattern to regex
function convertPatternToRegex(pattern: string): string {
	let regex = pattern;
	regex = regex.replace(/yyyy/g, "\\d{4}");
	regex = regex.replace(/yy/g, "\\d{2}");
	regex = regex.replace(/MM/g, "\\d{2}");
	regex = regex.replace(/dd/g, "\\d{2}");
	regex = regex.replace(/HH/g, "\\d{2}");
	regex = regex.replace(/mm/g, "\\d{2}");
	regex = regex.replace(/ss/g, "\\d{2}");
	regex = regex.replace(/\//g, "\\/");
	regex = regex.replace(/\./g, "\\.");
	regex = regex.replace(/-/g, "\\-");
	return `^${regex}$`;
}

// Generate date usage guidance
function generateDateUsageGuidance(dateFieldInfo: DateFieldInfo): {
	bestPractices: string[];
	commonMistakes: string[];
	formatting: string[];
} {
	const guidance = {
		bestPractices: [
			"Use ISO 8601 format (yyyy-MM-dd) for data exchange",
			"Validate dates against business rules before saving",
			"Consider timezone implications for datetime fields",
			"Use consistent date formats throughout the application",
		],
		commonMistakes: [
			"Mixing date formats within the same field",
			"Not validating date ranges for business logic",
			"Ignoring locale-specific date preferences",
			"Using ambiguous date formats (MM/dd vs dd/MM)",
		],
		formatting: [
			`Primary format: ${dateFieldInfo.formats[0]?.pattern || "yyyy-MM-dd"}`,
			"Always include leading zeros for single-digit values",
			"Use consistent separators (/, -, or .)",
			"Specify timezone for datetime fields when relevant",
		],
	};

	return guidance;
}

// Generate date recommendations
function generateDateRecommendations(dateFieldInfo: DateFieldInfo): string[] {
	const recommendations: string[] = [];

	if (dateFieldInfo.formats.length > 3) {
		recommendations.push(
			"Consider limiting supported date formats to improve consistency",
		);
	}

	if (
		!dateFieldInfo.constraints.required &&
		dateFieldInfo.fieldName.toLowerCase().includes("created")
	) {
		recommendations.push("Created date fields typically should be required");
	}

	if (
		dateFieldInfo.fieldType === "datetime" &&
		!dateFieldInfo.formats.some((f) => f.pattern.includes("T"))
	) {
		recommendations.push("Consider using ISO 8601 format for datetime fields");
	}

	if (dateFieldInfo.businessRules.length === 0) {
		recommendations.push("Consider adding business rules for date validation");
	}

	return recommendations;
}

// Get supported formats for locale and type
function getSupportedFormats(locale: string, type: string): DateFormat[] {
	const formats: DateFormat[] = [];

	if (type === "date" || type === "all") {
		formats.push(...getDateFormats(locale, true));
	}

	if (type === "datetime" || type === "all") {
		formats.push(...getDateTimeFormats(locale, true));
	}

	if (type === "time" || type === "all") {
		formats.push(...getTimeFormats(locale, true));
	}

	return formats;
}

// Group formats by type
function groupFormatsByType(
	formats: DateFormat[],
): Record<string, DateFormat[]> {
	const grouped: Record<string, DateFormat[]> = {
		date: [],
		datetime: [],
		time: [],
	};

	for (const format of formats) {
		grouped[format.type].push(format);
	}

	return grouped;
}

// Get locale information
function getLocaleInformation(locale: string): {
	name: string;
	dateOrder: string;
	separator: string;
	timeFormat: "12" | "24";
	firstDayOfWeek: number;
} {
	const localeMap: Record<string, any> = {
		"en-US": {
			name: "English (United States)",
			dateOrder: "MDY",
			separator: "/",
			timeFormat: "12",
			firstDayOfWeek: 0,
		},
		"en-GB": {
			name: "English (United Kingdom)",
			dateOrder: "DMY",
			separator: "/",
			timeFormat: "24",
			firstDayOfWeek: 1,
		},
		"de-DE": {
			name: "German (Germany)",
			dateOrder: "DMY",
			separator: ".",
			timeFormat: "24",
			firstDayOfWeek: 1,
		},
		"fr-FR": {
			name: "French (France)",
			dateOrder: "DMY",
			separator: "/",
			timeFormat: "24",
			firstDayOfWeek: 1,
		},
	};

	return localeMap[locale] || localeMap["en-US"];
}

// Generate format examples
function generateFormatExamples(
	formats: DateFormat[],
): Record<string, string[]> {
	const examples: Record<string, string[]> = {};

	for (const format of formats) {
		examples[format.format] = format.examples;
	}

	return examples;
}

// Generate conversion table
function generateConversionTable(formats: DateFormat[]): Array<{
	from: string;
	to: string;
	example: string;
}> {
	const conversions: Array<{
		from: string;
		to: string;
		example: string;
	}> = [];

	// Common conversions
	conversions.push(
		{
			from: "MM/dd/yyyy",
			to: "dd/MM/yyyy",
			example: "05/31/2025 → 31/05/2025",
		},
		{
			from: "MM/dd/yyyy",
			to: "yyyy-MM-dd",
			example: "05/31/2025 → 2025-05-31",
		},
		{
			from: "dd/MM/yyyy",
			to: "yyyy-MM-dd",
			example: "31/05/2025 → 2025-05-31",
		},
	);

	return conversions;
}

// Parse date string
function parseDateString(
	dateString: string,
	expectedFormat?: string,
	locale = "en-US",
	strict = false,
): {
	success: boolean;
	parsedDate?: Date;
	format?: string;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	try {
		// Try to parse the date
		const parsedDate = new Date(dateString);

		if (Number.isNaN(parsedDate.getTime())) {
			errors.push("Invalid date string");
			return { success: false, errors, warnings };
		}

		// Validate against expected format if provided
		if (expectedFormat && strict) {
			const regex = convertPatternToRegex(expectedFormat);
			if (!new RegExp(regex).test(dateString)) {
				errors.push(
					`Date string does not match expected format: ${expectedFormat}`,
				);
				return { success: false, errors, warnings };
			}
		}

		// Add warnings for ambiguous formats
		if (dateString.includes("/") && !expectedFormat) {
			warnings.push(
				"Ambiguous date format - specify expected format for clarity",
			);
		}

		return {
			success: true,
			parsedDate,
			format: expectedFormat || "auto-detected",
			errors,
			warnings,
		};
	} catch (error) {
		errors.push(
			`Parse error: ${error instanceof Error ? error.message : String(error)}`,
		);
		return { success: false, errors, warnings };
	}
}

// Suggest alternative formats
function suggestAlternativeFormats(
	dateString: string,
	locale: string,
): Array<{
	format: string;
	suggestion: string;
	confidence: number;
}> {
	const suggestions: Array<{
		format: string;
		suggestion: string;
		confidence: number;
	}> = [];

	// Analyze the date string pattern
	if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
		suggestions.push({
			format: "yyyy-MM-dd",
			suggestion: "Use ISO 8601 format",
			confidence: 0.9,
		});
	}

	if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
		suggestions.push({
			format: "MM/dd/yyyy",
			suggestion: "US date format",
			confidence: 0.7,
		});
		suggestions.push({
			format: "dd/MM/yyyy",
			suggestion: "European date format",
			confidence: 0.7,
		});
	}

	return suggestions;
}

// Generate parsing recommendations
function generateParsingRecommendations(
	parseResult: any,
	dateString: string,
): string[] {
	const recommendations: string[] = [];

	if (!parseResult.success) {
		recommendations.push("Check date string format and ensure it's valid");
		recommendations.push(
			"Consider using ISO 8601 format (yyyy-MM-dd) for reliability",
		);
	}

	if (parseResult.warnings.length > 0) {
		recommendations.push("Specify expected date format to avoid ambiguity");
	}

	if (dateString.includes("/")) {
		recommendations.push(
			"Be aware of regional date format differences (MM/dd vs dd/MM)",
		);
	}

	return recommendations;
}

// Generate table date statistics
function generateTableDateStatistics(
	dateFields: Record<string, DateFieldInfo>,
): {
	formatDistribution: Record<string, number>;
	constraintSummary: Record<string, number>;
	businessRuleCount: number;
} {
	const formatDistribution: Record<string, number> = {};
	const constraintSummary: Record<string, number> = {};
	let businessRuleCount = 0;

	for (const field of Object.values(dateFields)) {
		// Count format usage
		for (const format of field.formats) {
			formatDistribution[format.pattern] =
				(formatDistribution[format.pattern] || 0) + 1;
		}

		// Count constraints
		if (field.constraints.required) {
			constraintSummary.required = (constraintSummary.required || 0) + 1;
		}
		if (field.constraints.futureOnly) {
			constraintSummary.futureOnly = (constraintSummary.futureOnly || 0) + 1;
		}
		if (field.constraints.pastOnly) {
			constraintSummary.pastOnly = (constraintSummary.pastOnly || 0) + 1;
		}

		businessRuleCount += field.businessRules.length;
	}

	return {
		formatDistribution,
		constraintSummary,
		businessRuleCount,
	};
}
