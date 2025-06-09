import type { LoaderFunctionArgs } from "react-router";
import { storageEvents } from "~/modules/storage/events/storage-events.server";
import type { StorageUpdateEvent } from "~/modules/storage/events/storage-events.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { type, id } = params;
  
  if (!type || !id) {
    return new Response("Type and ID are required", { status: 400 });
  }

  // Set up SSE headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no", // Disable Nginx buffering
  });

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ type, id })}\n\n`)
      );

      // Set up heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(":heartbeat\n\n"));
        } catch (error) {
          // Connection closed, clean up
          clearInterval(heartbeat);
        }
      }, 30000); // Every 30 seconds

      // Subscribe to storage updates
      const unsubscribe = storageEvents.subscribeToDocument(
        type,
        id,
        (event: StorageUpdateEvent) => {
          try {
            const data = JSON.stringify({
              type: event.type,
              id: event.id,
              cursor: event.cursor,
              sessionId: event.sessionId,
              timestamp: event.timestamp,
              operation: event.operation,
            });
            
            controller.enqueue(
              encoder.encode(`event: update\ndata: ${data}\n\n`)
            );
          } catch (error) {
            // Connection closed, clean up
            unsubscribe();
            clearInterval(heartbeat);
          }
        }
      );

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
}