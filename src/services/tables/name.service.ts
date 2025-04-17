import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Name, NameFields } from "../../types/interface/tables/name";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/name-schema";
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Name);
  }

  dataCenterJsonToNameUsingFields(fields: string[], data: ANY): Name {
    return fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Name record`);
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!NameFields.includes(field as keyof typeof schema)) {
            throw new Error(
              `Invalid field '${field}' for Name table. Valid fields are: ${NameFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Name> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("name", mwParams);

      // Parse the response
      const names = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToNameUsingFields(params.fields as string[], d),
          )
        : data.map(this.dataCenterJsonToName);

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
