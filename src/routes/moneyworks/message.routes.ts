import { MessageService } from "../../services/tables/message.service";
import { messageObject } from "../../types/constants.eden";
import type { Message } from "../../types/interface/tables/message";
import { moneyworksRoute } from "./base/moneyworks.route";

export const messageRoutes = moneyworksRoute<Message, "Message", typeof messageObject>(
  "Message",
  messageObject,
  new MessageService(),
  {
    summary: "Messages",
    description: "Manages recurring messages, reminders, and scheduled tasks within MoneyWorks.",
    tags: ["System"],
  },
);
