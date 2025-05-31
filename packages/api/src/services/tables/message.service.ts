import { type Message, MessageFields } from "../../types/interface/tables/message";
import schema from "../../types/optimized/table/message-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Message table
 * Messages represent internal system messages between users
 */
export class MessageService extends TableService<Message> {
  constructor() {
    super("message", schema, MessageFields);
  }
}
