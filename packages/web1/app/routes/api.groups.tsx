import { data as json, type ActionFunctionArgs } from "react-router";
import { groupService } from "~/services/groups";
import { getUserIdFromRequest } from "~/lib/server-utils";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const method = request.method;
    
    if (method === "POST") {
      const body = await request.json();
      
      // Validate required fields
      if (!body.name || !body.organization_id) {
        return json({ error: "Missing required fields" }, { status: 400 });
      }
      
      // Create the group
      const group = await groupService.createGroup({
        organization_id: body.organization_id,
        parent_group_id: body.parent_group_id,
        name: body.name,
        type: body.type || 'standard',
        color_code: body.color_code || '#3B82F6',
        description: body.description,
        consolidation_settings: body.consolidation_settings || {},
        sync_rules: body.sync_rules || {},
      });
      
      // Grant the creating user admin permissions on the group
      const permId = crypto.randomUUID();
      const db = await import("~/db/client").then(m => m.getDatabaseAsync());
      const now = new Date().toISOString();
      
      const stmt = db.prepare(`
        INSERT INTO group_permissions (
          id, group_id, user_id, role, permissions,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        permId,
        group.id,
        userId,
        'admin',
        JSON.stringify({}),
        now,
        now
      );
      
      return json(group);
    }
    
    return json({ error: "Method not allowed" }, { status: 405 });
    
  } catch (error) {
    console.error("[Groups API] Error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}