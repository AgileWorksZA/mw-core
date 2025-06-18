/**
 * YYYYMMDD date handling utilities for MoneyWorks
 *
 * MoneyWorks uses YYYYMMDD format for date fields.
 * This module provides type-safe handling of these date strings.
 */

import type { YYYYMMDD } from "../types/branded";

/**
 * Regular expression for YYYYMMDD format
 */
const YYYYMMDD_REGEX = /^(\d{4})(\d{2})(\d{2})$/;

/**
 * Check if a string is in valid YYYYMMDD format
 */
export function isYYYYMMDD(value: string): value is YYYYMMDD {
	if (!YYYYMMDD_REGEX.test(value)) {
		return false;
	}

	const year = parseInt(value.substring(0, 4), 10);
	const month = parseInt(value.substring(4, 6), 10);
	const day = parseInt(value.substring(6, 8), 10);

	// Validate ranges
	if (month < 1 || month > 12) {
		return false;
	}

	// Check day validity
	const daysInMonth = new Date(year, month, 0).getDate();
	if (day < 1 || day > daysInMonth) {
		return false;
	}

	return true;
}

/**
 * Create a YYYYMMDD from a string, with validation
 */
export function createYYYYMMDD(value: string): YYYYMMDD {
	if (!isYYYYMMDD(value)) {
		throw new Error(`Invalid YYYYMMDD format: ${value}`);
	}
	return value;
}

/**
 * Create a YYYYMMDD from a string, returning null if invalid
 */
export function tryCreateYYYYMMDD(value: string): YYYYMMDD | null {
	return isYYYYMMDD(value) ? value : null;
}

/**
 * Convert a Date object to YYYYMMDD format
 */
export function dateToYYYYMMDD(date: Date): YYYYMMDD {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return createYYYYMMDD(`${year}${month}${day}`);
}

/**
 * Convert YYYYMMDD to a Date object
 */
export function yyyymmddToDate(value: YYYYMMDD): Date {
	const year = parseInt(value.substring(0, 4), 10);
	const month = parseInt(value.substring(4, 6), 10) - 1; // JS months are 0-based
	const day = parseInt(value.substring(6, 8), 10);
	return new Date(year, month, day);
}

/**
 * Parse various date formats to YYYYMMDD
 */
export function parseToYYYYMMDD(value: string | Date | YYYYMMDD): YYYYMMDD {
	// Already YYYYMMDD
	if (typeof value === "string" && isYYYYMMDD(value)) {
		return value;
	}

	// Date object
	if (value instanceof Date) {
		return dateToYYYYMMDD(value);
	}

	// Try to parse string formats
	if (typeof value === "string") {
		// ISO date format (YYYY-MM-DD)
		const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (isoMatch) {
			const [, year, month, day] = isoMatch;
			return createYYYYMMDD(`${year}${month}${day}`);
		}

		// Slash format (YYYY/MM/DD)
		const slashMatch = value.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
		if (slashMatch) {
			const [, year, month, day] = slashMatch;
			return createYYYYMMDD(`${year}${month}${day}`);
		}

		// Try parsing as a date string (but reject MM-DD-YYYY format)
		if (!/^\d{2}-\d{2}-\d{4}/.test(value)) {
			const date = new Date(value);
			if (!Number.isNaN(date.getTime())) {
				return dateToYYYYMMDD(date);
			}
		}
	}

	throw new Error(`Cannot parse date: ${value}`);
}

/**
 * Format YYYYMMDD to a display string
 */
export function formatYYYYMMDD(
	value: YYYYMMDD,
	separator: string = "-",
): string {
	return `${value.substring(0, 4)}${separator}${value.substring(4, 6)}${separator}${value.substring(6, 8)}`;
}

/**
 * Get today's date as YYYYMMDD
 */
export function todayYYYYMMDD(): YYYYMMDD {
	return dateToYYYYMMDD(new Date());
}

/**
 * Add days to a YYYYMMDD date
 */
export function addDaysToYYYYMMDD(date: YYYYMMDD, days: number): YYYYMMDD {
	const d = yyyymmddToDate(date);
	d.setDate(d.getDate() + days);
	return dateToYYYYMMDD(d);
}

/**
 * Add months to a YYYYMMDD date
 */
export function addMonthsToYYYYMMDD(date: YYYYMMDD, months: number): YYYYMMDD {
	const d = yyyymmddToDate(date);
	const originalDay = d.getDate();

	// Add months
	d.setMonth(d.getMonth() + months);

	// If the day changed (due to month overflow), set to last day of target month
	if (d.getDate() !== originalDay) {
		d.setDate(0); // Sets to last day of previous month
	}

	return dateToYYYYMMDD(d);
}

/**
 * Get the difference in days between two YYYYMMDD dates
 */
export function daysBetweenYYYYMMDD(from: YYYYMMDD, to: YYYYMMDD): number {
	const fromDate = yyyymmddToDate(from);
	const toDate = yyyymmddToDate(to);
	const diffMs = toDate.getTime() - fromDate.getTime();
	return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Compare two YYYYMMDD dates
 */
export function compareYYYYMMDD(a: YYYYMMDD, b: YYYYMMDD): number {
	return a.localeCompare(b);
}

/**
 * Check if a YYYYMMDD date is before another
 */
export function isBeforeYYYYMMDD(date: YYYYMMDD, compare: YYYYMMDD): boolean {
	return date < compare;
}

/**
 * Check if a YYYYMMDD date is after another
 */
export function isAfterYYYYMMDD(date: YYYYMMDD, compare: YYYYMMDD): boolean {
	return date > compare;
}

/**
 * Get the start of the month for a YYYYMMDD date
 */
export function startOfMonthYYYYMMDD(date: YYYYMMDD): YYYYMMDD {
	return createYYYYMMDD(`${date.substring(0, 6)}01`);
}

/**
 * Get the end of the month for a YYYYMMDD date
 */
export function endOfMonthYYYYMMDD(date: YYYYMMDD): YYYYMMDD {
	const d = yyyymmddToDate(date);
	const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
	return dateToYYYYMMDD(lastDay);
}

/**
 * Namespace for YYYYMMDD utilities
 */
export namespace YYYYMMDDUtils {
	export const is = isYYYYMMDD;
	export const create = createYYYYMMDD;
	export const tryCreate = tryCreateYYYYMMDD;
	export const fromDate = dateToYYYYMMDD;
	export const toDate = yyyymmddToDate;
	export const parse = parseToYYYYMMDD;
	export const format = formatYYYYMMDD;
	export const today = todayYYYYMMDD;
	export const addDays = addDaysToYYYYMMDD;
	export const addMonths = addMonthsToYYYYMMDD;
	export const daysBetween = daysBetweenYYYYMMDD;
	export const compare = compareYYYYMMDD;
	export const isBefore = isBeforeYYYYMMDD;
	export const isAfter = isAfterYYYYMMDD;
	export const startOfMonth = startOfMonthYYYYMMDD;
	export const endOfMonth = endOfMonthYYYYMMDD;
}
