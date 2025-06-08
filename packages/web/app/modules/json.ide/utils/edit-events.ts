import type { JsonEditEvent, JsonObject, JsonValue } from "../types";
import { jsonArtifactLogger } from "./logger";

// Maintain a history of edit events for debugging and potential undo functionality
const editHistory: JsonEditEvent[] = [];
const MAX_HISTORY_SIZE = 100;

/**
 * ⚠️ CRITICAL: Log a JSON edit event WITHOUT modifying data.
 *
 * This function is designed as a NON-INVASIVE OBSERVER that logs edit events
 * for tracking and history purposes only. It NEVER modifies the actual data.
 *
 * All data updates must flow through store-kit for proper persistence.
 *
 * @param data The current data (for reference only - NOT MODIFIED)
 * @param event The edit event to log
 * @returns The original data (always unchanged)
 */
export function applyJsonEdit(
  data: JsonObject,
  event: JsonEditEvent,
): JsonObject {
  try {
    // Log the edit event
    logEditEvent(event);

    // Return the original data unchanged - actual updates happen at component level
    return data;
  } catch (error) {
    jsonArtifactLogger.error(
      `Error logging edit event: ${JSON.stringify(event)}`,
      error,
    );
    return data;
  }
}

/**
 * Log an edit event and add it to the history
 *
 * @param event The edit event to log
 */
function logEditEvent(event: JsonEditEvent): void {
  // Add to history
  editHistory.unshift(event);

  // Trim history if needed
  if (editHistory.length > MAX_HISTORY_SIZE) {
    editHistory.pop();
  }

  // Log based on event type
  switch (event.type) {
    case "update":
      jsonArtifactLogger.info(`Updated ${event.path}`, event.value);
      break;

    case "delete":
      jsonArtifactLogger.info(`Deleted ${event.path}`);
      break;

    case "rename":
      jsonArtifactLogger.info(
        `Renamed ${event.path}: ${event.oldKey} → ${event.newKey}`,
      );
      break;

    case "add":
      jsonArtifactLogger.info(`Added ${event.path}`, event.value);
      break;
  }
}

/**
 * Get the edit history
 *
 * @returns The edit history
 */
export function getEditHistory(): JsonEditEvent[] {
  return [...editHistory];
}

/**
 * Clear the edit history
 */
export function clearEditHistory(): void {
  editHistory.length = 0;
  jsonArtifactLogger.info("Edit history cleared");
}

/**
 * Create an update edit event
 *
 * @param path Path to update
 * @param value New value
 * @returns The edit event
 */
export function createUpdateEvent(
  path: string,
  value: JsonValue,
): JsonEditEvent {
  return {
    type: "update",
    path,
    value,
  };
}

/**
 * Create a delete edit event
 *
 * @param path Path to delete
 * @returns The edit event
 */
export function createDeleteEvent(path: string): JsonEditEvent {
  return {
    type: "delete",
    path,
  };
}

/**
 * Create a rename edit event
 *
 * @param path Path to parent object
 * @param oldKey Old key name
 * @param newKey New key name
 * @returns The edit event
 */
export function createRenameEvent(
  path: string,
  oldKey: string,
  newKey: string,
): JsonEditEvent {
  return {
    type: "rename",
    path,
    oldKey,
    newKey,
  };
}

/**
 * Create an add edit event
 *
 * @param path Path to add at
 * @param value Value to add
 * @returns The edit event
 */
export function createAddEvent(path: string, value: JsonValue): JsonEditEvent {
  return {
    type: "add",
    path,
    value,
  };
}
