#!/usr/bin/env bun

/**
 * Main test runner for the comprehensive MCP server test suite
 * Orchestrates all test types and generates summary reports
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface TestResult {
	suite: string;
	passed: boolean;
	duration: number;
	output: string;
	errors?: string[];
}

interface TestSummary {
	totalSuites: number;
	passedSuites: number;
	failedSuites: number;
	totalDuration: number;
	results: TestResult[];
	overallPass: boolean;
}

class TestRunner {
	private results: TestResult[] = [];
	private startTime = 0;

	async runTestSuite(
		suiteName: string,
		command: string,
		args: string[] = [],
		options: { timeout?: number; cwd?: string } = {},
	): Promise<TestResult> {
		console.log(`\n🧪 Running ${suiteName}...`);
		console.log(`Command: ${command} ${args.join(" ")}`);
		console.log("=".repeat(50));

		const start = Date.now();

		return new Promise((resolve) => {
			const process = spawn(command, args, {
				cwd: options.cwd || process.cwd(),
				stdio: "pipe",
				timeout: options.timeout || 300000, // 5 minute default timeout
			});

			let output = "";
			let errorOutput = "";

			process.stdout?.on("data", (data) => {
				const text = data.toString();
				output += text;
				// Real-time output for immediate feedback
				process.stdout.write(text);
			});

			process.stderr?.on("data", (data) => {
				const text = data.toString();
				errorOutput += text;
				process.stderr.write(text);
			});

			process.on("close", (code) => {
				const duration = Date.now() - start;
				const passed = code === 0;

				const result: TestResult = {
					suite: suiteName,
					passed,
					duration,
					output: output + errorOutput,
					errors: passed ? undefined : [errorOutput],
				};

				this.results.push(result);

				const status = passed ? "✅ PASS" : "❌ FAIL";
				console.log(`\n${status} ${suiteName} (${duration}ms)`);

				resolve(result);
			});

			process.on("error", (error) => {
				const duration = Date.now() - start;
				const result: TestResult = {
					suite: suiteName,
					passed: false,
					duration,
					output: errorOutput,
					errors: [error.message],
				};

				this.results.push(result);
				console.log(`\n❌ ERROR ${suiteName}: ${error.message}`);
				resolve(result);
			});
		});
	}

	async runAllTests(): Promise<TestSummary> {
		console.log("🚀 Starting Comprehensive MCP Server Test Suite");
		console.log("===============================================");
		console.log(`Started at: ${new Date().toISOString()}`);

		this.startTime = Date.now();

		// 1. Unit Tests
		await this.runTestSuite(
			"Unit Tests",
			"bun",
			["test", "tests/unit/"],
			{ timeout: 120000 }, // 2 minutes
		);

		// 2. Integration Tests
		await this.runTestSuite(
			"Integration Tests",
			"bun",
			["test", "tests/integration/"],
			{ timeout: 180000 }, // 3 minutes
		);

		// 3. Validation Tests
		await this.runTestSuite(
			"Validation Tests",
			"bun",
			["test", "tests/validation/"],
			{ timeout: 120000 }, // 2 minutes
		);

		// 4. Performance Tests
		await this.runTestSuite(
			"Performance Tests",
			"bun",
			["test", "tests/performance/load-tests.test.ts"],
			{ timeout: 300000 }, // 5 minutes
		);

		// 5. Benchmark Tests
		await this.runTestSuite(
			"Benchmark Analysis",
			"bun",
			["run", "tests/performance/benchmark-runner.ts"],
			{ timeout: 600000 }, // 10 minutes
		);

		// 6. Manual Test Runner (sample verification)
		await this.runTestSuite(
			"Sample Query Validation",
			"bun",
			[
				"run",
				"tests/samples/manual-test-runner.ts",
				"accounts",
				"transactions",
			],
			{ timeout: 180000 }, // 3 minutes
		);

		return this.generateSummary();
	}

	private generateSummary(): TestSummary {
		const totalDuration = Date.now() - this.startTime;
		const passedSuites = this.results.filter((r) => r.passed).length;
		const failedSuites = this.results.filter((r) => !r.passed).length;
		const overallPass = failedSuites === 0;

		const summary: TestSummary = {
			totalSuites: this.results.length,
			passedSuites,
			failedSuites,
			totalDuration,
			results: this.results,
			overallPass,
		};

		this.printSummary(summary);
		return summary;
	}

	private printSummary(summary: TestSummary) {
		console.log(`\n${"=".repeat(80)}`);
		console.log("📊 TEST SUITE SUMMARY");
		console.log("=".repeat(80));

		console.log("\n📈 Overall Results:");
		console.log(`  Total Test Suites: ${summary.totalSuites}`);
		console.log(`  Passed: ${summary.passedSuites} ✅`);
		console.log(`  Failed: ${summary.failedSuites} ❌`);
		console.log(
			`  Success Rate: ${((summary.passedSuites / summary.totalSuites) * 100).toFixed(1)}%`,
		);
		console.log(
			`  Total Duration: ${(summary.totalDuration / 1000).toFixed(1)}s`,
		);

		console.log("\n📋 Suite Details:");
		for (const result of summary.results) {
			const status = result.passed ? "✅" : "❌";
			const duration = (result.duration / 1000).toFixed(1);
			console.log(`  ${status} ${result.suite}: ${duration}s`);

			if (!result.passed && result.errors) {
				for (const error of result.errors.slice(0, 2)) {
					const shortError = error.split("\n")[0].substring(0, 100);
					console.log(`    Error: ${shortError}...`);
				}
			}
		}

		// Performance insights
		const fastestSuite = summary.results.reduce((min, curr) =>
			curr.duration < min.duration ? curr : min,
		);
		const slowestSuite = summary.results.reduce((max, curr) =>
			curr.duration > max.duration ? curr : max,
		);

		console.log("\n⚡ Performance Insights:");
		console.log(
			`  Fastest: ${fastestSuite.suite} (${(fastestSuite.duration / 1000).toFixed(1)}s)`,
		);
		console.log(
			`  Slowest: ${slowestSuite.suite} (${(slowestSuite.duration / 1000).toFixed(1)}s)`,
		);
		console.log(
			`  Average: ${(summary.totalDuration / summary.totalSuites / 1000).toFixed(1)}s per suite`,
		);

		// Final verdict
		console.log(
			`\n🏆 Final Result: ${summary.overallPass ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"}`,
		);

		if (!summary.overallPass) {
			console.log("\n🔍 Failed Suites:");
			for (const result of summary.results.filter((r) => !r.passed)) {
				console.log(`  - ${result.suite}`);
			}
			console.log("\nRerun failed suites individually for detailed output.");
		}

		console.log(`\n${"=".repeat(80)}`);
	}

	exportResults(filename: string) {
		const summary = {
			timestamp: new Date().toISOString(),
			summary: this.generateSummary(),
			environment: {
				nodeVersion: process.version,
				platform: process.platform,
				arch: process.arch,
				cwd: process.cwd(),
			},
			detailedResults: this.results,
		};

		fs.writeFileSync(filename, JSON.stringify(summary, null, 2));
		console.log(`📄 Detailed results exported to: ${filename}`);
	}
}

// Additional utility functions
async function checkPrerequisites(): Promise<boolean> {
	console.log("🔍 Checking prerequisites...");

	// Check if bun is available
	try {
		await new Promise((resolve, reject) => {
			const bunCheck = spawn("bun", ["--version"], { stdio: "pipe" });
			bunCheck.on("close", (code) => {
				if (code === 0) resolve(undefined);
				else reject(new Error("Bun not found"));
			});
			bunCheck.on("error", reject);
		});
		console.log("  ✅ Bun is available");
	} catch (error) {
		console.log("  ❌ Bun is not available");
		return false;
	}

	// Check if test directories exist
	const testDirs = [
		"tests/unit",
		"tests/integration",
		"tests/validation",
		"tests/performance",
		"tests/samples",
	];
	for (const dir of testDirs) {
		if (!fs.existsSync(dir)) {
			console.log(`  ❌ Test directory not found: ${dir}`);
			return false;
		}
	}
	console.log("  ✅ All test directories found");

	// Check if test database directory exists, create if not
	const testDataDir = "tests/data";
	if (!fs.existsSync(testDataDir)) {
		fs.mkdirSync(testDataDir, { recursive: true });
		console.log(`  ✅ Created test data directory: ${testDataDir}`);
	} else {
		console.log(`  ✅ Test data directory exists: ${testDataDir}`);
	}

	return true;
}

async function cleanupTestArtifacts() {
	console.log("\n🧹 Cleaning up test artifacts...");

	const artifactPatterns = [
		"tests/data/*.db",
		"tests/data/*.db-shm",
		"tests/data/*.db-wal",
		"benchmark-report-*.json",
		"test-results-*.json",
	];

	for (const pattern of artifactPatterns) {
		try {
			// Simple glob implementation for cleanup
			const [dir, filePattern] = pattern.split("/").slice(-2);
			const fullDir = pattern.replace(`/${filePattern}`, "");

			if (fs.existsSync(fullDir)) {
				const files = fs.readdirSync(fullDir);
				const regex = new RegExp(filePattern.replace("*", ".*"));

				for (const file of files) {
					if (regex.test(file)) {
						const fullPath = path.join(fullDir, file);
						fs.unlinkSync(fullPath);
						console.log(`  🗑️  Removed: ${fullPath}`);
					}
				}
			}
		} catch (error) {
			// Ignore cleanup errors
		}
	}
}

// Main execution
async function main() {
	const args = process.argv.slice(2);

	// Parse command line arguments
	const shouldCleanup = args.includes("--cleanup");
	const shouldExport = args.includes("--export") || args.includes("--save");
	const verboseMode = args.includes("--verbose") || args.includes("-v");
	const skipPrereqs = args.includes("--skip-prereqs");

	try {
		// Prerequisites check
		if (!skipPrereqs) {
			const prereqsOk = await checkPrerequisites();
			if (!prereqsOk) {
				console.log("❌ Prerequisites check failed");
				process.exit(1);
			}
		}

		// Cleanup old artifacts if requested
		if (shouldCleanup) {
			await cleanupTestArtifacts();
		}

		// Run test suite
		const runner = new TestRunner();
		const summary = await runner.runAllTests();

		// Export results if requested
		if (shouldExport) {
			const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
			const filename = `test-results-${timestamp}.json`;
			runner.exportResults(filename);
		}

		// Exit with appropriate code
		const exitCode = summary.overallPass ? 0 : 1;
		console.log(`\n🏁 Test suite completed with exit code: ${exitCode}`);
		process.exit(exitCode);
	} catch (error) {
		console.error("💥 Test runner failed:", error);
		process.exit(1);
	}
}

// Run if this file is executed directly
if (import.meta.main) {
	main().catch(console.error);
}

export { TestRunner, main };
