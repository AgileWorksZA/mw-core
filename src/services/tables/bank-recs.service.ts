import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type BankRecs, BankRecsFields } from "../../types/interface/bank-recs";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/bankrecs-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks BankRecs table
 * Bank reconciliations represent bank statement reconciliations
 */
export class BankRecsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToBankRecs(data: ANY): BankRecs {
    return BankRecsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for BankRecs record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as BankRecs);
  }

  /**
   * Get bankRecs from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed bank-recs data with pagination metadata
   */
  async getBankRecs(params: {
    limit?: number;
    offset?: number;
    search?: Partial<BankRecs>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<BankRecs> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("bankrecs", mwParams);

      // Parse the response
      const bankRecs = data.map(this.dataCenterJsonToBankRecs);

      return {
        data: bankRecs,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching bankRecs:", error);
      throw error;
    }
  }
}
