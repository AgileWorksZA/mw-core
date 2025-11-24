/**
 * Group management service for handling company groups and permissions
 */

import { getDatabaseAsync } from "~/db/client";
import type {
	CompanyGroup,
	CompanyGroupMember,
	GroupInvitation,
	GroupPermission,
	GroupSyncLog,
	GroupTemplate,
	Organization,
} from "~/db/schema";
import { createCryptoService } from "./crypto";

export type CreateOrganizationInput = {
	name: string;
	plan_type?: "basic" | "professional" | "enterprise";
	settings?: Record<string, any>;
};

export type CreateGroupInput = {
	organization_id: string;
	parent_group_id?: string;
	name: string;
	type?: "standard" | "holding" | "division" | "client";
	color_code?: string;
	description?: string;
	consolidation_settings?: Record<string, any>;
	sync_rules?: Record<string, any>;
};

export type AddGroupMemberInput = {
	group_id: string;
	connection_id: string;
	company_code?: string;
	is_parent_company?: boolean;
	sync_settings?: Record<string, any>;
	mapping_rules?: Record<string, any>;
};

export type InviteUserInput = {
	group_id: string;
	email: string;
	role: "owner" | "admin" | "manager" | "accountant" | "bookkeeper" | "viewer";
	permissions?: Record<string, any>;
	invited_by: string;
	expires_in_days?: number;
};

