/*
 * Server-side exports for JSON storage adapter
 */
import json_file_adapter from "./adapter";
import { createStorageLoader } from "~/modules/storage/loader";
import { createPOSTAction, createDELETEAction } from "./actions";

// Export the adapter instance with legacy name for compatibility
export default json_file_adapter;
export { json_file_adapter };

// Export pre-configured React Router handlers
export const loader = createStorageLoader(json_file_adapter);
export const POST = createPOSTAction(json_file_adapter);
export const DELETE = createDELETEAction(json_file_adapter);
