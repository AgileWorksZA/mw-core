/**
 * JSON stringify utilities for MoneyWorks types
 *
 * Handles serialization of branded types and custom formatting.
 */

import { formatPeriod } from "../date/period";
import { formatYYYYMMDD } from "../date/yyyymmdd";
import type { Period, YYYYMMDD } from "../types/branded";

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
 * Options for JSON stringification
 */
export interface MoneyWorksStringifyOptions {
	/**
	 * Format dates with separators (e.g., "2025-01-15" instead of "20250115")
	 * @default false
	 */
	formatDates?: boolean;

	/**
	 * Date separator when formatDates is true
	 * @default "-"
	 */
	dateSeparator?: string;

	/**
	 * Format periods with separators (e.g., "2025/01" instead of 202501)
	 * @default false
	 */
	formatPeriods?: boolean;

	/**
	 * Period separator when formatPeriods is true
	 * @default "/"
	 */
	periodSeparator?: string;

	/**
	 * Indent for pretty printing
	 */
	indent?: number | string;

	/**
	 * Custom replacer function
	 */
	replacer?: (key: string, value: JsonValue) => JsonValue;
}

/**
 * Create a MoneyWorks-aware JSON replacer
 */
export function createMoneyWorksReplacer(
	options: MoneyWorksStringifyOptions = {},
) {
	const {
		formatDates = false,
		dateSeparator = "-",
		formatPeriods = false,
		periodSeparator = "/",
		replacer,
	} = options;

	return (key: string, value: JsonValue): JsonValue => {
		// Apply custom replacer first if provided
		let processedValue = value;
		if (replacer) {
			processedValue = replacer(key, processedValue);
		}

		// Handle YYYYMMDD formatting
		if (formatDates && typeof processedValue === "string" && processedValue.length === 8) {
			// Check if it looks like a YYYYMMDD
			if (/^\d{8}$/.test(processedValue)) {
				try {
					return formatYYYYMMDD(processedValue as YYYYMMDD, dateSeparator);
				} catch {
					// Not a valid date, return as-is
				}
			}
		}

		// Handle Period formatting
		if (
			formatPeriods &&
			typeof processedValue === "number" &&
			processedValue >= 100000 &&
			processedValue <= 999999
		) {
			try {
				return formatPeriod(processedValue as Period, periodSeparator);
			} catch {
				// Not a valid period, return as-is
			}
		}

		// Branded types serialize as their underlying value
		return processedValue;
	};
}

/**
 * Stringify with MoneyWorks formatting
 */
export function stringifyMoneyWorks(
	value: JsonValue,
	options?: MoneyWorksStringifyOptions,
): string {
	const { indent, ...replacerOptions } = options || {};
	const replacer = createMoneyWorksReplacer(replacerOptions);

	return JSON.stringify(value, replacer, indent);
}

/**
 * Stringify for MoneyWorks API (no formatting, compact)
 */
export function stringifyForAPI(value: JsonValue): string {
	// Branded types automatically serialize as their base type
	// No special handling needed for API
	return JSON.stringify(value);
}

/**
 * Stringify for display (formatted dates, pretty print)
 */
export function stringifyForDisplay(value: JsonValue): string {
	return stringifyMoneyWorks(value, {
		formatDates: true,
		formatPeriods: true,
		indent: 2,
	});
}

/**
 * Create a custom stringifier with preset options
 */
export function createStringifier(defaultOptions: MoneyWorksStringifyOptions) {
	return (value: JsonValue, overrides?: MoneyWorksStringifyOptions) => {
		return stringifyMoneyWorks(value, { ...defaultOptions, ...overrides });
	};
}

/**
 * Safe stringify that handles circular references
 */
export function safeStringify(
	value: JsonValue,
	options?: MoneyWorksStringifyOptions,
): string {
	const seen = new WeakSet();

	const circularReplacer = (key: string, val: JsonValue): JsonValue => {
		if (val != null && typeof val === "object") {
			if (seen.has(val)) {
				return "[Circular]";
			}
			seen.add(val);
		}

		// Apply MoneyWorks replacer if options provided
		if (options?.replacer) {
			return options.replacer(key, val);
		}

		return val;
	};

	return stringifyMoneyWorks(value, {
		...options,
		replacer: circularReplacer,
	});
}
