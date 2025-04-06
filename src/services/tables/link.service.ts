import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Link, type LinkField, LinkFields } from "../../types/interface/tables/link";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/link-schema";
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Link);
  }

  dataCenterJsonToLinkUsingFields(
    fields: LinkField[],
    data: ANY,
  ): Link {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(`Missing key ${key} in data center json for Link record`);
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!LinkFields.includes(field as LinkField)) {
            throw new Error(
              `Invalid field '${field}' for Link table. Valid fields are: ${LinkFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Link> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("link", mwParams);

      // Parse the response
      const links = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToLinkUsingFields(
              params.fields as LinkField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToLink);

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
