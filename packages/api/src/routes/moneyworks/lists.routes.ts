import { ListsService } from "../../services/tables/lists.service";
import { listObject } from "../../types/constants.eden";
import type { Lists } from "../../types/interface/tables/lists";
import { moneyworksRoute } from "./base/moneyworks.route";

export const listsRoutes = moneyworksRoute<Lists, "Lists", typeof listObject>(
  "Lists",
  listObject,
  new ListsService(),
  {
    summary: "Lists",
    description:
      "Stores user-defined lists of options used for custom fields and dropdown menus.",
    tags: ["System"],
  },
);
