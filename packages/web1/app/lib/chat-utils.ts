import type { MoneyWorksMessage } from "@moneyworks/chat";

export function formatConversationForCopy(
	messages: MoneyWorksMessage[],
): string {
	const conversationText = messages
		.filter((message) => message.id !== "welcome") // Exclude welcome messages
		.map((message) => {
			const role = message.role === "user" ? "user" : "agent";
			const content = message.content.trim();

			if (!content) {
				return "";
			}

			return `${role}: ${content}`;
		})
		.filter((line) => line.length > 0) // Remove empty lines
		.join("\n\n");

	return conversationText;
}
