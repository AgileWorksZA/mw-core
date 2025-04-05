import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { MessageService } from "../../../services/tables/message.service";
import { messageZod } from "../../../types/zod/tables/message";
import { pagingSelectionSchema } from "../../../types/zod/tables/paging";

const messageService = new MessageService(loadMoneyWorksConfig());

export function registerMessageTools(server: McpServer) {
  server.tool(
    "searchMessages",
    "Search for messages",
    { paging: pagingSelectionSchema, search: z.optional(messageZod.partial()) },
    async ({ paging, search }) => {
      const result = await messageService.getMessages({ ...paging, search });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );
}
