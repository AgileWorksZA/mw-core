import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Link, LinkFields } from "../../types/interface/link";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/link-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Link table
 * Link entries in MoneyWorks
 */
export class LinkService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLink(data: ANY): Link {
    return LinkFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Link record`);
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Link);
  }

  /**
   * Get links from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed link data with pagination metadata
   */
  async getLinks(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Link>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Link> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("link", mwParams);

      // Parse the response
      const links = data.map(this.dataCenterJsonToLink);

      return {
        data: links,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching links:", error);
      throw error;
    }
  }
}
