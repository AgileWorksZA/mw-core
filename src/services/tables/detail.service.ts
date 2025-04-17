import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Detail,
  type DetailField,
  DetailFields,
} from "../../types/interface/tables/detail";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/detail-schema";
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Detail);
  }

  dataCenterJsonToDetailUsingFields(fields: DetailField[], data: ANY): Detail {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Detail record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!DetailFields.includes(field as DetailField)) {
            throw new Error(
              `Invalid field '${field}' for Detail table. Valid fields are: ${DetailFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Detail> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("detail", mwParams);

      // Parse the response
      const details = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToDetailUsingFields(
              params.fields as DetailField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToDetail);

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
