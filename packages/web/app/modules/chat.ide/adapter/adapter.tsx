import type { Adapter } from "~/modules/ide/adapter/type";
import type { ChatContext } from "~/modules/chat/types";
import { useSelector } from "@xstate/store/react";
import { MessageCircle } from "lucide-react";
import { Provider } from "../provider/provider";
import { Editor } from "../components/editor";
import { QuickView } from "../components/quick-view";
import { useChatStore } from "~/modules/chat/provider";
import { v4 as uuidv4 } from "uuid";

export const adapter: Adapter<ChatContext> = {
  type: "chat",
  metadata: {
    name: "Chat",
    description: "AI Chat Sessions",
    tags: ["chat", "ai", "conversation"],
    category: undefined,
  },
  Icon: MessageCircle,
  emptyContext: () => {
    const chatId = uuidv4();
    const firstSessionId = uuidv4();
    return {
      data: {
        id: chatId,
        title: "New Chat",
        currentSessionId: firstSessionId,
        sessions: [{
          id: firstSessionId,
          title: "New Chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  },
  calculateOutputs: () => ({
    variables: null,
  }),
  useSelector: (selector) => {
    const store = useChatStore();
    return useSelector(store, selector);
  },
  QuickView: ({ file }) => <QuickView />,
  Editor,
  Provider,
};