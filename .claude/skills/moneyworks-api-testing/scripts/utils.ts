/**
 * Shared utilities for MoneyWorks API testing scripts
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";

export const DEFAULT_API_URL = "http://localhost:3400/api/v1";

/**
 * Parse command line arguments
 */
export function parseArgs(argv: string[]): Record<string, string | boolean> {
	const args: Record<string, string | boolean> = {};
	for (const arg of argv.slice(2)) {
		if (arg.startsWith("--")) {
			const [key, ...valueParts] = arg.slice(2).split("=");
			const value = valueParts.join("=");
			args[key] = value || true;
		}
	}
	return args;
}

/**
 * Get bearer token from various sources
 * Priority: CLI arg > environment variable > .env file
 */
export function getToken(args: Record<string, string | boolean>): string | null {
	// 1. CLI argument
	if (typeof args.token === "string" && args.token) {
		return args.token;
	}

	// 2. Environment variable
	if (process.env.MW_TOKEN) {
		return process.env.MW_TOKEN;
	}

	// 3. .env file in project root
	const envPaths = [
		join(process.cwd(), ".env"),
		join(process.cwd(), ".env.local"),
	];

	for (const envPath of envPaths) {
		if (existsSync(envPath)) {
			const content = readFileSync(envPath, "utf-8");
			const match = content.match(/^MW_TOKEN=(.+)$/m);
			if (match) {
				return match[1].trim().replace(/^["']|["']$/g, "");
			}
		}
	}

	return null;
}

/**
 * Get API base URL
 */
export function getApiUrl(args: Record<string, string | boolean>): string {
	if (typeof args.url === "string" && args.url) {
		return args.url;
	}
	if (process.env.MW_API_URL) {
		return process.env.MW_API_URL;
	}
	return DEFAULT_API_URL;
}

/**
 * Make authenticated API request
 */
export async function apiRequest<T = any>(
	endpoint: string,
	options: {
		method?: "GET" | "POST" | "PUT" | "DELETE";
		token: string;
		body?: any;
		baseUrl?: string;
	}
): Promise<{ data: T; status: number; ok: boolean; error?: string }> {
	const { method = "GET", token, body, baseUrl = DEFAULT_API_URL } = options;
	const url = `${baseUrl}${endpoint}`;

	try {
		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		const contentType = response.headers.get("content-type") || "";
		let data: any;

		if (contentType.includes("application/json")) {
			data = await response.json();
		} else {
			data = await response.text();
		}

		if (!response.ok) {
			const errorMessage =
				data?.error?.message || data?.message || `HTTP ${response.status}`;
			return {
				data,
				status: response.status,
				ok: false,
				error: errorMessage,
			};
		}

		return { data, status: response.status, ok: true };
	} catch (error: any) {
		return {
			data: null as any,
			status: 0,
			ok: false,
			error: error.message || "Network error",
		};
	}
}

/**
 * Format JSON for console output
 */
export function formatJson(data: any, indent = 2): string {
	return JSON.stringify(data, null, indent);
}

/**
 * Print error and exit
 */
export function exitWithError(message: string, code = 1): never {
	console.error(`\n❌ Error: ${message}\n`);
	process.exit(code);
}

/**
 * Print usage help
 */
export function printUsage(scriptName: string, options: string[], examples: string[]): void {
	console.log(`
Usage: bun ${scriptName} [options]

Options:
${options.map((o) => `  ${o}`).join("\n")}
  --token=xxx     Bearer token (or set MW_TOKEN env var)
  --url=xxx       API base URL (default: ${DEFAULT_API_URL})

Examples:
${examples.map((e) => `  ${e}`).join("\n")}
`);
}

/**
 * MoneyWorks type to TypeScript type mapping
 */
export function mwTypeToTs(mwType: string): string {
	if (!mwType) return "string";

	const type = mwType.toUpperCase();

	// Boolean
	if (type === "B" || type.startsWith("B(")) return "boolean";

	// Number types
	if (type === "N" || type.startsWith("N(") || type === "I" || type.startsWith("I(")) {
		return "number";
	}

	// Currency/decimal
	if (type === "$" || type.startsWith("$(")) return "number";

	// Date types
	if (type === "D" || type.startsWith("D(")) return "string"; // YYYYMMDD branded type

	// Time types
	if (type === "S" || type.startsWith("S(")) return "string";

	// Text types
	if (type === "T" || type.startsWith("T(")) return "string";

	// Binary/blob
	if (type === "X" || type.startsWith("X(")) return "string";

	return "string";
}

/**
 * Check if field is likely optional based on MoneyWorks conventions
 */
export function isOptionalField(fieldName: string, mwType: string): boolean {
	// Primary keys and codes are usually required
	if (
		fieldName === "Code" ||
		fieldName === "SequenceNumber" ||
		fieldName.endsWith("Code")
	) {
		return false;
	}

	// Most other fields are optional
	return true;
}

/**
 * Format table data for console output
 */
export function formatTable(
	headers: string[],
	rows: string[][],
	options: { maxWidth?: number } = {}
): string {
	const maxWidth = options.maxWidth || 40;

	// Calculate column widths
	const colWidths = headers.map((h, i) => {
		const maxDataWidth = Math.max(...rows.map((r) => (r[i] || "").length));
		return Math.min(Math.max(h.length, maxDataWidth), maxWidth);
	});

	// Format header
	const headerLine = headers
		.map((h, i) => h.padEnd(colWidths[i]).slice(0, colWidths[i]))
		.join(" | ");
	const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");

	// Format rows
	const dataLines = rows.map((row) =>
		row
			.map((cell, i) =>
				(cell || "").padEnd(colWidths[i]).slice(0, colWidths[i])
			)
			.join(" | ")
	);

	return [headerLine, separator, ...dataLines].join("\n");
}
