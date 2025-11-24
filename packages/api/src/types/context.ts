/**
 * Extended Elysia Context Types
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";

declare module "elysia" {
	interface Context {
		mwClient?: SmartMoneyWorksClient;
		connectionId?: string;
	}
}

// Export a type that includes our extended context
export interface MoneyWorksContext {
	mwClient?: SmartMoneyWorksClient;
	connectionId?: string;
}
