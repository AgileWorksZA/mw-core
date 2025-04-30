import { loadMoneyWorksConfig } from "../../config/moneyworks.config";
import { AssetService } from "../../services/tables/asset.service";
import { assetObject } from "../../types/constants.eden";
import type { Asset } from "../../types/interface/tables/asset";
import { moneyworksRoute } from "./base/moneyworks.route";

export const assetRoutes = moneyworksRoute<Asset, "Asset", typeof assetObject>(
  "Asset",
  assetObject,
  new AssetService(loadMoneyWorksConfig()),
  {
    summary: "Assets",
    description:
      "Stores details of individual fixed assets, including acquisition cost, depreciation settings, and current book value.",
    tags: ["Assets"],
  },
);
