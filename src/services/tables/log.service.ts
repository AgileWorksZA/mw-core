import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Log, LogFields } from "../../types/interface/log";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/log-schema";
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
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Log> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("log", mwParams);

      // Parse the response
      const logs = data.map(this.dataCenterJsonToLog);

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
