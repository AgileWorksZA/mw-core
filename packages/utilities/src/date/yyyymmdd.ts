/**
 * YYYYMMDD date handling utilities for MoneyWorks
 *
 * MoneyWorks uses YYYYMMDD format for date fields.
 * This module provides type-safe handling of these date strings.
 */

import type {YYYYMMDD} from "../types";

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
  return !(day < 1 || day > daysInMonth);


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
 * Extended YYYYMMDD type with methods
 */
export type YYYYMMDDWithMethods = YYYYMMDD & {
  // Comparison methods
  gt(other: Date | string | YYYYMMDD | YYYYMMDDWithMethods): boolean;
  gte(other: Date | string | YYYYMMDD | YYYYMMDDWithMethods): boolean;
  lt(other: Date | string | YYYYMMDD | YYYYMMDDWithMethods): boolean;
  lte(other: Date | string | YYYYMMDD | YYYYMMDDWithMethods): boolean;
  eq(other: Date | string | YYYYMMDD | YYYYMMDDWithMethods): boolean;
  
  // Date arithmetic
  addDays(days: number): YYYYMMDDWithMethods;
  addMonths(months: number): YYYYMMDDWithMethods;
  subtract(other: Date | string | YYYYMMDD | YYYYMMDDWithMethods): number; // days between
  
  // Formatting
  format(separator?: string): string;
  
  // Conversion
  toDate(): Date;
  
  // Period extraction
  toPeriod(): number;
  
  // Validation
  isWeekend(): boolean;
  isLeapYear(): boolean;
};

/**
 * Cache for proxy objects to ensure identity equality
 */
const proxyCache = new Map<string, YYYYMMDDWithMethods>();

/**
 * Create a YYYYMMDD with methods using Proxy
 */
function withMethods(value: YYYYMMDD): YYYYMMDDWithMethods {
  // Check if we already have a proxy for this value
  const cached = proxyCache.get(value);
  if (cached) {
    return cached;
  }
  
  // Wrap the string in an object for Proxy
  const wrapper = Object(value);
  
  const proxy = new Proxy(wrapper, {
    get(target, prop) {
      // Handle toString, valueOf, and toJSON for proper string behavior
      if (prop === 'toString' || prop === 'valueOf' || prop === 'toJSON') {
        return () => value;
      }
      
      // Handle Symbol.toPrimitive for string coercion
      if (prop === Symbol.toPrimitive) {
        return (hint: string) => {
          if (hint === 'string' || hint === 'default') {
            return value;
          }
          return value;
        };
      }
      
      // First check if it's a string method/property
      if (prop in String.prototype || prop === 'length') {
        const val = value[prop as keyof typeof value];
        return typeof val === 'function' ? (val as any).bind(value) : val;
      }
      
      // Then check our custom methods
      switch (prop) {
        case 'gt':
          return (other: Date | string | YYYYMMDD | YYYYMMDDWithMethods) => {
            const otherDate = normalizeToYYYYMMDD(other);
            return value > otherDate;
          };
        case 'gte':
          return (other: Date | string | YYYYMMDD | YYYYMMDDWithMethods) => {
            const otherDate = normalizeToYYYYMMDD(other);
            return value >= otherDate;
          };
        case 'lt':
          return (other: Date | string | YYYYMMDD | YYYYMMDDWithMethods) => {
            const otherDate = normalizeToYYYYMMDD(other);
            return value < otherDate;
          };
        case 'lte':
          return (other: Date | string | YYYYMMDD | YYYYMMDDWithMethods) => {
            const otherDate = normalizeToYYYYMMDD(other);
            return value <= otherDate;
          };
        case 'eq':
          return (other: Date | string | YYYYMMDD | YYYYMMDDWithMethods) => {
            const otherDate = normalizeToYYYYMMDD(other);
            return value === otherDate;
          };
        case 'addDays':
          return (days: number) => withMethods(addDaysToYYYYMMDD(value, days));
        case 'addMonths':
          return (months: number) => withMethods(addMonthsToYYYYMMDD(value, months));
        case 'subtract':
          return (other: Date | string | YYYYMMDD | YYYYMMDDWithMethods) => {
            const otherDate = normalizeToYYYYMMDD(other);
            return daysBetweenYYYYMMDD(otherDate, value);
          };
        case 'format':
          return (separator?: string) => formatYYYYMMDD(value, separator);
        case 'toDate':
          return () => yyyymmddToDate(value);
        case 'toPeriod':
          return () => {
            const year = parseInt(value.substring(0, 4), 10);
            const month = parseInt(value.substring(4, 6), 10);
            return year * 100 + month;
          };
        case 'isWeekend':
          return () => {
            const date = yyyymmddToDate(value);
            const day = date.getDay();
            return day === 0 || day === 6;
          };
        case 'isLeapYear':
          return () => {
            const year = parseInt(value.substring(0, 4), 10);
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
          };
      }
      
      return target[prop];
    }
  }) as YYYYMMDDWithMethods;
  
  // Cache the proxy for identity equality
  proxyCache.set(value, proxy);
  return proxy;
}

/**
 * Helper to normalize various date inputs to YYYYMMDD
 */
function normalizeToYYYYMMDD(value: Date | string | YYYYMMDD | YYYYMMDDWithMethods): YYYYMMDD {
  if (value instanceof Date) {
    return dateToYYYYMMDD(value);
  } else if (typeof value === 'string') {
    if (!isYYYYMMDD(value)) {
      return parseToYYYYMMDD(value);
    }
    return value;
  } else if (typeof value === 'object' && value && 'toString' in value) {
    // Handle proxy objects by getting their string value
    return (value as YYYYMMDDWithMethods).toString() as YYYYMMDD;
  }
  return value as YYYYMMDD;
}

/**
 * Tagged template literal for creating YYYYMMDD dates with methods
 * 
 * @example
 * const date = d`20250115`;
 * const today = d`${new Date()}`;
 * const formatted = d`2025-01-15`;
 * 
 * // With methods:
 * if (date.gt(today)) {
 *   console.log('Date is in the future');
 * }
 * const nextMonth = date.addMonths(1);
 */
export function d(
  strings: TemplateStringsArray,
  ...values: any[]
): YYYYMMDDWithMethods {
  // Combine template parts
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + strings[i + 1];
  }
  
  // Parse the result and add methods
  return withMethods(parseToYYYYMMDD(result));
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
