import { AssetLogService } from "../../services/tables/asset-log.service";
import { assetLogObject } from "../../types/constants.eden";
import type { AssetLog } from "../../types/interface/tables/assetlog";
import { moneyworksRoute } from "./base/moneyworks.route";

export const assetLogRoutes = moneyworksRoute<AssetLog, "AssetLog", typeof assetLogObject>(
  "AssetLog",
  assetLogObject,
  new AssetLogService(),
  {
    summary: "Asset Logs",
    description: "Records the history of actions performed on fixed assets, such as depreciation runs, revaluations, and disposals.",
    tags: ["Assets"],
  },
);
