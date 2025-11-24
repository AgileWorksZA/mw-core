/**
 * Branded types with methods for enhanced DX
 *
 * This demonstrates different approaches to adding methods to branded types
 */

import {
	addDaysToYYYYMMDD,
	addMonthsToYYYYMMDD,
	dateToYYYYMMDD,
	daysBetweenYYYYMMDD,
	formatYYYYMMDD,
	isAfterYYYYMMDD,
	isBeforeYYYYMMDD,
	yyyymmddToDate,
} from "../date/yyyymmdd";
import type { Brand } from "./branded";

// ===== Approach 1: Class-based wrapper =====
// Pros: Full method support, intuitive API
// Cons: Not a primitive, needs .value for string operations

export class YYYYMMDDClass {
	constructor(private readonly value: string & Brand<string, "YYYYMMDD">) {}

	// Comparison methods
	gt(other: YYYYMMDDClass | Date | string): boolean {
		const otherDate = this.normalizeDate(other);
		return this.value > otherDate;
	}

	gte(other: YYYYMMDDClass | Date | string): boolean {
		const otherDate = this.normalizeDate(other);
		return this.value >= otherDate;
	}

	lt(other: YYYYMMDDClass | Date | string): boolean {
		const otherDate = this.normalizeDate(other);
		return this.value < otherDate;
	}

	lte(other: YYYYMMDDClass | Date | string): boolean {
		const otherDate = this.normalizeDate(other);
		return this.value <= otherDate;
	}

	eq(other: YYYYMMDDClass | Date | string): boolean {
		const otherDate = this.normalizeDate(other);
		return this.value === otherDate;
	}

	// Date arithmetic
	addDays(days: number): YYYYMMDDClass {
		return new YYYYMMDDClass(addDaysToYYYYMMDD(this.value, days));
	}

	addMonths(months: number): YYYYMMDDClass {
		return new YYYYMMDDClass(addMonthsToYYYYMMDD(this.value, months));
	}

	daysBetween(other: YYYYMMDDClass | Date | string): number {
		const otherDate = this.normalizeDate(other);
		return daysBetweenYYYYMMDD(this.value, otherDate);
	}

	// Formatting
	format(separator = "-"): string {
		return formatYYYYMMDD(this.value, separator);
	}

	// Conversion
	toDate(): Date {
		return yyyymmddToDate(this.value);
	}

	toString(): string {
		return this.value;
	}

	valueOf(): string {
		return this.value;
	}

	toJSON(): string {
		return this.value;
	}

	// Helper to normalize different input types
	private normalizeDate(
		other: YYYYMMDDClass | Date | string,
	): string & Brand<string, "YYYYMMDD"> {
		if (other instanceof YYYYMMDDClass) {
			return other.value;
		}
		if (other instanceof Date) {
			return dateToYYYYMMDD(other);
		}
		// Assume it's already YYYYMMDD branded
		return other as string & Brand<string, "YYYYMMDD">;
	}
}

// ===== Approach 2: Proxy-based enhancement =====
// Pros: Behaves like a primitive, can use string operations directly
// Cons: More complex, potential performance overhead

export type YYYYMMDDWithMethods = string &
	Brand<string, "YYYYMMDD"> & {
		gt(other: Date | string): boolean;
		gte(other: Date | string): boolean;
		lt(other: Date | string): boolean;
		lte(other: Date | string): boolean;
		eq(other: Date | string): boolean;
		addDays(days: number): YYYYMMDDWithMethods;
		addMonths(months: number): YYYYMMDDWithMethods;
		daysBetween(other: Date | string): number;
		format(separator?: string): string;
		toDate(): Date;
	};

