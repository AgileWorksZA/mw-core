/**
 * Tests for YYYYMMDD date utilities
 */

import { describe, expect, test } from "bun:test";
import {
	addDaysToYYYYMMDD,
	addMonthsToYYYYMMDD,
	compareYYYYMMDD,
	createYYYYMMDD,
	dateToYYYYMMDD,
	daysBetweenYYYYMMDD,
	endOfMonthYYYYMMDD,
	formatYYYYMMDD,
	isAfterYYYYMMDD,
	isBeforeYYYYMMDD,
	isYYYYMMDD,
	parseToYYYYMMDD,
	startOfMonthYYYYMMDD,
	tryCreateYYYYMMDD,
	YYYYMMDDUtils,
	yyyymmddToDate,
} from "./yyyymmdd";

describe("YYYYMMDD utilities", () => {
	describe("isYYYYMMDD", () => {
		test("validates correct format", () => {
			expect(isYYYYMMDD("20250115")).toBe(true);
			expect(isYYYYMMDD("19991231")).toBe(true);
			expect(isYYYYMMDD("20200229")).toBe(true); // Leap year
		});

		test("rejects invalid formats", () => {
			expect(isYYYYMMDD("2025-01-15")).toBe(false);
			expect(isYYYYMMDD("20251301")).toBe(false); // Invalid month
			expect(isYYYYMMDD("20250132")).toBe(false); // Invalid day
			expect(isYYYYMMDD("20190229")).toBe(false); // Not a leap year
			expect(isYYYYMMDD("202501")).toBe(false); // Too short
			expect(isYYYYMMDD("not-a-date")).toBe(false);
		});
	});

	describe("createYYYYMMDD", () => {
		test("creates valid YYYYMMDD", () => {
			const date = createYYYYMMDD("20250115");
			expect(date).toBe("20250115");
		});

		test("throws on invalid date", () => {
			expect(() => createYYYYMMDD("20251301")).toThrow(
				"Invalid YYYYMMDD format",
			);
			expect(() => createYYYYMMDD("invalid")).toThrow(
				"Invalid YYYYMMDD format",
			);
		});
	});

	describe("tryCreateYYYYMMDD", () => {
		test("returns YYYYMMDD for valid date", () => {
			expect(tryCreateYYYYMMDD("20250115")).toBe("20250115");
		});

		test("returns null for invalid date", () => {
			expect(tryCreateYYYYMMDD("20251301")).toBeNull();
			expect(tryCreateYYYYMMDD("invalid")).toBeNull();
		});
	});

	describe("date conversions", () => {
		test("converts Date to YYYYMMDD", () => {
			const date = new Date(2025, 0, 15); // January 15, 2025
			expect(dateToYYYYMMDD(date)).toBe("20250115");
		});

		test("converts YYYYMMDD to Date", () => {
			const date = yyyymmddToDate(createYYYYMMDD("20250115"));
			expect(date.getFullYear()).toBe(2025);
			expect(date.getMonth()).toBe(0); // January
			expect(date.getDate()).toBe(15);
		});

		test("round trip conversion", () => {
			const original = "20250115";
			const date = yyyymmddToDate(createYYYYMMDD(original));
			const back = dateToYYYYMMDD(date);
			expect(back).toBe(original);
		});
	});

	describe("parseToYYYYMMDD", () => {
		test("parses YYYYMMDD format", () => {
			expect(parseToYYYYMMDD("20250115")).toBe("20250115");
		});

		test("parses ISO date format", () => {
			expect(parseToYYYYMMDD("2025-01-15")).toBe("20250115");
			expect(parseToYYYYMMDD("2025-01-15T10:30:00")).toBe("20250115");
		});

		test("parses slash format", () => {
			expect(parseToYYYYMMDD("2025/01/15")).toBe("20250115");
		});

		test("parses Date object", () => {
			const date = new Date(2025, 0, 15);
			expect(parseToYYYYMMDD(date)).toBe("20250115");
		});

		test("throws on invalid format", () => {
			expect(() => parseToYYYYMMDD("invalid")).toThrow("Cannot parse date");
			expect(() => parseToYYYYMMDD("01-15-2025")).toThrow("Cannot parse date");
		});
	});

	describe("formatYYYYMMDD", () => {
		test("formats with default separator", () => {
			const date = createYYYYMMDD("20250115");
			expect(formatYYYYMMDD(date)).toBe("2025-01-15");
		});

		test("formats with custom separator", () => {
			const date = createYYYYMMDD("20250115");
			expect(formatYYYYMMDD(date, "/")).toBe("2025/01/15");
			expect(formatYYYYMMDD(date, "")).toBe("20250115");
		});
	});

	describe("date arithmetic", () => {
		test("adds days", () => {
			const date = createYYYYMMDD("20250115");
			expect(addDaysToYYYYMMDD(date, 1)).toBe("20250116");
			expect(addDaysToYYYYMMDD(date, 7)).toBe("20250122");
			expect(addDaysToYYYYMMDD(date, -5)).toBe("20250110");
		});

		test("handles month boundaries", () => {
			const date = createYYYYMMDD("20250131");
			expect(addDaysToYYYYMMDD(date, 1)).toBe("20250201");
		});

		test("adds months", () => {
			const date = createYYYYMMDD("20250115");
			expect(addMonthsToYYYYMMDD(date, 1)).toBe("20250215");
			expect(addMonthsToYYYYMMDD(date, 12)).toBe("20260115");
			expect(addMonthsToYYYYMMDD(date, -1)).toBe("20241215");
		});

		test("handles month-end dates", () => {
			const date = createYYYYMMDD("20250131");
			expect(addMonthsToYYYYMMDD(date, 1)).toBe("20250228"); // Feb has 28 days
		});

		test("calculates days between dates", () => {
			const from = createYYYYMMDD("20250115");
			const to = createYYYYMMDD("20250120");
			expect(daysBetweenYYYYMMDD(from, to)).toBe(5);
			expect(daysBetweenYYYYMMDD(to, from)).toBe(-5);
		});
	});

	describe("date comparisons", () => {
		test("compares dates", () => {
			const date1 = createYYYYMMDD("20250115");
			const date2 = createYYYYMMDD("20250120");

			expect(compareYYYYMMDD(date1, date2)).toBeLessThan(0);
			expect(compareYYYYMMDD(date2, date1)).toBeGreaterThan(0);
			expect(compareYYYYMMDD(date1, date1)).toBe(0);
		});

		test("checks before/after", () => {
			const date1 = createYYYYMMDD("20250115");
			const date2 = createYYYYMMDD("20250120");

			expect(isBeforeYYYYMMDD(date1, date2)).toBe(true);
			expect(isBeforeYYYYMMDD(date2, date1)).toBe(false);
			expect(isBeforeYYYYMMDD(date1, date1)).toBe(false);

			expect(isAfterYYYYMMDD(date2, date1)).toBe(true);
			expect(isAfterYYYYMMDD(date1, date2)).toBe(false);
			expect(isAfterYYYYMMDD(date1, date1)).toBe(false);
		});
	});

	describe("month operations", () => {
		test("gets start of month", () => {
			expect(startOfMonthYYYYMMDD(createYYYYMMDD("20250115"))).toBe("20250101");
			expect(startOfMonthYYYYMMDD(createYYYYMMDD("20250131"))).toBe("20250101");
		});

		test("gets end of month", () => {
			expect(endOfMonthYYYYMMDD(createYYYYMMDD("20250115"))).toBe("20250131");
			expect(endOfMonthYYYYMMDD(createYYYYMMDD("20250201"))).toBe("20250228");
			expect(endOfMonthYYYYMMDD(createYYYYMMDD("20200215"))).toBe("20200229"); // Leap year
		});
	});

	describe("YYYYMMDD namespace", () => {
		test("provides all functions", () => {
			expect(YYYYMMDDUtils.is("20250115")).toBe(true);
			expect(YYYYMMDDUtils.create("20250115")).toBe("20250115");
			expect(YYYYMMDDUtils.tryCreate("invalid")).toBeNull();
			expect(YYYYMMDDUtils.format(YYYYMMDDUtils.create("20250115"))).toBe(
				"2025-01-15",
			);
		});

		test("today returns valid date", () => {
			const today = YYYYMMDDUtils.today();
			expect(YYYYMMDDUtils.is(today)).toBe(true);
		});
	});

	describe("string behavior", () => {
		test("works with string comparison", () => {
			const date = createYYYYMMDD("20250115");
			expect(date === "20250115").toBe(true);
			expect("20250115" === date).toBe(true);
		});

		test("works with JSON", () => {
			const date = createYYYYMMDD("20250115");
			const obj = { date, name: "Test" };
			const json = JSON.stringify(obj);
			expect(json).toBe('{"date":"20250115","name":"Test"}');

			const parsed = JSON.parse(json);
			expect(parsed.date).toBe("20250115");
		});
	});
});
