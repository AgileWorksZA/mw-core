import { StickiesService } from "../../services/tables/stickies.service";
import { stickiesObject } from "../../types/constants.eden";
import type { Stickies } from "../../types/interface/tables/stickies";
import { moneyworksRoute } from "./base/moneyworks.route";

export const stickiesRoutes = moneyworksRoute<Stickies, "Stickies", typeof stickiesObject>(
  "Stickies",
  stickiesObject,
  new StickiesService(),
  {
    summary: "stickiess",
    description: "",
    tags: ["System"],
  },
);
