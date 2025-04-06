import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Contacts,
  ContactsFields,
} from "../../types/interface/tables/contacts";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/contacts-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Contacts table
 * Contacts represent GL contacts in the chart of contacts
 */
export class ContactsService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToContacts(data: ANY): Contacts {
    return ContactsFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Contacts record`,
        );
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      return acc;
    }, {} as Contacts);
  }

  /**
   * Get contactss from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed contacts data with pagination metadata
   */
  async getContacts(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Contacts>;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Contacts> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("contacts", mwParams);

      // Parse the response
      const contacts = data.map(this.dataCenterJsonToContacts);

      return {
        data: contacts,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }
}
