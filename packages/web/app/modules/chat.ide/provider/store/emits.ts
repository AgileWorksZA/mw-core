import type { EventHandlers } from "~/modules/store-kit/types";
import type { ChatContext, ChatEventPayloads, ChatEmitPayloads } from "../../types";

export const emits: EventHandlers<ChatContext, ChatEventPayloads, ChatEmitPayloads> = {
  "session:create": (context, { session }) => {
    context.sessions.push(session);
    context.currentSessionId = session.id;
    context.updatedAt = new Date();
  },

  "session:update": (context, { sessionId, updates }) => {
    const session = context.sessions.find((s) => s.id === sessionId);
    if (session) {
      Object.assign(session, updates);
      session.updatedAt = new Date();
      context.updatedAt = new Date();
    }
  },

  "session:delete": (context, { sessionId }) => {
    context.sessions = context.sessions.filter(
      (s) => s.id !== sessionId
    );
    if (context.currentSessionId === sessionId) {
      context.currentSessionId = context.sessions[0]?.id || null;
    }
    context.updatedAt = new Date();
  },

  "session:select": (context, { sessionId }) => {
    if (context.sessions.find((s) => s.id === sessionId)) {
      context.currentSessionId = sessionId;
    }
  },

  "message:add": (context, { sessionId, message }) => {
    const session = context.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = new Date();
      context.updatedAt = new Date();
    }
  },

  "message:update": (context, { sessionId, messageId, content }) => {
    const session = context.sessions.find((s) => s.id === sessionId);
    if (session) {
      const message = session.messages.find((m) => m.id === messageId);
      if (message) {
        message.content = content;
        message.updatedAt = new Date();
        session.updatedAt = new Date();
        context.updatedAt = new Date();
      }
    }
  },

  "message:delete": (context, { sessionId, messageId }) => {
    const session = context.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.messages = session.messages.filter((m) => m.id !== messageId);
      session.updatedAt = new Date();
      context.updatedAt = new Date();
    }
  },

  "chat:start": (context, { sessionId }) => {
    context.isLoading = true;
    context.error = null;
  },

  "chat:complete": (context, { sessionId }) => {
    context.isLoading = false;
  },

  "chat:error": (context, { sessionId, error }) => {
    context.isLoading = false;
    context.error = error;
  },
};