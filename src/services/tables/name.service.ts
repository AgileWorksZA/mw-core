import { enforceType } from "../../types/helpers";
import { type Name, NameFields } from "../../types/interface/name";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/name-schema";
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

  dataCenterJsonToName(data: any): Name {
    return NameFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Name record`);
      }
      (acc as any)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("name", mwParams);

      // Parse the response
      const names = data.map(this.dataCenterJsonToName);

      return {
        data: names,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching names:", error);
      throw error;
    }
  }

  /**
   * Get a single name by ID (code)
   *
   * @param code The name code to look up
   * @returns Name details
   */
  async getNameByCode(code: string) {
    try {
      const response = await this.api.export("name", {
        search: `code=\`${code}\``,
        format: "xml-verbose",
      });

      if (!response.data[0]) {
        throw new Error(`Name with code "${code}" not found`);
      }

      return this.dataCenterJsonToName(response.data[0]);
    } catch (error) {
      console.error(`Error fetching name with code ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get a single name by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Name details
   */
  async getNameBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("name", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(`Name with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const nameData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToName(nameData);
    } catch (error) {
      console.error(
        `Error fetching name with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }
}