class GroupService {
	/**
	 * Create a new organization
	 */
	async createOrganization(
		input: CreateOrganizationInput,
	): Promise<Organization> {
		const db = await getDatabaseAsync();
		const id = crypto.randomUUID();
		const now = new Date().toISOString();

		const stmt = db.prepare(`
      INSERT INTO organizations (id, name, plan_type, settings, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

		stmt.run(
			id,
			input.name,
			input.plan_type || "basic",
			JSON.stringify(input.settings || {}),
			now,
			now,
		);

		return {
			id,
			name: input.name,
			plan_type: input.plan_type || "basic",
			settings: input.settings || {},
			created_at: now,
			updated_at: now,
		};
	}

	/**
	 * Get organization by ID
	 */
	async getOrganization(id: string): Promise<Organization | null> {
		const db = await getDatabaseAsync();
		const stmt = db.prepare("SELECT * FROM organizations WHERE id = ?");
		const org = stmt.get(id) as any;

		if (!org) return null;

		return {
			...org,
			settings: JSON.parse(org.settings || "{}"),
		};
	}

	/**
	 * Create a new company group
	 */
	async createGroup(input: CreateGroupInput): Promise<CompanyGroup> {
		const db = await getDatabaseAsync();
		const id = crypto.randomUUID();
		const now = new Date().toISOString();

		const stmt = db.prepare(`
      INSERT INTO company_groups (
        id, organization_id, parent_group_id, name, type, 
        color_code, description, consolidation_settings, sync_rules,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		stmt.run(
			id,
			input.organization_id,
			input.parent_group_id || null,
			input.name,
			input.type || "standard",
			input.color_code || "#3B82F6",
			input.description || null,
			JSON.stringify(input.consolidation_settings || {}),
			JSON.stringify(input.sync_rules || {}),
			1,
			now,
			now,
		);

		return {
			id,
			organization_id: input.organization_id,
			parent_group_id: input.parent_group_id,
			name: input.name,
			type: input.type || "standard",
			color_code: input.color_code || "#3B82F6",
			description: input.description,
			consolidation_settings: input.consolidation_settings || {},
			sync_rules: input.sync_rules || {},
			is_active: true,
			created_at: now,
			updated_at: now,
		};
	}

	/**
	 * Get all groups for an organization
	 */
	async getGroupsByOrganization(
		organizationId: string,
	): Promise<CompanyGroup[]> {
		const db = await getDatabaseAsync();
		const stmt = db.prepare(`
      SELECT * FROM company_groups 
      WHERE organization_id = ? AND is_active = 1
      ORDER BY name
    `);

		const groups = stmt.all(organizationId) as any[];

		return groups.map((group) => ({
			...group,
			consolidation_settings: JSON.parse(group.consolidation_settings || "{}"),
			sync_rules: JSON.parse(group.sync_rules || "{}"),
			is_active: !!group.is_active,
		}));
	}

	/**
	 * Get group hierarchy (with nested children)
	 */
	async getGroupHierarchy(organizationId: string): Promise<CompanyGroup[]> {
		const groups = await this.getGroupsByOrganization(organizationId);

		// Build hierarchy
		const groupMap = new Map<
			string,
			CompanyGroup & { children?: CompanyGroup[] }
		>();
		const rootGroups: (CompanyGroup & { children?: CompanyGroup[] })[] = [];

		// First pass: create map
		groups.forEach((group) => {
			groupMap.set(group.id, { ...group, children: [] });
		});

		// Second pass: build hierarchy
		groups.forEach((group) => {
			const groupWithChildren = groupMap.get(group.id)!;
			if (group.parent_group_id) {
				const parent = groupMap.get(group.parent_group_id);
				if (parent) {
					parent.children?.push(groupWithChildren);
				} else {
					rootGroups.push(groupWithChildren);
				}
			} else {
				rootGroups.push(groupWithChildren);
			}
		});

		return rootGroups;
	}

	/**
	 * Add a company to a group
	 */
	async addGroupMember(
		input: AddGroupMemberInput,
	): Promise<CompanyGroupMember> {
		const db = await getDatabaseAsync();
		const id = crypto.randomUUID();
		const now = new Date().toISOString();

		const stmt = db.prepare(`
      INSERT INTO company_group_members (
        id, group_id, connection_id, company_code, is_parent_company,
        sync_settings, mapping_rules, joined_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

		stmt.run(
			id,
			input.group_id,
			input.connection_id,
			input.company_code || null,
			input.is_parent_company ? 1 : 0,
			JSON.stringify(input.sync_settings || {}),
			JSON.stringify(input.mapping_rules || {}),
			now,
		);

		return {
			id,
			group_id: input.group_id,
			connection_id: input.connection_id,
			company_code: input.company_code,
			is_parent_company: !!input.is_parent_company,
			sync_settings: input.sync_settings || {},
			mapping_rules: input.mapping_rules || {},
			joined_at: now,
		};
	}

	/**
	 * Get all members of a group
	 */
	async getGroupMembers(groupId: string): Promise<CompanyGroupMember[]> {
		const db = await getDatabaseAsync();
		const stmt = db.prepare(`
      SELECT * FROM company_group_members 
      WHERE group_id = ?
      ORDER BY joined_at
    `);

		const members = stmt.all(groupId) as any[];

		return members.map((member) => ({
			...member,
			is_parent_company: !!member.is_parent_company,
			sync_settings: JSON.parse(member.sync_settings || "{}"),
			mapping_rules: JSON.parse(member.mapping_rules || "{}"),
		}));
	}

	/**
	 * Get groups for a specific connection
	 */
	async getGroupsByConnection(connectionId: string): Promise<CompanyGroup[]> {
		const db = await getDatabaseAsync();
		const stmt = db.prepare(`
      SELECT g.* FROM company_groups g
      JOIN company_group_members m ON g.id = m.group_id
      WHERE m.connection_id = ? AND g.is_active = 1
      ORDER BY g.name
    `);

		const groups = stmt.all(connectionId) as any[];

		return groups.map((group) => ({
			...group,
			consolidation_settings: JSON.parse(group.consolidation_settings || "{}"),
			sync_rules: JSON.parse(group.sync_rules || "{}"),
			is_active: !!group.is_active,
		}));
	}

	/**
	 * Create user invitation for group access
	 */
	async inviteUser(input: InviteUserInput): Promise<GroupInvitation> {
		const db = await getDatabaseAsync();
		const id = crypto.randomUUID();
		const token = crypto.randomUUID();
		const now = new Date().toISOString();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + (input.expires_in_days || 7));

		const stmt = db.prepare(`
      INSERT INTO group_invitations (
        id, group_id, email, role, permissions, invited_by,
        token, expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		stmt.run(
			id,
			input.group_id,
			input.email,
			input.role,
			JSON.stringify(input.permissions || {}),
			input.invited_by,
			token,
			expiresAt.toISOString(),
			now,
		);

		return {
			id,
			group_id: input.group_id,
			email: input.email,
			role: input.role,
			permissions: input.permissions || {},
			invited_by: input.invited_by,
			token,
			expires_at: expiresAt.toISOString(),
			created_at: now,
		};
	}

	/**
	 * Accept an invitation
	 */
	async acceptInvitation(
		token: string,
		userId: string,
	): Promise<GroupPermission | null> {
		const db = await getDatabaseAsync();

		// Get invitation
		const inviteStmt = db.prepare(`
      SELECT * FROM group_invitations 
      WHERE token = ? AND expires_at > datetime('now') AND accepted_at IS NULL
    `);
		const invitation = inviteStmt.get(token) as any;

		if (!invitation) return null;

		// Mark invitation as accepted
		const updateStmt = db.prepare(`
      UPDATE group_invitations 
      SET accepted_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
		updateStmt.run(invitation.id);

		// Create permission entry
		const permId = crypto.randomUUID();
		const now = new Date().toISOString();

		const permStmt = db.prepare(`
      INSERT INTO group_permissions (
        id, group_id, user_id, role, permissions, invited_by,
        invitation_accepted_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		permStmt.run(
			permId,
			invitation.group_id,
			userId,
			invitation.role,
			invitation.permissions,
			invitation.invited_by,
			now,
			now,
			now,
		);

		return {
			id: permId,
			group_id: invitation.group_id,
			user_id: userId,
			role: invitation.role,
			permissions: JSON.parse(invitation.permissions || "{}"),
			invited_by: invitation.invited_by,
			invitation_accepted_at: now,
			created_at: now,
			updated_at: now,
		};
	}

	/**
	 * Get user permissions for a group
	 */
	async getUserPermission(
		groupId: string,
		userId: string,
	): Promise<GroupPermission | null> {
		const db = await getDatabaseAsync();
		const stmt = db.prepare(`
      SELECT * FROM group_permissions 
      WHERE group_id = ? AND user_id = ? 
      AND (expires_at IS NULL OR expires_at > datetime('now'))
    `);

		const permission = stmt.get(groupId, userId) as any;

		if (!permission) return null;

		return {
			...permission,
			permissions: JSON.parse(permission.permissions || "{}"),
		};
	}

	/**
	 * Check if user has access to organization
	 */
	async getUserOrganizations(userId: string): Promise<Organization[]> {
		const db = await getDatabaseAsync();
		const stmt = db.prepare(`
      SELECT DISTINCT o.* FROM organizations o
      JOIN company_groups g ON o.id = g.organization_id
      JOIN group_permissions p ON g.id = p.group_id
      WHERE p.user_id = ? 
      AND (p.expires_at IS NULL OR p.expires_at > datetime('now'))
      AND g.is_active = 1
    `);

		const orgs = stmt.all(userId) as any[];

		return orgs.map((org) => ({
			...org,
			settings: JSON.parse(org.settings || "{}"),
		}));
	}

	/**
	 * Log a sync operation
	 */
	async logSyncOperation(
		groupId: string,
		operationType: string,
		initiatedBy: string,
		affectedCompanies: string[],
	): Promise<string> {
		const db = await getDatabaseAsync();
		const id = crypto.randomUUID();

		const stmt = db.prepare(`
      INSERT INTO group_sync_log (
        id, group_id, operation_type, initiated_by, 
        affected_companies, status, started_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

		stmt.run(
			id,
			groupId,
			operationType,
			initiatedBy,
			JSON.stringify(affectedCompanies),
			"pending",
		);

		return id;
	}

	/**
	 * Update sync operation status
	 */
	async updateSyncStatus(
		logId: string,
		status: "in_progress" | "completed" | "failed",
		details?: Record<string, any>,
	): Promise<void> {
		const db = await getDatabaseAsync();
		const stmt = db.prepare(`
      UPDATE group_sync_log 
      SET status = ?, details = ?, completed_at = ?
      WHERE id = ?
    `);

		stmt.run(
			status,
			details ? JSON.stringify(details) : null,
			status === "completed" || status === "failed"
				? new Date().toISOString()
				: null,
			logId,
		);
	}
}

export const groupService = new GroupService();
