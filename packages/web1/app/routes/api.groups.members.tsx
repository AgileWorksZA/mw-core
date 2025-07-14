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
      if (!body.group_id || !body.connection_id) {
        return json({ error: "Missing required fields" }, { status: 400 });
      }
      
      // TODO: Check if user has permission to add members to this group
      
      // Add the connection to the group
      const member = await groupService.addGroupMember({
        group_id: body.group_id,
        connection_id: body.connection_id,
        company_code: body.company_code,
      });
      
      return json(member);
    }
    
    return json({ error: "Method not allowed" }, { status: 405 });
    
  } catch (error) {
    console.error("[Groups Members API] Error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}