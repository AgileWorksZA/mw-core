import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Log, LogFields } from "../../types/interface/tables/log";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/log-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Log table
 * Log entries in MoneyWorks
 */
export class LogService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLog(data: ANY): Log {
    return LogFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Log record`);
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Log);
  }

  dataCenterJsonToLogUsingFields(fields: string[], data: ANY): Log {
    return fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Log record`);
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Log);
  }

  /**
   * Get logs from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed log data with pagination metadata
   */
  async getLogs(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Log>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!LogFields.includes(field as keyof typeof schema)) {
            throw new Error(
              `Invalid field '${field}' for Log table. Valid fields are: ${LogFields.join(", ")}`
            );
          }
        }
      }
      
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Log> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("log", mwParams);

      // Parse the response
      const logs = params.fields
        ? data.map((d) => this.dataCenterJsonToLogUsingFields(params.fields as string[], d))
        : data.map(this.dataCenterJsonToLog);

      return {
        data: logs,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching logs:", error);
      throw error;
    }
  }
}
