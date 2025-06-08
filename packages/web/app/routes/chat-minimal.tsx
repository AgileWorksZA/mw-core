import { useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Markdown } from "~/components/ui/markdown";

export default function ChatMinimalRoute() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/moneyworks-ai",
  });

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Minimal Chat (No Storage)</h1>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <Markdown content={message.content} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={(e) => {
          handleSubmit(e);
          // Refocus the input after submission
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}