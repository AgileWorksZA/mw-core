import { BuildService } from "../../services/tables/build.service";
import { buildObject } from "../../types/constants.eden";
import type { Build } from "../../types/interface/tables/build";
import { moneyworksRoute } from "./base/moneyworks.route";

export const buildRoutes = moneyworksRoute<Build, "Build", typeof buildObject>(
  "Build",
  buildObject,
  new BuildService(),
  {
    summary: "Builds",
    description: "Defines the Bill of Materials (BOM) components required to manufacture a specific parent product.",
    tags: ["System"],
  },
);
