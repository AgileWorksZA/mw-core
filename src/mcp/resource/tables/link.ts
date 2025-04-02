import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import { LinkService } from "../../../services/tables/link.service";
import { linkZod } from "../../../types/zod/link";
import { pagingSelectionSchema } from "../../../types/zod/paging";

const linkService = new LinkService(loadMoneyWorksConfig());

export function registerLinkTools(server: McpServer) {
  server.tool(
    "searchLinks",
    "Search for links",
    { paging: pagingSelectionSchema, search: z.optional(linkZod.partial()) },
    async ({ paging, search }) => {
      const result = await linkService.getLinks({ ...paging, search });

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
