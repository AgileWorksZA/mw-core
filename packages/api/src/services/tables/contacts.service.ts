import { type Contacts, ContactsFields } from "../../types/interface/tables/contacts";
import schema from "../../types/optimized/table/contacts-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Contacts table
 * Contacts represent GL contacts in the chart of contacts
 */
export class ContactsService extends TableService<Contacts> {
  constructor() {
    super("contacts", schema, ContactsFields);
  }
}
