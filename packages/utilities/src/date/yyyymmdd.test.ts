/**
 * Tests for YYYYMMDD date utilities
 */

import { describe, expect, test } from "bun:test";
import {
	YYYYMMDDUtils,
	addDaysToYYYYMMDD,
	addMonthsToYYYYMMDD,
	compareYYYYMMDD,
	createYYYYMMDD,
	d,
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
	yyyymmddToDate,
} from "@moneyworks/utilities/date/yyyymmdd";

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
			expect(date.toString()).toBe("20250115");
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
			expect(tryCreateYYYYMMDD("20250115")?.toString()).toBe("20250115");
		});

		test("returns null for invalid date", () => {
			expect(tryCreateYYYYMMDD("20251301")).toBeNull();
			expect(tryCreateYYYYMMDD("invalid")).toBeNull();
		});
	});

	describe("date conversions", () => {
		test("converts Date to YYYYMMDD", () => {
			const date = new Date(2025, 0, 15); // January 15, 2025
			expect(dateToYYYYMMDD(date).toString()).toBe("20250115");
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
			expect(back.toString()).toBe(original);
		});
	});

	describe("parseToYYYYMMDD", () => {
		test("parses YYYYMMDD format", () => {
			expect(parseToYYYYMMDD("20250115").toString()).toBe("20250115");
		});

		test("parses ISO date format", () => {
			expect(parseToYYYYMMDD("2025-01-15").toString()).toBe("20250115");
			expect(parseToYYYYMMDD("2025-01-15T10:30:00").toString()).toBe(
				"20250115",
			);
		});

		test("parses slash format", () => {
			expect(parseToYYYYMMDD("2025/01/15").toString()).toBe("20250115");
		});

		test("parses Date object", () => {
			const date = new Date(2025, 0, 15);
			expect(parseToYYYYMMDD(date).toString()).toBe("20250115");
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
			expect(addDaysToYYYYMMDD(date, 1).toString()).toBe("20250116");
			expect(addDaysToYYYYMMDD(date, 7).toString()).toBe("20250122");
			expect(addDaysToYYYYMMDD(date, -5).toString()).toBe("20250110");
		});

		test("handles month boundaries", () => {
			const date = createYYYYMMDD("20250131");
			expect(addDaysToYYYYMMDD(date, 1).toString()).toBe("20250201");
		});

		test("adds months", () => {
			const date = createYYYYMMDD("20250115");
			expect(addMonthsToYYYYMMDD(date, 1).toString()).toBe("20250215");
			expect(addMonthsToYYYYMMDD(date, 12).toString()).toBe("20260115");
			expect(addMonthsToYYYYMMDD(date, -1).toString()).toBe("20241215");
		});

		test("handles month-end dates", () => {
			const date = createYYYYMMDD("20250131");
			expect(addMonthsToYYYYMMDD(date, 1).toString()).toBe("20250228"); // Feb has 28 days
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
			expect(startOfMonthYYYYMMDD(createYYYYMMDD("20250115")).toString()).toBe(
				"20250101",
			);
			expect(startOfMonthYYYYMMDD(createYYYYMMDD("20250131")).toString()).toBe(
				"20250101",
			);
		});

		test("gets end of month", () => {
			expect(endOfMonthYYYYMMDD(createYYYYMMDD("20250115")).toString()).toBe(
				"20250131",
			);
			expect(endOfMonthYYYYMMDD(createYYYYMMDD("20250201")).toString()).toBe(
				"20250228",
			);
			expect(endOfMonthYYYYMMDD(createYYYYMMDD("20200215")).toString()).toBe(
				"20200229",
			); // Leap year
		});
	});

	describe("YYYYMMDD namespace", () => {
		test("provides all functions", () => {
			expect(YYYYMMDDUtils.is("20250115")).toBe(true);
			expect(YYYYMMDDUtils.create("20250115").toString()).toBe("20250115");
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

	describe("tagged template literal", () => {
		test("creates date from template literal", () => {
			const date = d`20250115`;
			expect(date.toString()).toBe("20250115");
		});

		test("parses various formats", () => {
			expect(d`20250115`.toString()).toBe("20250115");
			expect(d`2025-01-15`.toString()).toBe("20250115");
			expect(d`2025/01/15`.toString()).toBe("20250115");
		});

		test("works with interpolation", () => {
			const year = 2025;
			const month = "01";
			const day = "15";
			expect(d`${year}${month}${day}`.toString()).toBe("20250115");
		});

		test("works with Date objects", () => {
			const jsDate = new Date(2025, 0, 15);
			expect(d`${jsDate}`.toString()).toBe("20250115");
		});

		test("throws on invalid dates", () => {
			expect(() => d`20251301`).toThrow("Cannot parse date");
			expect(() => d`invalid`).toThrow("Cannot parse date");
		});

		test("d function works as tagged template", () => {
			const date = d`20250115`;
			expect(date.toString()).toBe("20250115");
		});

		test("works in comparisons", () => {
			const date1 = d`20250115`;
			const date2 = d`20250120`;
			expect(date1 < date2).toBe(true);
			expect(date1 === d`20250115`).toBe(true);
		});

		test("works with complex interpolation", () => {
			const getDate = () => new Date(2025, 0, 15);
			const date = d`${getDate()}`;
			expect(date.toString()).toBe("20250115");
		});
	});

	describe("YYYYMMDD with methods", () => {
		test("comparison methods work", () => {
			const date = d`20250115`;
			const earlier = d`20250110`;
			const later = d`20250120`;

			// gt (greater than)
			expect(date.gt(earlier)).toBe(true);
			expect(date.gt(later)).toBe(false);
			expect(date.gt(new Date(2025, 0, 10))).toBe(true);

			// lt (less than)
			expect(date.lt(later)).toBe(true);
			expect(date.lt(earlier)).toBe(false);

			// gte (greater than or equal)
			expect(date.gte(date)).toBe(true);
			expect(date.gte(earlier)).toBe(true);

			// lte (less than or equal)
			expect(date.lte(date)).toBe(true);
			expect(date.lte(later)).toBe(true);

			// eq (equal)
			expect(date.eq(d`20250115`)).toBe(true);
			expect(date.eq(new Date(2025, 0, 15))).toBe(true);
		});

		test("arithmetic methods work", () => {
			const date = d`20250115`;

			// addDays
			expect(date.addDays(5).toString()).toBe("20250120");
			expect(date.addDays(-5).toString()).toBe("20250110");

			// addMonths
			expect(date.addMonths(1).toString()).toBe("20250215");
			expect(date.addMonths(-1).toString()).toBe("20241215");

			// subtract (days between)
			expect(date.subtract(d`20250110`)).toBe(5);
			expect(date.subtract(d`20250120`)).toBe(-5);
		});

		test("format method works", () => {
			const date = d`20250115`;
			expect(date.format()).toBe("2025-01-15");
			expect(date.format("/")).toBe("2025/01/15");
			expect(date.format("")).toBe("20250115");
		});

		test("conversion methods work", () => {
			const date = d`20250115`;

			// toDate
			const jsDate = date.toDate();
			expect(jsDate.getFullYear()).toBe(2025);
			expect(jsDate.getMonth()).toBe(0);
			expect(jsDate.getDate()).toBe(15);

			// toPeriod
			expect(date.toPeriod()).toBe(202501);
		});

		test("validation methods work", () => {
			// isWeekend
			const wednesday = d`20250115`; // Jan 15, 2025 is a Wednesday
			const saturday = d`20250118`; // Jan 18, 2025 is a Saturday
			const sunday = d`20250119`; // Jan 19, 2025 is a Sunday

			expect(wednesday.isWeekend()).toBe(false);
			expect(saturday.isWeekend()).toBe(true);
			expect(sunday.isWeekend()).toBe(true);

			// isLeapYear
			const leapYear = d`20240215`; // 2024 is a leap year
			const nonLeapYear = d`20250215`; // 2025 is not a leap year
			const century = d`19000215`; // 1900 is not a leap year
			const quadCentury = d`20000215`; // 2000 is a leap year

			expect(leapYear.isLeapYear()).toBe(true);
			expect(nonLeapYear.isLeapYear()).toBe(false);
			expect(century.isLeapYear()).toBe(false);
			expect(quadCentury.isLeapYear()).toBe(true);
		});

		test("string methods still work", () => {
			const date = d`20250115`;

			// String methods
			expect(date.substring(0, 4)).toBe("2025");
			expect(date.length).toBe(8);
			expect(date.charAt(4)).toBe("0");
			expect(date.indexOf("01")).toBe(4);
		});

		test("method chaining works", () => {
			const date = d`20250115`;

			const result = date.addMonths(1).addDays(5).format("/");

			expect(result).toBe("2025/02/20");

			// Can chain comparisons
			const isValid =
				date.addMonths(1).gt(date) && date.addMonths(1).lt(d`20250301`);

			expect(isValid).toBe(true);
		});

		test("works with different input types", () => {
			const date = d`20250115`;

			// Compare with Date
			expect(date.gt(new Date(2025, 0, 10))).toBe(true);
			expect(date.lt(new Date(2025, 0, 20))).toBe(true);

			// Compare with string (various formats)
			expect(date.eq("20250115")).toBe(true);
			expect(date.eq("2025-01-15")).toBe(true);
			expect(date.eq("2025/01/15")).toBe(true);

			// Subtract with different types
			expect(date.subtract(new Date(2025, 0, 10))).toBe(5);
			expect(date.subtract("2025-01-10")).toBe(5);
		});
	});
});
