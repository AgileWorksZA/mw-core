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
    const { limit = 10, offset = 0, sort, order, search, format } = query;
    // Parse the format parameter as a comma-separated list of field names
    const fields = format ? format.split(",") : undefined;

    try {
      return await contactsService.getContacts({
        limit: Number(limit),
        offset: Number(offset),
        sort,
        order: order as "asc" | "desc",
        search: search as unknown as Partial<Contacts>,
        fields,
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
      format: t.Optional(t.String()),
    }),
    detail: {
      summary: "Contacts",
      description: `Get all contacts. Search by: ${ContactsFields.join(", ")}.
      Optionally specify comma-separated field names with "format" parameter to retrieve only specific fields.
      Example: /api/contacts?format=SequenceNumber,ContactName,eMail`,
    },
    tags: ["CRM"],
    response: ContactsMany,
  },
);
