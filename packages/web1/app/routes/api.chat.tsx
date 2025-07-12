import { type ActionFunctionArgs } from "react-router";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { createChatStreamHandler, createSSEResponse } from "@moneyworks/chat/server";
import type { ChatRequest, MoneyWorksChatContext, MoneyWorksMessage, StreamingChunk } from "@moneyworks/chat";
import { ChatService } from "~/services/chat";

// This handler will be created per request with the proper config

export async function action({ request }: ActionFunctionArgs) {
  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return new Response("OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.", {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Get authenticated user and connection
  const { userId, connection } = await requireAuthAndConnection(request);
  
  // Get sessionId from URL
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');
  
  if (!sessionId) {
    return new Response("Session ID is required", {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Parse request
  const formData = await request.formData();
  const requestJson = formData.get('request') as string;
  const chatRequest: ChatRequest = JSON.parse(requestJson);

  // Create MoneyWorks client config
  const mwClientConfig = {
    host: connection.mw_host,
    port: connection.mw_port,
    dataFile: connection.mw_data_file,
    username: connection.mw_username,
    password: connection.mw_password,
    folderAuth: connection.mw_folder_name ? {
      folderName: connection.mw_folder_name,
      folderPassword: connection.mw_folder_password
    } : undefined
  };

  // Create chat context
  const chatContext: MoneyWorksChatContext = {
    connectionId: connection.id,
    companyName: connection.connection_name || 'MoneyWorks',
    userId: userId,
    userEmail: '', // We don't have email in this context
    permissions: [], // TODO: Load from user roles
    currentPeriod: chatRequest.context?.currentPeriod,
    selectedAccount: chatRequest.context?.selectedAccount,
    selectedEntity: chatRequest.context?.selectedEntity,
    dateFormat: 'DD/MM/YYYY',
    currencySymbol: '$',
    decimalPlaces: 2
  };

  // Create handler with connection config
  const handler = createChatStreamHandler(
    {
      openaiApiKey: process.env.OPENAI_API_KEY!,
      model: 'gpt-4o-mini',
      maxTokens: 16384 // Extended context for gpt-4o-mini
    },
    mwClientConfig
  );
  
  // Verify session exists before saving messages
  const session = await ChatService.getSession(sessionId);
  if (!session) {
    console.error(`[API CHAT] Session not found: ${sessionId}`);
    return new Response("Invalid session ID", {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // Save the user message immediately
  const lastMessage = chatRequest.messages[chatRequest.messages.length - 1];
  if (lastMessage && lastMessage.role === 'user') {
    try {
      await ChatService.saveMessage(sessionId, {
        id: crypto.randomUUID(),
        role: 'user',
        content: lastMessage.content,
        timestamp: new Date()
      });
      
      // Generate title from first message if this is the first message
      if (session.message_count === 0) {
        await ChatService.generateSessionTitle(sessionId, lastMessage.content);
      }
    } catch (error) {
      console.error('[API CHAT] Failed to save user message:', error);
    }
  }

  // Handle the stream and collect response for persistence
  const stream = await handler(chatRequest, chatContext);
  
  // Create a transform stream to intercept and save messages
  let assistantContent = '';
  let toolInvocations: any[] = [];
  let mwData: any = null;
  let buffer = '';
  
  const persistenceStream = new TransformStream<Uint8Array, Uint8Array>({
    async transform(chunk, controller) {
      // Pass through the raw chunk immediately for SSE
      controller.enqueue(chunk);
      
      // Decode and parse SSE data
      const decoder = new TextDecoder();
      buffer += decoder.decode(chunk, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            // Stream complete - save the message
            console.log('[API CHAT] Stream done signal received');
            continue;
          }
          
          try {
            const parsedChunk = JSON.parse(data) as StreamingChunk;
            
            // Process the chunk
            if (parsedChunk.type === 'text' && parsedChunk.content) {
              assistantContent += parsedChunk.content;
            } else if (parsedChunk.type === 'tool_start') {
              toolInvocations.push({
                toolName: parsedChunk.toolName,
                args: parsedChunk.toolArgs,
                state: 'pending'
              });
            } else if (parsedChunk.type === 'tool_result') {
              const tool = toolInvocations.find(t => t.toolName === parsedChunk.toolName);
              if (tool) {
                tool.state = 'completed';
                tool.result = parsedChunk.toolResult;
              }
            } else if (parsedChunk.type === 'mw_data') {
              mwData = parsedChunk.mwData;
            } else if (parsedChunk.type === 'done') {
              // Stream is complete, save the assistant message
              if (assistantContent || toolInvocations.length > 0) {
                try {
                  await ChatService.saveMessage(sessionId, {
                    id: crypto.randomUUID(),
                    role: 'assistant' as const,
                    content: assistantContent || 'I encountered an issue processing your request.',
                    timestamp: new Date(),
                    toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined,
                    mwData: mwData
                  });
                } catch (error) {
                  console.error('[API CHAT] Failed to save assistant message:', error);
                }
              }
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      }
    },
    
    async flush() {
      // The 'done' event handler already saves the message
      // This flush is only for unexpected stream termination
      console.log('[API CHAT] Flush called - stream ended');
    }
  });
  
  // Pipe the original stream through persistence
  const reader = stream.getReader();
  const writer = persistenceStream.writable.getWriter();
  
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await writer.write(value);
      }
    } catch (error) {
      console.error('Stream processing error:', error);
    } finally {
      await writer.close();
    }
  })();
  
  // Return SSE response from the persistence stream
  return createSSEResponse(persistenceStream.readable);
}