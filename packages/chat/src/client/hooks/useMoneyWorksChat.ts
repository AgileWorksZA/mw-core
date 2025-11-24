import { useCallback, useEffect, useRef, useState } from "react";
import { useSubmit } from "react-router";
import type {
	ChatRequest,
	MoneyWorksMessage,
	StreamingChunk,
} from "../../shared/types";

export interface UseMoneyWorksChatOptions {
	apiEndpoint?: string;
	initialMessages?: MoneyWorksMessage[];
	onError?: (error: Error) => void;
	onMessage?: (message: MoneyWorksMessage) => void;
}

export function useMoneyWorksChat(options: UseMoneyWorksChatOptions = {}) {
	const {
		apiEndpoint = "/api/chat",
		initialMessages = [],
		onError,
		onMessage,
	} = options;

	const [messages, setMessages] =
		useState<MoneyWorksMessage[]>(initialMessages);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const submit = useSubmit();
	const abortControllerRef = useRef<AbortController | null>(null);
	const currentMessageRef = useRef<MoneyWorksMessage | null>(null);

	const sendMessage = useCallback(
		async (content: string) => {
			// Abort any ongoing request
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Create new user message
			const userMessage: MoneyWorksMessage = {
				id: crypto.randomUUID(),
				role: "user",
				content,
				timestamp: new Date(),
			};

			// Add user message to state
			setMessages((prev) => [...prev, userMessage]);
			setIsLoading(true);
			setError(null);

			// Create assistant message placeholder
			const assistantMessage: MoneyWorksMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: "",
				timestamp: new Date(),
				streaming: true,
			};

			currentMessageRef.current = assistantMessage;
			setMessages((prev) => [...prev, assistantMessage]);

			try {
				// Create abort controller for this request
				const abortController = new AbortController();
				abortControllerRef.current = abortController;

				// Prepare request
				const chatRequest: ChatRequest = {
					messages: [...messages, userMessage].map((m) => ({
						role: m.role,
						content: m.content,
					})),
				};

				// Create form data for React Router
				const formData = new FormData();
				formData.append("request", JSON.stringify(chatRequest));

				// Submit using React Router's submit (will trigger the action)
				const response = await fetch(apiEndpoint, {
					method: "POST",
					body: formData,
					signal: abortController.signal,
				});

				if (!response.ok) {
					throw new Error(`Chat request failed: ${response.statusText}`);
				}

				// Handle SSE stream
				const reader = response.body?.getReader();
				const decoder = new TextDecoder();

				if (!reader) {
					throw new Error("No response body");
				}

				let buffer = "";

				while (true) {
					const { done, value } = await reader.read();

					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() || "";

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							const data = line.slice(6);

							if (data === "[DONE]") {
								continue;
							}

							try {
								const chunk: StreamingChunk = JSON.parse(data);
								handleStreamChunk(chunk);
							} catch (e) {
								console.error("Failed to parse SSE chunk:", e);
							}
						}
					}
				}

				// Mark message as complete
				if (currentMessageRef.current) {
					const messageId = currentMessageRef.current.id;
					setMessages((prev) =>
						prev.map((m) =>
							m.id === messageId ? { ...m, streaming: false } : m,
						),
					);
				}
			} catch (err) {
				if (err instanceof Error && err.name === "AbortError") {
					// Request was aborted, ignore
					return;
				}

				const error = err instanceof Error ? err : new Error("Unknown error");
				setError(error);
				onError?.(error);

				// Remove the assistant message if it's empty
				if (currentMessageRef.current && !currentMessageRef.current.content) {
					const messageId = currentMessageRef.current.id;
					setMessages((prev) => prev.filter((m) => m.id !== messageId));
				}
			} finally {
				setIsLoading(false);
				abortControllerRef.current = null;
				currentMessageRef.current = null;
			}
		},
		[messages, apiEndpoint, onError],
	);

	const handleStreamChunk = useCallback(
		(chunk: StreamingChunk) => {
			if (!currentMessageRef.current) return;

			const messageId = currentMessageRef.current.id;

			switch (chunk.type) {
				case "text":
					if (chunk.content) {
						setMessages((prev) =>
							prev.map((m) =>
								m.id === messageId
									? { ...m, content: m.content + chunk.content }
									: m,
							),
						);
					}
					break;

				case "tool_start":
					setMessages((prev) =>
						prev.map((m) =>
							m.id === messageId
								? {
										...m,
										toolInvocations: [
											...(m.toolInvocations || []),
											{
												toolName: chunk.toolName!,
												args: chunk.toolArgs || {},
												state: "pending" as const,
											},
										],
									}
								: m,
						),
					);
					break;

				case "tool_result":
					setMessages((prev) =>
						prev.map((m) =>
							m.id === messageId
								? {
										...m,
										toolInvocations: m.toolInvocations?.map((ti) =>
											ti.toolName === chunk.toolName
												? {
														...ti,
														state: "completed" as const,
														result: {
															success: true,
															data: chunk.toolResult,
														},
													}
												: ti,
										),
									}
								: m,
						),
					);
					break;

				case "mw_data":
					if (chunk.mwData) {
						setMessages((prev) =>
							prev.map((m) =>
								m.id === messageId ? { ...m, mwData: chunk.mwData } : m,
							),
						);
					}
					break;

				case "error":
					if (chunk.error) {
						const error = new Error(chunk.error);
						setError(error);
						onError?.(error);
					}
					break;
			}

			// Notify of message update
			if (currentMessageRef.current && onMessage) {
				const messageId = currentMessageRef.current.id;
				const updatedMessage = messages.find((m) => m.id === messageId);
				if (updatedMessage) {
					onMessage(updatedMessage);
				}
			}
		},
		[messages, onError, onMessage],
	);

	const clearMessages = useCallback(() => {
		setMessages([]);
		setError(null);
	}, []);

	const cancelStream = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			setIsLoading(false);
		}
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	return {
		messages,
		sendMessage,
		isLoading,
		error,
		clearMessages,
		cancelStream,
	};
}
