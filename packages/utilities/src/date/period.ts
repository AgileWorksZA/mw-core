/**
 * Period handling utilities for MoneyWorks
 *
 * MoneyWorks uses periods in the format YYYYMM (as a number).
 * For example, January 2025 is represented as 202501.
 */

import type { Period, YYYYMMDD } from "@moneyworks/utilities/types/branded";
import { createYYYYMMDD } from "./yyyymmdd";

/**
 * Check if a number is a valid period
 */
export function isPeriod(value: number): value is Period {
	if (!Number.isInteger(value) || value < 100000 || value > 999999) {
		return false;
	}

	const year = Math.floor(value / 100);
	const month = value % 100;

	return year >= 1900 && year <= 9999 && month >= 1 && month <= 12;
}

/**
 * Create a Period from a number, with validation
 */
export function createPeriod(value: number): Period {
	if (!isPeriod(value)) {
		throw new Error(`Invalid period format: ${value}`);
	}
	return value;
}

/**
 * Create a Period from year and month
 */
export function periodFromYearMonth(year: number, month: number): Period {
	return createPeriod(year * 100 + month);
}

/**
 * Get current period
 */
export function currentPeriod(): Period {
	const now = new Date();
	return periodFromYearMonth(now.getFullYear(), now.getMonth() + 1);
}

/**
 * Extract year from period
 */
export function periodYear(period: Period): number {
	return Math.floor(period / 100);
}

/**
 * Extract month from period
 */
export function periodMonth(period: Period): number {
	return period % 100;
}

/**
 * Convert period to Date (first day of month)
 */
export function periodToDate(period: Period): Date {
	const year = periodYear(period);
	const month = periodMonth(period) - 1; // JS months are 0-based
	return new Date(year, month, 1);
}

/**
 * Convert Date to period
 */
export function dateToPeriod(date: Date): Period {
	return periodFromYearMonth(date.getFullYear(), date.getMonth() + 1);
}

/**
 * Convert YYYYMMDD to period
 */
export function yyyymmddToPeriod(date: YYYYMMDD): Period {
	const year = Number.parseInt(date.substring(0, 4), 10);
	const month = Number.parseInt(date.substring(4, 6), 10);
	return periodFromYearMonth(year, month);
}

/**
 * Get the first day of a period as YYYYMMDD
 */
export function periodStartDate(period: Period): YYYYMMDD {
	const year = periodYear(period);
	const month = String(periodMonth(period)).padStart(2, "0");
	return createYYYYMMDD(`${year}${month}01`);
}

/**
 * Get the last day of a period as YYYYMMDD
 */
export function periodEndDate(period: Period): YYYYMMDD {
	const date = periodToDate(period);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const year = lastDay.getFullYear();
	const month = String(lastDay.getMonth() + 1).padStart(2, "0");
	const day = String(lastDay.getDate()).padStart(2, "0");
	return createYYYYMMDD(`${year}${month}${day}`);
}

/**
 * Add months to a period
 */
export function addMonthsToPeriod(period: Period, months: number): Period {
	const date = periodToDate(period);
	date.setMonth(date.getMonth() + months);
	return dateToPeriod(date);
}

/**
 * Get the difference in months between two periods
 */
export function monthsBetweenPeriods(from: Period, to: Period): number {
	const fromYear = periodYear(from);
	const fromMonth = periodMonth(from);
	const toYear = periodYear(to);
	const toMonth = periodMonth(to);

	return (toYear - fromYear) * 12 + (toMonth - fromMonth);
}

/**
 * Format period for display
 */
export function formatPeriod(period: Period, separator = "/"): string {
	const year = periodYear(period);
	const month = String(periodMonth(period)).padStart(2, "0");
	return `${year}${separator}${month}`;
}

/**
 * Get an array of periods between two periods (inclusive)
 */
export function periodRange(from: Period, to: Period): Period[] {
	const periods: Period[] = [];
	let current = from;

	while (current <= to) {
		periods.push(current);
		current = addMonthsToPeriod(current, 1);
	}

	return periods;
}

/**
 * Tagged template literal for creating Period values
 *
 * @example
 * const period = p`202501`;
 * const current = p`${new Date()}`;
 * const composed = p`${2025}${1}`;
 */
export function p(strings: TemplateStringsArray, ...values: any[]): Period {
	// Combine template parts
	let result = strings[0];
	for (let i = 0; i < values.length; i++) {
		const value = values[i];
		// Handle Date objects specially
		if (value instanceof Date) {
			result += String(dateToPeriod(value)) + strings[i + 1];
		} else {
			result += String(value) + strings[i + 1];
		}
	}

	// Parse as number and validate
	const num = Number.parseInt(result, 10);
	if (Number.isNaN(num)) {
		throw new Error(`Invalid period format: ${result}`);
	}

	return createPeriod(num);
}

/**
 * Namespace for Period utilities
 */
export namespace PeriodUtils {
	export const is = isPeriod;
	export const create = createPeriod;
	export const fromYearMonth = periodFromYearMonth;
	export const current = currentPeriod;
	export const year = periodYear;
	export const month = periodMonth;
	export const toDate = periodToDate;
	export const fromDate = dateToPeriod;
	export const fromYYYYMMDD = yyyymmddToPeriod;
	export const startDate = periodStartDate;
	export const endDate = periodEndDate;
	export const addMonths = addMonthsToPeriod;
	export const monthsBetween = monthsBetweenPeriods;
	export const format = formatPeriod;
	export const range = periodRange;
}
