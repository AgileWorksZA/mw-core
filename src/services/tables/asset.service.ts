import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Asset, AssetFields } from "../../types/interface/tables/asset";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/asset-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Asset table
 * Assets represent fixed assets in the system
 */
export class AssetService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAsset(data: ANY): Asset {
    return AssetFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Asset record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      return acc;
    }, {} as Asset);
  }

  /**
   * Get assets from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed asset data with pagination metadata
   */
  async getAssets(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Asset>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Asset> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("asset", mwParams);

      // Parse the response
      const assets = data.map(this.dataCenterJsonToAsset);

      return {
        data: assets,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
  }
}
