import { loadMoneyWorksConfig } from "../../../config/moneyworks.config";
import type { ANY } from "../../../types/hack";
import { enforceType } from "../../../types/helpers";
import type { MoneyWorksQueryParams } from "../../../types/moneyworks";
import { MoneyWorksApiService } from "../../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Account table
 * Accounts represent GL accounts in the chart of accounts
 */
export class TableService<
  T extends object = object,
  S extends Record<keyof T, string> = Record<keyof T, string>,
  FIELD extends keyof T = keyof T,
> {
  private readonly api: MoneyWorksApiService;
  private readonly schema: S;
  private readonly fields: FIELD[];
  private readonly table: string;

  constructor(table: string, schema: S, fields: FIELD[]) {
    this.api = new MoneyWorksApiService(loadMoneyWorksConfig());
    this.schema = schema;
    this.fields = fields;
    this.table = table;
  }
  dataCenterJsonToTableUsingFields(fields: FIELD[], data: ANY): T {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.warn(
          `Missing key ${String(key)} in data center json for Account record`,
        );
      }
      const value = enforceType(data[key], this.schema[key] as "string");
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as T);
  }
  dataCenterJsonToTable(data: ANY): T {
    return this.fields.reduce((acc, key) => {
      if (data[String(key).toLowerCase()] === undefined) {
        console.warn(
          `Missing key ${String(key).toLowerCase()} in data center json for Account record`,
        );
      }
      const value = enforceType(
        data[String(key).toLowerCase()],
        this.schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as T);
  }
  async getData(params: {
    limit?: number;
    offset?: number;
    search?: Partial<T>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[]; // Array of field names to include in the response
    skip_validation?: boolean; // Skip validation of fields
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<T> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        // fields: params.fields ?? (this.fields as string[]),
      };

      // Call MoneyWorks API
      const response = await this.api.export(this.table, mwParams);

      // Parse the response
      // If we're using custom fields, the data is already in the correct format
      // Otherwise, map the full data to objects
      const data = params.fields
        ? response.data.map((d) =>
            this.dataCenterJsonToTableUsingFields(params.fields as FIELD[], d),
          )
        : response.data.map((d) => this.dataCenterJsonToTable(d));

      return {
        data,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error(`Error fetching ${this.table}:`, error);
      throw error;
    }
  }
}
