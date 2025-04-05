import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type General,
  GeneralFields,
} from "../../types/interface/tables/general";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/general-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks General table
 * General entries in MoneyWorks
 */
export class GeneralService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToGeneral(data: ANY): General {
    return GeneralFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for General record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as General);
  }

  /**
   * Get generals from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed general data with pagination metadata
   */
  async getGenerals(params: {
    limit?: number;
    offset?: number;
    search?: Partial<General>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<General> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("general", mwParams);

      // Parse the response
      const generals = data.map(this.dataCenterJsonToGeneral);

      return {
        data: generals,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching generals:", error);
      throw error;
    }
  }
}
