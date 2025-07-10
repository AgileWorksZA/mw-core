import { data as json, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { nowAccountService } from "~/services/now-accounts";
import { connectionService } from "~/services/connections";
import { auditService } from "~/services/audit";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  
  console.log("[API NOW Accounts Loader] userId:", userId);
  
  if (!userId) {
    console.log("[API NOW Accounts Loader] No userId provided");
    return json({ accounts: [] });
  }
  
  try {
    const accounts = await nowAccountService.getNowAccountsByUser(userId);
    console.log("[API NOW Accounts Loader] Found accounts:", accounts.length);
    return json({ accounts });
  } catch (error) {
    console.error("[API NOW Accounts Loader] Failed to load accounts:", error);
    return json({ accounts: [] });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("[API NOW Accounts] Action called");
  
  const formData = await request.formData();
  const userId = formData.get("clerk_user_id") as string;
  const action = formData.get("_action");
  
  console.log("[API NOW Accounts] Action:", action, "UserId:", userId);
  
  if (!userId) {
    console.log("[API NOW Accounts] No userId provided");
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    switch (action) {
      case "create": {
        const data = {
          clerk_user_id: userId,
          account_name: formData.get("account_name") as string,
          mw_now_username: formData.get("mw_now_username") as string,
          mw_now_password: formData.get("mw_now_password") as string,
        };
        
        console.log("[API NOW Accounts] Creating account with name:", data.account_name);
        
        const account = await nowAccountService.createNowAccount(data);
        
        await auditService.log({
          clerk_user_id: userId,
          event_type: 'connection_added',
          event_details: { 
            type: 'now_account',
            account_name: account.account_name,
          },
          success: true,
        });
        
        return json({ account });
      }
      
      case "authenticate": {
        const accountId = formData.get("id") as string;
        const account = await nowAccountService.getNowAccount(userId, accountId);
        
        if (!account) {
          return json({ error: "Account not found" }, { status: 404 });
        }
        
        const authResponse = await nowAccountService.authenticateAndGetFiles(account);
        return json({ files: authResponse.files });
      }
      
      case "create-connections": {
        const accountId = formData.get("accountId") as string;
        const selectedFiles = JSON.parse(formData.get("selectedFiles") as string);
        
        console.log("[API NOW Accounts] Creating connections for", selectedFiles.length, "files");
        
        // Get the NOW account to use its credentials
        const account = await nowAccountService.getNowAccount(userId, accountId);
        if (!account) {
          return json({ error: "Account not found" }, { status: 404 });
        }
        
        // Create connections for selected files
        const connections = await connectionService.createNowConnections(
          userId,
          accountId,
          selectedFiles.map((file: any) => ({
            file,
            username: account.mw_now_username,
            password: account.mw_now_password,
          }))
        );
        
        await auditService.log({
          clerk_user_id: userId,
          event_type: 'connection_added',
          event_details: { 
            type: 'now_connections',
            count: connections.length,
          },
          success: true,
        });
        
        return json({ connections });
      }
      
      case "refresh": {
        const accountId = formData.get("id") as string;
        const files = await nowAccountService.refreshFiles(userId, accountId);
        
        // Get existing connections for comparison
        const existingConnections = await connectionService.getConnectionsByNowAccount(userId, accountId);
        
        // Categorize files
        const existingFileIds = new Set(existingConnections.map(c => c.mw_now_file_id));
        const newFiles = files.filter(f => !existingFileIds.has(f.id));
        const missingFileIds = existingConnections
          .filter(c => !files.find(f => f.id === c.mw_now_file_id))
          .map(c => c.mw_now_file_id);
        
        return json({
          files,
          newFiles,
          missingFileIds,
          existingConnections: existingConnections.length,
        });
      }
      
      case "delete": {
        const accountId = formData.get("id") as string;
        await nowAccountService.deleteNowAccount(userId, accountId);
        
        await auditService.log({
          clerk_user_id: userId,
          event_type: 'connection_deleted',
          event_details: { 
            type: 'now_account',
          },
          success: true,
        });
        
        return json({ success: true });
      }
      
      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API NOW Accounts error:", error);
    return json({ error: error instanceof Error ? error.message : "Operation failed" }, { status: 500 });
  }
}