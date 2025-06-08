/**
 * Test setup and configuration for MCP server tests
 */

import { afterAll, afterEach, beforeAll, beforeEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { TicketService } from "../src/services/ticket-service";

// Test configuration
export const TEST_CONFIG = {
	DB_PATH: "./tests/data/test-tickets.db",
	TIMEOUT: 10000,
	MAX_RETRIES: 3,
	LOG_LEVEL: process.env.TEST_LOG_LEVEL || "error",
};

// Mock MoneyWorks API responses
export const MOCK_RESPONSES = {
	accounts: {
		success: {
			data: [
				{
					Code: "1000",
					Description: "Cash at Bank",
					Type: "A",
					Category: "CASH",
					CurrentBalance: 50000.0,
				},
				{
					Code: "4000",
					Description: "Sales Revenue",
					Type: "I",
					Category: "SALES",
					CurrentBalance: 0.0,
				},
			],
			pagination: { total: 2, offset: 0, limit: 50 },
		},
		notFound: {
			data: [],
			pagination: { total: 0, offset: 0, limit: 50 },
		},
	},
	transactions: {
		success: {
			data: [
				{
					SequenceNumber: 1001,
					Type: "SI",
					Status: "OP",
					OurRef: "INV-001",
					NameCode: "CUST001",
					TransDate: "2024-01-15",
					Gross: 1200.0,
					AmtPaid: 800.0,
					Period: 1,
				},
			],
			pagination: { total: 1, offset: 0, limit: 50 },
		},
	},
	contacts: {
		success: {
			data: [
				{
					Code: "CUST001",
					Description: "ABC Corporation",
					Type: "C",
					Address: "123 Business St",
					Phone: "+1234567890",
					Email: "contact@abc.com",
				},
			],
			pagination: { total: 1, offset: 0, limit: 50 },
		},
	},
};

// Test database setup
let testTicketService: TicketService;

export async function setupTestDatabase() {
	// Ensure test data directory exists
	const testDataDir = path.dirname(TEST_CONFIG.DB_PATH);
	if (!fs.existsSync(testDataDir)) {
		fs.mkdirSync(testDataDir, { recursive: true });
	}

	// Remove existing test database
	if (fs.existsSync(TEST_CONFIG.DB_PATH)) {
		fs.unlinkSync(TEST_CONFIG.DB_PATH);
	}

	// Initialize test ticket service
	testTicketService = new TicketService(TEST_CONFIG.DB_PATH);
}

export async function cleanupTestDatabase() {
	if (testTicketService) {
		// Close database connections if available
		// Note: Add cleanup method to TicketService if needed
	}

	// Remove test database
	if (fs.existsSync(TEST_CONFIG.DB_PATH)) {
		fs.unlinkSync(TEST_CONFIG.DB_PATH);
	}
}

export function getTestTicketService(): TicketService {
	return testTicketService;
}

// Mock service factory for testing tools without real API calls
export function createMockService<T>(mockData: any) {
	return {
		async getData(options: any) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 10));

			if (options.search && Object.keys(options.search).length > 0) {
				// Simple mock search logic
				const searchKey = Object.keys(options.search)[0];
				const searchValue = options.search[searchKey];

				const filtered = mockData.data.filter(
					(item: any) =>
						item[searchKey] === searchValue ||
						item[searchKey]?.toString().includes(searchValue?.toString()),
				);

				return {
					data: filtered.slice(
						options.offset || 0,
						(options.offset || 0) + (options.limit || 50),
					),
					pagination: {
						total: filtered.length,
						offset: options.offset || 0,
						limit: options.limit || 50,
					},
				};
			}

			return {
				data: mockData.data.slice(
					options.offset || 0,
					(options.offset || 0) + (options.limit || 50),
				),
				pagination: {
					total: mockData.data.length,
					offset: options.offset || 0,
					limit: options.limit || 50,
				},
			};
		},
	};
}

// Error simulation helpers
export class MockApiError extends Error {
	constructor(
		message: string,
		public code = 500,
		public details?: any,
	) {
		super(message);
		this.name = "MockApiError";
	}
}

export function simulateNetworkError() {
	throw new MockApiError("Network timeout", 408);
}

export function simulateNotFoundError() {
	throw new MockApiError("Resource not found", 404);
}

export function simulateServerError() {
	throw new MockApiError("Internal server error", 500);
}

// Assertion helpers
export function assertToolResponse(response: any, expectedStructure: any) {
	expect(response).toBeDefined();
	expect(response.content).toBeDefined();
	expect(Array.isArray(response.content)).toBe(true);
	expect(response.content.length).toBeGreaterThan(0);
	expect(response.content[0].type).toBe("text");

	const data = JSON.parse(response.content[0].text);

	for (const [key, value] of Object.entries(expectedStructure)) {
		expect(data).toHaveProperty(key);
		if (typeof value === "string") {
			expect(typeof data[key]).toBe(value);
		} else if (Array.isArray(value)) {
			expect(Array.isArray(data[key])).toBe(true);
		}
	}
}

export function assertErrorResponse(response: any, expectedErrorType?: string) {
	expect(response).toBeDefined();
	expect(response.content).toBeDefined();
	expect(response.content[0].type).toBe("text");

	const content = response.content[0].text;
	expect(content).toContain("error");

	if (expectedErrorType) {
		expect(content.toLowerCase()).toContain(expectedErrorType.toLowerCase());
	}
}

// Global test hooks
beforeAll(async () => {
	await setupTestDatabase();
});

afterAll(async () => {
	await cleanupTestDatabase();
});

beforeEach(() => {
	// Reset any global state if needed
});

afterEach(() => {
	// Cleanup after each test
});
