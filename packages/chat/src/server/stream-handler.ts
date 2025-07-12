import { MoneyWorksChatService } from './chat-service';
import { StreamingChunk, ChatRequest } from '../shared/types';
import type { CoreMessage } from 'ai';

export interface StreamHandlerConfig {
  openaiApiKey: string;
  model?: string;
  maxTokens?: number;
}

/**
 * Creates a server-sent events stream handler for React Router
 * This is designed to be used in an action function
 */
export function createChatStreamHandler(
  config: StreamHandlerConfig,
  mwConnectionConfig: any // MoneyWorks connection from server
) {
  return async function handleChatStream(
    request: ChatRequest,
    context: any // MoneyWorksChatContext from session/db
  ): Promise<ReadableStream> {
    const encoder = new TextEncoder();
    
    // Convert request messages to CoreMessage format
    const messages: CoreMessage[] = request.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Merge context from request with server context
    const fullContext = {
      ...context,
      ...request.context // Allow client to update some context fields
    };

    const chatService = new MoneyWorksChatService(
      fullContext,
      config,
      mwConnectionConfig
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial connection message
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
          );

          // Stream chat responses
          for await (const chunk of chatService.streamChat(messages)) {
            const sseMessage = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(sseMessage));
            
            // If we received a done signal, close the stream
            if (chunk.type === 'done') {
              controller.close();
              return;
            }
          }

          // Ensure stream is closed
          controller.close();
        } catch (error) {
          // Send error and close stream
          const errorChunk: StreamingChunk = {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          };
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
          );
          controller.close();
        }
      }
    });

    return stream;
  };
}

/**
 * Helper to create a Response object for React Router
 */
export function createSSEResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}