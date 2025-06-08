import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { v4 as uuidv4 } from "uuid";
import { Markdown } from "~/components/ui/markdown";
import { useChatContext, useChatSessions, useCurrentSession, useChatTrigger } from "~/modules/chat/hooks";
import type { ChatMessage } from "~/modules/chat/types";
import { useState } from "react";

export function Editor() {
  const context = useChatContext();
  const sessions = useChatSessions();
  const currentSession = useCurrentSession();
  const trigger = useChatTrigger();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  const { messages, isLoading, append } = useChat({
    api: "/api/moneyworks-ai",
    initialMessages: currentSession?.messages || [],
    id: currentSession?.id,
    onFinish: (message) => {
      if (currentSession) {
        trigger.addMessage(currentSession.id, {
          id: uuidv4(),
          role: message.role as "user" | "assistant",
          content: message.content,
          createdAt: new Date(),
        });
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!currentSession) {
      // Create a new session if none exists
      const newSessionId = uuidv4();
      trigger.createSession({
        id: newSessionId,
        title: input.substring(0, 50) + (input.length > 50 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: input,
      createdAt: new Date(),
    };

    if (currentSession) {
      trigger.addMessage(currentSession.id, userMessage);
    }

    setInput("");
    
    // Send to AI
    await append({
      role: "user",
      content: input,
    });

    // Focus back on input
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    trigger.createSession({
      id: newSessionId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    trigger.deleteSession(sessionId);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-4">
        <button
          onClick={handleNewChat}
          className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          New Chat
        </button>
        
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 ${
                session.id === currentSession?.id ? "bg-gray-200 dark:bg-gray-800" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={() => trigger.selectSession(session.id)}
                  className="flex-1 text-left truncate"
                >
                  {session.title}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {session.messages.length} messages
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            {currentSession?.messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                Start a conversation...
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Markdown content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.role === "user" ? "You" : "Assistant"}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
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