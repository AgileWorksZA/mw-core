import { v4 as uuidv4 } from "uuid";
import type { EventHandlers } from "~/modules/store-kit";
import type { ChatEmitPayloads } from "../provider";
import type { ChatContext, ChatEventPayloads } from "../types";

export const on: EventHandlers<
	ChatContext,
	ChatEventPayloads,
	ChatEmitPayloads
> = {
	update: (context, event, enqueue) => {
		Object.assign(context, event.context);
	},
	"session:create": (context, event) => {
		const newSession = event.session || {
			id: uuidv4(),
			title: "New Chat",
			messages: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return {
			...context,
			sessions: [...context.sessions, newSession],
			currentSessionId: newSession.id,
			updatedAt: new Date(),
		};
	},

	"session:delete": (context, event) => {
		const { sessionId } = event;
		const newSessions = context.sessions.filter((s) => s.id !== sessionId);

		// If deleting current session, switch to another or create new
		let newCurrentId = context.currentSessionId;
		if (sessionId === context.currentSessionId) {
			if (newSessions.length > 0) {
				newCurrentId = newSessions[0].id;
			} else {
				// Create a new session if all are deleted
				const newSession = {
					id: uuidv4(),
					title: "New Chat",
					messages: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				newSessions.push(newSession);
				newCurrentId = newSession.id;
			}
		}

		return {
			...context,
			sessions: newSessions,
			currentSessionId: newCurrentId,
			updatedAt: new Date(),
		};
	},

	"session:select": (context, event) => {
		return {
			...context,
			currentSessionId: event.sessionId,
			updatedAt: new Date(),
		};
	},

	"session:update": (context, event) => {
		const { sessionId, updates } = event;

		return {
			...context,
			sessions: context.sessions.map((session) =>
				session.id === sessionId
					? { ...session, ...updates, updatedAt: new Date() }
					: session,
			),
			updatedAt: new Date(),
		};
	},

	"message:add": (context, event) => {
		const { sessionId, message } = event;

		return {
			...context,
			sessions: context.sessions.map((session) => {
				if (session.id === sessionId) {
					const updatedSession = {
						...session,
						messages: [...session.messages, message],
						updatedAt: new Date(),
					};

					// Update title if it's the first user message
					if (
						session.title === "New Chat" &&
						message.role === "user" &&
						session.messages.length === 0
					) {
						updatedSession.title =
							message.content.substring(0, 50) +
							(message.content.length > 50 ? "..." : "");
					}

					return updatedSession;
				}
				return session;
			}),
			updatedAt: new Date(),
		};
	},

	"message:clear": (context, event) => {
		const { sessionId } = event;

		return {
			...context,
			sessions: context.sessions.map((session) =>
				session.id === sessionId
					? { ...session, messages: [], updatedAt: new Date() }
					: session,
			),
			updatedAt: new Date(),
		};
	},
};
