import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Name, NameFields } from "../../types/interface/name";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/name-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Name table
 * Names are customers, suppliers, and other contacts
 */
export class NameService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToName(data: ANY): Name {
    return NameFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Name record`);
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Name);
  }

  /**
   * Get names from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed name data with pagination metadata
   */
  async getNames(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Name>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Name> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("name", mwParams);

      // Parse the response
      const names = data.map(this.dataCenterJsonToName);

      return {
        data: names,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching names:", error);
      throw error;
    }
  }
}