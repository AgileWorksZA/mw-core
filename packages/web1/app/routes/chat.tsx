import { LoaderFunctionArgs, redirect } from "react-router";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { ChatService } from "~/services/chat";

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, connection } = await requireAuthAndConnection(request);
  
  // Check if we should force a new session
  const url = new URL(request.url);
  const forceNew = url.searchParams.has('new');
  
  let session;
  if (forceNew) {
    // Create a new session
    session = await ChatService.createSession(connection.id, userId);
  } else {
    // Get the most recent session or create a new one
    const sessions = await ChatService.getSessionsByConnection(connection.id, userId);
    
    if (sessions.length > 0) {
      // Use the most recent session
      session = sessions[0];
    } else {
      // Create a new session
      session = await ChatService.createSession(connection.id, userId);
    }
  }
  
  // Redirect to the specific session
  return redirect(`/chat/${session.id}`);
}