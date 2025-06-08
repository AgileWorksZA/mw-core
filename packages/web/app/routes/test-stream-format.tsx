import { useChat } from "@ai-sdk/react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function TestStreamFormat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/test-ai-sdk", // Using AI SDK directly for testing
  });

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card className="mb-6 p-6">
        <h1 className="text-2xl font-bold mb-2">AI SDK Stream Format Test</h1>
        <p className="text-muted-foreground">
          This page tests the correct streaming format for useChat compatibility.
          Try typing "show me a tool call" to see tool streaming.
        </p>
      </Card>

      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <Card key={message.id} className={`p-4 ${
            message.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                {message.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </Card>
        ))}
        
        {isLoading && (
          <Card className="mr-auto max-w-[80%] p-4">
            <Badge variant="secondary" className="mb-2">assistant</Badge>
            <div className="animate-pulse">Streaming response...</div>
          </Card>
        )}
      </div>

      {error && (
        <Card className="mb-6 p-4 border-red-200 bg-red-50">
          <h3 className="font-semibold text-red-800 mb-1">Error</h3>
          <p className="text-red-600 text-sm">{error.message}</p>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>

      <Card className="mt-6 p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Stream Format Info</h3>
        <p className="text-sm text-muted-foreground mb-2">
          This test uses the AI SDK's data stream protocol:
        </p>
        <div className="space-y-1 text-xs font-mono bg-white p-2 rounded">
          <div>f[hex]:{`{messageId}`} - Start message</div>
          <div>0:"text content" - Text chunks</div>
          <div>9[hex]:{`{toolCall}`} - Tool calls</div>
          <div>a[hex]:{`{toolResult}`} - Tool results</div>
          <div>e[hex]:{`{stepFinish}`} - Step finish</div>
          <div>d[hex]:{`{finish}`} - Final finish</div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Example: <code className="bg-white px-1">0:"Hello world"</code>
        </p>
      </Card>
    </div>
  );
}