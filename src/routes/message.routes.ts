import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../config/moneyworks.config";
import { MessageService } from "../services/tables/message.service";
import { messageObject } from "../types/constants.eden";
import { MessageMany } from "../types/eden/Message";
import { type Message, MessageFields } from "../types/interface/message";

// Initialize the message service with configuration
const config = loadMoneyWorksConfig();
const messageService = new MessageService(config);

export const messageRoutes = new Elysia({ prefix: "/api" }).get(
  "/messages",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await messageService.getMessages({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Message,
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
    }),
    detail: {
      summary: "Get messages.",
      description: `Get all messages. Search by: ${MessageFields.join(", ")}`,
      tags: ["MoneyWorks Data"],
    },
    response: MessageMany,
  },
);
