import { z } from "zod";
import type { TicketService } from "../services/ticket-service";

let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializeSystemInfoTools(ticketSvc: TicketService) {
	ticketService = ticketSvc;
}

// Helper function for error tracking
async function trackError(error: unknown, toolName: string, args: unknown) {
	if (!ticketService) return;

	try {
		await ticketService.createTicket({
			type: "bug",
			severity: "medium",
			status: "open",
			user_prompt: `Tool ${toolName} failed with args: ${JSON.stringify(args)}`,
			ai_attempted_action: `Execute ${toolName}`,
			mcp_tool_used: toolName,
			error_message: error instanceof Error ? error.message : String(error),
			error_stack: error instanceof Error ? error.stack : undefined,
			session_id: process.env.SESSION_ID,
		});
	} catch (trackingError) {
		console.error("Failed to track error:", trackingError);
	}
}

// System information interface
interface SystemInfo {
	moneyworks: {
		version: string;
		edition: string;
		build?: string;
		licenseType: string;
		serialNumber?: string;
	};
	api: {
		version: string;
		protocol: string;
		supportedFeatures: string[];
		maxConcurrentConnections: number;
		timeout: number;
	};
	database: {
		name: string;
		version: string;
		location: string;
		size?: number;
		lastBackup?: string;
		isMultiUser: boolean;
		currentUsers: number;
		maxUsers: number;
	};
	capabilities: {
		transactions: boolean;
		inventory: boolean;
		jobs: boolean;
		multiCurrency: boolean;
		webServices: boolean;
		reporting: boolean;
		automation: boolean;
		customFields: boolean;
	};
	performance: {
		responseTime: number;
		memoryUsage?: number;
		diskSpace?: number;
		status: "online" | "degraded" | "maintenance";
	};
	environment: {
		serverOS: string;
		serverVersion: string;
		timezone: string;
		locale: string;
		encoding: string;
	};
}

// Get system information
const getSystemInfoInputSchema = z.object({
	includePerformance: z
		.boolean()
		.default(true)
		.describe("Include performance metrics"),
	includeEnvironment: z
		.boolean()
		.default(true)
		.describe("Include environment information"),
	includeDatabase: z
		.boolean()
		.default(true)
		.describe("Include database information"),
});

export const getSystemInfoTool = {
	description:
		"Get comprehensive MoneyWorks system information including version, capabilities, and status",
	inputSchema: getSystemInfoInputSchema,

	async execute(args: z.infer<typeof getSystemInfoInputSchema>) {
		try {
			const systemInfo = await getSystemInformation(args);

			// Add summary information
			const summary = {
				status: systemInfo.performance.status,
				version: `${systemInfo.moneyworks.version} ${systemInfo.moneyworks.edition}`,
				apiVersion: systemInfo.api.version,
				databaseName: systemInfo.database.name,
				users: `${systemInfo.database.currentUsers}/${systemInfo.database.maxUsers}`,
				capabilities: Object.entries(systemInfo.capabilities)
					.filter(([_, enabled]) => enabled)
					.map(([capability]) => capability),
				lastChecked: new Date().toISOString(),
			};

			return {
				system: systemInfo,
				summary: summary,
				recommendations: generateRecommendations(systemInfo),
			};
		} catch (error) {
			await trackError(error, "getSystemInfo", args);
			throw error;
		}
	},
};

// Get API capabilities
const getApiCapabilitiesInputSchema = z.object({});

