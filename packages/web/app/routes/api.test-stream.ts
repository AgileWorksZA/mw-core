import type { ActionFunctionArgs } from "react-router";
import { 
  createTextContent,
  createStepStart,
  createToolCall, 
  createToolResult, 
  createStepFinish,
  createFinishMessage,
  createStreamingResponse,
  generateMessageId
} from "~/lib/ai-sdk-stream-format";

/**
 * Test route to demonstrate correct AI SDK streaming format
 * This can be used with useChat to verify our understanding
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { messages } = await request.json();
  const lastMessage = messages[messages.length - 1];
  
  console.log("[Test Stream] Received message:", lastMessage.content);

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        // Start the message
        const messageId = generateMessageId();
        controller.enqueue(encoder.encode(createStepStart(messageId)));
        
        // Simulate thinking
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Stream the response word by word
        const response = "I am a test streaming response that demonstrates the correct AI SDK format.";
        const words = response.split(' ');
        
        for (const word of words) {
          controller.enqueue(encoder.encode(createTextContent(word + ' ')));
          // Small delay to show streaming
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Simulate a tool call
        if (lastMessage.content.toLowerCase().includes('tool')) {
          const toolCallId = "test_call_123";
          
          controller.enqueue(encoder.encode(createToolCall(
            toolCallId,
            "testTool",
            { action: "demo", value: 42 }
          )));
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Simulate tool result
          controller.enqueue(encoder.encode(createToolResult(
            toolCallId,
            { success: true, data: "Tool executed successfully" }
          )));
          
          // Add more text after tool
          controller.enqueue(encoder.encode(createTextContent("\n\nThe tool was called successfully.")));
        }
        
        // Send step finish message
        controller.enqueue(encoder.encode(createStepFinish("stop", {
          completionTokens: 20,
          promptTokens: 10
        })));
        
        // Send final finish message
        controller.enqueue(encoder.encode(createFinishMessage("stop", {
          completionTokens: 20,
          promptTokens: 10
        })));
        
        controller.close();
      } catch (error: any) {
        console.error("[Test Stream] Error:", error);
        controller.enqueue(encoder.encode(createErrorMessage(error.message)));
        controller.close();
      }
    }
  });

  return createStreamingResponse(stream);
}