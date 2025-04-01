import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type OffLedger,
  OffLedgerFields,
} from "../../types/interface/off-ledger";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/offledger-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks OffLedger table
 * Off ledger items represent items not in the general ledger
 */
export class OffLedgerService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToOffLedger(data: ANY): OffLedger {
    return OffLedgerFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for OffLedger record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as OffLedger);
  }

  /**
   * Get offLedgerItems from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed off-ledger data with pagination metadata
   */
  async getOffLedgerItems(params: {
    limit?: number;
    offset?: number;
    search?: Partial<OffLedger>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<OffLedger> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export(
        "off-ledger",
        mwParams,
      );

      // Parse the response
      const offLedgerItems = data.map(this.dataCenterJsonToOffLedger);

      return {
        data: offLedgerItems,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching offLedgerItems:", error);
      throw error;
    }
  }
}