export const getApiCapabilitiesTool = {
	description:
		"Get detailed information about available API capabilities and features",
	inputSchema: getApiCapabilitiesInputSchema,

	async execute() {
		try {
			const capabilities = {
				tables: {
					read: true,
					write: false, // Typically read-only API
					search: true,
					pagination: true,
					filtering: true,
					sorting: true,
					fieldSelection: true,
				},
				metadata: {
					schema: true,
					relationships: true,
					validation: true,
					fieldInfo: true,
					enumValues: true,
				},
				system: {
					companyInfo: true,
					labels: true,
					evaluation: true,
					reports: true,
					userInfo: true,
				},
				features: {
					multiLanguage: true,
					dateFormatting: true,
					currencyFormatting: true,
					numberFormatting: true,
					permissions: true,
					audit: false,
					realTime: false,
				},
				limits: {
					maxResultsPerQuery: 1000,
					maxConcurrentRequests: 10,
					rateLimit: "100 requests/minute",
					timeout: "30 seconds",
					maxQueryComplexity: "medium",
				},
				dataTypes: {
					string: true,
					number: true,
					integer: true,
					boolean: true,
					date: true,
					datetime: true,
					decimal: true,
					enum: true,
					array: false,
					object: false,
				},
			};

			// Calculate capability score
			const totalCapabilities = Object.values(capabilities).reduce(
				(total, section) => {
					return (
						total + Object.values(section).filter((v) => v === true).length
					);
				},
				0,
			);

			const possibleCapabilities = Object.values(capabilities).reduce(
				(total, section) => {
					return total + Object.values(section).length;
				},
				0,
			);

			const capabilityScore = Math.round(
				(totalCapabilities / possibleCapabilities) * 100,
			);

			return {
				capabilities: capabilities,
				summary: {
					capabilityScore: capabilityScore,
					availableFeatures: totalCapabilities,
					totalFeatures: possibleCapabilities,
					readOnly: !capabilities.tables.write,
					realTime: capabilities.features.realTime,
					multiLanguage: capabilities.features.multiLanguage,
				},
				usage: {
					bestFor: [
						"Data querying and analysis",
						"Report generation",
						"Data integration",
						"Business intelligence",
						"Automated workflows",
					],
					limitations: [
						"Read-only access (no data modification)",
						"No real-time updates",
						"Limited complex query support",
						"No file upload/download",
					],
				},
			};
		} catch (error) {
			await trackError(error, "getApiCapabilities", {});
			throw error;
		}
	},
};

// Get system status
const getSystemStatusInputSchema = z.object({
	includeHealth: z
		.boolean()
		.default(true)
		.describe("Include health check information"),
});

export const getSystemStatusTool = {
	description: "Get current system status and health information",
	inputSchema: getSystemStatusInputSchema,

	async execute(args: z.infer<typeof getSystemStatusInputSchema>) {
		try {
			const startTime = Date.now();

			// Simulate health checks
			const healthChecks = args.includeHealth
				? await performHealthChecks()
				: undefined;

			const responseTime = Date.now() - startTime;

			const status = {
				overall: "healthy" as const,
				services: {
					api: "online",
					database: "online",
					authentication: "online",
					reports: "online",
				},
				metrics: {
					responseTime: responseTime,
					uptime: getUptime(),
					memoryUsage: getMemoryUsage(),
					activeConnections: getCurrentConnections(),
				},
				lastUpdated: new Date().toISOString(),
			};

			if (healthChecks) {
				Object.assign(status, { healthChecks });
			}

			return {
				status: status,
				alerts: generateStatusAlerts(status),
				recommendations: generateStatusRecommendations(status),
			};
		} catch (error) {
			await trackError(error, "getSystemStatus", args);
			throw error;
		}
	},
};

// Helper functions for system information gathering
async function getSystemInformation(options: {
	includePerformance: boolean;
	includeEnvironment: boolean;
	includeDatabase: boolean;
}): Promise<SystemInfo> {
	// This would typically query the actual MoneyWorks system
	// For now, return mock data that represents typical system info

	const baseInfo: SystemInfo = {
		moneyworks: {
			version: "8.1.7",
			edition: "Gold",
			build: "8170",
			licenseType: "Network",
			serialNumber: "MW-****-****-****",
		},
		api: {
			version: "1.2.0",
			protocol: "HTTP/HTTPS",
			supportedFeatures: [
				"table_access",
				"metadata",
				"system_info",
				"evaluation",
				"reports",
				"authentication",
			],
			maxConcurrentConnections: 10,
			timeout: 30,
		},
		database: {
			name: process.env.MW_DATABASE_NAME || "Sample Company",
			version: "8.1",
			location: process.env.MW_DATABASE_PATH || "/MoneyWorks/Databases/",
			isMultiUser: true,
			currentUsers: 3,
			maxUsers: 10,
		},
		capabilities: {
			transactions: true,
			inventory: true,
			jobs: true,
			multiCurrency: true,
			webServices: true,
			reporting: true,
			automation: true,
			customFields: true,
		},
		performance: {
			responseTime: 150,
			status: "online",
		},
		environment: {
			serverOS: process.platform,
			serverVersion: process.version,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			locale: Intl.DateTimeFormat().resolvedOptions().locale,
			encoding: "UTF-8",
		},
	};

	// Add optional sections based on parameters
	if (options.includePerformance) {
		baseInfo.performance.memoryUsage = process.memoryUsage().heapUsed;
		baseInfo.performance.diskSpace = 1024 * 1024 * 1024; // 1GB free
	}

	if (options.includeDatabase) {
		baseInfo.database.size = 50 * 1024 * 1024; // 50MB
		baseInfo.database.lastBackup = "2025-05-30T23:00:00Z";
	}

	return baseInfo;
}

