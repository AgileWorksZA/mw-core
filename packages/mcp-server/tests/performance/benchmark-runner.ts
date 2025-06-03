#!/usr/bin/env bun

/**
 * Benchmark runner for MCP tools
 * Provides detailed performance analysis and comparison
 */

import fs from "fs";
import path from "path";

interface BenchmarkConfig {
  warmupIterations: number;
  testIterations: number;
  concurrentUsers: number;
  testDurationMs: number;
  memoryLimitMB: number;
  targetResponseTimeMs: number;
}

interface BenchmarkResult {
  tool: string;
  scenario: string;
  iterations: number;
  totalDuration: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50Duration: number;
  p95Duration: number;
  p99Duration: number;
  successRate: number;
  throughput: number; // requests per second
  memoryUsage: {
    avg: number;
    max: number;
    final: number;
  };
  errors: string[];
}

interface SystemMetrics {
  timestamp: number;
  memoryUsage: number;
  cpuUsage?: number;
}

class BenchmarkRunner {
  private config: BenchmarkConfig;
  private results: BenchmarkResult[] = [];
  private systemMetrics: SystemMetrics[] = [];
  private metricsInterval?: NodeJS.Timeout;

  constructor(config: BenchmarkConfig) {
    this.config = config;
  }

  startSystemMonitoring() {
    this.systemMetrics = [];
    this.metricsInterval = setInterval(() => {
      this.systemMetrics.push({
        timestamp: Date.now(),
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      });
    }, 100);
  }

