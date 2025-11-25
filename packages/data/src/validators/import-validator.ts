/**
 * Import Validation Utilities
 *
 * Provides pre-write validation for MoneyWorks import operations.
 * Validates records against discovered or canonical field definitions
 * before sending to MoneyWorks to catch errors earlier with better messages.
 *
 * @moneyworks-dsl PURE
 * @ai-instruction Use these validators to prevent invalid data from reaching MoneyWorks
 */

import type { FieldInfo, TableStructure } from "../parsers/field-discovery";

/**
 * Validation error for a specific field
 *
 * @ai-instruction Provides granular error information for field-level validation
 */
export interface FieldValidationError {
	/** Field name that failed validation */
	field: string;
	/** Human-readable error message */
	message: string;
	/** Validation rule that failed */
	rule: "required" | "type" | "maxLength" | "pattern" | "range" | "custom";
	/** The actual value that was invalid */
	value: unknown;
	/** Expected value constraints */
	expected?: string;
}

/**
 * Result of validating a single record
 */
export interface RecordValidationResult {
	/** Whether the record is valid */
	valid: boolean;
	/** Zero-based index of the record */
	recordIndex: number;
	/** List of validation errors */
	errors: FieldValidationError[];
}

/**
 * Result of validating multiple records
 */
export interface ValidationResult {
	/** Whether all records are valid */
	valid: boolean;
	/** Total number of records validated */
	totalRecords: number;
	/** Number of valid records */
	validRecords: number;
	/** Number of invalid records */
	invalidRecords: number;
	/** Detailed results per record (only for invalid records) */
	recordErrors: RecordValidationResult[];
}

/**
 * Custom validation error class with field-level details
 *
 * @ai-instruction Throw this for validation failures with context
 */
export class ValidationError extends Error {
	readonly isValidationError = true;
	readonly field?: string;
	readonly rule?: string;
	readonly value?: unknown;

	constructor(
		message: string,
		options?: {
			field?: string;
			rule?: string;
			value?: unknown;
		},
	) {
		super(message);
		this.name = "ValidationError";
		this.field = options?.field;
		this.rule = options?.rule;
		this.value = options?.value;
	}
}

/**
 * Field validator function type
 */
export type FieldValidator = (
	value: unknown,
	field: FieldInfo,
	record: Record<string, unknown>,
) => FieldValidationError | null;

/**
 * Validate string length
 */
export function validateStringLength(
	value: unknown,
	field: FieldInfo,
): FieldValidationError | null {
	if (value === null || value === undefined || value === "") {
		return null; // Let required validator handle empty values
	}

	if (typeof value !== "string") {
		return null; // Let type validator handle this
	}

	if (field.maxLength && value.length > field.maxLength) {
		return {
			field: field.name,
			message: `Value exceeds maximum length of ${field.maxLength} (got ${value.length})`,
			rule: "maxLength",
			value,
			expected: `<= ${field.maxLength} characters`,
		};
	}

	return null;
}

/**
 * Validate number range
 */
export function validateNumberRange(
	value: unknown,
	field: FieldInfo,
	options?: { min?: number; max?: number },
): FieldValidationError | null {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	if (field.dataType !== "number") {
		return null;
	}

	const numValue = typeof value === "number" ? value : Number(value);

	if (Number.isNaN(numValue)) {
		return {
			field: field.name,
			message: `Value must be a valid number`,
			rule: "type",
			value,
			expected: "number",
		};
	}

	if (options?.min !== undefined && numValue < options.min) {
		return {
			field: field.name,
			message: `Value must be at least ${options.min}`,
			rule: "range",
			value,
			expected: `>= ${options.min}`,
		};
	}

	if (options?.max !== undefined && numValue > options.max) {
		return {
			field: field.name,
			message: `Value must be at most ${options.max}`,
			rule: "range",
			value,
			expected: `<= ${options.max}`,
		};
	}

	return null;
}

/**
 * Validate MoneyWorks date format (YYYYMMDD)
 */
export function validateDateFormat(
	value: unknown,
	field: FieldInfo,
): FieldValidationError | null {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	if (field.dataType !== "date") {
		return null;
	}

	const strValue = String(value);

	// MoneyWorks uses YYYYMMDD format
	if (!/^\d{8}$/.test(strValue)) {
		return {
			field: field.name,
			message: `Date must be in YYYYMMDD format (e.g., 20240115)`,
			rule: "pattern",
			value,
			expected: "YYYYMMDD",
		};
	}

	// Validate it's a real date
	const year = Number.parseInt(strValue.substring(0, 4), 10);
	const month = Number.parseInt(strValue.substring(4, 6), 10);
	const day = Number.parseInt(strValue.substring(6, 8), 10);

	if (month < 1 || month > 12) {
		return {
			field: field.name,
			message: `Invalid month: ${month}`,
			rule: "pattern",
			value,
			expected: "Month 01-12",
		};
	}

	const daysInMonth = new Date(year, month, 0).getDate();
	if (day < 1 || day > daysInMonth) {
		return {
			field: field.name,
			message: `Invalid day: ${day} for month ${month}`,
			rule: "pattern",
			value,
			expected: `Day 01-${daysInMonth}`,
		};
	}

	return null;
}

/**
 * Validate boolean value
 */
export function validateBoolean(
	value: unknown,
	field: FieldInfo,
): FieldValidationError | null {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	if (field.dataType !== "boolean") {
		return null;
	}

	// Accept: true, false, 0, 1, "0", "1", "true", "false"
	const validValues = [true, false, 0, 1, "0", "1", "true", "false"];
	if (!validValues.includes(value as any)) {
		return {
			field: field.name,
			message: `Value must be a boolean (true/false, 0/1)`,
			rule: "type",
			value,
			expected: "boolean",
		};
	}

	return null;
}

