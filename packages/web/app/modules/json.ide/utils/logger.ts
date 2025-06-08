import { logger } from "~/components/datagrid/data-grid/logger";

// Create a namespace for our module
const MODULE_NAME = "json.ide";

export const jsonArtifactLogger = {
  info: (message: string, ...data: any[]) =>
    logger.info(`[${MODULE_NAME}] ${message}`, ...data),

  warn: (message: string, ...data: any[]) =>
    logger.warn(`[${MODULE_NAME}] ${message}`, ...data),

  error: (message: string, ...data: any[]) =>
    logger.error(`[${MODULE_NAME}] ${message}`, ...data),

  // Debug logging that will only be active in development
  // This doesn't log to the centralized logger to reduce noise
  debug: (message: string, ...data: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[${MODULE_NAME}] ${message}`, ...data);
    }
  },
};
