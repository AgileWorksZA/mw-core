import { data as json, type LoaderFunctionArgs } from "react-router";
import { getDatabaseAsync } from "~/db/client";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  
  if (!userId) {
    return json({ error: "userId parameter required" }, { status: 400 });
  }
  
  try {
    const db = await getDatabaseAsync();
    
    // Get all connections for this user
    const connections = db.prepare(`
      SELECT id, clerk_user_id, connection_name, mw_host, mw_port, is_default, created_at
      FROM mw_connections 
      WHERE clerk_user_id = ?
      ORDER BY created_at DESC
    `).all(userId);
    
    // Get connection count
    const countResult = db.prepare(`
      SELECT COUNT(*) as count 
      FROM mw_connections 
      WHERE clerk_user_id = ?
    `).get(userId) as { count: number };
    
    return json({
      userId,
      totalConnections: countResult.count,
      connections: connections.map((conn: any) => ({
        ...conn,
        // Don't expose sensitive data in debug endpoint
        mw_username: undefined,
        mw_password: undefined,
        mw_folder_name: undefined,
        mw_folder_password: undefined,
        mw_data_file: undefined,
      }))
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return json({ error: "Failed to fetch debug data" }, { status: 500 });
  }
}