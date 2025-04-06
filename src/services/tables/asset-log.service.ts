import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type AssetLog,
  AssetLogFields,
} from "../../types/interface/tables/asset-log";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/asset-log-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks AssetLog table
 * AssetLog represents the history of asset transactions
 */
export class AssetLogService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAssetLog(data: ANY): AssetLog {
    return AssetLogFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AssetLog record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as AssetLog);
  }

  /**
   * Get asset logs from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed asset log data with pagination metadata
   */
  async getAssetLogs(params: {
    limit?: number;
    offset?: number;
    search?: Partial<AssetLog>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<AssetLog> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("assetlog", mwParams);

      // Parse the response
      const assetLogs = data.map(this.dataCenterJsonToAssetLog);

      return {
        data: assetLogs,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching asset logs:", error);
      throw error;
    }
  }
}