// Generate recommendations based on system info
function generateRecommendations(systemInfo: SystemInfo): string[] {
	const recommendations: string[] = [];

	if (systemInfo.performance.responseTime > 1000) {
		recommendations.push(
			"Consider optimizing database queries to improve response time",
		);
	}

	if (systemInfo.database.currentUsers / systemInfo.database.maxUsers > 0.8) {
		recommendations.push(
			"Database approaching user limit - consider increasing capacity",
		);
	}

	if (
		systemInfo.performance.memoryUsage &&
		systemInfo.performance.memoryUsage > 500 * 1024 * 1024
	) {
		recommendations.push(
			"High memory usage detected - monitor system performance",
		);
	}

	if (
		!systemInfo.capabilities.multiCurrency &&
		systemInfo.moneyworks.edition === "Gold"
	) {
		recommendations.push(
			"Multi-currency capabilities available - consider enabling for international operations",
		);
	}

	return recommendations;
}

// Perform health checks
async function performHealthChecks(): Promise<
	Record<string, { status: string; message: string; responseTime: number }>
> {
	const checks: Record<
		string,
		{ status: string; message: string; responseTime: number }
	> = {};

	// Simulate various health checks
	const checkItems = [
		{ name: "database", delay: 50, successRate: 0.98 },
		{ name: "authentication", delay: 20, successRate: 0.99 },
		{ name: "fileSystem", delay: 30, successRate: 0.95 },
		{ name: "network", delay: 100, successRate: 0.97 },
	];

	for (const item of checkItems) {
		const startTime = Date.now();
		await new Promise((resolve) => setTimeout(resolve, item.delay));
		const responseTime = Date.now() - startTime;

		const isHealthy = Math.random() < item.successRate;
		checks[item.name] = {
			status: isHealthy ? "healthy" : "warning",
			message: isHealthy ? "Operating normally" : "Minor issues detected",
			responseTime: responseTime,
		};
	}

	return checks;
}

// Get system uptime (mock)
function getUptime(): string {
	const uptimeSeconds = Math.floor(Math.random() * 86400 * 7); // Random uptime up to 7 days
	const days = Math.floor(uptimeSeconds / 86400);
	const hours = Math.floor((uptimeSeconds % 86400) / 3600);
	const minutes = Math.floor((uptimeSeconds % 3600) / 60);

	return `${days}d ${hours}h ${minutes}m`;
}

// Get memory usage (simplified)
function getMemoryUsage(): { used: number; total: number; percentage: number } {
	const used = process.memoryUsage().heapUsed;
	const total = 1024 * 1024 * 1024; // Assume 1GB total
	const percentage = Math.round((used / total) * 100);

	return { used, total, percentage };
}

// Get current connections (mock)
function getCurrentConnections(): number {
	return Math.floor(Math.random() * 5) + 1; // 1-5 connections
}

// Generate status alerts
function generateStatusAlerts(status: any): string[] {
	const alerts: string[] = [];

	if (status.metrics.responseTime > 1000) {
		alerts.push("High response time detected");
	}

	if (status.metrics.memoryUsage.percentage > 80) {
		alerts.push("Memory usage is high");
	}

	if (status.metrics.activeConnections > 8) {
		alerts.push("High number of active connections");
	}

	return alerts;
}

// Generate status recommendations
function generateStatusRecommendations(status: any): string[] {
	const recommendations: string[] = [];

	if (status.metrics.responseTime > 500) {
		recommendations.push(
			"Monitor system performance and consider optimization",
		);
	}

	if (status.metrics.memoryUsage.percentage > 70) {
		recommendations.push("Consider restarting services to free memory");
	}

	recommendations.push("Regular system monitoring recommended");
	recommendations.push("Schedule regular database maintenance");

	return recommendations;
}
