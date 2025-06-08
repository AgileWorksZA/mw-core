import fs from "node:fs";
import path from "node:path";

/**
 * Resource Manager for IDE files
 * Manages files stored in the public/resources directory
 */

export interface ResourceInfo {
  type: string;
  id: string;
  path: string;
  publicPath: string; // Path accessible from the browser
}

/**
 * Get the base directory for resources
 */
export function getResourceBaseDir(): string {
  return "./public/resources";
}

/**
 * Get the directory for a specific resource type
 */
export function getResourceTypeDir(type: string): string {
  return path.join(getResourceBaseDir(), type);
}

/**
 * Get the full path for a resource
 */
export function getResourcePath(type: string, id: string, extension: string = ".json"): ResourceInfo {
  const filename = `${id}${extension}`;
  const fullPath = path.join(getResourceTypeDir(type), filename);
  const publicPath = `/resources/${type}/${filename}`;
  
  return {
    type,
    id,
    path: fullPath,
    publicPath
  };
}

/**
 * Save a resource to the public folder
 */
export async function saveResource(
  type: string,
  id: string,
  content: string | Buffer,
  extension: string = ".json"
): Promise<ResourceInfo> {
  const resourceInfo = getResourcePath(type, id, extension);
  
  // Ensure directory exists
  fs.mkdirSync(getResourceTypeDir(type), { recursive: true });
  
  // Write the file
  fs.writeFileSync(resourceInfo.path, content, "utf8");
  
  return resourceInfo;
}

/**
 * Delete a resource from the public folder
 */
export async function deleteResource(
  type: string,
  id: string,
  extension: string = ".json"
): Promise<void> {
  const resourceInfo = getResourcePath(type, id, extension);
  
  if (fs.existsSync(resourceInfo.path)) {
    fs.unlinkSync(resourceInfo.path);
  }
}

/**
 * Delete multiple resources
 */
export async function deleteResources(resourcePaths: string[]): Promise<void> {
  for (const resourcePath of resourcePaths) {
    const fullPath = path.join("./public", resourcePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}

/**
 * Check if a resource exists
 */
export function resourceExists(
  type: string,
  id: string,
  extension: string = ".json"
): boolean {
  const resourceInfo = getResourcePath(type, id, extension);
  return fs.existsSync(resourceInfo.path);
}

/**
 * Read a resource from the public folder
 */
export async function readResource(
  type: string,
  id: string,
  extension: string = ".json"
): Promise<string> {
  const resourceInfo = getResourcePath(type, id, extension);
  return fs.readFileSync(resourceInfo.path, "utf8");
}

/**
 * List all resources of a specific type
 */
export function listResources(type: string): string[] {
  const dir = getResourceTypeDir(type);
  
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  return fs.readdirSync(dir);
}