  stopSystemMonitoring() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }

  async benchmarkTool(
    toolName: string,
    toolFunction: (args: any) => Promise<any>,
    scenarios: Array<{ name: string; args: any; iterations?: number }>
  ) {
    console.log(`\n📊 Benchmarking ${toolName}`);
    console.log("=".repeat(50));

    for (const scenario of scenarios) {
      await this.runScenario(toolName, scenario.name, toolFunction, scenario.args, scenario.iterations);
    }
  }

  private async runScenario(
    toolName: string,
    scenarioName: string,
    toolFunction: (args: any) => Promise<any>,
    args: any,
    iterations?: number
  ) {
    const testIterations = iterations || this.config.testIterations;
    console.log(`\n🔍 Scenario: ${scenarioName} (${testIterations} iterations)`);

    // Warmup phase
    console.log("🔥 Warming up...");
    for (let i = 0; i < this.config.warmupIterations; i++) {
      try {
        await toolFunction(args);
      } catch (error) {
        // Ignore warmup errors
      }
    }

    // Clear system metrics and start monitoring
    this.startSystemMonitoring();

    // Benchmark phase
    console.log("⚡ Running benchmark...");
    const durations: number[] = [];
    const errors: string[] = [];
    const startTime = Date.now();

    for (let i = 0; i < testIterations; i++) {
      const iterationStart = Date.now();
      
      try {
        await toolFunction(args);
        const duration = Date.now() - iterationStart;
        durations.push(duration);
      } catch (error) {
        const duration = Date.now() - iterationStart;
        durations.push(duration);
        errors.push(error.message);
      }

      // Brief pause to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 1));
    }

    const totalDuration = Date.now() - startTime;
    this.stopSystemMonitoring();

    // Calculate statistics
    const sortedDurations = durations.sort((a, b) => a - b);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const successRate = ((testIterations - errors.length) / testIterations) * 100;
    const throughput = testIterations / (totalDuration / 1000);

    const memoryReadings = this.systemMetrics.map(m => m.memoryUsage);
    const avgMemory = memoryReadings.reduce((sum, m) => sum + m, 0) / memoryReadings.length;
    const maxMemory = Math.max(...memoryReadings);
    const finalMemory = memoryReadings[memoryReadings.length - 1] || 0;

    const result: BenchmarkResult = {
      tool: toolName,
      scenario: scenarioName,
      iterations: testIterations,
      totalDuration,
      avgDuration,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      p50Duration: this.percentile(sortedDurations, 50),
      p95Duration: this.percentile(sortedDurations, 95),
      p99Duration: this.percentile(sortedDurations, 99),
      successRate,
      throughput,
      memoryUsage: {
        avg: avgMemory,
        max: maxMemory,
        final: finalMemory,
      },
      errors: errors.slice(0, 5), // Keep only first 5 errors
    };

    this.results.push(result);
    this.printScenarioResults(result);
  }

  private percentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  private printScenarioResults(result: BenchmarkResult) {
    const status = result.successRate >= 99 ? "✅" : result.successRate >= 95 ? "⚠️" : "❌";
    const performanceStatus = result.avgDuration <= this.config.targetResponseTimeMs ? "⚡" : "🐌";
    
    console.log(`${status} ${performanceStatus} Results:`);
    console.log(`   Success Rate: ${result.successRate.toFixed(1)}%`);
    console.log(`   Avg Duration: ${result.avgDuration.toFixed(2)}ms`);
    console.log(`   Min/Max:      ${result.minDuration.toFixed(2)}ms / ${result.maxDuration.toFixed(2)}ms`);
    console.log(`   P95/P99:      ${result.p95Duration.toFixed(2)}ms / ${result.p99Duration.toFixed(2)}ms`);
    console.log(`   Throughput:   ${result.throughput.toFixed(1)} req/s`);
    console.log(`   Memory:       ${result.memoryUsage.avg.toFixed(1)}MB avg, ${result.memoryUsage.max.toFixed(1)}MB peak`);
    
    if (result.errors.length > 0) {
      console.log(`   Errors:       ${result.errors.length} (${result.errors[0]})`);
    }
  }

  async runConcurrencyTest(
    toolName: string,
    toolFunction: (args: any) => Promise<any>,
    args: any,
    concurrentUsers: number = this.config.concurrentUsers
  ) {
    console.log(`\n🏁 Concurrency Test: ${toolName} (${concurrentUsers} concurrent users)`);
    console.log("=".repeat(60));

    this.startSystemMonitoring();

    const requestsPerUser = 10;
    const userPromises = Array(concurrentUsers).fill(null).map(async (_, userId) => {
      const userResults = [];
      
      for (let req = 0; req < requestsPerUser; req++) {
        const startTime = Date.now();
        
        try {
          await toolFunction({ ...args, userId, reqId: req });
          userResults.push({
            duration: Date.now() - startTime,
            success: true,
            error: null,
          });
        } catch (error) {
          userResults.push({
            duration: Date.now() - startTime,
            success: false,
            error: error.message,
          });
        }

        // Random delay between requests
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      }
      
      return userResults;
    });

    const allUserResults = await Promise.all(userPromises);
    this.stopSystemMonitoring();

    // Analyze concurrency results
    const allRequests = allUserResults.flat();
    const successfulRequests = allRequests.filter(r => r.success);
    const durations = allRequests.map(r => r.duration);
    const sortedDurations = durations.sort((a, b) => a - b);

    const concurrencyResult: BenchmarkResult = {
      tool: toolName,
      scenario: `Concurrency (${concurrentUsers} users)`,
      iterations: allRequests.length,
      totalDuration: 0, // Not applicable for concurrent test
      avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      p50Duration: this.percentile(sortedDurations, 50),
      p95Duration: this.percentile(sortedDurations, 95),
      p99Duration: this.percentile(sortedDurations, 99),
      successRate: (successfulRequests.length / allRequests.length) * 100,
      throughput: 0, // Calculate differently for concurrent test
      memoryUsage: {
        avg: this.systemMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.systemMetrics.length,
        max: Math.max(...this.systemMetrics.map(m => m.memoryUsage)),
        final: this.systemMetrics[this.systemMetrics.length - 1]?.memoryUsage || 0,
      },
      errors: allRequests.filter(r => !r.success).map(r => r.error).slice(0, 5),
    };

    this.results.push(concurrencyResult);
    this.printScenarioResults(concurrencyResult);

    return concurrencyResult;
  }

  async runStressTest(
    toolName: string,
    toolFunction: (args: any) => Promise<any>,
    args: any,
    durationMs: number = this.config.testDurationMs
  ) {
    console.log(`\n💪 Stress Test: ${toolName} (${durationMs/1000}s duration)`);
    console.log("=".repeat(60));

    this.startSystemMonitoring();

    const startTime = Date.now();
    const requests: Array<Promise<any>> = [];
    let requestCount = 0;

    // Generate continuous load
    const loadGenerator = setInterval(() => {
      if (Date.now() - startTime >= durationMs) {
        clearInterval(loadGenerator);
        return;
      }

      requestCount++;
      const requestPromise = toolFunction({ ...args, stressId: requestCount })
        .then(() => ({ success: true, duration: Date.now() - startTime }))
        .catch(error => ({ success: false, duration: Date.now() - startTime, error: error.message }));
      
      requests.push(requestPromise);
    }, 50); // New request every 50ms

    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, durationMs));
    
    // Wait for all requests to complete
    const results = await Promise.allSettled(requests);
    this.stopSystemMonitoring();

    // Analyze stress test results
    const completedResults = results
      .filter(r => r.status === "fulfilled")
      .map(r => (r as PromiseFulfilledResult<any>).value);

    const successfulResults = completedResults.filter(r => r.success);
    const failedResults = completedResults.filter(r => !r.success);

    console.log(`💪 Stress Test Results:`);
    console.log(`   Total Requests: ${completedResults.length}`);
    console.log(`   Successful: ${successfulResults.length} (${(successfulResults.length/completedResults.length*100).toFixed(1)}%)`);
    console.log(`   Failed: ${failedResults.length}`);
    console.log(`   Avg Load: ${(completedResults.length / (durationMs/1000)).toFixed(1)} req/s`);
    console.log(`   Peak Memory: ${Math.max(...this.systemMetrics.map(m => m.memoryUsage)).toFixed(1)}MB`);

    if (failedResults.length > 0) {
      console.log(`   Sample Errors: ${failedResults.slice(0, 3).map(r => r.error).join(", ")}`);
    }

    const memoryExceeded = Math.max(...this.systemMetrics.map(m => m.memoryUsage)) > this.config.memoryLimitMB;
    const successRate = (successfulResults.length / completedResults.length) * 100;
    
    console.log(`   Status: ${successRate >= 90 && !memoryExceeded ? "✅ PASS" : "❌ FAIL"}`);

    return {
      totalRequests: completedResults.length,
      successRate,
      avgThroughput: completedResults.length / (durationMs/1000),
      peakMemory: Math.max(...this.systemMetrics.map(m => m.memoryUsage)),
      memoryExceeded,
      sampleErrors: failedResults.slice(0, 5).map(r => r.error),
    };
  }

  generateReport() {
    console.log(`\n📈 BENCHMARK REPORT`);
    console.log("=".repeat(80));

    // Summary statistics
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => 
      r.successRate >= 95 && 
      r.avgDuration <= this.config.targetResponseTimeMs &&
      r.memoryUsage.max <= this.config.memoryLimitMB
    ).length;

    console.log(`\n📊 Summary:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests} (${(passedTests/totalTests*100).toFixed(1)}%)`);
    console.log(`   Failed: ${totalTests - passedTests}`);

    // Performance summary by tool
    const toolStats = this.results.reduce((acc, result) => {
      if (!acc[result.tool]) {
        acc[result.tool] = {
          scenarios: 0,
          avgDuration: 0,
          maxDuration: 0,
          avgSuccessRate: 0,
          maxMemory: 0,
        };
      }

      const stats = acc[result.tool];
      stats.scenarios++;
      stats.avgDuration += result.avgDuration;
      stats.maxDuration = Math.max(stats.maxDuration, result.maxDuration);
      stats.avgSuccessRate += result.successRate;
      stats.maxMemory = Math.max(stats.maxMemory, result.memoryUsage.max);

      return acc;
    }, {} as Record<string, any>);

    console.log(`\n📋 Performance by Tool:`);
    for (const [tool, stats] of Object.entries(toolStats)) {
      stats.avgDuration /= stats.scenarios;
      stats.avgSuccessRate /= stats.scenarios;

      const performanceGrade = stats.avgDuration <= this.config.targetResponseTimeMs ? "A" : 
                              stats.avgDuration <= this.config.targetResponseTimeMs * 1.5 ? "B" : 
                              stats.avgDuration <= this.config.targetResponseTimeMs * 2 ? "C" : "F";

      console.log(`   ${tool}:`);
      console.log(`     Grade: ${performanceGrade}`);
      console.log(`     Avg Duration: ${stats.avgDuration.toFixed(2)}ms`);
      console.log(`     Max Duration: ${stats.maxDuration.toFixed(2)}ms`);
      console.log(`     Avg Success Rate: ${stats.avgSuccessRate.toFixed(1)}%`);
      console.log(`     Peak Memory: ${stats.maxMemory.toFixed(1)}MB`);
    }

    // Detailed results
    console.log(`\n📊 Detailed Results:`);
    for (const result of this.results) {
      const status = result.successRate >= 99 ? "✅" : result.successRate >= 95 ? "⚠️" : "❌";
      const perf = result.avgDuration <= this.config.targetResponseTimeMs ? "⚡" : "🐌";
      
      console.log(`   ${status} ${perf} ${result.tool}.${result.scenario}:`);
      console.log(`     ${result.avgDuration.toFixed(2)}ms avg (P95: ${result.p95Duration.toFixed(2)}ms)`);
      console.log(`     ${result.successRate.toFixed(1)}% success, ${result.throughput.toFixed(1)} req/s`);
      
      if (result.errors.length > 0) {
        console.log(`     Errors: ${result.errors[0]}`);
      }
    }

    return {
      summary: { totalTests, passedTests, passRate: passedTests/totalTests*100 },
      toolStats,
      detailedResults: this.results,
    };
  }

  exportResults(filename: string) {
    const report = this.generateReport();
    const exportData = {
      timestamp: new Date().toISOString(),
      config: this.config,
      summary: report.summary,
      toolStats: report.toolStats,
      results: this.results,
    };

    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    console.log(`\n💾 Results exported to: ${filename}`);
  }
}

