import { type AssetLog, AssetLogFields } from "../../types/interface/tables/assetlog";
import schema from "../../types/optimized/table/asset-log-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks AssetLog table
 * AssetLog represents the history of asset transactions
 */
export class AssetLogService extends TableService<AssetLog> {
  constructor() {
    super("assetlog", schema, AssetLogFields);
  }
}
