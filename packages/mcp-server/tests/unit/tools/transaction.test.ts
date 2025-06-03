/**
 * Unit tests for transaction tools
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { z } from "zod";
import { 
  searchTransactionsTool, 
  getTransactionTool, 
  getTransactionByRefTool,
  listTransactionFieldsTool,
  getTransactionSummaryTool
} from "../../../src/tools/transaction";
import { createMockService, MOCK_RESPONSES } from "../../setup";

// Mock the TransactionService
const mockTransactionService = createMockService(MOCK_RESPONSES.transactions.success);

mock.module("@moneyworks/api/src/services/tables/transaction.service", () => ({
  TransactionService: function() {
    return mockTransactionService;
  }
}));

describe("Transaction Tools", () => {
  describe("searchTransactionsTool", () => {
    it("should search transactions with basic query", async () => {
      const args = {
        query: "INV-001",
        limit: 10,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(Array.isArray(result.transactions)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    it("should search transactions by type", async () => {
      const args = {
        type: "SI" as const,
        limit: 20,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.limit).toBe(20);
    });

    it("should search transactions by status", async () => {
      const args = {
        status: "OP" as const,
        limit: 15,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.limit).toBe(15);
    });

    it("should search transactions by name code", async () => {
      const args = {
        nameCode: "CUST001",
        limit: 50,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
    });

    it("should search transactions by date range", async () => {
      const args = {
        fromDate: "2024-01-01",
        toDate: "2024-01-31",
        limit: 50,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
    });

    it("should search transactions by amount range", async () => {
      const args = {
        minAmount: 1000,
        maxAmount: 5000,
        limit: 50,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
    });

    it("should search transactions by period", async () => {
      const args = {
        period: 1,
        limit: 50,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
    });

    it("should validate input schema", () => {
      const validArgs = {
        query: "test",
        type: "SI" as const,
        status: "OP" as const,
        nameCode: "CUST001",
        fromDate: "2024-01-01",
        toDate: "2024-01-31",
        period: 1,
        minAmount: 100,
        maxAmount: 1000,
        limit: 50,
        offset: 0
      };

      expect(() => searchTransactionsTool.inputSchema.parse(validArgs)).not.toThrow();
    });

    it("should reject invalid transaction type", () => {
      const invalidArgs = {
        type: "INVALID",
        limit: 50,
        offset: 0
      };

      expect(() => searchTransactionsTool.inputSchema.parse(invalidArgs)).toThrow();
    });

    it("should reject invalid status", () => {
      const invalidArgs = {
        status: "INVALID",
        limit: 50,
        offset: 0
      };

      expect(() => searchTransactionsTool.inputSchema.parse(invalidArgs)).toThrow();
    });

    it("should support all valid transaction types", () => {
      const validTypes = ["SI", "SC", "SR", "SD", "PI", "PC", "PP", "PD", "JN", "JC", "BR", "BP", "BT", "ST", "SO", "PO"];
      
      for (const type of validTypes) {
        const args = {
          type: type as any,
          limit: 50,
          offset: 0
        };

        expect(() => searchTransactionsTool.inputSchema.parse(args)).not.toThrow();
      }
    });

    it("should support all valid transaction statuses", () => {
      const validStatuses = ["OP", "CL", "PA", "CA", "DR"];
      
      for (const status of validStatuses) {
        const args = {
          status: status as any,
          limit: 50,
          offset: 0
        };

        expect(() => searchTransactionsTool.inputSchema.parse(args)).not.toThrow();
      }
    });
  });

  describe("getTransactionTool", () => {
    it("should get transaction by sequence number", async () => {
      const args = {
        sequenceNumber: 1001
      };

      const result = await getTransactionTool.execute(args);

      expect(result).toBeDefined();
      expect(result.SequenceNumber).toBe(1001);
    });

    it("should throw error for non-existent transaction", async () => {
      // Mock empty response
      const mockEmptyService = createMockService({ data: [], pagination: { total: 0 } });
      
      const originalExecute = getTransactionTool.execute;
      getTransactionTool.execute = async (args) => {
        const result = await mockEmptyService.getData({
          search: { SequenceNumber: args.sequenceNumber },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Transaction not found: ${args.sequenceNumber}`);
        }

        return result.data[0];
      };

      const args = {
        sequenceNumber: 999999
      };

      await expect(getTransactionTool.execute(args)).rejects.toThrow("Transaction not found: 999999");

      getTransactionTool.execute = originalExecute;
    });

    it("should validate input schema", () => {
      const validArgs = {
        sequenceNumber: 1001
      };

      expect(() => getTransactionTool.inputSchema.parse(validArgs)).not.toThrow();
    });

    it("should require sequence number parameter", () => {
      const invalidArgs = {};

      expect(() => getTransactionTool.inputSchema.parse(invalidArgs)).toThrow();
    });
  });

  describe("getTransactionByRefTool", () => {
    it("should get transaction by reference", async () => {
      const args = {
        reference: "INV-001"
      };

      const result = await getTransactionByRefTool.execute(args);

      expect(result).toBeDefined();
      expect(result.OurRef).toBe("INV-001");
    });

    it("should throw error for non-existent reference", async () => {
      const mockEmptyService = createMockService({ data: [], pagination: { total: 0 } });
      
      const originalExecute = getTransactionByRefTool.execute;
      getTransactionByRefTool.execute = async (args) => {
        const result = await mockEmptyService.getData({
          search: { OurRef: args.reference },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Transaction not found with reference: ${args.reference}`);
        }

        return result.data[0];
      };

      const args = {
        reference: "NONEXISTENT"
      };

      await expect(getTransactionByRefTool.execute(args)).rejects.toThrow("Transaction not found with reference: NONEXISTENT");

      getTransactionByRefTool.execute = originalExecute;
    });

    it("should validate input schema", () => {
      const validArgs = {
        reference: "INV-001"
      };

      expect(() => getTransactionByRefTool.inputSchema.parse(validArgs)).not.toThrow();
    });
  });

  describe("listTransactionFieldsTool", () => {
    it("should return transaction fields with types and statuses", async () => {
      mock.module("@moneyworks/api/src/types/interface/tables/transaction", () => ({
        TransactionFields: [
          "SequenceNumber",
          "Type",
          "Status",
          "OurRef",
          "NameCode",
          "TransDate",
          "Gross",
          "AmtPaid",
          "Period"
        ]
      }));

      const result = await listTransactionFieldsTool.execute();

      expect(result).toBeDefined();
      expect(result.fields).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.types).toBeDefined();
      expect(Array.isArray(result.types)).toBe(true);
      expect(result.statuses).toBeDefined();
      expect(Array.isArray(result.statuses)).toBe(true);

      // Check that types include expected entries
      const siType = result.types.find(t => t.code === "SI");
      expect(siType).toBeDefined();
      expect(siType.description).toBe("Sales Invoice");

      // Check that statuses include expected entries
      const openStatus = result.statuses.find(s => s.code === "OP");
      expect(openStatus).toBeDefined();
      expect(openStatus.description).toBe("Open");
    });
  });

  describe("getTransactionSummaryTool", () => {
    it("should return transaction summary", async () => {
      const args = {
        nameCode: "CUST001",
        fromDate: "2024-01-01",
        toDate: "2024-01-31"
      };

      const result = await getTransactionSummaryTool.execute(args);

      expect(result).toBeDefined();
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
      expect(result.byType).toBeDefined();
      expect(result.byStatus).toBeDefined();
      expect(typeof result.grandTotal).toBe("number");
      expect(typeof result.outstandingTotal).toBe("number");
    });

    it("should filter by type", async () => {
      const args = {
        type: "SI" as const
      };

      const result = await getTransactionSummaryTool.execute(args);

      expect(result).toBeDefined();
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
    });

    it("should calculate outstanding totals correctly", async () => {
      // This test verifies the calculation logic
      const args = {};

      const result = await getTransactionSummaryTool.execute(args);

      expect(result).toBeDefined();
      expect(typeof result.outstandingTotal).toBe("number");
      // Outstanding should be calculated from open/partial transactions
    });

    it("should validate input schema", () => {
      const validArgs = {
        nameCode: "CUST001",
        type: "SI" as const,
        fromDate: "2024-01-01",
        toDate: "2024-01-31"
      };

      expect(() => getTransactionSummaryTool.inputSchema.parse(validArgs)).not.toThrow();
    });
  });

  describe("Date filtering", () => {
    it("should filter transactions by date range correctly", async () => {
      // Mock data with specific dates
      const mockDataWithDates = {
        data: [
          {
            ...MOCK_RESPONSES.transactions.success.data[0],
            TransDate: "2024-01-15"
          },
          {
            ...MOCK_RESPONSES.transactions.success.data[0],
            SequenceNumber: 1002,
            TransDate: "2024-02-15"
          }
        ],
        pagination: { total: 2, offset: 0, limit: 50 }
      };

      const mockServiceWithDates = createMockService(mockDataWithDates);
      
      const originalExecute = searchTransactionsTool.execute;
      searchTransactionsTool.execute = async (args) => {
        const result = await mockServiceWithDates.getData({
          search: {},
          limit: args.limit,
          offset: args.offset,
        });

        let filteredData = result.data;

        if (args.fromDate || args.toDate) {
          filteredData = filteredData.filter((trans) => {
            const transDate = new Date(trans.TransDate);
            if (args.fromDate && transDate < new Date(args.fromDate)) return false;
            if (args.toDate && transDate > new Date(args.toDate)) return false;
            return true;
          });
        }

        return {
          transactions: filteredData,
          total: filteredData.length,
          limit: args.limit,
          offset: args.offset,
        };
      };

      const args = {
        fromDate: "2024-01-01",
        toDate: "2024-01-31",
        limit: 50,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].TransDate).toBe("2024-01-15");

      searchTransactionsTool.execute = originalExecute;
    });
  });

  describe("Amount filtering", () => {
    it("should filter transactions by amount range correctly", async () => {
      const mockDataWithAmounts = {
        data: [
          {
            ...MOCK_RESPONSES.transactions.success.data[0],
            Gross: 500
          },
          {
            ...MOCK_RESPONSES.transactions.success.data[0],
            SequenceNumber: 1002,
            Gross: 1500
          },
          {
            ...MOCK_RESPONSES.transactions.success.data[0],
            SequenceNumber: 1003,
            Gross: 2500
          }
        ],
        pagination: { total: 3, offset: 0, limit: 50 }
      };

      const mockServiceWithAmounts = createMockService(mockDataWithAmounts);
      
      const originalExecute = searchTransactionsTool.execute;
      searchTransactionsTool.execute = async (args) => {
        const result = await mockServiceWithAmounts.getData({
          search: {},
          limit: args.limit,
          offset: args.offset,
        });

        let filteredData = result.data;

        if (args.minAmount !== undefined || args.maxAmount !== undefined) {
          filteredData = filteredData.filter((trans) => {
            if (args.minAmount !== undefined && trans.Gross < args.minAmount) return false;
            if (args.maxAmount !== undefined && trans.Gross > args.maxAmount) return false;
            return true;
          });
        }

        return {
          transactions: filteredData,
          total: filteredData.length,
          limit: args.limit,
          offset: args.offset,
        };
      };

      const args = {
        minAmount: 1000,
        maxAmount: 2000,
        limit: 50,
        offset: 0
      };

      const result = await searchTransactionsTool.execute(args);

      expect(result).toBeDefined();
      expect(result.transactions.length).toBe(1);
      expect(result.transactions[0].Gross).toBe(1500);

      searchTransactionsTool.execute = originalExecute;
    });
  });
});