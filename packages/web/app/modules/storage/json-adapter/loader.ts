/*
 * React Router loader for JSON storage adapter
 */
import { createStorageLoader } from "~/modules/storage/loader";
import json_file_adapter from "./adapter";

// Re-export the generic loader creator for flexibility
export { createStorageLoader };

// Export a pre-configured loader using the default JSON adapter
export const loader = createStorageLoader(json_file_adapter);
