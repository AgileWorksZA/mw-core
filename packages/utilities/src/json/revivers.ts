/**
 * JSON reviver functions for MoneyWorks data types
 *
 * These revivers automatically convert string values to branded types
 * during JSON parsing.
 */

import { createPeriod } from "../date/period";
import { isYYYYMMDD, parseToYYYYMMDD } from "../date/yyyymmdd";
import type { HHMMSS, YYYYMMDD } from "../types/branded";

/**
 * Type representing any valid JSON value
 */
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonObject
	| JsonArray;
export interface JsonObject {
	[key: string]: JsonValue;
}
export interface JsonArray extends Array<JsonValue> {}

/**
 * Common MoneyWorks date field names
 */
const DATE_FIELDS = new Set([
	// Transaction dates
	"transDate",
	"TransDate",
	"enterDate",
	"EnterDate",
	"dueDate",
	"DueDate",
	"datePosted",
	"DatePosted",
	"datePaid",
	"DatePaid",
	"datePromised",
	"DatePromised",
	"dateRequired",
	"DateRequired",
	"dateCompleted",
	"DateCompleted",

	// General dates
	"startDate",
	"StartDate",
	"endDate",
	"EndDate",
	"created",
	"Created",
	"lastModified",
	"LastModified",
	"lastModifiedTime",
	"LastModifiedTime",

	// Name dates
	"dateOpened",
	"DateOpened",
	"dateClosed",
	"DateClosed",

	// Asset dates
	"purchaseDate",
	"PurchaseDate",
	"disposalDate",
	"DisposalDate",
	"depreciationStartDate",
	"DepreciationStartDate",

	// Custom date patterns
	"expiryDate",
	"ExpiryDate",
	"renewalDate",
	"RenewalDate",
	"reminderDate",
	"ReminderDate",
]);

/**
 * Period field names
 */
const PERIOD_FIELDS = new Set([
	"period",
	"Period",
	"startPeriod",
	"StartPeriod",
	"endPeriod",
	"EndPeriod",
	"currentPeriod",
	"CurrentPeriod",
	"lastPeriod",
	"LastPeriod",
]);

/**
 * Time field names
 */
const TIME_FIELDS = new Set([
	"transTime",
	"TransTime",
	"enterTime",
	"EnterTime",
	"timePosted",
	"TimePosted",
	"startTime",
	"StartTime",
	"endTime",
	"EndTime",
]);

/**
 * Options for JSON parsing with MoneyWorks types
 */
export interface MoneyWorksParseOptions {
	/**
	 * Convert date fields to YYYYMMDD
	 * @default true
	 */
	convertDates?: boolean;

	/**
	 * Convert period fields to Period type
	 * @default true
	 */
	convertPeriods?: boolean;

	/**
	 * Convert time fields to HHMMSS
	 * @default true
	 */
	convertTimes?: boolean;

	/**
	 * Additional date field names to convert
	 */
	additionalDateFields?: string[];

	/**
	 * Field names to exclude from conversion
	 */
	excludeFields?: string[];

	/**
	 * Strict mode - throw on invalid values instead of keeping original
	 * @default false
	 */
	strict?: boolean;
}

/**
 * Create a MoneyWorks-aware JSON reviver
 */
export function createMoneyWorksReviver(options: MoneyWorksParseOptions = {}) {
	const {
		convertDates = true,
		convertPeriods = true,
		convertTimes = true,
		additionalDateFields = [],
		excludeFields = [],
		strict = false,
	} = options;

	const excludeSet = new Set(excludeFields);
	const extendedDateFields = new Set([...DATE_FIELDS, ...additionalDateFields]);

	return function reviver(key: string, value: JsonValue): JsonValue {
		// Skip excluded fields
		if (excludeSet.has(key)) {
			return value;
		}

		// Convert date fields
		if (
			convertDates &&
			typeof value === "string" &&
			extendedDateFields.has(key)
		) {
			try {
				// Try YYYYMMDD format first
				if (isYYYYMMDD(value)) {
					return value as YYYYMMDD;
				}

				// Try parsing other formats
				return parseToYYYYMMDD(value);
			} catch (_error) {
				if (strict) {
					throw new Error(`Invalid date value for field "${key}": ${value}`);
				}
				return value;
			}
		}

		// Convert period fields
		if (convertPeriods && typeof value === "number" && PERIOD_FIELDS.has(key)) {
			try {
				return createPeriod(value);
			} catch (_error) {
				if (strict) {
					throw new Error(`Invalid period value for field "${key}": ${value}`);
				}
				return value;
			}
		}

		// Convert time fields (HHMMSS format)
		if (convertTimes && typeof value === "string" && TIME_FIELDS.has(key)) {
			if (/^\d{6}$/.test(value)) {
				// Validate time components
				const hours = parseInt(value.substring(0, 2), 10);
				const minutes = parseInt(value.substring(2, 4), 10);
				const seconds = parseInt(value.substring(4, 6), 10);

				if (
					hours >= 0 &&
					hours <= 23 &&
					minutes >= 0 &&
					minutes <= 59 &&
					seconds >= 0 &&
					seconds <= 59
				) {
					return value as HHMMSS;
				}
			}

			if (strict) {
				throw new Error(`Invalid time value for field "${key}": ${value}`);
			}
		}

		return value;
	};
}

/**
 * Parse JSON with MoneyWorks type conversion
 */
export function parseMoneyWorksJSON<T = JsonObject>(
	text: string,
	options?: MoneyWorksParseOptions,
): T {
	return JSON.parse(text, createMoneyWorksReviver(options));
}

/**
 * Parse JSON with automatic date conversion only
 */
export function parseDateJSON<T = JsonObject>(text: string): T {
	return parseMoneyWorksJSON<T>(text, {
		convertDates: true,
		convertPeriods: false,
		convertTimes: false,
	});
}

/**
 * Create a typed parser for specific MoneyWorks types
 */
export function createTypedParser<T>(
	dateFields: (keyof T)[],
	periodFields: (keyof T)[] = [],
	timeFields: (keyof T)[] = [],
): (text: string) => T {
	return (text: string) => {
		return JSON.parse(text, (key, value) => {
			if (dateFields.includes(key as keyof T) && typeof value === "string") {
				try {
					return isYYYYMMDD(value) ? value : parseToYYYYMMDD(value);
				} catch {
					return value;
				}
			}

			if (periodFields.includes(key as keyof T) && typeof value === "number") {
				try {
					return createPeriod(value);
				} catch {
					return value;
				}
			}

			if (timeFields.includes(key as keyof T) && typeof value === "string") {
				if (/^\d{6}$/.test(value)) {
					return value as HHMMSS;
				}
			}

			return value;
		});
	};
}

/**
 * Parse response body with MoneyWorks types
 */
export async function parseMoneyWorksResponse<T = JsonObject>(
	response: Response,
	options?: MoneyWorksParseOptions,
): Promise<T> {
	const text = await response.text();
	return parseMoneyWorksJSON<T>(text, options);
}
