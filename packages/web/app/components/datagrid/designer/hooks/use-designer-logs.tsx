import React, { useState, useCallback, type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { logger } from "~/components/datagrid/data-grid/logger";

/**
 * Hook for managing logs in the Designer component
 * 
 * @param maxLogs - Maximum number of logs to keep (defaults to 100)
 * @returns Log state and utility functions
 */
export function useDesignerLogs(maxLogs = 100) {
  const [logs, setLogs] = useState<ReactNode[]>([]);
  
  /**
   * Add a log message with the specified level
   */
  const log = useCallback((message: string, level: "info" | "warning" | "error" | "warn" = "info") => {
    // Map UI log levels to logger levels
    const loggerLevel = level === "warning" ? "warn" : (level as "info" | "warn" | "error");
    
    // Log to our centralized logger
    if (loggerLevel === "info") {
      logger.info(message);
    } else if (loggerLevel === "warn") {
      logger.warn(message);
    } else if (loggerLevel === "error") {
      logger.error(message);
    }
    
    // Also update local state for UI rendering
    setLogs((prevLogs) => [
      <span
        className={cn(
          "text-xs",
          level === "error"
            ? "text-red-600"
            : level === "warning" || level === "warn"
              ? "text-yellow-600"
              : "text-green-600",
        )}
        key={`log-${prevLogs.length}`}
      >
        {message}
      </span>,
      ...prevLogs.slice(0, maxLogs - 1),
    ]);
  }, [maxLogs]);
  
  /**
   * Clear all logs
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
    // Clear the global logger too
    logger.clearLogs();
  }, []);
  
  return { logs, log, clearLogs };
}