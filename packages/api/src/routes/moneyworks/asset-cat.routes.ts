import { AssetCatService } from "../../services/tables/asset-cat.service";
import { assetCatObject } from "../../types/constants.eden";
import type { AssetCat } from "../../types/interface/tables/assetcat";
import { moneyworksRoute } from "./base/moneyworks.route";

export const assetCatRoutes = moneyworksRoute<AssetCat, "AssetCat", typeof assetCatObject>(
  "AssetCat",
  assetCatObject,
  new AssetCatService(),
  {
    summary: "Asset Categories",
    description: "Defines categories for grouping fixed assets, holding default depreciation methods, rates, and related GL accounts.",
    tags: ["Assets"],
  },
);
