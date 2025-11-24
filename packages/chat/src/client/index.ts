// Client-side exports
export { MoneyWorksChat } from "./components/MoneyWorksChat";
export { useMoneyWorksChat } from "./hooks/useMoneyWorksChat";
export {
	useMWChatContext,
	MWChatContextProvider,
} from "./hooks/useMWChatContext";

// Re-export types that client code needs
export type {
	MoneyWorksMessage,
	MoneyWorksDataAttachment,
	StreamingChunk,
	MoneyWorksChatContext,
} from "../shared/types";
