import { Building2, FolderTree, Plus, Settings, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLoaderData } from "react-router";
import { type LoaderFunctionArgs, data as json } from "react-router";
import { AddCompanyDialog } from "~/components/add-company-dialog";
import { AuthGuard } from "~/components/auth-guard";
import { CreateGroupDialog } from "~/components/create-group-dialog";
import { GroupTree } from "~/components/group-tree";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type {
	CompanyGroup,
	CompanyGroupMember,
	MWConnection,
} from "~/db/schema";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { connectionService } from "~/services/connections";
import { groupService } from "~/services/groups";

interface GroupWithChildren extends CompanyGroup {
	children?: GroupWithChildren[];
}

interface LoaderData {
	organizations: Array<{
		id: string;
		name: string;
	}>;
	groups: GroupWithChildren[];
	selectedGroup?: CompanyGroup;
	groupMembers?: Array<CompanyGroupMember & { connection: MWConnection }>;
	currentOrganizationId?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
	try {
		const { userId } = await requireAuthAndConnection(request);

		// Get user's organizations
		const organizations = await groupService.getUserOrganizations(userId);

		// For now, we'll create a default organization if none exists
		let currentOrgId = organizations[0]?.id;

		if (!currentOrgId) {
			// Create a default organization for the user
			const org = await groupService.createOrganization({
				name: "My Accounting Firm",
				plan_type: "basic",
			});

			// Create a default group
			const defaultGroup = await groupService.createGroup({
				organization_id: org.id,
				name: "All Companies",
				type: "standard",
			});

			// Grant the user owner permissions on the default group
			const db = await import("~/db/client").then((m) => m.getDatabaseAsync());
			const permId = crypto.randomUUID();
			const now = new Date().toISOString();

			const stmt = db.prepare(`
        INSERT INTO group_permissions (
          id, group_id, user_id, role, permissions,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

			stmt.run(
				permId,
				defaultGroup.id,
				userId,
				"owner",
				JSON.stringify({}),
				now,
				now,
			);

			currentOrgId = org.id;
			organizations.push(org);
		}

		// Get group hierarchy
		const groups = await groupService.getGroupHierarchy(currentOrgId);

		// Get selected group from URL
		const url = new URL(request.url);
		const selectedGroupId = url.searchParams.get("group");

		let selectedGroup: CompanyGroup | undefined;
		let groupMembers:
			| Array<CompanyGroupMember & { connection: MWConnection }>
			| undefined;

		if (selectedGroupId) {
			// Find selected group in hierarchy
			const findGroup = (
				groups: GroupWithChildren[],
			): CompanyGroup | undefined => {
				for (const group of groups) {
					if (group.id === selectedGroupId) return group;
					if (group.children) {
						const found = findGroup(group.children);
						if (found) return found;
					}
				}
				return undefined;
			};

			selectedGroup = findGroup(groups);

			if (selectedGroup) {
				// Get members of selected group
				const members = await groupService.getGroupMembers(selectedGroup.id);

				// Fetch connection details for each member
				const membersWithConnections = await Promise.all(
					members.map(async (member) => {
						const connection = await connectionService.getConnection(
							userId,
							member.connection_id,
						);
						return { ...member, connection: connection! };
					}),
				);

				groupMembers = membersWithConnections.filter((m) => m.connection);
			}
		}

		return json<LoaderData>({
			organizations: organizations.map((org) => ({
				id: org.id,
				name: org.name,
			})),
			groups,
			selectedGroup,
			groupMembers,
			currentOrganizationId: currentOrgId,
		});
	} catch (error) {
		if (error instanceof Response) {
			throw error;
		}
		console.error("[Groups Loader] Error:", error);
		throw new Response("Failed to load groups", { status: 500 });
	}
}

export default function Groups() {
	return (
		<AuthGuard requireConnection={false}>
			<GroupsContent />
		</AuthGuard>
	);
}

function GroupsContent() {
	const { t } = useTranslation();
	const {
		organizations,
		groups,
		selectedGroup,
		groupMembers,
		currentOrganizationId,
	} = useLoaderData<typeof loader>();
	const [showCreateGroup, setShowCreateGroup] = useState(false);
	const [showAddCompany, setShowAddCompany] = useState(false);

	return (
		<>
			<Navigation />

			{/* Create Group Dialog */}
			{currentOrganizationId && (
				<CreateGroupDialog
					open={showCreateGroup}
					onOpenChange={setShowCreateGroup}
					organizationId={currentOrganizationId}
				/>
			)}

			{/* Add Company Dialog */}
			{selectedGroup && (
				<AddCompanyDialog
					open={showAddCompany}
					onOpenChange={setShowAddCompany}
					groupId={selectedGroup.id}
					groupName={selectedGroup.name}
					currentMembers={groupMembers?.map((m) => m.connection_id) || []}
				/>
			)}
			<main className="container py-8">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Company Groups
						</h1>
						<p className="text-muted-foreground mt-2">
							Organize and manage your client companies
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline">
							<Users className="mr-2 h-4 w-4" />
							Invite User
						</Button>
						<Button onClick={() => setShowCreateGroup(true)}>
							<Plus className="mr-2 h-4 w-4" />
							New Group
						</Button>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-12">
					{/* Group Tree */}
					<div className="md:col-span-4">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center text-base">
									<FolderTree className="mr-2 h-4 w-4" />
									Group Structure
								</CardTitle>
								<CardDescription>
									Click a group to view its companies
								</CardDescription>
							</CardHeader>
							<CardContent>
								<GroupTree
									groups={groups}
									selectedGroupId={selectedGroup?.id}
									onSelectGroup={(group) => {
										// Update URL with selected group
										const url = new URL(window.location.href);
										url.searchParams.set("group", group.id);
										window.history.pushState({}, "", url.toString());
										window.location.reload(); // For now, reload to fetch group data
									}}
								/>
							</CardContent>
						</Card>
					</div>

					{/* Group Details */}
					<div className="md:col-span-8">
						{selectedGroup ? (
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="flex items-center">
												<div
													className="w-3 h-3 rounded-full mr-2"
													style={{ backgroundColor: selectedGroup.color_code }}
												/>
												{selectedGroup.name}
											</CardTitle>
											<CardDescription>
												{selectedGroup.description ||
													`${selectedGroup.type} group`}
											</CardDescription>
										</div>
										<Button variant="outline" size="sm">
											<Settings className="h-4 w-4 mr-2" />
											Settings
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold mb-2">
												Companies in this group
											</h3>
											{groupMembers && groupMembers.length > 0 ? (
												<div className="space-y-2">
													{groupMembers.map((member) => (
														<div
															key={member.id}
															className="flex items-center justify-between p-3 rounded-lg border"
														>
															<div className="flex items-center gap-3">
																<Building2 className="h-4 w-4 text-muted-foreground" />
																<div>
																	<p className="font-medium">
																		{member.connection.connection_name}
																	</p>
																	<p className="text-sm text-muted-foreground">
																		{member.connection.mw_data_file} •{" "}
																		{member.connection.mw_host}
																	</p>
																</div>
															</div>
															{member.company_code && (
																<span className="text-xs bg-muted px-2 py-1 rounded">
																	{member.company_code}
																</span>
															)}
														</div>
													))}
												</div>
											) : (
												<div className="text-center py-8 text-muted-foreground">
													<Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
													<p>No companies in this group yet</p>
													<Button
														variant="outline"
														size="sm"
														className="mt-2"
														onClick={() => setShowAddCompany(true)}
													>
														Add Company
													</Button>
												</div>
											)}
										</div>

										{/* Quick Actions */}
										<div>
											<h3 className="font-semibold mb-2">Quick Actions</h3>
											<div className="grid gap-2 sm:grid-cols-2">
												<Button variant="outline" size="sm" asChild>
													<Link
														to={`/groups/${selectedGroup.id}/tax-comparison`}
													>
														Compare Tax Codes
													</Link>
												</Button>
												<Button variant="outline" size="sm">
													Sync from Parent
												</Button>
												<Button variant="outline" size="sm">
													Apply Template
												</Button>
												<Button variant="outline" size="sm">
													Export Group Data
												</Button>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className="py-16 text-center">
									<FolderTree className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
									<p className="text-muted-foreground">
										Select a group from the tree to view its details
									</p>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
