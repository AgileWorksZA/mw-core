import { enforceType } from "../../types/helpers";
import { type Lists, ListsFields } from "../../types/interface/lists";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/lists-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Lists table
 * Lists represent dropdown lists and their values
 */
export class ListsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToLists(data: any): Lists {
    return ListsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Lists record`,
        );
      }
      (acc as any)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Lists);
  }

  /**
   * Get lists from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed lists data with pagination metadata
   */
  async getLists(params: {
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
      const { data, pagination } = await this.api.export("lists", mwParams);

      // Parse the response
      const lists = data.map(this.dataCenterJsonToLists);

      return {
        data: lists,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching lists:", error);
      throw error;
    }
  }

  /**
   * Get lists by list name
   *
   * @param listName The list name to look up
   * @returns Lists entries for that list name
   */
  async getListsByName(listName: string) {
    try {
      const response = await this.api.export("lists", {
        search: `listname=\`${listName}\``,
        format: "xml-verbose",
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const lists = Array.isArray(response.data)
        ? response.data.map(this.dataCenterJsonToLists)
        : [this.dataCenterJsonToLists(response.data)];

      return {
        data: lists,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error(`Error fetching lists for list name ${listName}:`, error);
      throw error;
    }
  }

  /**
   * Get a single list entry by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Lists details
   */
  async getListBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("lists", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose",
      });

      if (!response?.data) {
        throw new Error(
          `Lists entry with sequence number "${seqNumber}" not found`,
        );
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const listsData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return this.dataCenterJsonToLists(listsData);
    } catch (error) {
      console.error(
        `Error fetching list entry with sequence number ${seqNumber}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get unique list names
   *
   * @returns Array of unique list names
   */
  async getListNames() {
    try {
      // First get all lists
      const { data } = await this.getLists({ limit: 1000 });

      // Extract unique list names
      const uniqueNames = [...new Set(data.map((list) => list.ListName))];

      return {
        data: uniqueNames.map((name) => ({ name })),
      };
    } catch (error) {
      console.error("Error fetching list names:", error);
      throw error;
    }
  }
}
