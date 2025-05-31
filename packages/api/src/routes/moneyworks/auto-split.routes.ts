import { AutoSplitService } from "../../services/tables/auto-split.service";
import { autoSplitObject } from "../../types/constants.eden";
import type { AutoSplit } from "../../types/interface/tables/autosplit";
import { moneyworksRoute } from "./base/moneyworks.route";

export const autoSplitRoutes = moneyworksRoute<AutoSplit, "AutoSplit", typeof autoSplitObject>(
  "AutoSplit",
  autoSplitObject,
  new AutoSplitService(),
  {
    summary: "Auto Splits",
    description: "Defines rules for automatically allocating or splitting transactions based on matching criteria, used during bank statement imports.",
    tags: ["Transaction"],
  },
);
