import type { ChatContext, ChatEventPayloads, ChatEmitPayloads } from "../types";
import type { StoreKit } from "~/modules/store-kit/types";

export type ChatStoreKit = StoreKit<
  ChatContext,
  ChatEventPayloads,
  ChatEmitPayloads
>;