/*
 * JSON Storage Adapter public API
 */

// Main adapter
export { JsonFileStorageAdapter } from "./adapter";
export { default as json_file_adapter } from "./adapter";

// React Router integration
export { createPOSTAction, createDELETEAction } from "./actions";

// Client utilities
export { useSyncDocument } from "./client";
