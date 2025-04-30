import { NameService } from "../../services/tables/name.service";
import { nameObject } from "../../types/constants.eden";
import type { Name } from "../../types/interface/tables/name";
import { moneyworksRoute } from "./base/moneyworks.route";

export const nameRoutes = moneyworksRoute<Name, "Name", typeof nameObject>(
  "Name",
  nameObject,
  new NameService(),
  {
    summary: "Names",
    description: "Stores contacts, customers, suppliers, employees, and other entities that the organization interacts with.",
    tags: ["CRM"],
  },
);