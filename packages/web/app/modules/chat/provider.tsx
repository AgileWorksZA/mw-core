import React from "react";
import { useCreateStoreKit } from "~/modules/store-kit";
import { on } from "./store/on";
import { emits } from "./store/emits";
import type { ChatContext, ChatEventPayloads } from "./types";
import type { VersionCursor } from "~/modules/store-kit/versioning/types";
import { useServerSync } from "~/modules/store-kit/hooks/use-server-sync";
import { useSyncDocument } from "~/modules/storage/json-adapter/client";
import type { StoreKit } from "~/modules/store-kit";

// Define emit payloads type (empty for now as we don't emit events)
export type ChatEmitPayloads = {
  updated: undefined;
};

export type ChatStoreKit = StoreKit<
  ChatContext,
  ChatEventPayloads,
  ChatEmitPayloads
>;

const ChatStoreContext = React.createContext<
  | {
      store: ChatStoreKit;
      cursor: VersionCursor;
    }
  | undefined
>(undefined);

export const ChatStoreProvider: React.FC<{
  children: React.ReactNode;
  documentContext: ChatContext;
  cursor: VersionCursor;
  type: string;
  id: string;
}> = ({ children, documentContext, cursor, type, id }) => {
  const store: ChatStoreKit = useCreateStoreKit<
    ChatContext,
    ChatEventPayloads,
    ChatEmitPayloads
  >({
    context: documentContext,
    on,
    emits,
  });

  const storageFn = useSyncDocument(type, id);

  useServerSync<ChatContext, ChatEventPayloads, ChatEmitPayloads>({
    store,
    type,
    id,
    cursor,
    maxWait: 500,
    storageFn,
  });

  return (
    <ChatStoreContext.Provider value={{ store, cursor }}>
      {children}
    </ChatStoreContext.Provider>
  );
};

export const useChatStore = () => {
  const context = React.useContext(ChatStoreContext);
  if (!context) {
    throw new Error("useChatStore must be used within ChatStoreProvider");
  }
  return context.store;
};

export const useChatCursor = () => {
  const context = React.useContext(ChatStoreContext);
  if (!context) {
    throw new Error("useChatCursor must be used within ChatStoreProvider");
  }
  return context.cursor;
};
