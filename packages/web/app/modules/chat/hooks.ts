import { useSelector } from "@xstate/store/react";
import { useChatStore } from "./provider";
import type { ChatContext, ChatEventPayloads, ChatSession } from "./types";

export const useChatContext = () => {
  const store = useChatStore();
  return useSelector(store, (state) => state.context);
};

export const useChatSessions = () => {
  const store = useChatStore();
  return useSelector(store, (state) => state.context.sessions);
};

export const useCurrentSession = (): ChatSession | undefined => {
  const store = useChatStore();
  return useSelector(store, (state) => {
    const { sessions, currentSessionId } = state.context;
    return sessions.find((s) => s.id === currentSessionId);
  });
};

export const useChatTrigger = () => {
  const store = useChatStore();
  
  return {
    createSession: (session?: ChatEventPayloads["session:create"]["session"]) =>
      store.send({ type: "session:create", session }),
    
    deleteSession: (sessionId: string) =>
      store.send({ type: "session:delete", sessionId }),
    
    selectSession: (sessionId: string) =>
      store.send({ type: "session:select", sessionId }),
    
    updateSession: (sessionId: string, updates: ChatEventPayloads["session:update"]["updates"]) =>
      store.send({ type: "session:update", sessionId, updates }),
    
    addMessage: (sessionId: string, message: ChatEventPayloads["message:add"]["message"]) =>
      store.send({ type: "message:add", sessionId, message }),
    
    clearMessages: (sessionId: string) =>
      store.send({ type: "message:clear", sessionId }),
  };
};