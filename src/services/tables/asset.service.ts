import { type Asset, AssetFields } from "../../types/interface/tables/asset";
import type { MoneyWorksConfig } from "../../types/moneyworks";
import schema from "../../types/optimized/table/asset-schema";
import { TableService } from "./base/table.service";

export class AssetService extends TableService<Asset> {
  constructor(config: MoneyWorksConfig) {
    super(config, "asset", schema, AssetFields);
  }
}
