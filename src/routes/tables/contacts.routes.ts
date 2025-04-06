import { Elysia, t } from "elysia";
import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { ContactsService } from "../../services/tables/contacts.service";
import { contactsObject } from "../../types/constants.eden";
import { ContactsMany } from "../../types/eden/tables/Contacts";
import {
  type Contacts,
  ContactsFields,
} from "../../types/interface/tables/contacts";

// Initialize the contacts service with configuration
const config = loadMoneyWorksConfig();
const contactsService = new ContactsService(config);

export const contactsRoutes = new Elysia({ prefix: "/api" }).get(
  "/contacts",
  async ({ query }) => {
    const { limit = 10, offset = 0, sort, order, search } = query;

    try {
      return await contactsService.getContacts({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Contacts>,
      });
    } catch (error) {
      console.error("Error in GET /contacts:", error);
      throw error;
    }
  },
  {
    query: t.Object({
      limit: t.Optional(t.Numeric()),
      offset: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
      order: t.Optional(t.String()),
      search: t.Optional(contactsObject),
    }),
    detail: {
      summary: "Contacts",
      description: `Get all contacts. Search by: ${ContactsFields.join(", ")}`,
    },
    tags: ["CRM"],
    response: ContactsMany,
  },
);
