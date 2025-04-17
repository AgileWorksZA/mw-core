import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import {
  type Message,
  MessageFields,
} from "../../types/interface/tables/message";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/message-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Message table
 * Messages represent internal system messages between users
 */
export class MessageService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToMessage(data: ANY): Message {
    return MessageFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Message record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Message);
  }

  dataCenterJsonToMessageUsingFields(fields: string[], data: ANY): Message {
    return fields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Message record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Message);
  }

  /**
   * Get messages from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed message data with pagination metadata
   */
  async getMessages(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Message>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!MessageFields.includes(field as keyof typeof schema)) {
            throw new Error(
              `Invalid field '${field}' for Message table. Valid fields are: ${MessageFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Message> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("message", mwParams);

      // Parse the response
      const messages = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToMessageUsingFields(
              params.fields as string[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToMessage);

      return {
        data: messages,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}
