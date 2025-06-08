import { useEffect, useRef } from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useChat } from "@ai-sdk/react";
import { v4 as uuidv4 } from "uuid";
import { Markdown } from "~/components/ui/markdown";
import { createStorageLoader } from "~/modules/storage/loader";
import { createPOSTAction } from "~/modules/storage/json-adapter";
import json_file_adapter from "~/modules/storage/json-adapter/adapter";
import { ChatStoreProvider } from "~/modules/chat/provider";
import { useChatContext, useChatSessions, useCurrentSession, useChatTrigger } from "~/modules/chat/hooks";
import type { ChatContext, ChatMessage } from "~/modules/chat/types";
import { useState } from "react";
import { Bug, Check, Brain } from "lucide-react";

const CHAT_STORAGE_KEY = "standalone-chat";

// Create a default context factory
const createDefaultContext = (): ChatContext => {
  const firstSessionId = uuidv4();
  
  return {
    id: CHAT_STORAGE_KEY,
    title: "Chat Sessions",
    currentSessionId: firstSessionId,
    sessions: [{
      id: firstSessionId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Create a storage loader for chat
const chatLoader = createStorageLoader(json_file_adapter, {
  type: "chat",
  id: CHAT_STORAGE_KEY,
  defaultContext: createDefaultContext(),
});

// Create a POST action for updates
const chatAction = createPOSTAction(json_file_adapter, {
  type: "chat",
  id: CHAT_STORAGE_KEY,
});

export async function loader(args: LoaderFunctionArgs) {
  const result = await chatLoader(args);
  return result;
}

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

function ChatInterface() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const context = useChatContext();
  const sessions = useChatSessions();
  const currentSession = useCurrentSession();
  const trigger = useChatTrigger();
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/moneyworks-ai",
    body: {
      chatId: currentSession?.id,
    },
    initialMessages: currentSession?.messages || [],
    onFinish: (message) => {
      if (currentSession) {
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: message.content,
          createdAt: new Date(),
        };
        trigger.addMessage(currentSession.id, aiMessage);
        
        // Scroll to bottom after AI reply
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });
  
  // Sync messages when session changes
  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages);
    }
  }, [currentSession, setMessages]);
  
  // Auto-scroll to bottom when messages change or during loading
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const userInput = input.trim();
    if (!userInput || !currentSession) return;
    
    // Create user message that will be added after submission
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: userInput,
      createdAt: new Date(),
    };
    
    // Add the user message to the store after the chat hook processes it
    // This prevents the duplicate message issue
    setTimeout(() => {
      trigger.addMessage(currentSession.id, userMessage);
    }, 0);
    
    handleSubmit(e);
    
    // Refocus the input after submission
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  const startNewChat = () => {
    const newSessionId = uuidv4();
    trigger.createSession({
      id: newSessionId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setMessages([]);
  };
  
  const selectSession = (sessionId: string) => {
    trigger.selectSession(sessionId);
    setIsHistoryOpen(false);
  };
  
  const deleteSession = (sessionId: string) => {
    trigger.deleteSession(sessionId);
  };

  const copyDebugUrl = async () => {
    const debugUrl = `${window.location.origin}/api/chat/debug/${currentSession?.id || 'no-session'}`;
    try {
      await navigator.clipboard.writeText(debugUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log("Debug URL copied:", debugUrl);
    } catch (err) {
      console.error("Failed to copy debug URL:", err);
    }
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isHistoryOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-gray-100 dark:bg-gray-900 border-r overflow-hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
            >
              ✕
            </button>
          </div>
          
          <button
            onClick={startNewChat}
            className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + New Chat
          </button>
          
          <div className="flex-1 overflow-y-auto space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${
                  session.id === context.currentSessionId
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
              >
                <div
                  onClick={() => selectSession(session.id)}
                  className="flex-1"
                >
                  <div className="font-medium truncate">{session.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            MoneyWorks AI Chat
            <a href="/knowledge-alignment" className="group relative">
              <Brain className="h-5 w-5 text-blue-500 hover:text-blue-600 cursor-pointer" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Knowledge Alignment Active - Click to manage
              </div>
            </a>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={copyDebugUrl}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center gap-1"
              title="Copy debug URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Bug className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={startNewChat}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              New Chat
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 space-y-4">
              <p className="text-lg">Start a new conversation with MoneyWorks AI</p>
              <div className="max-w-lg mx-auto bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-sm text-left">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Knowledge Alignment System Active
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  This chat uses domain-specific knowledge cards to provide accurate MoneyWorks information.
                  Click the brain icon above to manage knowledge cards and improve AI responses.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <Markdown content={message.content} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <form
          onSubmit={handleFormSubmit}
          className="p-4 border-t flex gap-2 max-w-4xl mx-auto w-full"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChatRoute() {
  const loaderData = useLoaderData<typeof loader>();
  
  if (!loaderData || !loaderData.data) {
    return <div>Loading...</div>;
  }

  // Ensure we have a valid ChatContext
  const chatContext = loaderData.data as ChatContext;

  return (
    <ChatStoreProvider
      documentContext={chatContext}
      cursor={loaderData.cursor}
      type="chat"
      id={CHAT_STORAGE_KEY}
    >
      <ChatInterface />
    </ChatStoreProvider>
  );
}