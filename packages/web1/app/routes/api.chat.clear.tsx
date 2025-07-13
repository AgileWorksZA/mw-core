import type { ActionFunctionArgs } from "react-router";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { ChatService } from "~/services/chat";

export async function action({ request }: ActionFunctionArgs) {
	if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	const { userId, connection } = await requireAuthAndConnection(request);

	try {
		// Check if a specific sessionId is provided
		const url = new URL(request.url);
		const sessionId = url.searchParams.get("sessionId");

		if (sessionId) {
			// Clear specific session - verify ownership first
			const session = await ChatService.getSession(sessionId);
			if (!session || session.clerk_user_id !== userId) {
				return new Response(JSON.stringify({ error: "Session not found" }), {
					status: 404,
					headers: { "Content-Type": "application/json" },
				});
			}

			await ChatService.deleteSession(sessionId);
			return new Response(JSON.stringify({ success: true, deleted: 1 }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
		
		// Clear all sessions for this user and connection
		const sessions = await ChatService.getSessionsByConnection(
			connection.id,
			userId,
		);

		// Delete all sessions
		for (const session of sessions) {
			await ChatService.deleteSession(session.id);
		}

		return new Response(
			JSON.stringify({ success: true, deleted: sessions.length }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Failed to clear chat history:", error);
		return new Response(JSON.stringify({ error: "Failed to clear history" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
