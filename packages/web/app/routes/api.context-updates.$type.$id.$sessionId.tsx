import type { LoaderFunctionArgs } from "react-router";
import { storageEvents } from "~/modules/storage/events/storage-events.server";
import type { StorageUpdateEvent } from "~/modules/storage/events/storage-events.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { type, id, sessionId } = params;
  
  if (!type || !id || !sessionId) {
    throw new Response("Missing required parameters", { status: 400 });
  }

  // Set up SSE response
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ connected: true })}\n\n`);

      // Subscribe to storage updates for this document
      const unsubscribe = storageEvents.subscribeToDocument(
        type,
        id,
        (event: StorageUpdateEvent) => {
          // Don't send updates from the same session that triggered them
          if (event.sessionId !== sessionId) {
            try {
              const message = `data: ${JSON.stringify({
                type: event.type,
                id: event.id,
                cursor: event.cursor,
                timestamp: event.timestamp,
                operation: event.operation,
                fromSessionId: event.sessionId,
              })}\n\n`;
              
              controller.enqueue(message);
            } catch (error) {
              console.error("Error sending SSE message:", error);
            }
          }
        }
      );

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable Nginx buffering
    },
  });
}