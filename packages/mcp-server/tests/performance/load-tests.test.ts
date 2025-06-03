/**
 * Performance and load tests for MCP tools
 * Tests response times, concurrent usage, and resource consumption
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createMockService, MOCK_RESPONSES, setupTestDatabase, cleanupTestDatabase } from "../setup";

// Performance test configuration
const PERFORMANCE_CONFIG = {
  TARGET_RESPONSE_TIME_MS: 500,
  MAX_RESPONSE_TIME_MS: 2000,
  CONCURRENT_REQUESTS: 10,
  LOAD_TEST_DURATION_MS: 30000,
  MEMORY_LIMIT_MB: 100,
  CPU_THRESHOLD_PERCENT: 80,
};

// Mock performance monitoring
class PerformanceMonitor {
  private metrics: Array<{
    timestamp: number;
    tool: string;
    duration: number;
    memoryUsage: number;
    success: boolean;
  }> = [];

  recordExecution(tool: string, duration: number, success: boolean) {
    this.metrics.push({
      timestamp: Date.now(),
      tool,
      duration,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      success
    });
  }

  getStats() {
    const totalRequests = this.metrics.length;
    const successfulRequests = this.metrics.filter(m => m.success).length;
    const avgDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
    const maxDuration = Math.max(...this.metrics.map(m => m.duration));
    const minDuration = Math.min(...this.metrics.map(m => m.duration));
    const avgMemory = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / totalRequests;
    const maxMemory = Math.max(...this.metrics.map(m => m.memoryUsage));

    return {
      totalRequests,
      successfulRequests,
      successRate: (successfulRequests / totalRequests) * 100,
      avgDuration,
      maxDuration,
      minDuration,
      avgMemory,
      maxMemory,
      requestsPerSecond: totalRequests / (this.getTestDuration() / 1000)
    };
  }

  private getTestDuration() {
    if (this.metrics.length === 0) return 1000;
    const first = this.metrics[0].timestamp;
    const last = this.metrics[this.metrics.length - 1].timestamp;
    return last - first;
  }

  reset() {
    this.metrics = [];
  }
}

const performanceMonitor = new PerformanceMonitor();

// Mock tool implementations for performance testing
const createPerformanceTestTool = (name: string, baseDelay: number = 50) => {
  const mockService = createMockService(MOCK_RESPONSES.accounts.success);
  
  return async (args: any) => {
    const startTime = Date.now();
    let success = true;
    
    try {
      // Simulate variable processing time
      const delay = baseDelay + Math.random() * 50;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Simulate data processing
      const result = await mockService.getData({
        search: args.query ? { Code: args.query } : undefined,
        limit: args.limit || 50,
        offset: args.offset || 0,
      });

      // Simulate response transformation
      const transformedResult = {
        data: result.data.map(item => ({ ...item, processed: true })),
        total: result.pagination?.total || result.data.length,
        limit: args.limit || 50,
        offset: args.offset || 0,
        processingTime: delay
      };

      return transformedResult;
      
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      performanceMonitor.recordExecution(name, duration, success);
    }
  };
};

const performanceTools = {
  searchAccounts: createPerformanceTestTool("searchAccounts", 30),
  searchTransactions: createPerformanceTestTool("searchTransactions", 80),
  searchContacts: createPerformanceTestTool("searchContacts", 40),
  getAccount: createPerformanceTestTool("getAccount", 20),
  getTransaction: createPerformanceTestTool("getTransaction", 25),
  getContact: createPerformanceTestTool("getContact", 20),
};

describe("Performance and Load Tests", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe("Response Time Tests", () => {
    it("should meet target response times for account search", async () => {
      performanceMonitor.reset();
      
      const iterations = 20;
      const promises = Array(iterations).fill(null).map(() => 
        performanceTools.searchAccounts({ query: "cash", limit: 10 })
      );

      const results = await Promise.all(promises);
      const stats = performanceMonitor.getStats();

      expect(results).toHaveLength(iterations);
      expect(stats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS);
      expect(stats.maxDuration).toBeLessThan(PERFORMANCE_CONFIG.MAX_RESPONSE_TIME_MS);
      expect(stats.successRate).toBe(100);

      console.log(`Account Search Performance:
        - Average: ${stats.avgDuration.toFixed(2)}ms
        - Max: ${stats.maxDuration.toFixed(2)}ms
        - Min: ${stats.minDuration.toFixed(2)}ms
        - Success Rate: ${stats.successRate.toFixed(1)}%`);
    });

    it("should meet target response times for transaction search", async () => {
      performanceMonitor.reset();
      
      const iterations = 15;
      const promises = Array(iterations).fill(null).map(() => 
        performanceTools.searchTransactions({ 
          type: "SI", 
          status: "OP", 
          limit: 20 
        })
      );

      const results = await Promise.all(promises);
      const stats = performanceMonitor.getStats();

      expect(results).toHaveLength(iterations);
      expect(stats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS * 1.5);
      expect(stats.maxDuration).toBeLessThan(PERFORMANCE_CONFIG.MAX_RESPONSE_TIME_MS);
      expect(stats.successRate).toBe(100);

      console.log(`Transaction Search Performance:
        - Average: ${stats.avgDuration.toFixed(2)}ms
        - Max: ${stats.maxDuration.toFixed(2)}ms
        - Success Rate: ${stats.successRate.toFixed(1)}%`);
    });

    it("should handle single record lookups efficiently", async () => {
      performanceMonitor.reset();
      
      const iterations = 30;
      const promises = Array(iterations).fill(null).map((_, i) => 
        performanceTools.getAccount({ code: `ACC${i.toString().padStart(3, '0')}` })
      );

      const results = await Promise.all(promises);
      const stats = performanceMonitor.getStats();

      expect(results).toHaveLength(iterations);
      expect(stats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS * 0.5);
      expect(stats.maxDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS);
      expect(stats.successRate).toBe(100);

      console.log(`Single Record Lookup Performance:
        - Average: ${stats.avgDuration.toFixed(2)}ms
        - Max: ${stats.maxDuration.toFixed(2)}ms
        - Requests/sec: ${stats.requestsPerSecond.toFixed(1)}`);
    });
  });

  describe("Concurrent Load Tests", () => {
    it("should handle concurrent account searches", async () => {
      performanceMonitor.reset();
      
      const concurrentUsers = PERFORMANCE_CONFIG.CONCURRENT_REQUESTS;
      const requestsPerUser = 5;
      
      // Create concurrent user sessions
      const userSessions = Array(concurrentUsers).fill(null).map(async (_, userId) => {
        const userRequests = Array(requestsPerUser).fill(null).map(async (_, reqId) => {
          const delay = Math.random() * 100; // Stagger requests
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return performanceTools.searchAccounts({
            query: `user${userId}req${reqId}`,
            limit: 10 + (reqId * 5)
          });
        });
        
        return Promise.all(userRequests);
      });

      const allResults = await Promise.all(userSessions);
      const stats = performanceMonitor.getStats();

      const totalRequests = concurrentUsers * requestsPerUser;
      expect(allResults.flat()).toHaveLength(totalRequests);
      expect(stats.successRate).toBeGreaterThanOrEqual(95); // Allow for some failures under load
      expect(stats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS * 2);

      console.log(`Concurrent Load Test (${concurrentUsers} users, ${requestsPerUser} requests each):
        - Total Requests: ${stats.totalRequests}
        - Success Rate: ${stats.successRate.toFixed(1)}%
        - Average Duration: ${stats.avgDuration.toFixed(2)}ms
        - Requests/sec: ${stats.requestsPerSecond.toFixed(1)}
        - Max Memory: ${stats.maxMemory.toFixed(2)}MB`);
    });

    it("should handle mixed tool usage under load", async () => {
      performanceMonitor.reset();
      
      const testDuration = 10000; // 10 seconds
      const startTime = Date.now();
      const requests: Promise<any>[] = [];

      // Generate continuous load for the test duration
      while (Date.now() - startTime < testDuration) {
        const toolChoice = Math.random();
        
        if (toolChoice < 0.4) {
          // 40% account searches
          requests.push(performanceTools.searchAccounts({
            query: "test", 
            limit: Math.floor(Math.random() * 20) + 10
          }));
        } else if (toolChoice < 0.7) {
          // 30% transaction searches
          requests.push(performanceTools.searchTransactions({
            type: "SI",
            limit: Math.floor(Math.random() * 15) + 5
          }));
        } else if (toolChoice < 0.9) {
          // 20% contact searches
          requests.push(performanceTools.searchContacts({
            type: "C",
            limit: Math.floor(Math.random() * 25) + 5
          }));
        } else {
          // 10% specific lookups
          requests.push(performanceTools.getAccount({
            code: `ACC${Math.floor(Math.random() * 1000)}`
          }));
        }

        // Don't overwhelm the system
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      }

      // Wait for all requests to complete
      const results = await Promise.allSettled(requests);
      const stats = performanceMonitor.getStats();

      const successfulResults = results.filter(r => r.status === "fulfilled");
      const actualSuccessRate = (successfulResults.length / results.length) * 100;

      expect(actualSuccessRate).toBeGreaterThanOrEqual(90);
      expect(stats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS * 1.5);
      expect(stats.maxMemory).toBeLessThan(PERFORMANCE_CONFIG.MEMORY_LIMIT_MB);

      console.log(`Mixed Load Test (${testDuration/1000}s duration):
        - Total Requests: ${results.length}
        - Successful: ${successfulResults.length} (${actualSuccessRate.toFixed(1)}%)
        - Average Duration: ${stats.avgDuration.toFixed(2)}ms
        - Requests/sec: ${stats.requestsPerSecond.toFixed(1)}
        - Peak Memory: ${stats.maxMemory.toFixed(2)}MB`);
    });
  });

  describe("Resource Usage Tests", () => {
    it("should not exceed memory limits under sustained load", async () => {
      performanceMonitor.reset();
      
      const iterations = 100;
      const largeDataRequests = Array(iterations).fill(null).map(async (_, i) => {
        // Request large result sets
        return performanceTools.searchAccounts({
          limit: 100, // Maximum allowed
          offset: i * 10
        });
      });

      // Monitor memory during execution
      const memoryReadings: number[] = [];
      const memoryInterval = setInterval(() => {
        memoryReadings.push(process.memoryUsage().heapUsed / 1024 / 1024);
      }, 100);

      try {
        await Promise.all(largeDataRequests);
        
        clearInterval(memoryInterval);
        
        const stats = performanceMonitor.getStats();
        const maxMemoryUsed = Math.max(...memoryReadings);
        const avgMemoryUsed = memoryReadings.reduce((a, b) => a + b, 0) / memoryReadings.length;

        expect(maxMemoryUsed).toBeLessThan(PERFORMANCE_CONFIG.MEMORY_LIMIT_MB);
        expect(stats.successRate).toBe(100);

        console.log(`Memory Usage Test:
          - Max Memory: ${maxMemoryUsed.toFixed(2)}MB
          - Avg Memory: ${avgMemoryUsed.toFixed(2)}MB
          - Memory Limit: ${PERFORMANCE_CONFIG.MEMORY_LIMIT_MB}MB
          - Success Rate: ${stats.successRate}%`);
          
      } finally {
        clearInterval(memoryInterval);
      }
    });

    it("should handle pagination efficiently", async () => {
      performanceMonitor.reset();
      
      const pageSize = 20;
      const totalPages = 10;
      
      // Sequential pagination test
      const sequentialStart = Date.now();
      for (let page = 0; page < totalPages; page++) {
        await performanceTools.searchAccounts({
          limit: pageSize,
          offset: page * pageSize
        });
      }
      const sequentialDuration = Date.now() - sequentialStart;

      // Concurrent pagination test
      performanceMonitor.reset();
      const concurrentStart = Date.now();
      const concurrentPages = Array(totalPages).fill(null).map((_, page) =>
        performanceTools.searchAccounts({
          limit: pageSize,
          offset: page * pageSize
        })
      );
      await Promise.all(concurrentPages);
      const concurrentDuration = Date.now() - concurrentStart;

      const stats = performanceMonitor.getStats();

      expect(stats.successRate).toBe(100);
      expect(concurrentDuration).toBeLessThan(sequentialDuration * 0.8); // Should be faster
      expect(stats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS);

      console.log(`Pagination Efficiency Test:
        - Sequential Duration: ${sequentialDuration}ms
        - Concurrent Duration: ${concurrentDuration}ms
        - Improvement: ${((sequentialDuration - concurrentDuration) / sequentialDuration * 100).toFixed(1)}%
        - Avg Page Load: ${stats.avgDuration.toFixed(2)}ms`);
    });
  });

  describe("Stress Tests", () => {
    it("should handle rapid successive requests", async () => {
      performanceMonitor.reset();
      
      const rapidRequests = 50;
      const requests: Promise<any>[] = [];

      // Fire requests as rapidly as possible
      for (let i = 0; i < rapidRequests; i++) {
        requests.push(performanceTools.searchAccounts({
          query: `rapid${i}`,
          limit: 5
        }));
      }

      const results = await Promise.allSettled(requests);
      const stats = performanceMonitor.getStats();

      const successfulResults = results.filter(r => r.status === "fulfilled");
      const successRate = (successfulResults.length / results.length) * 100;

      expect(successRate).toBeGreaterThanOrEqual(90);
      expect(stats.maxDuration).toBeLessThan(PERFORMANCE_CONFIG.MAX_RESPONSE_TIME_MS);

      console.log(`Rapid Request Stress Test:
        - Requests: ${rapidRequests}
        - Success Rate: ${successRate.toFixed(1)}%
        - Max Duration: ${stats.maxDuration.toFixed(2)}ms
        - Requests/sec: ${stats.requestsPerSecond.toFixed(1)}`);
    });

    it("should recover from temporary overload", async () => {
      performanceMonitor.reset();
      
      // Create overload condition
      const overloadRequests = 100;
      const overloadPromises = Array(overloadRequests).fill(null).map(() =>
        performanceTools.searchTransactions({
          limit: 100,
          type: "SI"
        })
      );

      // Wait for overload to process
      await Promise.allSettled(overloadPromises);

      // Test recovery with normal requests
      performanceMonitor.reset();
      const recoveryRequests = 10;
      const recoveryPromises = Array(recoveryRequests).fill(null).map(() =>
        performanceTools.getAccount({ code: "1000" })
      );

      const recoveryResults = await Promise.all(recoveryPromises);
      const recoveryStats = performanceMonitor.getStats();

      expect(recoveryResults).toHaveLength(recoveryRequests);
      expect(recoveryStats.successRate).toBe(100);
      expect(recoveryStats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS);

      console.log(`Recovery Test:
        - Overload Requests: ${overloadRequests}
        - Recovery Requests: ${recoveryRequests}
        - Recovery Success Rate: ${recoveryStats.successRate}%
        - Recovery Avg Duration: ${recoveryStats.avgDuration.toFixed(2)}ms`);
    });
  });

  describe("Performance Regression Tests", () => {
    it("should maintain consistent performance across tool types", async () => {
      const toolTests = [
        { name: "searchAccounts", args: { query: "test", limit: 20 } },
        { name: "searchTransactions", args: { type: "SI", limit: 20 } },
        { name: "searchContacts", args: { type: "C", limit: 20 } },
        { name: "getAccount", args: { code: "1000" } },
        { name: "getTransaction", args: { sequenceNumber: 1001 } },
        { name: "getContact", args: { code: "CUST001" } },
      ];

      const toolPerformance: Record<string, any> = {};

      for (const toolTest of toolTests) {
        performanceMonitor.reset();
        
        const iterations = 20;
        const promises = Array(iterations).fill(null).map(() =>
          performanceTools[toolTest.name as keyof typeof performanceTools](toolTest.args)
        );

        await Promise.all(promises);
        const stats = performanceMonitor.getStats();
        
        toolPerformance[toolTest.name] = {
          avgDuration: stats.avgDuration,
          maxDuration: stats.maxDuration,
          successRate: stats.successRate
        };

        expect(stats.successRate).toBe(100);
        expect(stats.avgDuration).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS);
      }

      console.log("Tool Performance Comparison:");
      for (const [tool, perf] of Object.entries(toolPerformance)) {
        console.log(`  ${tool}: ${perf.avgDuration.toFixed(2)}ms avg, ${perf.maxDuration.toFixed(2)}ms max`);
      }

      // Ensure no tool is significantly slower than others
      const avgDurations = Object.values(toolPerformance).map((p: any) => p.avgDuration);
      const minAvg = Math.min(...avgDurations);
      const maxAvg = Math.max(...avgDurations);
      const variance = maxAvg - minAvg;

      expect(variance).toBeLessThan(PERFORMANCE_CONFIG.TARGET_RESPONSE_TIME_MS * 0.5);
    });
  });
});