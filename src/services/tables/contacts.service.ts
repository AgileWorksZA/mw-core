import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Contacts,
  type ContactsField,
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
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Contacts);
  }

  dataCenterJsonToContactsUsingFields(
    fields: ContactsField[],
    data: ANY,
  ): Contacts {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Contacts record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
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
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!ContactsFields.includes(field as ContactsField)) {
            throw new Error(
              `Invalid field '${field}' for Contacts table. Valid fields are: ${ContactsFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Contacts> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("contacts", mwParams);

      // Parse the response
      const contacts = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToContactsUsingFields(
              params.fields as ContactsField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToContacts);

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