/**
 * Validate required field
 */
export function validateRequired(
	value: unknown,
	field: FieldInfo,
): FieldValidationError | null {
	if (!field.required) {
		return null;
	}

	if (value === null || value === undefined || value === "") {
		return {
			field: field.name,
			message: `Field '${field.name}' is required`,
			rule: "required",
			value,
			expected: "non-empty value",
		};
	}

	return null;
}

/**
 * Validate field type
 */
export function validateFieldType(
	value: unknown,
	field: FieldInfo,
): FieldValidationError | null {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	switch (field.dataType) {
		case "number": {
			const numValue = typeof value === "number" ? value : Number(value);
			if (Number.isNaN(numValue)) {
				return {
					field: field.name,
					message: `Expected number, got '${typeof value}'`,
					rule: "type",
					value,
					expected: "number",
				};
			}
			break;
		}

		case "boolean": {
			return validateBoolean(value, field);
		}

		case "date": {
			return validateDateFormat(value, field);
		}

		// String accepts anything
		case "string":
		default:
			break;
	}

	return null;
}

/**
 * Validate a single record against table structure
 *
 * @param record - Record to validate
 * @param structure - Table structure with field definitions
 * @param recordIndex - Index of the record (for error reporting)
 * @param customValidators - Optional custom validators to run
 * @returns Validation result for the record
 *
 * @example
 * const result = validateRecordForImport(
 *   { TaxCode: 'GST15', Rate: 15 },
 *   taxRateStructure,
 *   0
 * );
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 */
export function validateRecordForImport(
	record: Record<string, unknown>,
	structure: TableStructure,
	recordIndex: number,
	customValidators?: FieldValidator[],
): RecordValidationResult {
	const errors: FieldValidationError[] = [];

	// Build field map for case-insensitive lookup
	const fieldMap = new Map<string, FieldInfo>();
	for (const field of structure.fields) {
		fieldMap.set(field.name.toLowerCase(), field);
	}

	// Validate each field in the record
	for (const [key, value] of Object.entries(record)) {
		const field = fieldMap.get(key.toLowerCase());

		if (!field) {
			// Field not in structure - could warn but don't fail
			continue;
		}

		// Run standard validators
		const requiredError = validateRequired(value, field);
		if (requiredError) errors.push(requiredError);

		const typeError = validateFieldType(value, field);
		if (typeError) errors.push(typeError);

		const lengthError = validateStringLength(value, field);
		if (lengthError) errors.push(lengthError);

		// Run custom validators
		if (customValidators) {
			for (const validator of customValidators) {
				const customError = validator(value, field, record);
				if (customError) errors.push(customError);
			}
		}
	}

	// Check for required fields that are missing from record
	for (const field of structure.fields) {
		if (field.required) {
			const hasField = Object.keys(record).some(
				(key) => key.toLowerCase() === field.name.toLowerCase(),
			);
			if (!hasField) {
				errors.push({
					field: field.name,
					message: `Required field '${field.name}' is missing`,
					rule: "required",
					value: undefined,
					expected: "non-empty value",
				});
			}
		}
	}

	return {
		valid: errors.length === 0,
		recordIndex,
		errors,
	};
}

/**
 * Validate multiple records for import
 *
 * @param records - Records to validate
 * @param structure - Table structure with field definitions
 * @param customValidators - Optional custom validators
 * @returns Validation result for all records
 *
 * @example
 * const result = validateRecordsForImport(records, structure);
 * if (!result.valid) {
 *   // Show errors to user
 *   for (const recordError of result.recordErrors) {
 *     console.log(`Record ${recordError.recordIndex}:`, recordError.errors);
 *   }
 * }
 */
export function validateRecordsForImport(
	records: Record<string, unknown>[],
	structure: TableStructure,
	customValidators?: FieldValidator[],
): ValidationResult {
	const recordErrors: RecordValidationResult[] = [];
	let validCount = 0;

	for (let i = 0; i < records.length; i++) {
		const result = validateRecordForImport(
			records[i],
			structure,
			i,
			customValidators,
		);
		if (result.valid) {
			validCount++;
		} else {
			recordErrors.push(result);
		}
	}

	return {
		valid: recordErrors.length === 0,
		totalRecords: records.length,
		validRecords: validCount,
		invalidRecords: recordErrors.length,
		recordErrors,
	};
}

/**
 * Create a custom field validator
 *
 * @param fieldName - Name of the field to validate (case-insensitive)
 * @param validate - Validation function
 * @returns FieldValidator function
 *
 * @example
 * const taxCodeValidator = createFieldValidator(
 *   'TaxCode',
 *   (value) => {
 *     if (typeof value === 'string' && value.length > 10) {
 *       return { message: 'Tax code too long', rule: 'custom' };
 *     }
 *     return null;
 *   }
 * );
 */
export function createFieldValidator(
	fieldName: string,
	validate: (
		value: unknown,
		record: Record<string, unknown>,
	) => { message: string; rule?: FieldValidationError["rule"] } | null,
): FieldValidator {
	const lowerFieldName = fieldName.toLowerCase();

	return (value, field, record) => {
		if (field.name.toLowerCase() !== lowerFieldName) {
			return null;
		}

		const result = validate(value, record);
		if (result) {
			return {
				field: field.name,
				message: result.message,
				rule: result.rule || "custom",
				value,
			};
		}

		return null;
	};
}
