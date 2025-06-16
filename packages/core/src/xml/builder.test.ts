/**
 * XML Builder Unit Tests
 *
 * Tests for XML building functionality.
 */

import { describe, expect, test } from "bun:test";
import type { DetailCamel, NameCamel, ProductCamel } from "../tables";
import { XMLBuilder } from "./builder";

describe("XMLBuilder", () => {
  describe("build()", () => {
    test("builds basic XML structure", () => {
      const records: Partial<NameCamel>[] = [
        {
          code: "TEST001",
          name: "Test Name",
        },
      ];

      const xml = XMLBuilder.build("Name", records);

      // Check XML declaration
      expect(xml).toStartWith('<?xml version="1.0" encoding="UTF-8"?>');

      // Check structure
      expect(xml).toContain("<import>");
      expect(xml).toContain('<table name="name">');
      expect(xml).toContain("<name>");
      expect(xml).toContain("<Code>TEST001</Code>");
      expect(xml).toContain("<Name>Test Name</Name>");
      expect(xml).toContain("</name>");
      expect(xml).toContain("</table>");
      expect(xml).toContain("</import>");
    });

    test("handles multiple records", () => {
      const records: Partial<ProductCamel>[] = [
        { code: "PROD001", description: "Product 1" },
        { code: "PROD002", description: "Product 2" },
      ];

      const xml = XMLBuilder.build("Product", records);

      expect(xml).toContain("<Code>PROD001</Code>");
      expect(xml).toContain("<Code>PROD002</Code>");
      expect(xml).toContain("<Description>Product 1</Description>");
      expect(xml).toContain("<Description>Product 2</Description>");
    });

    test("applies import mode", () => {
      const records: Partial<NameCamel>[] = [{ code: "TEST" }];

      const xml = XMLBuilder.build("Name", records, { mode: "upsert" });

      expect(xml).toContain('mode="upsert"');
    });

    test("handles work-it-out fields", () => {
      const records: Partial<NameCamel>[] = [{ code: "TEST" }];

      const xml = XMLBuilder.build("Name", records, {
        workItOut: ["balance", "creditLimit"],
      });

      expect(xml).toContain('work-it-out="balance,creditLimit"');
    });

    test("formats dates correctly", () => {
      const date = new Date("2024-01-15");
      const records = [
        {
          code: "TEST",
          transDate: date,
        },
      ];

      const xml = XMLBuilder.build("Transaction", records);

      expect(xml).toContain("<TransDate>20240115</TransDate>");
    });

    test("formats booleans as 0/1", () => {
      const records: Partial<ProductCamel>[] = [
        {
          code: "TEST",
          discontinued: true,
          taxExempt: false,
        },
      ];

      const xml = XMLBuilder.build("Product", records);

      expect(xml).toContain("<Discontinued>1</Discontinued>");
      expect(xml).toContain("<TaxExempt>0</TaxExempt>");
    });

    test("formats monetary values with 2 decimals", () => {
      const records: Partial<ProductCamel>[] = [
        {
          code: "TEST",
          sellPrice: 99.999,
          buyPrice: 45.5,
        },
      ];

      const xml = XMLBuilder.build("Product", records);

      expect(xml).toContain("<SellPrice>100</SellPrice>");
      expect(xml).toContain("<BuyPrice>45.5</BuyPrice>");
    });

    test("skips undefined and null values", () => {
      const records: Partial<NameCamel>[] = [
        {
          code: "TEST",
          name: "Test",
          phone: undefined,
          email: null,
        },
      ];

      const xml = XMLBuilder.build("Name", records);

      expect(xml).not.toContain("Phone");
      expect(xml).not.toContain("Email");
    });
  });

  describe("buildTransactionWithDetails()", () => {
    test("builds transaction with detail subfile", () => {
      const transaction = {
        nameCode: "CUST001",
        ourRef: "INV001",
      };

      const details: Partial<DetailCamel>[] = [
        {
          account: "4100",
          debit: 0,
          credit: 100,
          description: "Sales",
        },
      ];

      const xml = XMLBuilder.buildTransactionWithDetails(transaction, details);

      expect(xml).toContain("<NameCode>CUST001</NameCode>");
      expect(xml).toContain("<OurRef>INV001</OurRef>");
      expect(xml).toContain('<subfile name="detail">');
      expect(xml).toContain("<detail>");
      expect(xml).toContain("<Detail.Account>4100</Detail.Account>");
      expect(xml).toContain("<Detail.Credit>100</Detail.Credit>");
      expect(xml).toContain("</detail>");
      expect(xml).toContain("</subfile>");
    });
  });

  describe("validate()", () => {
    test("validates Detail field lengths", () => {
      const detail: Partial<DetailCamel> = {
        account: "VERYLONGACCOUNTCODE", // > 14 chars
        description: "A".repeat(300), // > 255 chars
        taxCode: "VERYLONGTAX", // > 7 chars
      };

      const errors = XMLBuilder.validate("Detail", detail);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.includes("Account exceeds 14"))).toBe(true);
      expect(errors.some((e) => e.includes("Description exceeds 255"))).toBe(
        true,
      );
      expect(errors.some((e) => e.includes("TaxCode exceeds 7"))).toBe(true);
    });

    test("returns empty array for valid data", () => {
      const detail: Partial<DetailCamel> = {
        account: "4100",
        description: "Valid description",
        taxCode: "GST",
      };

      const errors = XMLBuilder.validate("Detail", detail);

      expect(errors).toHaveLength(0);
    });
  });
});
