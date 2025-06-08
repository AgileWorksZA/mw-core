/*
 * JSON Storage Adapter server-only exports
 * This file should only be imported in server-side code (routes, loaders, actions)
 */

export { loader, POST, DELETE } from "./storage.server";
export { json_file_adapter } from "./storage.server";