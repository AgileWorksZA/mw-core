import { MoneyWorksApiService } from "./moneyworks-api.service";
import { Log, LogFields } from "../moneyworks/types/log";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../types/moneyworks";
import { enforceType } from "../moneyworks/helpers";
import schema from "../moneyworks/optimized/log-schema";

/**
 * Service for interacting with MoneyWorks Log table
 * Logs record system activities and events
 */
export class LogService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLog(data: any): Log {
    return LogFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Log record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
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
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort || 'when',
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose"
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("log", mwParams);

      // Parse the response
      const logs = data.map(this.dataCenterJsonToLog);

      return {
        data: logs,
        pagination
      };
    } catch (error) {
      console.error("Error fetching logs:", error);
      throw error;
    }
  }

  /**
   * Get logs for a specific user
   *
   * @param username The username to look up
   * @returns Log entries for that user
   */
  async getLogsByUser(username: string) {
    try {
      const response = await this.api.export("log", {
        search: `user=\`${username}\``,
        sort: 'when',
        direction: 'descending',
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const logs = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToLog)
        : [this.dataCenterJsonToLog(response.data)];

      return {
        data: logs,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching logs for user ${username}:`, error);
      throw error;
    }
  }

  /**
   * Get a single log entry by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Log details
   */
  async getLogBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("log", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Log entry with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const logData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToLog(logData);
    } catch (error) {
      console.error(`Error fetching log with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}