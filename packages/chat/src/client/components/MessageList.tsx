import React from "react";
import type { MoneyWorksMessage } from "../../shared/types";
import { AssistantMessage } from "./messages/AssistantMessage";
import { LoadingMessage } from "./messages/LoadingMessage";
import { UserMessage } from "./messages/UserMessage";

export interface MessageListProps {
	messages: MoneyWorksMessage[];
	isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
	return (
		<div className="space-y-6 px-4">
			{messages.map((message) => {
				if (message.role === "user") {
					return <UserMessage key={message.id} message={message} />;
				}

				if (message.role === "assistant") {
					return <AssistantMessage key={message.id} message={message} />;
				}

				return null;
			})}

			{isLoading && messages[messages.length - 1]?.role !== "assistant" && (
				<LoadingMessage />
			)}
		</div>
	);
}
