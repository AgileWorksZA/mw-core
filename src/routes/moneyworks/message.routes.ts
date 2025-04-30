import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { MessageService } from "../../services/tables/message.service";
import { messageObject } from "../../types/constants.eden";
import {
  type Message,
  MessageFields,
} from "../../types/interface/tables/message";

// Initialize the message service with configuration
const config = loadMoneyWorksConfig();
const messageService = new MessageService(config);

export const messageRoutes = new Elysia({ prefix: "/api" }).get(
  "/messages",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    const fields = format ? format.split(",") : undefined;

    try {
      return await messageService.getMessages({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Message>,
        fields,
      });
    } catch (error) {
      console.error("Error in GET /messages:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(messageObject),
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Messages",
      description: `Manages recurring messages, reminders, and scheduled tasks within MoneyWorks.

      Search by: ${MessageFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/messages?format=SequenceNumber,Message,User`,
    },
    tags: ["System"],
    response: { $schema: { $ref: "#/components/schemas/Messages" } },
  },
);
