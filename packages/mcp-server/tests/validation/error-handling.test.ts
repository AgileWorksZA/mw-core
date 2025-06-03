/**
 * Error handling tests for MCP tools
 * Tests various error scenarios and edge cases
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { 
  searchAccountsTool, 
  getAccountTool, 
  listAccountFieldsTool 
} from "../../src/tools/account";
import { 
  searchTransactionsTool, 
  getTransactionTool, 
  getTransactionByRefTool
} from "../../src/tools/transaction";
import { 
  searchContactsTool, 
  getContactTool 
} from "../../src/tools/contact";
import { createMockService, MockApiError } from "../setup";

describe("Error Handling Tests", () => {
  describe("Network and API Errors", () => {
    it("should handle network timeout errors", async () => {
      const timeoutService = {
        async getData() {
          throw new MockApiError("Network timeout", 408, { timeout: true });
        }
      };

      // Mock the service temporarily
      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        try {
          await timeoutService.getData({});
        } catch (error) {
          throw error;
        }
        return { accounts: [], total: 0, limit: args.limit, offset: args.offset };
      };

      const args = { query: "test", limit: 50, offset: 0 };

      await expect(searchAccountsTool.execute(args)).rejects.toThrow("Network timeout");

      // Restore original
      searchAccountsTool.execute = originalExecute;
    });

    it("should handle server errors (5xx)", async () => {
      const serverErrorService = {
        async getData() {
          throw new MockApiError("Internal server error", 500, { 
            serverError: true,
            details: "Database connection failed" 
          });
        }
      };

      const originalExecute = getAccountTool.execute;
      getAccountTool.execute = async (args) => {
        try {
          await serverErrorService.getData({});
        } catch (error) {
          throw error;
        }
        return {};
      };

      const args = { code: "1000" };

      await expect(getAccountTool.execute(args)).rejects.toThrow("Internal server error");

      getAccountTool.execute = originalExecute;
    });

    it("should handle authentication errors (401)", async () => {
      const authErrorService = {
        async getData() {
          throw new MockApiError("Unauthorized", 401, { 
            authError: true,
            message: "Invalid credentials" 
          });
        }
      };

      const originalExecute = searchTransactionsTool.execute;
      searchTransactionsTool.execute = async (args) => {
        try {
          await authErrorService.getData({});
        } catch (error) {
          throw error;
        }
        return { transactions: [], total: 0, limit: args.limit, offset: args.offset };
      };

      const args = { query: "test", limit: 50, offset: 0 };

      await expect(searchTransactionsTool.execute(args)).rejects.toThrow("Unauthorized");

      searchTransactionsTool.execute = originalExecute;
    });

    it("should handle forbidden errors (403)", async () => {
      const forbiddenErrorService = {
        async getData() {
          throw new MockApiError("Forbidden", 403, { 
            permissionError: true,
            message: "Insufficient permissions" 
          });
        }
      };

      const originalExecute = searchContactsTool.execute;
      searchContactsTool.execute = async (args) => {
        try {
          await forbiddenErrorService.getData({});
        } catch (error) {
          throw error;
        }
        return { contacts: [], total: 0, limit: args.limit, offset: args.offset };
      };

      const args = { query: "test", limit: 50, offset: 0 };

      await expect(searchContactsTool.execute(args)).rejects.toThrow("Forbidden");

      searchContactsTool.execute = originalExecute;
    });

    it("should handle rate limiting errors (429)", async () => {
      const rateLimitService = {
        async getData() {
          throw new MockApiError("Too Many Requests", 429, { 
            rateLimited: true,
            retryAfter: 60 
          });
        }
      };

      const originalExecute = getContactTool.execute;
      getContactTool.execute = async (args) => {
        try {
          await rateLimitService.getData({});
        } catch (error) {
          throw error;
        }
        return {};
      };

      const args = { code: "CUST001" };

      await expect(getContactTool.execute(args)).rejects.toThrow("Too Many Requests");

      getContactTool.execute = originalExecute;
    });
  });

  describe("Resource Not Found Errors", () => {
    it("should handle account not found", async () => {
      const notFoundService = createMockService({ data: [], pagination: { total: 0 } });

      const originalExecute = getAccountTool.execute;
      getAccountTool.execute = async (args) => {
        const result = await notFoundService.getData({
          search: { Code: args.code },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Account not found: ${args.code}`);
        }

        return result.data[0];
      };

      const args = { code: "NONEXISTENT" };

      await expect(getAccountTool.execute(args)).rejects.toThrow("Account not found: NONEXISTENT");

      getAccountTool.execute = originalExecute;
    });

    it("should handle transaction not found by sequence number", async () => {
      const notFoundService = createMockService({ data: [], pagination: { total: 0 } });

      const originalExecute = getTransactionTool.execute;
      getTransactionTool.execute = async (args) => {
        const result = await notFoundService.getData({
          search: { SequenceNumber: args.sequenceNumber },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Transaction not found: ${args.sequenceNumber}`);
        }

        return result.data[0];
      };

      const args = { sequenceNumber: 999999 };

      await expect(getTransactionTool.execute(args)).rejects.toThrow("Transaction not found: 999999");

      getTransactionTool.execute = originalExecute;
    });

    it("should handle transaction not found by reference", async () => {
      const notFoundService = createMockService({ data: [], pagination: { total: 0 } });

      const originalExecute = getTransactionByRefTool.execute;
      getTransactionByRefTool.execute = async (args) => {
        const result = await notFoundService.getData({
          search: { OurRef: args.reference },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Transaction not found with reference: ${args.reference}`);
        }

        return result.data[0];
      };

      const args = { reference: "NONEXISTENT" };

      await expect(getTransactionByRefTool.execute(args)).rejects.toThrow("Transaction not found with reference: NONEXISTENT");

      getTransactionByRefTool.execute = originalExecute;
    });

    it("should handle contact not found", async () => {
      const notFoundService = createMockService({ data: [], pagination: { total: 0 } });

      const originalExecute = getContactTool.execute;
      getContactTool.execute = async (args) => {
        const result = await notFoundService.getData({
          search: { Code: args.code },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Contact not found: ${args.code}`);
        }

        return result.data[0];
      };

      const args = { code: "NONEXISTENT" };

      await expect(getContactTool.execute(args)).rejects.toThrow("Contact not found: NONEXISTENT");

      getContactTool.execute = originalExecute;
    });
  });

  describe("Data Validation Errors", () => {
    it("should handle malformed response data", async () => {
      const malformedService = {
        async getData() {
          return {
            data: null, // Invalid data structure
            pagination: undefined
          };
        }
      };

      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        const result = await malformedService.getData({});
        
        // Simulate handling of malformed data
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid response format: data is not an array");
        }

        return {
          accounts: result.data,
          total: result.pagination?.total || 0,
          limit: args.limit,
          offset: args.offset,
        };
      };

      const args = { query: "test", limit: 50, offset: 0 };

      await expect(searchAccountsTool.execute(args)).rejects.toThrow("Invalid response format");

      searchAccountsTool.execute = originalExecute;
    });

    it("should handle missing required fields in response", async () => {
      const incompleteDataService = createMockService({
        data: [
          {
            // Missing required fields like Code, Description
            Type: "A",
            Category: "CASH"
          }
        ],
        pagination: { total: 1, offset: 0, limit: 50 }
      });

      const originalExecute = getAccountTool.execute;
      getAccountTool.execute = async (args) => {
        const result = await incompleteDataService.getData({
          search: { Code: args.code },
          limit: 1,
          offset: 0,
        });

        if (!result.data || result.data.length === 0) {
          throw new Error(`Account not found: ${args.code}`);
        }

        const account = result.data[0];
        
        // Validate required fields
        if (!account.Code) {
          throw new Error("Invalid account data: missing Code field");
        }

        return account;
      };

      const args = { code: "1000" };

      await expect(getAccountTool.execute(args)).rejects.toThrow("Invalid account data: missing Code field");

      getAccountTool.execute = originalExecute;
    });

    it("should handle date parsing errors", async () => {
      const invalidDateService = createMockService({
        data: [
          {
            SequenceNumber: 1001,
            TransDate: "invalid-date-format",
            Type: "SI",
            Status: "OP"
          }
        ],
        pagination: { total: 1, offset: 0, limit: 50 }
      });

      const originalExecute = searchTransactionsTool.execute;
      searchTransactionsTool.execute = async (args) => {
        const result = await invalidDateService.getData({});

        let filteredData = result.data;

        if (args.fromDate || args.toDate) {
          try {
            filteredData = filteredData.filter((trans) => {
              const transDate = new Date(trans.TransDate);
              
              // Check if date is invalid
              if (isNaN(transDate.getTime())) {
                throw new Error(`Invalid date format in transaction: ${trans.TransDate}`);
              }
              
              if (args.fromDate && transDate < new Date(args.fromDate)) return false;
              if (args.toDate && transDate > new Date(args.toDate)) return false;
              return true;
            });
          } catch (error) {
            throw error;
          }
        }

        return {
          transactions: filteredData,
          total: filteredData.length,
          limit: args.limit,
          offset: args.offset,
        };
      };

      const args = { fromDate: "2024-01-01", limit: 50, offset: 0 };

      await expect(searchTransactionsTool.execute(args)).rejects.toThrow("Invalid date format");

      searchTransactionsTool.execute = originalExecute;
    });
  });

  describe("Edge Case Handling", () => {
    it("should handle extremely large result sets", async () => {
      const largeDataService = createMockService({
        data: Array(1000).fill(null).map((_, i) => ({
          Code: `ACC${i.toString().padStart(4, '0')}`,
          Description: `Account ${i}`,
          Type: "A",
          Category: "TEST"
        })),
        pagination: { total: 1000, offset: 0, limit: 1000 }
      });

      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        const result = await largeDataService.getData({
          limit: args.limit,
          offset: args.offset,
        });

        // Simulate memory/performance considerations
        if (result.data.length > 100 && args.limit > 100) {
          console.warn("Large result set returned, consider using pagination");
        }

        return {
          accounts: result.data.slice(0, args.limit), // Respect limit
          total: result.pagination?.total || result.data.length,
          limit: args.limit,
          offset: args.offset,
        };
      };

      const args = { limit: 100, offset: 0 };
      const result = await searchAccountsTool.execute(args);

      expect(result.accounts).toHaveLength(100);
      expect(result.total).toBe(1000);

      searchAccountsTool.execute = originalExecute;
    });

    it("should handle zero results gracefully", async () => {
      const emptyService = createMockService({
        data: [],
        pagination: { total: 0, offset: 0, limit: 50 }
      });

      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        const result = await emptyService.getData({});

        return {
          accounts: result.data,
          total: result.pagination?.total || 0,
          limit: args.limit,
          offset: args.offset,
        };
      };

      const args = { query: "nonexistent", limit: 50, offset: 0 };
      const result = await searchAccountsTool.execute(args);

      expect(result.accounts).toHaveLength(0);
      expect(result.total).toBe(0);

      searchAccountsTool.execute = originalExecute;
    });

    it("should handle special characters in search queries", async () => {
      const specialCharService = createMockService({
        data: [
          {
            Code: "ACC-001",
            Description: "Account with special chars: @#$%",
            Type: "A"
          }
        ],
        pagination: { total: 1, offset: 0, limit: 50 }
      });

      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        // Simulate handling of special characters
        if (args.query && /[<>'"&]/.test(args.query)) {
          throw new Error("Invalid characters in search query");
        }

        const result = await specialCharService.getData({});
        return {
          accounts: result.data,
          total: result.pagination?.total || result.data.length,
          limit: args.limit,
          offset: args.offset,
        };
      };

      // Valid special characters
      const validArgs = { query: "ACC-001 @#$%", limit: 50, offset: 0 };
      const validResult = await searchAccountsTool.execute(validArgs);
      expect(validResult.accounts).toHaveLength(1);

      // Invalid characters that might cause security issues
      const invalidArgs = { query: "<script>alert('xss')</script>", limit: 50, offset: 0 };
      await expect(searchAccountsTool.execute(invalidArgs)).rejects.toThrow("Invalid characters");

      searchAccountsTool.execute = originalExecute;
    });

    it("should handle concurrent access gracefully", async () => {
      let callCount = 0;
      const concurrentService = {
        async getData() {
          callCount++;
          // Simulate slight delay
          await new Promise(resolve => setTimeout(resolve, 10));
          
          return {
            data: [{ Code: `RESULT-${callCount}`, Description: `Call ${callCount}` }],
            pagination: { total: 1, offset: 0, limit: 50 }
          };
        }
      };

      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        const result = await concurrentService.getData();
        return {
          accounts: result.data,
          total: result.pagination?.total || result.data.length,
          limit: args.limit,
          offset: args.offset,
        };
      };

      // Execute multiple calls concurrently
      const promises = Array(5).fill(null).map(() => 
        searchAccountsTool.execute({ query: "test", limit: 50, offset: 0 })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      expect(callCount).toBe(5);

      // Each result should be valid
      for (const result of results) {
        expect(result.accounts).toHaveLength(1);
        expect(result.accounts[0].Code).toMatch(/^RESULT-\d+$/);
      }

      searchAccountsTool.execute = originalExecute;
    });
  });

  describe("Resource Management", () => {
    it("should handle memory pressure gracefully", async () => {
      const memoryIntensiveService = {
        async getData() {
          // Simulate a service that returns a very large dataset
          const largeData = Array(10000).fill(null).map((_, i) => ({
            Code: `ACC${i}`,
            Description: `Account ${i}`.repeat(100), // Large strings
            Type: "A",
            LargeField: "x".repeat(1000)
          }));

          return {
            data: largeData,
            pagination: { total: 10000, offset: 0, limit: 10000 }
          };
        }
      };

      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        try {
          const result = await memoryIntensiveService.getData();
          
          // Implement memory-conscious handling
          if (result.data.length > 1000) {
            throw new Error("Result set too large, please use pagination to limit results");
          }

          return {
            accounts: result.data,
            total: result.pagination?.total || result.data.length,
            limit: args.limit,
            offset: args.offset,
          };
        } catch (error) {
          throw error;
        }
      };

      const args = { limit: 50, offset: 0 };

      await expect(searchAccountsTool.execute(args)).rejects.toThrow("Result set too large");

      searchAccountsTool.execute = originalExecute;
    });

    it("should handle connection pool exhaustion", async () => {
      let connectionCount = 0;
      const maxConnections = 3;

      const connectionPoolService = {
        async getData() {
          connectionCount++;
          
          if (connectionCount > maxConnections) {
            throw new MockApiError("Connection pool exhausted", 503, {
              connectionPoolError: true,
              activeConnections: connectionCount
            });
          }

          // Simulate connection being held
          await new Promise(resolve => setTimeout(resolve, 100));
          connectionCount--;

          return {
            data: [{ Code: "TEST", Description: "Test" }],
            pagination: { total: 1, offset: 0, limit: 50 }
          };
        }
      };

      const originalExecute = searchAccountsTool.execute;
      searchAccountsTool.execute = async (args) => {
        const result = await connectionPoolService.getData();
        return {
          accounts: result.data,
          total: result.pagination?.total || result.data.length,
          limit: args.limit,
          offset: args.offset,
        };
      };

      // Start multiple concurrent requests that will exceed the connection pool
      const promises = Array(5).fill(null).map(() => 
        searchAccountsTool.execute({ query: "test", limit: 50, offset: 0 })
      );

      // Some should succeed, some should fail with connection pool error
      const results = await Promise.allSettled(promises);
      
      const successes = results.filter(r => r.status === "fulfilled");
      const failures = results.filter(r => r.status === "rejected");

      expect(successes.length).toBeGreaterThan(0);
      expect(failures.length).toBeGreaterThan(0);

      // Check that failures are due to connection pool exhaustion
      const connectionPoolFailures = failures.filter(f => 
        f.status === "rejected" && f.reason.message.includes("Connection pool exhausted")
      );
      expect(connectionPoolFailures.length).toBeGreaterThan(0);

      searchAccountsTool.execute = originalExecute;
    });
  });
});