import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type General,
  type GeneralField,
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as General);
  }

  dataCenterJsonToGeneralUsingFields(
    fields: GeneralField[],
    data: ANY,
  ): General {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for General record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!GeneralFields.includes(field as GeneralField)) {
            throw new Error(
              `Invalid field '${field}' for General table. Valid fields are: ${GeneralFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<General> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("general", mwParams);

      // Parse the response
      const generals = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToGeneralUsingFields(
              params.fields as GeneralField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToGeneral);

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
