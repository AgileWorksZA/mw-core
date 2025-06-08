import type { EmitHandlers } from "~/modules/store-kit";
import type { ChatEmitPayloads } from "../provider";

export const emits: EmitHandlers<ChatEmitPayloads> = {
  updated: () => {
    // This is called when the chat context is updated
    console.log("Chat context updated");
  },
};