import { createContext, useContext } from "react";
import type { MoneyWorksChatContext } from "../../shared/types";

const MWChatContext = createContext<MoneyWorksChatContext | null>(null);

export const MWChatContextProvider = MWChatContext.Provider;

export function useMWChatContext(): MoneyWorksChatContext {
	const context = useContext(MWChatContext);

	if (!context) {
		throw new Error(
			"useMWChatContext must be used within a MWChatContextProvider. " +
				"Make sure to wrap your chat component with the provider.",
		);
	}

	return context;
}
