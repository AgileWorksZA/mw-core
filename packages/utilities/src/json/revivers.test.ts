/**
 * Tests for JSON reviver functions
 */

import { describe, expect, test } from "bun:test";
import type { HHMMSS, Period, YYYYMMDD } from "../types";
import {
	createMoneyWorksReviver,
	createTypedParser,
	parseDateJSON,
	parseMoneyWorksJSON,
	parseMoneyWorksResponse,
} from "./revivers";

describe("JSON revivers", () => {
	describe("createMoneyWorksReviver", () => {
		test("converts date fields to YYYYMMDD", () => {
			const reviver = createMoneyWorksReviver();
			const json = '{"transDate": "20250115", "amount": 100}';
			const parsed = JSON.parse(json, reviver);

			expect(parsed.transDate).toBe("20250115");
			expect(parsed.amount).toBe(100);
		});

		test("converts various date formats", () => {
			const reviver = createMoneyWorksReviver();
			const json = `{
        "transDate": "20250115",
        "enterDate": "2025-01-10",
        "dueDate": "2025-02-15T10:30:00Z"
      }`;
			const parsed = JSON.parse(json, reviver);

			expect(parsed.transDate).toBe("20250115");
			expect(parsed.enterDate).toBe("20250110");
			expect(parsed.dueDate).toBe("20250215");
		});

		test("converts period fields", () => {
			const reviver = createMoneyWorksReviver();
			const json = '{"period": 202501, "amount": 100}';
			const parsed = JSON.parse(json, reviver);

			expect(parsed.period).toBe(202501);
			expect(parsed.amount).toBe(100);
		});

		test("converts time fields", () => {
			const reviver = createMoneyWorksReviver();
			const json = '{"transTime": "143000", "name": "Test"}';
			const parsed = JSON.parse(json, reviver);

			expect(parsed.transTime).toBe("143000");
			expect(parsed.name).toBe("Test");
		});

		test("handles invalid values in non-strict mode", () => {
			const reviver = createMoneyWorksReviver({ strict: false });
			const json = '{"transDate": "invalid", "period": 999}';
			const parsed = JSON.parse(json, reviver);

			expect(parsed.transDate).toBe("invalid"); // Kept original
			expect(parsed.period).toBe(999); // Kept original
		});

		test("throws on invalid values in strict mode", () => {
			const reviver = createMoneyWorksReviver({ strict: true });
			const json = '{"transDate": "invalid"}';

			expect(() => JSON.parse(json, reviver)).toThrow("Invalid date value");
		});

		test("respects excluded fields", () => {
			const reviver = createMoneyWorksReviver({
				excludeFields: ["transDate"],
			});
			const json = '{"transDate": "20250115", "enterDate": "20250110"}';
			const parsed = JSON.parse(json, reviver);

			expect(parsed.transDate).toBe("20250115"); // Not converted
			expect(parsed.enterDate).toBe("20250110"); // Converted
		});

		test("handles additional date fields", () => {
			const reviver = createMoneyWorksReviver({
				additionalDateFields: ["customDate"],
			});
			const json = '{"customDate": "20250115", "otherField": "20250110"}';
			const parsed = JSON.parse(json, reviver);

			expect(parsed.customDate).toBe("20250115"); // Converted
			expect(parsed.otherField).toBe("20250110"); // Not converted
		});

		test("handles nested objects", () => {
			const reviver = createMoneyWorksReviver();
			const json = `{
        "transaction": {
          "transDate": "20250115",
          "period": 202501
        },
        "meta": {
          "created": "20250110"
        }
      }`;
			const parsed = JSON.parse(json, reviver);

			expect(parsed.transaction.transDate).toBe("20250115");
			expect(parsed.transaction.period).toBe(202501);
			expect(parsed.meta.created).toBe("20250110");
		});

		test("handles arrays", () => {
			const reviver = createMoneyWorksReviver();
			const json = `[
        {"transDate": "20250115", "period": 202501},
        {"transDate": "20250120", "period": 202502}
      ]`;
			const parsed = JSON.parse(json, reviver);

			expect(parsed[0].transDate).toBe("20250115");
			expect(parsed[0].period).toBe(202501);
			expect(parsed[1].transDate).toBe("20250120");
			expect(parsed[1].period).toBe(202502);
		});
	});

	describe("parseMoneyWorksJSON", () => {
		test("parses with default options", () => {
			const json = `{
        "id": 1001,
        "transDate": "20250115",
        "period": 202501,
        "transTime": "143000"
      }`;

			interface Transaction {
				id: number;
				transDate: YYYYMMDD;
				period: Period;
				transTime: HHMMSS;
			}

			const parsed = parseMoneyWorksJSON<Transaction>(json);
			expect(parsed.id).toBe(1001);
			expect(parsed.transDate.toString()).toBe("20250115");
			expect(parsed.period.valueOf()).toBe(202501);
			expect(parsed.transTime.toString()).toBe("143000");
		});

		test("parses with custom options", () => {
			const json = '{"transDate": "20250115", "period": 202501}';

			const parsed = parseMoneyWorksJSON(json, {
				convertDates: true,
				convertPeriods: false,
			});

			expect(parsed.transDate).toBe("20250115");
			expect(parsed.period).toBe(202501); // Not converted to Period type
		});
	});

	describe("parseDateJSON", () => {
		test("only converts dates", () => {
			const json = `{
        "transDate": "20250115",
        "period": 202501,
        "transTime": "143000"
      }`;

			const parsed = parseDateJSON(json);
			expect(parsed.transDate).toBe("20250115"); // Converted
			expect(parsed.period).toBe(202501); // Not converted
			expect(parsed.transTime).toBe("143000"); // Not converted
		});
	});

	describe("createTypedParser", () => {
		test("creates parser for specific fields", () => {
			interface Invoice {
				id: number;
				transDate: YYYYMMDD;
				dueDate: YYYYMMDD;
				period: Period;
				description: string;
			}

			const parseInvoice = createTypedParser<Invoice>(
				["transDate", "dueDate"],
				["period"],
			);

			const json = `{
        "id": 1001,
        "transDate": "20250115",
        "dueDate": "20250215",
        "period": 202501,
        "description": "Test invoice"
      }`;

			const invoice = parseInvoice(json);
			expect(invoice.transDate.toString()).toBe("20250115");
			expect(invoice.dueDate.toString()).toBe("20250215");
			expect(invoice.period.valueOf()).toBe(202501);
			expect(invoice.description).toBe("Test invoice");
		});

		test("handles missing fields gracefully", () => {
			interface TestData {
				id: number;
				transDate?: YYYYMMDD;
				period?: Period;
			}
			const parser = createTypedParser<TestData>(["transDate"], ["period"]);

			const json = '{"id": 1001}';
			const parsed = parser(json);

			expect(parsed.id).toBe(1001);
			expect(parsed.transDate).toBeUndefined();
			expect(parsed.period).toBeUndefined();
		});
	});

	describe("parseMoneyWorksResponse", () => {
		test("parses response body", async () => {
			const responseText = `{
        "transDate": "20250115",
        "period": 202501
      }`;

			const mockResponse = new Response(responseText, {
				headers: { "Content-Type": "application/json" },
			});

			const parsed = await parseMoneyWorksResponse(mockResponse);
			expect(parsed.transDate).toBe("20250115");
			expect(parsed.period).toBe(202501);
		});
	});

	describe("edge cases", () => {
		test("handles empty objects", () => {
			const parsed = parseMoneyWorksJSON("{}");
			expect(parsed).toEqual({});
		});

		test("handles null values", () => {
			const json = '{"transDate": null, "period": null}';
			const parsed = parseMoneyWorksJSON(json);

			expect(parsed.transDate).toBeNull();
			expect(parsed.period).toBeNull();
		});

		test("handles boolean values", () => {
			const json = '{"active": true, "transDate": "20250115"}';
			const parsed = parseMoneyWorksJSON(json);

			expect(parsed.active).toBe(true);
			expect(parsed.transDate).toBe("20250115");
		});

		test("validates time format", () => {
			const reviver = createMoneyWorksReviver();

			// Valid times
			expect(JSON.parse('{"transTime": "000000"}', reviver).transTime).toBe(
				"000000",
			);
			expect(JSON.parse('{"transTime": "235959"}', reviver).transTime).toBe(
				"235959",
			);

			// Invalid times (kept as-is in non-strict mode)
			expect(JSON.parse('{"transTime": "240000"}', reviver).transTime).toBe(
				"240000",
			);
			expect(JSON.parse('{"transTime": "126099"}', reviver).transTime).toBe(
				"126099",
			);
		});
	});
});
