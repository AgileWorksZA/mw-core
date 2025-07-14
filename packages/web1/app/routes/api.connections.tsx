import { data as json, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
// For now, we'll handle auth client-side only
// TODO: Add server-side auth when Clerk React Router support is available
import { connectionService } from "~/services/connections";
import { auditService } from "~/services/audit";

export async function loader({ request }: LoaderFunctionArgs) {
  // Temporary solution: get userId from query parameter
  // TODO: Replace with proper server-side auth when Clerk React Router support is available
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  
  console.log("[API Connections Loader] userId:", userId);
  
  if (!userId) {
    console.log("[API Connections Loader] No userId provided");
    return json({ connections: [] });
  }
  
  try {
    const connections = await connectionService.getConnectionsByUser(userId);
    console.log("[API Connections Loader] Found connections:", connections.length);
    return json({ connections });
  } catch (error) {
    console.error("[API Connections Loader] Failed to load connections:", error);
    return json({ connections: [] });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("[API] Connection action called");
  
  // For client-side auth, we'll get userId from the form json
  const formData = await request.formData();
  const userId = formData.get("clerk_user_id") as string;
  const action = formData.get("_action");
  
  console.log("[API] Action:", action, "UserId:", userId);
  
  if (!userId) {
    console.log("[API] No userId provided");
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    switch (action) {
      case "create": {
        const data = {
          clerk_user_id: userId,
          connection_name: formData.get("connection_name") as string,
          mw_username: formData.get("mw_username") as string,
          mw_password: formData.get("mw_password") as string,
          mw_folder_name: formData.get("mw_folder_name") as string || undefined,
          mw_folder_password: formData.get("mw_folder_password") as string || undefined,
          mw_data_file: formData.get("mw_data_file") as string,
          mw_host: formData.get("mw_host") as string,
          mw_port: parseInt(formData.get("mw_port") as string),
          is_default: formData.get("is_default") === "true",
        };
        
        console.log("[API] Creating connection with data:", {
          ...data,
          mw_password: "[REDACTED]",
          mw_folder_password: data.mw_folder_password ? "[REDACTED]" : undefined
        });
        
        let connection;
        try {
          connection = await connectionService.createConnection(data);
        } catch (error: any) {
          console.error("Failed to create connection:", error);
          
          // Check for unique constraint violation
          if (error?.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return new Response(
              JSON.stringify({ error: "A connection with this name already exists" }), 
              { 
                status: 409,
                headers: { "Content-Type": "application/json" }
              }
            );
          }
          
          return new Response(
            JSON.stringify({ error: "Failed to create connection" }), 
            { 
              status: 500,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        
        await auditService.log({
          clerk_user_id: userId,
          connection_id: connection.id,
          event_type: "connection_added",
          event_details: { 
            connection_name: connection.connection_name,
            host: connection.mw_host,
          },
          success: true,
        });
        
        return json({ connection });
      }
      
      case "update": {
        const connectionId = formData.get("id") as string;
        const updates: any = {};
        
        // Only include fields that were provided
        const fields = ["connection_name", "mw_username", "mw_password", "mw_folder_name", 
                       "mw_folder_password", "mw_json_file", "mw_host", "mw_port", "is_default"];
        
        fields.forEach(field => {
          const value = formData.get(field);
          if (value !== null) {
            updates[field] = field === "mw_port" ? parseInt(value as string) : 
                           field === "is_default" ? value === "true" : value;
          }
        });
        
        updates.id = connectionId;
        
        const connection = await connectionService.updateConnection(userId, updates);
        
        await auditService.log({
          clerk_user_id: userId,
          connection_id: connectionId,
          event_type: "connection_updated",
          success: true,
        });
        
        return json({ connection });
      }
      
      case "delete": {
        const connectionId = formData.get("id") as string;
        await connectionService.deleteConnection(userId, connectionId);
        
        await auditService.log({
          clerk_user_id: userId,
          connection_id: connectionId,
          event_type: "connection_deleted",
          success: true,
        });
        
        return json({ success: true });
      }
      
      case "test": {
        const connection = {
          id: "test",
          clerk_user_id: userId,
          connection_name: formData.get("connection_name") as string,
          connection_type: 'datacenter' as const,
          mw_username: formData.get("mw_username") as string,
          mw_password: formData.get("mw_password") as string,
          mw_folder_name: formData.get("mw_folder_name") as string || undefined,
          mw_folder_password: formData.get("mw_folder_password") as string || undefined,
          mw_data_file: formData.get("mw_data_file") as string,
          mw_host: formData.get("mw_host") as string,
          mw_port: parseInt(formData.get("mw_port") as string),
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const result = await connectionService.testConnection(connection);
        return json(result);
      }
      
      case "update-last-used": {
        const connectionId = formData.get("id") as string;
        await connectionService.updateLastUsed(userId, connectionId);
        return json({ success: true });
      }
      
      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return json({ error: error instanceof Error ? error.message : "Operation failed" }, { status: 500 });
  }
}