import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type OffLedger,
  type OffLedgerField,
  OffLedgerFields,
} from "../../types/interface/tables/offledger";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/offledger-schema";
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

  dataCenterJsonToOffLedgerUsingFields(
    fields: OffLedgerField[],
    data: ANY,
  ): OffLedger {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for OffLedger record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as OffLedger);
  }

  dataCenterJsonToOffLedger(data: ANY): OffLedger {
    return OffLedgerFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for OffLedger record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<OffLedger> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("offledger", mwParams);

      // Parse the response
      // If we're using custom fields, use the fields-specific mapper
      // Otherwise, map the full data to offLedger objects
      const offLedgerItems = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToOffLedgerUsingFields(
              params.fields as OffLedgerField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToOffLedger);

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
