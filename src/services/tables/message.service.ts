import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Message, MessageFields } from "../../types/interface/message";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/message-schema";
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
        console.error(`Missing key ${key} in data center json for record`);
      }
      (acc as ANY)[key] = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
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
  }) {
    try {
      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Message> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose",
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("message", mwParams);

      // Parse the response
      const messages = data.map(this.dataCenterJsonToMessage);

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