// Mock tool implementations for benchmarking
const createBenchmarkTool = (name: string, baseDelay: number = 50) => {
  return async (args: any) => {
    // Simulate variable processing time based on complexity
    const complexity = args.limit || 10;
    const delay = baseDelay + (complexity * 2) + (Math.random() * 20);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate response size based on limit
    const responseSize = complexity;
    const mockData = Array(responseSize).fill(null).map((_, i) => ({
      id: `${name}_${i}`,
      data: `mock_data_${i}`,
      timestamp: Date.now(),
    }));

    return {
      data: mockData,
      total: responseSize,
      processingTime: delay,
    };
  };
};

// Main benchmark execution
async function main() {
  const config: BenchmarkConfig = {
    warmupIterations: 5,
    testIterations: 50,
    concurrentUsers: 10,
    testDurationMs: 30000,
    memoryLimitMB: 100,
    targetResponseTimeMs: 500,
  };

  const runner = new BenchmarkRunner(config);

  console.log("🏃‍♂️ Starting MCP Tools Benchmark Suite");
  console.log("=====================================");
  console.log(`Configuration:`);
  console.log(`  Warmup Iterations: ${config.warmupIterations}`);
  console.log(`  Test Iterations: ${config.testIterations}`);
  console.log(`  Target Response Time: ${config.targetResponseTimeMs}ms`);
  console.log(`  Memory Limit: ${config.memoryLimitMB}MB`);

  const tools = {
    searchAccounts: createBenchmarkTool("account", 30),
    searchTransactions: createBenchmarkTool("transaction", 80),
    searchContacts: createBenchmarkTool("contact", 40),
    getAccount: createBenchmarkTool("account", 20),
    getTransaction: createBenchmarkTool("transaction", 25),
    getContact: createBenchmarkTool("contact", 20),
  };

  // Benchmark individual tools
  await runner.benchmarkTool("searchAccounts", tools.searchAccounts, [
    { name: "small_search", args: { query: "cash", limit: 10 } },
    { name: "large_search", args: { query: "account", limit: 100 } },
    { name: "filtered_search", args: { type: "CA", limit: 50 } },
  ]);

  await runner.benchmarkTool("searchTransactions", tools.searchTransactions, [
    { name: "recent_transactions", args: { type: "SI", limit: 20 } },
    { name: "large_query", args: { limit: 100 } },
    { name: "filtered_query", args: { type: "SI", status: "OP", limit: 30 } },
  ]);

  await runner.benchmarkTool("searchContacts", tools.searchContacts, [
    { name: "customer_search", args: { type: "C", limit: 25 } },
    { name: "all_contacts", args: { limit: 100 } },
  ]);

  // Single record lookups
  await runner.benchmarkTool("getAccount", tools.getAccount, [
    { name: "single_lookup", args: { code: "1000" }, iterations: 100 },
  ]);

  // Concurrency tests
  await runner.runConcurrencyTest("searchAccounts", tools.searchAccounts, { query: "test", limit: 20 });
  await runner.runConcurrencyTest("searchTransactions", tools.searchTransactions, { type: "SI", limit: 15 });

  // Stress tests
  await runner.runStressTest("searchAccounts", tools.searchAccounts, { query: "stress", limit: 10 }, 15000);

  // Generate and export report
  const report = runner.generateReport();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportFile = `benchmark-report-${timestamp}.json`;
  runner.exportResults(reportFile);

  // Exit with appropriate code
  const overallPass = report.summary.passRate >= 80;
  console.log(`\n${overallPass ? "✅" : "❌"} Benchmark ${overallPass ? "PASSED" : "FAILED"} (${report.summary.passRate.toFixed(1)}% pass rate)`);
  
  process.exit(overallPass ? 0 : 1);
}

// Run if this file is executed directly
if (import.meta.main) {
  main().catch(console.error);
}

export { BenchmarkRunner, main };