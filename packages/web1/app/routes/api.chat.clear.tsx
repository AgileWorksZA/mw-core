import { type ActionFunctionArgs } from "react-router";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { ChatService } from "~/services/chat";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { userId, connection } = await requireAuthAndConnection(request);
  
  try {
    // Get all sessions for this user and connection
    const sessions = await ChatService.getSessionsByConnection(connection.id, userId);
    
    // Delete all sessions
    for (const session of sessions) {
      await ChatService.deleteSession(session.id);
    }
    
    return new Response(JSON.stringify({ success: true, deleted: sessions.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to clear chat history:", error);
    return new Response(JSON.stringify({ error: "Failed to clear history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}