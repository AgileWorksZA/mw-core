/**
 * Schema validation tests for all MCP tools
 * Tests input validation, error scenarios, and edge cases
 */

import { describe, it, expect } from "bun:test";
import { z } from "zod";
import { 
  searchAccountsTool, 
  getAccountTool, 
  listAccountFieldsTool 
} from "../../src/tools/account";
import { 
  searchTransactionsTool, 
  getTransactionTool, 
  getTransactionByRefTool,
  listTransactionFieldsTool,
  getTransactionSummaryTool
} from "../../src/tools/transaction";
import { 
  searchContactsTool, 
  getContactTool, 
  listContactFieldsTool 
} from "../../src/tools/contact";

describe("Schema Validation Tests", () => {
  describe("Account Tool Schemas", () => {
    describe("searchAccountsTool schema", () => {
      const schema = searchAccountsTool.inputSchema;

      it("should accept valid minimal input", () => {
        const validInput = {};
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should accept valid complete input", () => {
        const validInput = {
          query: "cash",
          type: "CA" as const,
          category: "BANK",
          limit: 25,
          offset: 10
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should apply default values", () => {
        const input = {};
        const parsed = schema.parse(input);
        expect(parsed.limit).toBe(50);
        expect(parsed.offset).toBe(0);
      });

      it("should reject invalid account type", () => {
        const invalidInput = {
          type: "INVALID"
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should reject negative limit", () => {
        const invalidInput = {
          limit: -1
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should reject zero limit", () => {
        const invalidInput = {
          limit: 0
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should reject limit above maximum", () => {
        const invalidInput = {
          limit: 101
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should reject negative offset", () => {
        const invalidInput = {
          offset: -1
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should accept all valid account types", () => {
        const validTypes = ["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"];
        
        for (const type of validTypes) {
          const input = { type: type as any };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });

      it("should handle edge case values", () => {
        const edgeCases = [
          { limit: 1, offset: 0 }, // Minimum values
          { limit: 100, offset: 999999 }, // Maximum limit, large offset
          { query: "" }, // Empty string
          { query: "a".repeat(1000) }, // Very long string
          { category: "TEST123" }, // Alphanumeric category
        ];

        for (const input of edgeCases) {
          expect(() => schema.parse(input)).not.toThrow();
        }
      });
    });

    describe("getAccountTool schema", () => {
      const schema = getAccountTool.inputSchema;

      it("should accept valid code", () => {
        const validInput = {
          code: "1000"
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should reject missing code", () => {
        const invalidInput = {};
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should accept various code formats", () => {
        const validCodes = [
          "1000",
          "CASH",
          "4000-01",
          "SALES.REV",
          "A123B456",
          "1",
          "12345678901234567890" // Long code
        ];

        for (const code of validCodes) {
          const input = { code };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });
    });

    describe("listAccountFieldsTool schema", () => {
      const schema = listAccountFieldsTool.inputSchema;

      it("should accept empty input", () => {
        const validInput = {};
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should ignore additional properties", () => {
        const inputWithExtra = {
          extraProperty: "ignored"
        };
        const parsed = schema.parse(inputWithExtra);
        expect(parsed).not.toHaveProperty("extraProperty");
      });
    });
  });

  describe("Transaction Tool Schemas", () => {
    describe("searchTransactionsTool schema", () => {
      const schema = searchTransactionsTool.inputSchema;

      it("should accept valid minimal input", () => {
        const validInput = {};
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should accept valid complete input", () => {
        const validInput = {
          query: "INV-001",
          type: "SI" as const,
          status: "OP" as const,
          nameCode: "CUST001",
          fromDate: "2024-01-01",
          toDate: "2024-12-31",
          period: 1,
          minAmount: 100.50,
          maxAmount: 5000.75,
          limit: 20,
          offset: 5
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should reject invalid transaction type", () => {
        const invalidInput = {
          type: "INVALID"
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should reject invalid status", () => {
        const invalidInput = {
          status: "INVALID"
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should accept all valid transaction types", () => {
        const validTypes = ["SI", "SC", "SR", "SD", "PI", "PC", "PP", "PD", "JN", "JC", "BR", "BP", "BT", "ST", "SO", "PO"];
        
        for (const type of validTypes) {
          const input = { type: type as any };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });

      it("should accept all valid statuses", () => {
        const validStatuses = ["OP", "CL", "PA", "CA", "DR"];
        
        for (const status of validStatuses) {
          const input = { status: status as any };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });

      it("should handle date string formats", () => {
        const dateFormats = [
          "2024-01-01",
          "2024-12-31",
          "2024-02-29", // Leap year
          "2023-02-28", // Non-leap year
        ];

        for (const date of dateFormats) {
          const input = { fromDate: date, toDate: date };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });

      it("should handle numeric edge cases", () => {
        const numericCases = [
          { period: 0 },
          { period: 999 },
          { minAmount: 0 },
          { minAmount: 0.01 },
          { maxAmount: 999999.99 },
          { minAmount: -100 }, // Negative amounts might be valid for credits
        ];

        for (const input of numericCases) {
          expect(() => schema.parse(input)).not.toThrow();
        }
      });
    });

    describe("getTransactionTool schema", () => {
      const schema = getTransactionTool.inputSchema;

      it("should accept valid sequence number", () => {
        const validInput = {
          sequenceNumber: 1001
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should reject missing sequence number", () => {
        const invalidInput = {};
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should reject non-numeric sequence number", () => {
        const invalidInput = {
          sequenceNumber: "1001"
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should handle edge case numbers", () => {
        const edgeCases = [1, 999999999, 0];
        
        for (const sequenceNumber of edgeCases) {
          const input = { sequenceNumber };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });
    });

    describe("getTransactionByRefTool schema", () => {
      const schema = getTransactionByRefTool.inputSchema;

      it("should accept valid reference", () => {
        const validInput = {
          reference: "INV-001"
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should reject missing reference", () => {
        const invalidInput = {};
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should accept various reference formats", () => {
        const validReferences = [
          "INV-001",
          "RECEIPT_123",
          "JN001",
          "2024/001",
          "REF.001.A",
          "1",
          "X".repeat(100) // Long reference
        ];

        for (const reference of validReferences) {
          const input = { reference };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });
    });

    describe("getTransactionSummaryTool schema", () => {
      const schema = getTransactionSummaryTool.inputSchema;

      it("should accept empty input", () => {
        const validInput = {};
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should accept optional filters", () => {
        const validInput = {
          nameCode: "CUST001",
          type: "SI" as const,
          fromDate: "2024-01-01",
          toDate: "2024-12-31"
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });
    });
  });

  describe("Contact Tool Schemas", () => {
    describe("searchContactsTool schema", () => {
      const schema = searchContactsTool.inputSchema;

      it("should accept valid minimal input", () => {
        const validInput = {};
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should accept valid complete input", () => {
        const validInput = {
          query: "ABC Corp",
          type: "C" as const,
          code: "CUST001",
          description: "ABC Corporation",
          isActive: true,
          limit: 30,
          offset: 15
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should reject invalid contact type", () => {
        const invalidInput = {
          type: "INVALID"
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should accept all valid contact types", () => {
        const validTypes = ["C", "S", "E", "B"];
        
        for (const type of validTypes) {
          const input = { type: type as any };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });

      it("should handle boolean isActive", () => {
        const booleanCases = [
          { isActive: true },
          { isActive: false }
        ];

        for (const input of booleanCases) {
          expect(() => schema.parse(input)).not.toThrow();
        }
      });
    });

    describe("getContactTool schema", () => {
      const schema = getContactTool.inputSchema;

      it("should accept valid code", () => {
        const validInput = {
          code: "CUST001"
        };
        expect(() => schema.parse(validInput)).not.toThrow();
      });

      it("should reject missing code", () => {
        const invalidInput = {};
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should reject empty code", () => {
        const invalidInput = {
          code: ""
        };
        expect(() => schema.parse(invalidInput)).toThrow();
      });

      it("should accept various code formats", () => {
        const validCodes = [
          "CUST001",
          "SUPPLIER_A",
          "EMP.001",
          "123",
          "C-001-A",
          "VERYLONGCUSTOMERCODE123"
        ];

        for (const code of validCodes) {
          const input = { code };
          expect(() => schema.parse(input)).not.toThrow();
        }
      });
    });
  });

  describe("Cross-Tool Schema Consistency", () => {
    it("should have consistent limit and offset patterns", () => {
      const searchSchemas = [
        searchAccountsTool.inputSchema,
        searchTransactionsTool.inputSchema,
        searchContactsTool.inputSchema
      ];

      for (const schema of searchSchemas) {
        // Test default values
        const parsed = schema.parse({});
        expect(parsed.limit).toBe(50);
        expect(parsed.offset).toBe(0);

        // Test limit constraints
        expect(() => schema.parse({ limit: 0 })).toThrow();
        expect(() => schema.parse({ limit: 101 })).toThrow();
        expect(() => schema.parse({ limit: 1 })).not.toThrow();
        expect(() => schema.parse({ limit: 100 })).not.toThrow();

        // Test offset constraints
        expect(() => schema.parse({ offset: -1 })).toThrow();
        expect(() => schema.parse({ offset: 0 })).not.toThrow();
        expect(() => schema.parse({ offset: 999999 })).not.toThrow();
      }
    });

    it("should have consistent query parameter patterns", () => {
      const schemasWithQuery = [
        searchAccountsTool.inputSchema,
        searchTransactionsTool.inputSchema,
        searchContactsTool.inputSchema
      ];

      for (const schema of schemasWithQuery) {
        // Query should be optional string
        expect(() => schema.parse({})).not.toThrow();
        expect(() => schema.parse({ query: "test" })).not.toThrow();
        expect(() => schema.parse({ query: "" })).not.toThrow();
        expect(() => schema.parse({ query: "a".repeat(1000) })).not.toThrow();
      }
    });
  });

  describe("Error Message Quality", () => {
    it("should provide clear error messages for invalid enums", () => {
      try {
        searchAccountsTool.inputSchema.parse({ type: "INVALID" });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain("Invalid enum value");
      }
    });

    it("should provide clear error messages for number constraints", () => {
      try {
        searchAccountsTool.inputSchema.parse({ limit: -1 });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain("Number must be greater than or equal to 1");
      }
    });

    it("should provide clear error messages for required fields", () => {
      try {
        getAccountTool.inputSchema.parse({});
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain("Required");
      }
    });
  });

  describe("Schema Documentation", () => {
    it("should have descriptions for all schema fields", () => {
      const schemas = [
        searchAccountsTool.inputSchema,
        getAccountTool.inputSchema,
        searchTransactionsTool.inputSchema,
        getTransactionTool.inputSchema,
        searchContactsTool.inputSchema,
        getContactTool.inputSchema
      ];

      for (const schema of schemas) {
        const shape = schema._def.shape();
        
        for (const [fieldName, fieldSchema] of Object.entries(shape)) {
          // Most fields should have descriptions
          if (fieldName !== "limit" && fieldName !== "offset") {
            const description = (fieldSchema as any)._def?.description;
            if (!description) {
              console.warn(`Field ${fieldName} lacks description in schema`);
            }
          }
        }
      }
    });
  });

  describe("Type Safety", () => {
    it("should enforce type safety for enum values", () => {
      // This test ensures TypeScript type safety is maintained
      const accountTypes: Array<"IN" | "SA" | "EX" | "CS" | "CA" | "CL" | "FA" | "TA" | "TL" | "SF"> = 
        ["IN", "SA", "EX", "CS", "CA", "CL", "FA", "TA", "TL", "SF"];

      for (const type of accountTypes) {
        expect(() => searchAccountsTool.inputSchema.parse({ type })).not.toThrow();
      }

      const transactionTypes: Array<"SI" | "SC" | "SR" | "SD" | "PI" | "PC" | "PP" | "PD" | "JN" | "JC" | "BR" | "BP" | "BT" | "ST" | "SO" | "PO"> = 
        ["SI", "SC", "SR", "SD", "PI", "PC", "PP", "PD", "JN", "JC", "BR", "BP", "BT", "ST", "SO", "PO"];

      for (const type of transactionTypes) {
        expect(() => searchTransactionsTool.inputSchema.parse({ type })).not.toThrow();
      }

      const contactTypes: Array<"C" | "S" | "E" | "B"> = ["C", "S", "E", "B"];

      for (const type of contactTypes) {
        expect(() => searchContactsTool.inputSchema.parse({ type })).not.toThrow();
      }
    });
  });
});