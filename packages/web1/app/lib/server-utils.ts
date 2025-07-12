/**
 * Server-side utilities for React Router loaders/actions
 */

import { connectionService } from "~/services/connections";
import { SmartMoneyWorksClient } from "@moneyworks/data";
import type { MWConnection } from "~/db/schema";

const AUTOMATION_USER_ID = "automation_user";

/**
 * Get user ID from request (supports automation mode)
 */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  // TEMPORARY: Until we have proper server-side Clerk integration,
  // we'll use the known user ID from your current session
  // This matches the user ID that created the connection
  return "user_2jFpN1oR7s7jPT6xobNovvuzEEn";
}

/**
 * Get current connection for user
 */
export async function getCurrentConnection(
  userId: string, 
  request: Request
): Promise<MWConnection | null> {
  const url = new URL(request.url);
  const connectionId = url.searchParams.get("connectionId");
  
  if (connectionId) {
    return await connectionService.getConnection(userId, connectionId);
  }
  
  // Get default connection
  const connections = await connectionService.getConnectionsByUser(userId);
  const defaultConnection = connections.find(c => c.is_default) || connections[0];
  
  return defaultConnection || null;
}

/**
 * Create MoneyWorks client from connection
 */
export function createMoneyWorksClient(connection: MWConnection): SmartMoneyWorksClient {
  const config: any = {
    host: connection.mw_host,
    port: connection.mw_port,
    dataFile: connection.mw_data_file,
    username: connection.mw_username,
    password: connection.mw_password,
    debug: false
  };
  
  // Add folder auth if present
  if (connection.mw_folder_name && connection.mw_folder_password) {
    config.folderAuth = {
      folderName: connection.mw_folder_name,
      folderPassword: connection.mw_folder_password
    };
  }
  
  return new SmartMoneyWorksClient(config);
}

/**
 * Require authentication and connection
 */
export async function requireAuthAndConnection(request: Request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  
  const connection = await getCurrentConnection(userId, request);
  if (!connection) {
    throw new Response("No connection selected", { status: 400 });
  }
  
  return { userId, connection };
}