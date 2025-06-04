import { loadMoneyWorksConfig } from "@moneyworks/api/src/config/moneyworks.config";
import type { MoneyWorksConfig } from "@moneyworks/api/src/types/moneyworks";

// Export the same config used by the API
export const moneyWorksConfig: MoneyWorksConfig = loadMoneyWorksConfig();