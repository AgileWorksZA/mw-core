import { type AssetCat, AssetCatFields } from "../../types/interface/tables/assetcat";
import schema from "../../types/optimized/table/asset-cat-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks AssetCat table
 * AssetCat represents asset categories in the system
 */
export class AssetCatService extends TableService<AssetCat> {
  constructor() {
    super("assetcat", schema, AssetCatFields);
  }
}
