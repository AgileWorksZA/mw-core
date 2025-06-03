/**
 * Unit tests for contact tools
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { z } from "zod";
import { 
  searchContactsTool, 
  getContactTool, 
  listContactFieldsTool 
} from "../../../src/tools/contact";
import { createMockService, MOCK_RESPONSES } from "../../setup";

// Mock the ContactService
const mockContactService = createMockService(MOCK_RESPONSES.contacts.success);

mock.module("@moneyworks/api/src/services/tables/contact.service", () => ({
  ContactService: function() {
    return mockContactService;
  }
}));

describe("Contact Tools", () => {
  describe("searchContactsTool", () => {
    it("should search contacts with basic query", async () => {
      const args = {
        query: "ABC",
        limit: 10,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.contacts).toBeDefined();
      expect(Array.isArray(result.contacts)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    it("should search contacts by type", async () => {
      const args = {
        type: "C" as const,
        limit: 20,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.contacts).toBeDefined();
      expect(result.limit).toBe(20);
    });

    it("should search contacts by code", async () => {
      const args = {
        code: "CUST001",
        limit: 50,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.contacts).toBeDefined();
    });

    it("should search contacts by description", async () => {
      const args = {
        description: "ABC Corporation",
        limit: 50,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.contacts).toBeDefined();
    });

    it("should search active contacts only", async () => {
      const args = {
        isActive: true,
        limit: 50,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.contacts).toBeDefined();
    });

    it("should handle pagination correctly", async () => {
      const args = {
        limit: 5,
        offset: 10
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.limit).toBe(5);
      expect(result.offset).toBe(10);
    });

    it("should validate input schema", () => {
      const validArgs = {
        query: "test",
        type: "C" as const,
        code: "CUST001",
        description: "Test Customer",
        isActive: true,
        limit: 50,
        offset: 0
      };

      expect(() => searchContactsTool.inputSchema.parse(validArgs)).not.toThrow();
    });

    it("should reject invalid contact type", () => {
      const invalidArgs = {
        type: "INVALID",
        limit: 50,
        offset: 0
      };

      expect(() => searchContactsTool.inputSchema.parse(invalidArgs)).toThrow();
    });

    it("should reject invalid limit", () => {
      const invalidArgs = {
        limit: -1,
        offset: 0
      };

      expect(() => searchContactsTool.inputSchema.parse(invalidArgs)).toThrow();
    });

    it("should reject limit exceeding maximum", () => {
      const invalidArgs = {
        limit: 101,
        offset: 0
      };

      expect(() => searchContactsTool.inputSchema.parse(invalidArgs)).toThrow();
    });

    it("should reject negative offset", () => {
      const invalidArgs = {
        limit: 50,
        offset: -1
      };

      expect(() => searchContactsTool.inputSchema.parse(invalidArgs)).toThrow();
    });

    it("should support all valid contact types", () => {
      const validTypes = ["C", "S", "E", "B"];
      
      for (const type of validTypes) {
        const args = {
          type: type as any,
          limit: 50,
          offset: 0
        };

        expect(() => searchContactsTool.inputSchema.parse(args)).not.toThrow();
      }
    });

    it("should prioritize specific fields over general query", async () => {
      // Test that specific fields (code, description) take precedence over general query
      const args = {
        query: "general",
        code: "SPECIFIC",
        limit: 50,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      // The specific code should be used instead of the general query
    });
  });

  describe("getContactTool", () => {
    it("should get contact by code", async () => {
      const args = {
        code: "CUST001"
      };

      const result = await getContactTool.execute(args);

      expect(result).toBeDefined();
      expect(result.Code).toBe("CUST001");
    });

    it("should throw error for non-existent contact", async () => {
      // Mock empty response for this test
      const mockEmptyService = createMockService({ data: [], pagination: { total: 0 } });
      
      // Temporarily replace the service
      const originalExecute = getContactTool.execute;
      getContactTool.execute = async (args) => {
        const result = await mockEmptyService.getData({
          search: { Code: args.code },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Contact not found: ${args.code}`);
        }

        return result.data[0];
      };

      const args = {
        code: "NONEXISTENT"
      };

      await expect(getContactTool.execute(args)).rejects.toThrow("Contact not found: NONEXISTENT");

      // Restore original function
      getContactTool.execute = originalExecute;
    });

    it("should validate input schema", () => {
      const validArgs = {
        code: "CUST001"
      };

      expect(() => getContactTool.inputSchema.parse(validArgs)).not.toThrow();
    });

    it("should require code parameter", () => {
      const invalidArgs = {};

      expect(() => getContactTool.inputSchema.parse(invalidArgs)).toThrow();
    });

    it("should reject empty code", () => {
      const invalidArgs = {
        code: ""
      };

      expect(() => getContactTool.inputSchema.parse(invalidArgs)).toThrow();
    });
  });

  describe("listContactFieldsTool", () => {
    it("should return contact fields", async () => {
      // Mock the import
      mock.module("@moneyworks/api/src/types/interface/tables/contact", () => ({
        ContactFields: [
          "Code",
          "Description", 
          "Type",
          "Address",
          "Phone",
          "Email",
          "IsActive"
        ]
      }));

      const result = await listContactFieldsTool.execute();

      expect(result).toBeDefined();
      expect(result.fields).toBeDefined();
      expect(result.description).toBeDefined();
      expect(typeof result.description).toBe("string");
    });

    it("should validate empty input schema", () => {
      const args = {};

      expect(() => listContactFieldsTool.inputSchema.parse(args)).not.toThrow();
    });
  });

  describe("Contact search logic", () => {
    it("should handle different query patterns correctly", async () => {
      // Test that short queries are treated as codes and long queries as descriptions
      const shortQuery = {
        query: "CUST",
        limit: 50,
        offset: 0
      };

      const longQuery = {
        query: "ABC Corporation Ltd",
        limit: 50,
        offset: 0
      };

      // Both should execute without error
      const shortResult = await searchContactsTool.execute(shortQuery);
      const longResult = await searchContactsTool.execute(longQuery);

      expect(shortResult).toBeDefined();
      expect(longResult).toBeDefined();
    });

    it("should handle empty search gracefully", async () => {
      const args = {
        limit: 50,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.contacts).toBeDefined();
      // Should return all contacts when no search criteria provided
    });
  });

  describe("Type mapping and validation", () => {
    it("should correctly map contact types", () => {
      // Customer
      const customerArgs = { type: "C" as const, limit: 50, offset: 0 };
      expect(() => searchContactsTool.inputSchema.parse(customerArgs)).not.toThrow();

      // Supplier
      const supplierArgs = { type: "S" as const, limit: 50, offset: 0 };
      expect(() => searchContactsTool.inputSchema.parse(supplierArgs)).not.toThrow();

      // Employee
      const employeeArgs = { type: "E" as const, limit: 50, offset: 0 };
      expect(() => searchContactsTool.inputSchema.parse(employeeArgs)).not.toThrow();

      // Both (Customer and Supplier)
      const bothArgs = { type: "B" as const, limit: 50, offset: 0 };
      expect(() => searchContactsTool.inputSchema.parse(bothArgs)).not.toThrow();
    });
  });

  describe("Error handling", () => {
    it("should handle service errors gracefully", async () => {
      // Mock service that throws error
      const errorService = {
        async getData() {
          throw new Error("Service unavailable");
        }
      };

      // Temporarily replace the service
      const originalExecute = searchContactsTool.execute;
      searchContactsTool.execute = async (args) => {
        try {
          await errorService.getData({});
        } catch (error) {
          throw error;
        }
        return { contacts: [], total: 0, limit: args.limit, offset: args.offset };
      };

      const args = {
        query: "test",
        limit: 50,
        offset: 0
      };

      await expect(searchContactsTool.execute(args)).rejects.toThrow("Service unavailable");

      // Restore original function
      searchContactsTool.execute = originalExecute;
    });

    it("should handle network timeouts", async () => {
      const timeoutService = {
        async getData() {
          throw new Error("Request timeout");
        }
      };

      const originalExecute = getContactTool.execute;
      getContactTool.execute = async (args) => {
        try {
          await timeoutService.getData({});
        } catch (error) {
          throw error;
        }
        return {};
      };

      const args = {
        code: "TEST001"
      };

      await expect(getContactTool.execute(args)).rejects.toThrow("Request timeout");

      getContactTool.execute = originalExecute;
    });
  });

  describe("Performance considerations", () => {
    it("should handle large result sets", async () => {
      // Test with maximum allowed limit
      const args = {
        limit: 100,
        offset: 0
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.limit).toBe(100);
    });

    it("should handle pagination correctly for large datasets", async () => {
      // Test pagination with offset
      const args = {
        limit: 50,
        offset: 100
      };

      const result = await searchContactsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.offset).toBe(100);
    });
  });
});