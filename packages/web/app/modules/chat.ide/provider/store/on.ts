import type { EmitHandlers } from "~/modules/store-kit/types";
import type { ChatEmitPayloads } from "../../types";

export const on: EmitHandlers<ChatEmitPayloads> = {
  "session:created": () => {
    // Emit after session is created
  },
  
  "session:updated": () => {
    // Emit after session is updated
  },
  
  "session:deleted": () => {
    // Emit after session is deleted
  },
  
  "session:selected": () => {
    // Emit after session is selected
  },
  
  "message:added": () => {
    // Emit after message is added
  },
  
  "message:updated": () => {
    // Emit after message is updated
  },
  
  "message:deleted": () => {
    // Emit after message is deleted
  },
  
  "chat:started": () => {
    // Emit after chat starts
  },
  
  "chat:completed": () => {
    // Emit after chat completes
  },
  
  "chat:errored": () => {
    // Emit after chat errors
  },
};