export function createYYYYMMDDWithMethods(
	value: string & Brand<string, "YYYYMMDD">,
): YYYYMMDDWithMethods {
	return new Proxy(value as any, {
		get(target, prop) {
			// First check if it's a string method/property
			if (prop in String.prototype || prop === "length") {
				const val = target[prop];
				return typeof val === "function" ? val.bind(target) : val;
			}

			// Then check our custom methods
			switch (prop) {
				case "gt":
					return (other: Date | string) => {
						const otherDate =
							other instanceof Date ? dateToYYYYMMDD(other) : other;
						return target > otherDate;
					};
				case "gte":
					return (other: Date | string) => {
						const otherDate =
							other instanceof Date ? dateToYYYYMMDD(other) : other;
						return target >= otherDate;
					};
				case "lt":
					return (other: Date | string) => {
						const otherDate =
							other instanceof Date ? dateToYYYYMMDD(other) : other;
						return target < otherDate;
					};
				case "lte":
					return (other: Date | string) => {
						const otherDate =
							other instanceof Date ? dateToYYYYMMDD(other) : other;
						return target <= otherDate;
					};
				case "eq":
					return (other: Date | string) => {
						const otherDate =
							other instanceof Date ? dateToYYYYMMDD(other) : other;
						return target === otherDate;
					};
				case "addDays":
					return (days: number) =>
						createYYYYMMDDWithMethods(addDaysToYYYYMMDD(target, days));
				case "addMonths":
					return (months: number) =>
						createYYYYMMDDWithMethods(addMonthsToYYYYMMDD(target, months));
				case "daysBetween":
					return (other: Date | string) => {
						const otherDate =
							other instanceof Date ? dateToYYYYMMDD(other) : other;
						return daysBetweenYYYYMMDD(target, otherDate as any);
					};
				case "format":
					return (separator?: string) => formatYYYYMMDD(target, separator);
				case "toDate":
					return () => yyyymmddToDate(target);
				case "toString":
				case "valueOf":
				case "toJSON":
					return () => target;
			}

			return target[prop];
		},
	}) as YYYYMMDDWithMethods;
}

// ===== Approach 3: Fluent chain wrapper =====
// Pros: Chainable API, clear when you're using methods vs string
// Cons: Need to call .chain() to access methods

export class YYYYMMDDChain {
	constructor(private value: string & Brand<string, "YYYYMMDD">) {}

	// Chainable methods that return YYYYMMDDChain
	addDays(days: number): YYYYMMDDChain {
		return new YYYYMMDDChain(addDaysToYYYYMMDD(this.value, days));
	}

	addMonths(months: number): YYYYMMDDChain {
		return new YYYYMMDDChain(addMonthsToYYYYMMDD(this.value, months));
	}

	// Methods that return other types
	gt(other: Date | string): boolean {
		const otherDate = other instanceof Date ? dateToYYYYMMDD(other) : other;
		return this.value > otherDate;
	}

	lt(other: Date | string): boolean {
		const otherDate = other instanceof Date ? dateToYYYYMMDD(other) : other;
		return this.value < otherDate;
	}

	format(separator?: string): string {
		return formatYYYYMMDD(this.value, separator);
	}

	// Get back the raw value
	valueOf(): string & Brand<string, "YYYYMMDD"> {
		return this.value;
	}
}

// Extension method to start chaining
export function chain(date: string & Brand<string, "YYYYMMDD">): YYYYMMDDChain {
	return new YYYYMMDDChain(date);
}

// ===== Approach 4: Utility object with methods =====
// Pros: Simple, no magic, tree-shakeable
// Cons: Not as fluent, need to pass date as first arg

export const YYYYMMDD = {
	gt: (
		date: string & Brand<string, "YYYYMMDD">,
		other: Date | string,
	): boolean => {
		const otherDate = other instanceof Date ? dateToYYYYMMDD(other) : other;
		return date > otherDate;
	},

	gte: (
		date: string & Brand<string, "YYYYMMDD">,
		other: Date | string,
	): boolean => {
		const otherDate = other instanceof Date ? dateToYYYYMMDD(other) : other;
		return date >= otherDate;
	},

	lt: (
		date: string & Brand<string, "YYYYMMDD">,
		other: Date | string,
	): boolean => {
		const otherDate = other instanceof Date ? dateToYYYYMMDD(other) : other;
		return date < otherDate;
	},

	lte: (
		date: string & Brand<string, "YYYYMMDD">,
		other: Date | string,
	): boolean => {
		const otherDate = other instanceof Date ? dateToYYYYMMDD(other) : other;
		return date <= otherDate;
	},

	eq: (
		date: string & Brand<string, "YYYYMMDD">,
		other: Date | string,
	): boolean => {
		const otherDate = other instanceof Date ? dateToYYYYMMDD(other) : other;
		return date === otherDate;
	},

	// ... other methods
};
