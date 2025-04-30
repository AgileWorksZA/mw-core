import { type Asset, AssetFields } from "../../types/interface/tables/asset";
import schema from "../../types/optimized/table/asset-schema";
import { TableService } from "./base/table.service";

export class AssetService extends TableService<Asset> {
  constructor() {
    super("asset", schema, AssetFields);
  }
}
