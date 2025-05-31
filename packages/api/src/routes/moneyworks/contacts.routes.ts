import { ContactsService } from "../../services/tables/contacts.service";
import { contactsObject } from "../../types/constants.eden";
import type { Contacts } from "../../types/interface/tables/contacts";
import { moneyworksRoute } from "./base/moneyworks.route";

export const contactsRoutes = moneyworksRoute<Contacts, "Contacts", typeof contactsObject>(
  "Contacts",
  contactsObject,
  new ContactsService(),
  {
    summary: "Contacts",
    description: "Stores additional contact persons and their details associated with a primary Name record, beyond the first two contacts.",
    tags: ["CRM"],
  },
);
