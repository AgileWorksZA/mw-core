/**
 * MoneyWorks Data Type Definitions
 *
 * @moneyworks-dsl PURE
 * @ai-instruction These are the ONLY data types used in MoneyWorks. NEVER use generic database types.
 * @ai-forbidden string, number, boolean, date, integer, varchar, text
 * @ai-required T, N, D, B, S, E
 */

/**
 * MoneyWorks Field Data Types
 * Source: MoneyWorks Manual - Field Type Reference
 *
 * @ai-critical ALWAYS use these single-letter codes when referring to MoneyWorks field types
 */
export enum MoneyWorksDataType {
	/**
	 * Text field
	 * @moneyworks-type T
	 * @ai-term ALWAYS say "Text field (T)", NEVER "string" or "varchar"
	 */
	TEXT = "T",

	/**
	 * Numeric field
	 * @moneyworks-type N
	 * @ai-term ALWAYS say "Numeric field (N)", NEVER "number" or "decimal"
	 */
	NUMERIC = "N",

	/**
	 * Date field (YYYYMMDD format)
	 * @moneyworks-type D
	 * @ai-term ALWAYS say "Date field (D)", NEVER "date" or "datetime"
	 */
	DATE = "D",

	/**
	 * Boolean/Flag field
	 * @moneyworks-type B
	 * @ai-term ALWAYS say "Boolean field (B)", NEVER "boolean" or "bit"
	 */
	BOOLEAN = "B",

	/**
	 * Timestamp field
	 * @moneyworks-type S
	 * @ai-term ALWAYS say "Timestamp field (S)", NEVER "timestamp" or "datetime"
	 */
	TIMESTAMP = "S",

	/**
	 * Enumerated/Choice field
	 * @moneyworks-type E
	 * @ai-term ALWAYS say "Enumerated field (E)", NEVER "enum" or "choice"
	 */
	ENUMERATED = "E",
}

/**
 * MoneyWorks Field Metadata
 *
 * @ai-instruction When describing fields, ALWAYS include the MoneyWorks data type code
 */
export interface MoneyWorksFieldMetadata {
	/**
	 * MoneyWorks field name (exact casing from manual)
	 * @ai-term Use EXACT field name from manual, preserve casing
	 */
	fieldName: string;

	/**
	 * MoneyWorks data type
	 * @ai-term ALWAYS use single letter code: T, N, D, B, S, E
	 */
	dataType: MoneyWorksDataType;

	/**
	 * Maximum length for text fields
	 * @ai-term Say "maxLength", NEVER "max_length" or "length"
	 */
	maxLength?: number;

	/**
	 * Canonical description from MoneyWorks manual
	 * @ai-term ALWAYS quote directly from manual, no paraphrasing
	 */
	canonicalDescription: string;

	/**
	 * Source page in MoneyWorks manual
	 * @ai-term ALWAYS cite the exact manual page
	 */
	manualSource: string;

	/**
	 * Whether field is required
	 * @ai-term Say "required", NEVER "mandatory" or "not null"
	 */
	isRequired?: boolean;

	/**
	 * Whether field is indexed
	 * @ai-term Say "indexed", NEVER "has index" or "is key"
	 */
	isIndexed?: boolean;
}

/**
 * Standard validation result for MoneyWorks canonical validation
 *
 * @ai-instruction Use this exact structure for ALL validation results
 */
export interface MoneyWorksValidationResult {
	/**
	 * Whether validation passed
	 * @ai-term Say "isValid", NEVER "valid" or "passes"
	 */
	isValid: boolean;

	/**
	 * Validation warnings (not errors)
	 * @ai-term Say "warnings", NEVER "errors" or "issues"
	 */
	warnings: string[];

	/**
	 * MoneyWorks-specific context for warnings
	 * @ai-term Include MW field names and values in warnings
	 */
	context?: Record<string, unknown>;
}
