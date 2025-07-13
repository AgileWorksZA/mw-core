import { LoaderFunctionArgs, redirect, useNavigate } from "react-router";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { ChatService } from "~/services/chat";
import { useAuth } from "~/hooks/use-auth";
import { useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
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
  } catch (error) {
    console.error("[chat.tsx] Error in loader:", error);
    // If unauthorized, let the client handle redirect
    if (error instanceof Response && error.status === 401) {
      return null; // Will be handled by component
    }
    // If no connection, redirect to connections page
    if (error instanceof Response && error.status === 400) {
      return redirect("/connections/new");
    }
    throw error;
  }
}

// Component to handle client-side auth check
export default function ChatRoute() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        navigate("/sign-in");
      } else if (userId) {
        // Reload the page with userId in query params so server can handle it
        window.location.href = `/chat?userId=${userId}`;
      }
    }
  }, [isLoaded, isSignedIn, userId, navigate]);
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  return <div>Redirecting to chat session...</div>;
}