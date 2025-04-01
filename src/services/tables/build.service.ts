import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Build, BuildFields } from "../../types/interface/build";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/build-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Ubuild table
 * Ubuild entries in MoneyWorks
 */
export class BuildService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToUbuild(data: ANY): Build {
    return BuildFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Ubuild record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Build);
  }

  /**
   * Get builds from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed build data with pagination metadata
   */
  async getBuilds(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Build>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Build> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("build", mwParams);

      // Parse the response
      const builds = data.map(this.dataCenterJsonToUbuild);

      return {
        data: builds,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching builds:", error);
      throw error;
    }
  }
}
