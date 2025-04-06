import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Memo, MemoFields } from "../../types/interface/tables/memo";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/memo-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Memo table
 * Memo entries in MoneyWorks
 */
export class MemoService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToMemo(data: ANY): Memo {
    return MemoFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Memo record`);
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Memo);
  }

  dataCenterJsonToMemoUsingFields(fields: string[], data: ANY): Memo {
    return fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Memo record`);
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Memo);
  }

  /**
   * Get memos from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed memo data with pagination metadata
   */
  async getMemos(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Memo>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!MemoFields.includes(field as keyof typeof schema)) {
            throw new Error(
              `Invalid field '${field}' for Memo table. Valid fields are: ${MemoFields.join(", ")}`
            );
          }
        }
      }
      
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Memo> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("memo", mwParams);

      // Parse the response
      const memos = params.fields
        ? data.map((d) => this.dataCenterJsonToMemoUsingFields(params.fields as string[], d))
        : data.map(this.dataCenterJsonToMemo);

      // ToDo: Figure out why null values need to be filtered out
      return {
        data: memos.filter((m) => m.SequenceNumber),
        pagination,
      };
    } catch (error) {
      console.error("Error fetching memos:", error);
      throw error;
    }
  }
}
