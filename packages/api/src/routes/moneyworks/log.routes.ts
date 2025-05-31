import { LogService } from "../../services/tables/log.service";
import { logObject } from "../../types/constants.eden";
import type { Log } from "../../types/interface/tables/log";
import { moneyworksRoute } from "./base/moneyworks.route";

export const logRoutes = moneyworksRoute<Log, "Log", typeof logObject>(
  "Log",
  logObject,
  new LogService(),
  {
    summary: "logs",
    description: "",
    tags: ["System"],
  },
);
