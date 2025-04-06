import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Ledger, type LedgerField, LedgerFields } from "../../types/interface/tables/ledger";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/ledger-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Ledger table
 * Ledger entries in MoneyWorks
 */
export class LedgerService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLedger(data: ANY): Ledger {
    return LedgerFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Ledger record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Ledger);
  }

  dataCenterJsonToLedgerUsingFields(
    fields: LedgerField[],
    data: ANY,
  ): Ledger {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Ledger record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Ledger);
  }

  /**
   * Get ledgers from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed ledger data with pagination metadata
   */
  async getLedgers(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Ledger>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!LedgerFields.includes(field as LedgerField)) {
            throw new Error(
              `Invalid field '${field}' for Ledger table. Valid fields are: ${LedgerFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Ledger> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("ledger", mwParams);

      // Parse the response
      const ledgers = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToLedgerUsingFields(
              params.fields as LedgerField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToLedger);

      return {
        data: ledgers,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching ledgers:", error);
      throw error;
    }
  }
}
