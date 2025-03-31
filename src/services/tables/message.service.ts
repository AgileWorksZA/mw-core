import { MoneyWorksApiService } from "../moneyworks-api.service";
import { Message, MessageFields } from "../../moneyworks/types/message";
import { MoneyWorksConfig, MoneyWorksQueryParams } from "../../types/moneyworks";
import { enforceType } from "../../moneyworks/helpers";
import schema from "../../moneyworks/optimized/message-schema";

/**
 * Service for interacting with MoneyWorks Message table
 * Messages represent internal system messages between users
 */
export class MessageService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToMessage(data: any): Message {
    return MessageFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(`Missing key ${key} in data center json for Message record`);
      }
      (acc as any)[key] = enforceType(data[key.toLowerCase()], schema[key] as "string")
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
        sort: params.sort || 'when',
        direction: params.order === "desc" ? "descending" : "ascending",
        format: "xml-verbose"
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("message", mwParams);

      // Parse the response
      const messages = data.map(this.dataCenterJsonToMessage);

      return {
        data: messages,
        pagination
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  /**
   * Get messages for a specific user
   *
   * @param username The username to look up
   * @returns Message entries for that user
   */
  async getMessagesByUser(username: string) {
    try {
      const response = await this.api.export("message", {
        search: `user=\`${username}\``,
        sort: 'when',
        direction: 'descending',
        format: "xml-verbose"
      });

      if (!response?.data?.length) {
        return { data: [], pagination: { total: 0, limit: 0, offset: 0 } };
      }

      // Parse the response
      const messages = Array.isArray(response.data) 
        ? response.data.map(this.dataCenterJsonToMessage)
        : [this.dataCenterJsonToMessage(response.data)];

      return {
        data: messages,
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching messages for user ${username}:`, error);
      throw error;
    }
  }

  /**
   * Get a single message by sequence number
   *
   * @param seqNumber The sequence number to look up
   * @returns Message details
   */
  async getMessageBySequenceNumber(seqNumber: number) {
    try {
      const response = await this.api.export("message", {
        search: `sequencenumber=${seqNumber}`,
        format: "xml-verbose"
      });

      if (!response?.data) {
        throw new Error(`Message with sequence number "${seqNumber}" not found`);
      }

      // With xml2js and explicitArray: false, we may get a single object instead of an array
      const messageData = Array.isArray(response.data) ? response.data[0] : response.data;
      return this.dataCenterJsonToMessage(messageData);
    } catch (error) {
      console.error(`Error fetching message with sequence number ${seqNumber}:`, error);
      throw error;
    }
  }
}