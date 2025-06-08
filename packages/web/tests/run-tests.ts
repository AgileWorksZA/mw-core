#!/usr/bin/env bun

import { spawn } from "child_process";
import { promisify } from "util";
import * as path from "path";
import * as fs from "fs/promises";

const execAsync = promisify(spawn);

interface TestResult {
  suite: string;
  passed: number;
  failed: number;
  duration: number;
  errors: string[];
}

class TestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async run() {
    console.log("🧪 IDE Comprehensive Test Suite");
    console.log("================================\n");

    this.startTime = Date.now();

    // Run tests in sequence
    await this.runUnitTests();
    await this.runIntegrationTests();
    await this.runE2ETests();

    // Generate report
    await this.generateReport();
  }

  private async runUnitTests() {
    console.log("📦 Running Unit Tests...\n");

    const unitTestSuites = [
      {
        name: "Variable Resolution",
        pattern: "tests/unit/environment/*.test.ts",
      },
      {
        name: "Storage Module",
        pattern: "tests/unit/storage/*.test.ts",
      },
      {
        name: "IDE Core",
        pattern: "tests/unit/ide/*.test.ts",
      },
      {
        name: "Utilities",
        pattern: "tests/unit/utils/*.test.ts",
      },
    ];

    for (const suite of unitTestSuites) {
      await this.runTestSuite(suite.name, suite.pattern, "unit");
    }
  }

  private async runIntegrationTests() {
    console.log("\n🔗 Running Integration Tests...\n");

    const integrationSuites = [
      {
        name: "IDE Workflows",
        pattern: "tests/integration/workflows/*.test.ts",
      },
      {
        name: "State Synchronization",
        pattern: "tests/integration/sync/*.test.ts",
      },
    ];

    for (const suite of integrationSuites) {
      await this.runTestSuite(suite.name, suite.pattern, "integration");
    }
  }

  private async runE2ETests() {
    console.log("\n🌐 Running E2E Tests...\n");

    // Ensure dev server is running
    const isServerRunning = await this.checkDevServer();
    if (!isServerRunning) {
      console.log("⚠️  Dev server not running. Please start it with 'bun run dev'");
      return;
    }

    const e2eSuites = [
      {
        name: "Variable Management UI",
        pattern: "tests/e2e/variables/*.e2e.ts",
      },
      {
        name: "IDE Core UI",
        pattern: "tests/e2e/ide/*.e2e.ts",
      },
      {
        name: "OpenAPI Module UI",
        pattern: "tests/e2e/openapi/*.e2e.ts",
      },
      {
        name: "Service Connections UI",
        pattern: "tests/e2e/services/*.e2e.ts",
      },
    ];

    for (const suite of e2eSuites) {
      await this.runPlaywrightSuite(suite.name, suite.pattern);
    }
  }

  private async runTestSuite(name: string, pattern: string, type: "unit" | "integration") {
    const startTime = Date.now();
    const result: TestResult = {
      suite: name,
      passed: 0,
      failed: 0,
      duration: 0,
      errors: [],
    };

    try {
      console.log(`  Running ${name}...`);
      
      const { stdout, stderr } = await this.exec(`bun test ${pattern}`);
      
      // Parse test results
      const output = stdout.toString();
      const passedMatch = output.match(/(\d+) pass/);
      const failedMatch = output.match(/(\d+) fail/);
      
      if (passedMatch) result.passed = parseInt(passedMatch[1]);
      if (failedMatch) result.failed = parseInt(failedMatch[1]);
      
      if (result.failed > 0) {
        result.errors.push(stderr.toString() || output);
      }
      
      result.duration = Date.now() - startTime;
      
      // Display results
      if (result.failed === 0) {
        console.log(`  ✅ ${name}: ${result.passed} passed (${result.duration}ms)`);
      } else {
        console.log(`  ❌ ${name}: ${result.passed} passed, ${result.failed} failed (${result.duration}ms)`);
      }
    } catch (error) {
      result.failed = 1;
      result.errors.push(error.message);
      console.log(`  ❌ ${name}: Error running tests`);
    }

    this.results.push(result);
  }

  private async runPlaywrightSuite(name: string, pattern: string) {
    const startTime = Date.now();
    const result: TestResult = {
      suite: name,
      passed: 0,
      failed: 0,
      duration: 0,
      errors: [],
    };

    try {
      console.log(`  Running ${name}...`);
      
      const { stdout, stderr } = await this.exec(`bunx playwright test ${pattern}`);
      
      // Parse Playwright results
      const output = stdout.toString();
      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);
      
      if (passedMatch) result.passed = parseInt(passedMatch[1]);
      if (failedMatch) result.failed = parseInt(failedMatch[1]);
      
      if (result.failed > 0) {
        result.errors.push(stderr.toString() || output);
      }
      
      result.duration = Date.now() - startTime;
      
      // Display results
      if (result.failed === 0) {
        console.log(`  ✅ ${name}: ${result.passed} passed (${result.duration}ms)`);
      } else {
        console.log(`  ❌ ${name}: ${result.passed} passed, ${result.failed} failed (${result.duration}ms)`);
      }
    } catch (error) {
      result.failed = 1;
      result.errors.push(error.message);
      console.log(`  ❌ ${name}: Error running tests`);
    }

    this.results.push(result);
  }

  private async checkDevServer(): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:5173");
      return response.ok;
    } catch {
      return false;
    }
  }

  private async exec(command: string): Promise<{ stdout: Buffer; stderr: Buffer }> {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(" ");
      const child = spawn(cmd, args);
      
      let stdout = Buffer.alloc(0);
      let stderr = Buffer.alloc(0);
      
      child.stdout.on("data", (data) => {
        stdout = Buffer.concat([stdout, data]);
      });
      
      child.stderr.on("data", (data) => {
        stderr = Buffer.concat([stderr, data]);
      });
      
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr.toString()}`));
        }
      });
    });
  }

  private async generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failed, 0);
    
    console.log("\n================================");
    console.log("📊 Test Summary");
    console.log("================================\n");
    
    // Summary table
    console.log("Suite Results:");
    for (const result of this.results) {
      const status = result.failed === 0 ? "✅" : "❌";
      console.log(`  ${status} ${result.suite.padEnd(30)} ${result.passed} passed, ${result.failed} failed`);
    }
    
    console.log("\n--------------------------------");
    console.log(`Total Tests: ${totalPassed + totalFailed}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log("--------------------------------\n");
    
    // Generate detailed report
    const reportPath = path.join(process.cwd(), "tests", "test-report.json");
    const report = {
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      summary: {
        total: totalPassed + totalFailed,
        passed: totalPassed,
        failed: totalFailed,
      },
      suites: this.results,
    };
    
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    
    // Exit with appropriate code
    process.exit(totalFailed > 0 ? 1 : 0);
  }
}

// Run tests if called directly
if (import.meta.main) {
  const runner = new TestRunner();
  runner.run().catch((error) => {
    console.error("Test runner error:", error);
    process.exit(1);
  });
}