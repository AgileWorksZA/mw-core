import type { AdapterConfig } from "~/modules/ide/adapter/type";

export const config: AdapterConfig = {
  type: "chat",
  metadata: {
    name: "Chat",
    description: "AI Chat Sessions",
    tags: ["chat", "ai", "conversation"],
    category: undefined,
  },
};