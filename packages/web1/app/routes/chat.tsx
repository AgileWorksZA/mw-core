import { LoaderFunctionArgs, useLoaderData, data as json, useNavigate } from "react-router";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { MoneyWorksChat, MWChatContextProvider } from "@moneyworks/chat/client";
import type { MoneyWorksChatContext, MoneyWorksMessage } from "@moneyworks/chat";
import { AuthGuard } from "~/components/auth-guard";
import { Navigation } from "~/components/navigation";
import { ChatService } from "~/services/chat";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "~/lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, connection } = await requireAuthAndConnection(request);
  
  // Check if we should force a new session
  const url = new URL(request.url);
  const forceNew = url.searchParams.has('new');
  
  // Get or create a chat session
  let session;
  if (forceNew) {
    // Force create a new session
    session = await ChatService.createSession(connection.id, userId);
  } else {
    session = await ChatService.getOrCreateSession(connection.id, userId);
  }
  
  // Load existing messages for the session
  const messages = await ChatService.getSessionMessages(session.id);
  
  // Get all sessions for this connection (for history sidebar)
  const sessions = await ChatService.getSessionsByConnection(connection.id, userId);

  // Create context for chat (without sensitive connection details)
  const chatContext: MoneyWorksChatContext = {
    connectionId: connection.id,
    companyName: connection.connection_name || 'MoneyWorks',
    userId: userId,
    userEmail: '',
    permissions: [], // TODO: Load from user roles
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '$',
    decimalPlaces: 2
  };

  return json({ 
    chatContext, 
    sessionId: session.id,
    initialMessages: messages,
    sessions 
  });
}

export default function ChatPage() {
  return (
    <AuthGuard requireConnection={true}>
      <ChatPageContent />
    </AuthGuard>
  );
}

function ChatPageContent() {
  const { chatContext, sessionId, initialMessages, sessions } = useLoaderData<typeof loader>();
  const [selectedSessionId, setSelectedSessionId] = useState(sessionId);
  const navigate = useNavigate();

  const welcomeMessage = `Welcome to MoneyWorks Assistant for ${chatContext.companyName}! 

I can help you with:
• Searching transactions and invoices
• Looking up tax rates and account codes
• Creating financial reports
• Answering accounting questions

What would you like to know?`;

  return (
    <>
      <Navigation />
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Chat History Sidebar */}
        <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Chat History</h2>
            <Button 
              className="w-full mb-4"
              onClick={() => {
                // Force a new session by adding a timestamp parameter
                navigate(`/chat?new=${Date.now()}`);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    selectedSessionId === session.id && "bg-gray-100 dark:bg-gray-800"
                  )}
                  onClick={() => setSelectedSessionId(session.id)}
                >
                  <div className="font-medium text-sm truncate">{session.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {session.message_count} messages • {
                      session.last_message_at 
                        ? new Date(session.last_message_at).toLocaleDateString()
                        : 'New chat'
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <h1 className="text-xl font-bold">MoneyWorks Assistant</h1>
            <p className="text-sm text-gray-600">
              {chatContext.companyName} • Session: {selectedSessionId.slice(0, 8)}...
            </p>
          </div>

          <div className="flex-1 overflow-hidden">
            <MWChatContextProvider value={chatContext}>
              <MoneyWorksChat
                key={selectedSessionId} // Force remount on session change
                apiEndpoint={`/api/chat?sessionId=${selectedSessionId}`}
                initialMessages={selectedSessionId === sessionId ? initialMessages : []}
                welcomeMessage={welcomeMessage}
                className="h-full"
              />
            </MWChatContextProvider>
          </div>
        </div>
      </div>
    </>
  );
}