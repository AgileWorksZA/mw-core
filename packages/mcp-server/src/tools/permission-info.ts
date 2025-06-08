import { z } from "zod";
import type { TicketService } from "../services/ticket-service";

let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializePermissionInfoTools(ticketSvc: TicketService) {
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

// Permission interfaces
interface Permission {
	id: string;
	name: string;
	description: string;
	category: "read" | "write" | "delete" | "admin" | "system";
	level: "table" | "field" | "operation" | "global";
	scope: string;
	required: boolean;
	inherited?: boolean;
	conflictsWith?: string[];
}

interface OperationPermissions {
	operation: string;
	description: string;
	permissions: Permission[];
	minimumRole: string;
	alternativePermissions?: Permission[][];
	securityLevel: "low" | "medium" | "high" | "critical";
	auditRequired: boolean;
}

interface UserRole {
	id: string;
	name: string;
	description: string;
	permissions: string[];
	inheritsFrom?: string[];
	restrictions: string[];
	isBuiltIn: boolean;
}

interface SecurityContext {
	user: string;
	roles: string[];
	effectivePermissions: string[];
	restrictions: string[];
	sessionInfo: {
		loginTime: string;
		ipAddress?: string;
		userAgent?: string;
	};
}

// Get permission information for a specific operation
const getPermissionInfoInputSchema = z.object({
	operation: z
		.string()
		.describe(
			"Operation name (e.g., 'searchAccounts', 'getTransaction', 'createName')",
		),
	tableName: z
		.string()
		.optional()
		.describe("Table name if operation is table-specific"),
	includeAlternatives: z
		.boolean()
		.default(true)
		.describe("Include alternative permission combinations"),
});

export const getPermissionInfoTool = {
	description:
		"Get required permissions for a specific MoneyWorks operation or API endpoint",
	inputSchema: getPermissionInfoInputSchema,

	async execute(args: z.infer<typeof getPermissionInfoInputSchema>) {
		try {
			const operationPerms = getOperationPermissions(
				args.operation,
				args.tableName,
			);
			const alternatives = args.includeAlternatives
				? getAlternativePermissions(args.operation, args.tableName)
				: undefined;

			return {
				operation: args.operation,
				table: args.tableName,
				permissions: operationPerms,
				alternatives: alternatives,
				examples: generatePermissionExamples(operationPerms),
				troubleshooting: generateTroubleshootingGuide(operationPerms),
				recommendations: generatePermissionRecommendations(operationPerms),
			};
		} catch (error) {
			await trackError(error, "getPermissionInfo", args);
			throw error;
		}
	},
};

// Get permissions for a table
const getTablePermissionsInputSchema = z.object({
	tableName: z.string().describe("The name of the table"),
	operationType: z
		.enum(["read", "write", "delete", "all"])
		.default("all")
		.describe("Type of operations to check"),
	includeFieldLevel: z
		.boolean()
		.default(false)
		.describe("Include field-level permissions"),
});

export const getTablePermissionsTool = {
	description:
		"Get all required permissions for accessing a specific MoneyWorks table",
	inputSchema: getTablePermissionsInputSchema,

	async execute(args: z.infer<typeof getTablePermissionsInputSchema>) {
		try {
			const tablePerms = getTablePermissions(
				args.tableName,
				args.operationType,
			);
			const fieldPerms = args.includeFieldLevel
				? getFieldLevelPermissions(args.tableName)
				: undefined;

			// Analyze permission hierarchy
			const hierarchy = analyzePermissionHierarchy(tablePerms);

			return {
				tableName: args.tableName,
				operationType: args.operationType,
				permissions: tablePerms,
				fieldPermissions: fieldPerms,
				hierarchy: hierarchy,
				summary: {
					totalPermissions: tablePerms.permissions.length,
					minimumRole: tablePerms.minimumRole,
					securityLevel: tablePerms.securityLevel,
					auditRequired: tablePerms.auditRequired,
				},
				matrix: generatePermissionMatrix(args.tableName, args.operationType),
			};
		} catch (error) {
			await trackError(error, "getTablePermissions", args);
			throw error;
		}
	},
};

// Get user roles and permissions
const getUserRolesInputSchema = z.object({
	includeBuiltIn: z
		.boolean()
		.default(true)
		.describe("Include built-in system roles"),
	includeCustom: z
		.boolean()
		.default(true)
		.describe("Include custom user-defined roles"),
	roleId: z.string().optional().describe("Get details for a specific role"),
});

export const getUserRolesTool = {
	description:
		"Get information about MoneyWorks user roles and their permissions",
	inputSchema: getUserRolesInputSchema,

	async execute(args: z.infer<typeof getUserRolesInputSchema>) {
		try {
			if (args.roleId) {
				// Get specific role details
				const role = getUserRole(args.roleId);
				const effectivePermissions = calculateEffectivePermissions(role);
				const capabilities = analyzeRoleCapabilities(role);

				return {
					role: role,
					effectivePermissions: effectivePermissions,
					capabilities: capabilities,
					inheritance: getRoleInheritanceChain(role),
					conflicts: checkPermissionConflicts(role),
					recommendations: generateRoleRecommendations(role),
				};
			}
			// Get all roles
			const roles = getAllUserRoles(args.includeBuiltIn, args.includeCustom);
			const roleComparison = compareRoles(roles);

			return {
				roles: roles,
				summary: {
					totalRoles: roles.length,
					builtInRoles: roles.filter((r) => r.isBuiltIn).length,
					customRoles: roles.filter((r) => !r.isBuiltIn).length,
					averagePermissions: Math.round(
						roles.reduce((sum, r) => sum + r.permissions.length, 0) /
							roles.length,
					),
				},
				comparison: roleComparison,
				recommendations: generateRoleManagementRecommendations(roles),
			};
		} catch (error) {
			await trackError(error, "getUserRoles", args);
			throw error;
		}
	},
};

// Check user permissions
const checkUserPermissionsInputSchema = z.object({
	userId: z.string().describe("User identifier"),
	operation: z.string().describe("Operation to check permissions for"),
	tableName: z.string().optional().describe("Table name if applicable"),
	includeContext: z
		.boolean()
		.default(true)
		.describe("Include security context information"),
});

export const checkUserPermissionsTool = {
	description:
		"Check if a specific user has permissions to perform an operation",
	inputSchema: checkUserPermissionsInputSchema,

	async execute(args: z.infer<typeof checkUserPermissionsInputSchema>) {
		try {
			const securityContext = args.includeContext
				? getUserSecurityContext(args.userId)
				: undefined;

			const permissionCheck = checkUserOperationPermission(
				args.userId,
				args.operation,
				args.tableName,
			);

			const missingPermissions = permissionCheck.hasPermission
				? []
				: identifyMissingPermissions(
						args.userId,
						args.operation,
						args.tableName,
					);

			return {
				userId: args.userId,
				operation: args.operation,
				table: args.tableName,
				result: permissionCheck,
				securityContext: securityContext,
				missingPermissions: missingPermissions,
				suggestions: generatePermissionSuggestions(
					permissionCheck,
					missingPermissions,
				),
				escalationPath: getPermissionEscalationPath(args.operation),
			};
		} catch (error) {
			await trackError(error, "checkUserPermissions", args);
			throw error;
		}
	},
};

// Get security audit information
const getSecurityAuditInfoInputSchema = z.object({
	auditType: z
		.enum(["permissions", "access", "operations", "all"])
		.default("all")
		.describe("Type of audit information"),
	timeframe: z
		.enum(["day", "week", "month", "all"])
		.default("week")
		.describe("Time period for audit data"),
	userId: z.string().optional().describe("Specific user to audit"),
});

export const getSecurityAuditInfoTool = {
	description:
		"Get security audit information for permissions and access patterns",
	inputSchema: getSecurityAuditInfoInputSchema,

	async execute(args: z.infer<typeof getSecurityAuditInfoInputSchema>) {
		try {
			const auditData = getSecurityAuditData(
				args.auditType,
				args.timeframe,
				args.userId,
			);
			const analysis = analyzeSecurityAuditData(auditData);
			const alerts = generateSecurityAlerts(auditData);

			return {
				auditType: args.auditType,
				timeframe: args.timeframe,
				auditData: auditData,
				analysis: analysis,
				alerts: alerts,
				recommendations: generateSecurityRecommendations(analysis),
				complianceStatus: checkComplianceStatus(auditData),
			};
		} catch (error) {
			await trackError(error, "getSecurityAuditInfo", args);
			throw error;
		}
	},
};

// Helper functions for permission operations

// Get operation permissions
function getOperationPermissions(
	operation: string,
	tableName?: string,
): OperationPermissions {
	const operationMap: Record<string, Partial<OperationPermissions>> = {
		searchAccounts: {
			description: "Search and list account records",
			permissions: [
				{
					id: "read_accounts",
					name: "Read Accounts",
					description: "Permission to view account information",
					category: "read",
					level: "table",
					scope: "Account",
					required: true,
				},
			],
			minimumRole: "User",
			securityLevel: "low",
			auditRequired: false,
		},
		getAccount: {
			description: "Get specific account by ID",
			permissions: [
				{
					id: "read_accounts",
					name: "Read Accounts",
					description: "Permission to view account information",
					category: "read",
					level: "table",
					scope: "Account",
					required: true,
				},
			],
			minimumRole: "User",
			securityLevel: "low",
			auditRequired: false,
		},
		createTransaction: {
			description: "Create new transaction records",
			permissions: [
				{
					id: "write_transactions",
					name: "Write Transactions",
					description: "Permission to create transaction records",
					category: "write",
					level: "table",
					scope: "Transaction",
					required: true,
				},
				{
					id: "read_accounts",
					name: "Read Accounts",
					description: "Permission to validate account codes",
					category: "read",
					level: "table",
					scope: "Account",
					required: true,
				},
			],
			minimumRole: "Data Entry",
			securityLevel: "medium",
			auditRequired: true,
		},
		deleteTransaction: {
			description: "Delete transaction records",
			permissions: [
				{
					id: "delete_transactions",
					name: "Delete Transactions",
					description: "Permission to delete transaction records",
					category: "delete",
					level: "table",
					scope: "Transaction",
					required: true,
				},
				{
					id: "admin_transactions",
					name: "Transaction Administration",
					description: "Administrative access to transactions",
					category: "admin",
					level: "table",
					scope: "Transaction",
					required: true,
				},
			],
			minimumRole: "Administrator",
			securityLevel: "high",
			auditRequired: true,
		},
		runReport: {
			description: "Execute system reports",
			permissions: [
				{
					id: "read_reports",
					name: "Read Reports",
					description: "Permission to view and run reports",
					category: "read",
					level: "operation",
					scope: "Reports",
					required: true,
				},
			],
			minimumRole: "User",
			securityLevel: "medium",
			auditRequired: true,
		},
		evaluateExpression: {
			description: "Evaluate MWScript expressions",
			permissions: [
				{
					id: "execute_scripts",
					name: "Execute Scripts",
					description: "Permission to run MWScript expressions",
					category: "admin",
					level: "operation",
					scope: "System",
					required: true,
				},
			],
			minimumRole: "Power User",
			securityLevel: "high",
			auditRequired: true,
		},
	};

	const baseOperation = operationMap[operation];
	if (!baseOperation) {
		// Default permissions for unknown operations
		return {
			operation: operation,
			description: `Unknown operation: ${operation}`,
			permissions: [
				{
					id: "general_access",
					name: "General Access",
					description: "Basic system access permission",
					category: "read",
					level: "global",
					scope: "System",
					required: true,
				},
			],
			minimumRole: "User",
			securityLevel: "medium",
			auditRequired: false,
		};
	}

	return {
		operation,
		description: baseOperation.description || `Operation: ${operation}`,
		permissions: baseOperation.permissions || [],
		minimumRole: baseOperation.minimumRole || "User",
		alternativePermissions: baseOperation.alternativePermissions,
		securityLevel: baseOperation.securityLevel || "medium",
		auditRequired: baseOperation.auditRequired || false,
	};
}

// Get table permissions
function getTablePermissions(
	tableName: string,
	operationType: string,
): OperationPermissions {
	const basePermissions: Permission[] = [];

	// Add basic read permission
	if (operationType === "read" || operationType === "all") {
		basePermissions.push({
			id: `read_${tableName.toLowerCase()}`,
			name: `Read ${tableName}`,
			description: `Permission to read ${tableName} records`,
			category: "read",
			level: "table",
			scope: tableName,
			required: true,
		});
	}

	// Add write permission
	if (operationType === "write" || operationType === "all") {
		basePermissions.push({
			id: `write_${tableName.toLowerCase()}`,
			name: `Write ${tableName}`,
			description: `Permission to create/update ${tableName} records`,
			category: "write",
			level: "table",
			scope: tableName,
			required: true,
		});
	}

	// Add delete permission
	if (operationType === "delete" || operationType === "all") {
		basePermissions.push({
			id: `delete_${tableName.toLowerCase()}`,
			name: `Delete ${tableName}`,
			description: `Permission to delete ${tableName} records`,
			category: "delete",
			level: "table",
			scope: tableName,
			required: true,
		});
	}

	// Determine security level based on table and operation
	let securityLevel: "low" | "medium" | "high" | "critical" = "medium";

	if (["Transaction", "Account", "Name"].includes(tableName)) {
		securityLevel = operationType === "delete" ? "high" : "medium";
	}

	if (["User", "Login", "General"].includes(tableName)) {
		securityLevel = "high";
	}

	return {
		operation: `${operationType}_${tableName}`,
		description: `${operationType} operations on ${tableName} table`,
		permissions: basePermissions,
		minimumRole: securityLevel === "high" ? "Administrator" : "User",
		securityLevel: securityLevel,
		auditRequired: (securityLevel as "low" | "medium" | "high" | "critical") !== "low",
	};
}

// Get user role information
function getUserRole(roleId: string): UserRole {
	const roles: Record<string, UserRole> = {
		administrator: {
			id: "administrator",
			name: "Administrator",
			description: "Full system access with all permissions",
			permissions: ["*"],
			restrictions: [],
			isBuiltIn: true,
		},
		power_user: {
			id: "power_user",
			name: "Power User",
			description: "Advanced user with script execution and report access",
			permissions: [
				"read_*",
				"write_transactions",
				"write_names",
				"write_products",
				"execute_scripts",
				"read_reports",
				"run_reports",
			],
			restrictions: ["no_delete_core_data", "no_system_config"],
			isBuiltIn: true,
		},
		data_entry: {
			id: "data_entry",
			name: "Data Entry",
			description: "Standard user for data entry operations",
			permissions: [
				"read_accounts",
				"read_names",
				"read_products",
				"read_transactions",
				"write_transactions",
				"write_names",
				"write_products",
			],
			restrictions: ["no_delete", "no_admin", "no_scripts"],
			isBuiltIn: true,
		},
		user: {
			id: "user",
			name: "User",
			description: "Basic read-only user access",
			permissions: [
				"read_accounts",
				"read_names",
				"read_products",
				"read_transactions",
				"read_reports",
			],
			restrictions: ["read_only", "no_admin", "no_scripts", "no_delete"],
			isBuiltIn: true,
		},
		viewer: {
			id: "viewer",
			name: "Viewer",
			description: "Limited read access to basic data",
			permissions: ["read_accounts", "read_names", "read_reports"],
			restrictions: [
				"read_only",
				"no_admin",
				"no_scripts",
				"no_delete",
				"limited_tables",
			],
			isBuiltIn: true,
		},
	};

	const role = roles[roleId];
	if (!role) {
		throw new Error(`Role '${roleId}' not found`);
	}

	return role;
}

// Get all user roles
function getAllUserRoles(
	includeBuiltIn: boolean,
	includeCustom: boolean,
): UserRole[] {
	const builtInRoles = [
		"administrator",
		"power_user",
		"data_entry",
		"user",
		"viewer",
	].map((id) => getUserRole(id));

	const customRoles: UserRole[] = [
		// Mock custom roles
		{
			id: "accountant",
			name: "Accountant",
			description: "Custom role for accounting staff",
			permissions: [
				"read_*",
				"write_transactions",
				"write_accounts",
				"read_reports",
				"run_reports",
			],
			inheritsFrom: ["data_entry"],
			restrictions: ["no_delete_core_data"],
			isBuiltIn: false,
		},
	];

	const roles: UserRole[] = [];

	if (includeBuiltIn) {
		roles.push(...builtInRoles);
	}

	if (includeCustom) {
		roles.push(...customRoles);
	}

	return roles;
}

// Check user permission for operation
function checkUserOperationPermission(
	userId: string,
	operation: string,
	tableName?: string,
): {
	hasPermission: boolean;
	reason: string;
	requiredPermissions: string[];
	userPermissions: string[];
	userRoles: string[];
} {
	// Mock user data - would come from actual user service
	const userData = {
		userId: userId,
		roles: ["data_entry"],
		permissions: [
			"read_accounts",
			"read_names",
			"read_products",
			"read_transactions",
			"write_transactions",
			"write_names",
			"write_products",
		],
	};

	const operationPerms = getOperationPermissions(operation, tableName);
	const requiredPermissions = operationPerms.permissions
		.filter((p) => p.required)
		.map((p) => p.id);

	// Check if user has all required permissions
	const hasAllPermissions = requiredPermissions.every(
		(reqPerm) =>
			userData.permissions.includes(reqPerm) ||
			userData.permissions.includes("*") ||
			userData.permissions.some(
				(userPerm) =>
					userPerm.endsWith("*") && reqPerm.startsWith(userPerm.slice(0, -1)),
			),
	);

	return {
		hasPermission: hasAllPermissions,
		reason: hasAllPermissions
			? "User has all required permissions"
			: "User missing required permissions",
		requiredPermissions: requiredPermissions,
		userPermissions: userData.permissions,
		userRoles: userData.roles,
	};
}

// Generate permission examples
function generatePermissionExamples(operationPerms: OperationPermissions): {
	userWithAccess: { role: string; reason: string };
	userWithoutAccess: { role: string; reason: string };
	minimumRequirement: string;
} {
	return {
		userWithAccess: {
			role: operationPerms.minimumRole,
			reason: `Has ${operationPerms.minimumRole} role which includes required permissions`,
		},
		userWithoutAccess: {
			role: "Viewer",
			reason: "Viewer role lacks write permissions required for this operation",
		},
		minimumRequirement: `Minimum role: ${operationPerms.minimumRole}, Required permissions: ${operationPerms.permissions.map((p) => p.name).join(", ")}`,
	};
}

// Generate troubleshooting guide
function generateTroubleshootingGuide(operationPerms: OperationPermissions): {
	commonIssues: Array<{ problem: string; solution: string }>;
	checkList: string[];
} {
	return {
		commonIssues: [
			{
				problem: "Access denied error",
				solution: `Ensure user has ${operationPerms.minimumRole} role or higher`,
			},
			{
				problem: "Insufficient permissions",
				solution: `Grant required permissions: ${operationPerms.permissions.map((p) => p.name).join(", ")}`,
			},
			{
				problem: "Operation not available",
				solution: "Check if user's role restrictions prevent this operation",
			},
		],
		checkList: [
			"Verify user has an active account",
			"Check user's assigned roles",
			"Confirm required permissions are granted",
			"Review any role restrictions",
			"Check if operation requires audit permissions",
		],
	};
}

// Generate permission recommendations
function generatePermissionRecommendations(
	operationPerms: OperationPermissions,
): string[] {
	const recommendations: string[] = [];

	if (
		operationPerms.securityLevel === "high" ||
		operationPerms.securityLevel === "critical"
	) {
		recommendations.push(
			"This is a high-security operation - ensure minimal necessary access",
		);
	}

	if (operationPerms.auditRequired) {
		recommendations.push(
			"This operation requires audit logging - ensure compliance",
		);
	}

	if (operationPerms.permissions.length > 3) {
		recommendations.push(
			"This operation requires multiple permissions - consider using role-based access",
		);
	}

	recommendations.push("Regularly review and audit user permissions");
	recommendations.push("Follow principle of least privilege");

	return recommendations;
}

// Additional helper functions...

function getAlternativePermissions(
	operation: string,
	tableName?: string,
): Permission[][] {
	// Return alternative permission combinations
	return [];
}

function getFieldLevelPermissions(
	tableName: string,
): Record<string, Permission[]> {
	return {};
}

function analyzePermissionHierarchy(operationPerms: OperationPermissions): any {
	return {
		levels: ["Global", "Table", "Field", "Operation"],
		inheritance: "Top-down inheritance applies",
	};
}

function generatePermissionMatrix(
	tableName: string,
	operationType: string,
): any {
	return {
		matrix: "Permission matrix would be generated here",
	};
}

function calculateEffectivePermissions(role: UserRole): string[] {
	if (role.permissions.includes("*")) {
		return ["All permissions"];
	}
	return role.permissions;
}

function analyzeRoleCapabilities(role: UserRole): any {
	return {
		canRead: role.permissions.some((p) => p.startsWith("read_")),
		canWrite: role.permissions.some((p) => p.startsWith("write_")),
		canDelete: role.permissions.some((p) => p.startsWith("delete_")),
		canAdmin:
			role.permissions.includes("*") ||
			role.permissions.some((p) => p.includes("admin")),
	};
}

function getRoleInheritanceChain(role: UserRole): string[] {
	return role.inheritsFrom || [];
}

function checkPermissionConflicts(role: UserRole): string[] {
	return [];
}

function generateRoleRecommendations(role: UserRole): string[] {
	const recommendations: string[] = [];

	if (role.permissions.includes("*")) {
		recommendations.push("Consider limiting administrator privileges");
	}

	if (role.restrictions.length === 0 && !role.permissions.includes("*")) {
		recommendations.push("Consider adding appropriate restrictions");
	}

	return recommendations;
}

function compareRoles(roles: UserRole[]): any {
	return {
		comparison: "Role comparison matrix would be generated here",
	};
}

function generateRoleManagementRecommendations(roles: UserRole[]): string[] {
	return [
		"Regularly review role assignments",
		"Audit permissions for compliance",
		"Document role purposes and restrictions",
	];
}

function getUserSecurityContext(userId: string): SecurityContext {
	return {
		user: userId,
		roles: ["data_entry"],
		effectivePermissions: ["read_accounts", "write_transactions"],
		restrictions: ["no_delete"],
		sessionInfo: {
			loginTime: new Date().toISOString(),
			ipAddress: "192.168.1.100",
			userAgent: "MoneyWorks API Client",
		},
	};
}

function identifyMissingPermissions(
	userId: string,
	operation: string,
	tableName?: string,
): Permission[] {
	const operationPerms = getOperationPermissions(operation, tableName);
	const userCheck = checkUserOperationPermission(userId, operation, tableName);

	if (userCheck.hasPermission) {
		return [];
	}

	return operationPerms.permissions.filter(
		(p) => p.required && !userCheck.userPermissions.includes(p.id),
	);
}

function generatePermissionSuggestions(
	permissionCheck: any,
	missingPermissions: Permission[],
): string[] {
	const suggestions: string[] = [];

	if (missingPermissions.length > 0) {
		suggestions.push(
			`Grant missing permissions: ${missingPermissions.map((p) => p.name).join(", ")}`,
		);
		suggestions.push(
			"Consider assigning appropriate role that includes required permissions",
		);
	}

	return suggestions;
}

function getPermissionEscalationPath(operation: string): string[] {
	return [
		"Contact system administrator",
		"Submit permission request with business justification",
		"Wait for approval and role assignment",
		"Retry operation after permission grant",
	];
}

function getSecurityAuditData(
	auditType: string,
	timeframe: string,
	userId?: string,
): any {
	return {
		auditType,
		timeframe,
		events: [],
		summary: "Mock audit data",
	};
}

function analyzeSecurityAuditData(auditData: any): any {
	return {
		analysis: "Security analysis would be performed here",
	};
}

function generateSecurityAlerts(auditData: any): any[] {
	return [];
}

function generateSecurityRecommendations(analysis: any): string[] {
	return [
		"Implement regular permission audits",
		"Monitor for privilege escalation attempts",
		"Review access patterns for anomalies",
	];
}

function checkComplianceStatus(auditData: any): any {
	return {
		compliant: true,
		issues: [],
		recommendations: [],
	};
}
