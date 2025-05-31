import { FilterService } from "../../services/tables/filter.service";
import { filterObject } from "../../types/constants.eden";
import type { Filter } from "../../types/interface/tables/filter";
import { moneyworksRoute } from "./base/moneyworks.route";

export const filterRoutes = moneyworksRoute<Filter, "Filter", typeof filterObject>(
  "Filter",
  filterObject,
  new FilterService(),
  {
    summary: "Filters",
    description: "Stores user-defined filters (saved searches) for various list views within MoneyWorks. Note: This endpoint is deprecated and will be removed in a future release.",
    tags: ["System"],
  },
);
