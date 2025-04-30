import { GeneralService } from "../../services/tables/general.service";
import { generalObject } from "../../types/constants.eden";
import type { General } from "../../types/interface/tables/general";
import { moneyworksRoute } from "./base/moneyworks.route";

export const generalRoutes = moneyworksRoute<General, "General", typeof generalObject>(
  "General",
  generalObject,
  new GeneralService(),
  {
    summary: "generals",
    description: "",
    tags: ["System"],
  },
);
