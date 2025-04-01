import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Detail, DetailFields } from "../../types/interface/detail";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/detail-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Detail table
 * Detail entries in MoneyWorks
 */
export class DetailService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToDetail(data: ANY): Detail {
    return DetailFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Detail record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Detail);
  }

  /**
   * Get details from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed detail data with pagination metadata
   */
  async getDetails(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Detail>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Detail> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("detail", mwParams);

      // Parse the response
      const details = data.map(this.dataCenterJsonToDetail);

      return {
        data: details,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching details:", error);
      throw error;
    }
  }
}
