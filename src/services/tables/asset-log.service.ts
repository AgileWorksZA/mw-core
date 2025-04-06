import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type AssetLog,
  type AssetLogField,
  AssetLogFields,
} from "../../types/interface/tables/assetlog";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/asset-log-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks AssetLog table
 * AssetLog represents the history of asset transactions
 */
export class AssetLogService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToAssetLog(data: ANY): AssetLog {
    return AssetLogFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AssetLog record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as AssetLog);
  }

  dataCenterJsonToAssetLogUsingFields(
    fields: AssetLogField[],
    data: ANY,
  ): AssetLog {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for AssetLog record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as AssetLog);
  }

  /**
   * Get asset logs from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed asset log data with pagination metadata
   */
  async getAssetLogs(params: {
    limit?: number;
    offset?: number;
    search?: Partial<AssetLog>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!AssetLogFields.includes(field as AssetLogField)) {
            throw new Error(
              `Invalid field '${field}' for AssetLog table. Valid fields are: ${AssetLogFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<AssetLog> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("assetlog", mwParams);

      // Parse the response
      const assetLogs = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToAssetLogUsingFields(
              params.fields as AssetLogField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToAssetLog);

      return {
        data: assetLogs,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching asset logs:", error);
      throw error;
    }
  }
}
