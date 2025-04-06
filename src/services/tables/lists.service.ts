import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Lists, type ListsField, ListsFields } from "../../types/interface/tables/lists";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/lists-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Lists table
 * Lists entries in MoneyWorks
 */
export class ListsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLists(data: ANY): Lists {
    return ListsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Lists record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Lists);
  }

  dataCenterJsonToListsUsingFields(
    fields: ListsField[],
    data: ANY,
  ): Lists {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Lists record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Lists);
  }

  /**
   * Get listss from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed lists data with pagination metadata
   */
  async getLists(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Lists>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!ListsFields.includes(field as ListsField)) {
            throw new Error(
              `Invalid field '${field}' for Lists table. Valid fields are: ${ListsFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Lists> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("lists", mwParams);

      // Parse the response
      const lists = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToListsUsingFields(
              params.fields as ListsField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToLists);

      return {
        data: lists,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching lists:", error);
      throw error;
    }
  }
}
