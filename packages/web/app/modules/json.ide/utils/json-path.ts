import { jsonArtifactLogger } from './logger';
import type { JsonValue } from '../types';

/**
 * Evaluates a JSON path expression against the given data
 * 
 * Supported syntax:
 * - $ - Root element
 * - .property - Select property
 * - ['property'] - Select property (alternative syntax)
 * - [index] - Select array element by index
 * - ..property - Recursive descent to property
 * - * - Wildcard for all properties/elements
 * 
 * @param data The JSON data to query
 * @param path The JSON path expression
 * @returns The result of the query (can be any JSON value or array of values)
 */
export function queryJsonPath(data: any, path: string): JsonValue | JsonValue[] {
  try {
    // Parse the path into segments
    const segments = parseJsonPath(path);
    
    // Start with the root element
    let results: any[] = [data];
    
    // Process each segment
    for (const segment of segments) {
      // Collect new results for this segment
      const newResults: any[] = [];
      
      for (const item of results) {
        if (segment.type === 'property') {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            if (segment.name === '*') {
              // Wildcard property: include all properties
              for (const key in item) {
                newResults.push(item[key]);
              }
            } else if (segment.name in item) {
              // Specific property
              newResults.push(item[segment.name]);
            }
          }
        } else if (segment.type === 'index') {
          if (Array.isArray(item) && segment.index !== undefined) {
            if (segment.index === '*') {
              // Wildcard index: include all elements
              newResults.push(...item);
            } else if (segment.index >= 0 && segment.index < item.length) {
              // Specific index
              newResults.push(item[segment.index]);
            }
          }
        } else if (segment.type === 'recursive' && segment.name) {
          // Recursive descent
          const matches = findAllByProperty(item, segment.name);
          newResults.push(...matches);
        }
      }
      
      // Replace results with new results
      results = newResults;
    }
    
    // Return array if multiple results, or single value if only one result
    return results.length === 1 ? results[0] : results;
  } catch (error) {
    jsonArtifactLogger.error(`Error evaluating JSON path: ${path}`, error);
    return null;
  }
}

/**
 * Parse a JSON path string into segments
 * 
 * @param path JSON path string
 * @returns Array of parsed segments
 */
function parseJsonPath(path: string): Array<{
  type: 'property' | 'index' | 'recursive';
  name?: string;
  index?: number | string;
}> {
  const segments: Array<{
    type: 'property' | 'index' | 'recursive';
    name?: string;
    index?: number | string;
  }> = [];
  
  // Handle empty path or just root
  if (!path || path === '$') {
    return segments;
  }
  
  // Ensure path starts with $
  if (!path.startsWith('$')) {
    path = '$' + path;
  }
  
  // Regular expressions for matching segments
  const dotNotation = /\.([a-zA-Z0-9_*]+)/g;
  const bracketPropertyNotation = /\['([^']+)'\]|\["([^"]+)"\]/g;
  const bracketIndexNotation = /\[(\d+|\*)\]/g;
  const recursiveNotation = /\.\.([a-zA-Z0-9_*]+)/g;
  
  // Match dot notation
  let match;
  while ((match = dotNotation.exec(path)) !== null) {
    segments.push({ type: 'property', name: match[1] });
  }
  
  // Match bracket property notation
  dotNotation.lastIndex = 0;
  while ((match = bracketPropertyNotation.exec(path)) !== null) {
    segments.push({ type: 'property', name: match[1] || match[2] });
  }
  
  // Match bracket index notation
  bracketPropertyNotation.lastIndex = 0;
  while ((match = bracketIndexNotation.exec(path)) !== null) {
    const indexValue = match[1];
    segments.push({ 
      type: 'index', 
      index: indexValue === '*' ? '*' : parseInt(indexValue, 10)
    });
  }
  
  // Match recursive notation
  bracketIndexNotation.lastIndex = 0;
  while ((match = recursiveNotation.exec(path)) !== null) {
    segments.push({ type: 'recursive', name: match[1] });
  }
  
  // Sort segments by their position in the original string
  segments.sort((a, b) => {
    const aIndex = path.indexOf(a.type === 'property' ? '.' + a.name : 
                               a.type === 'index' ? '[' + a.index + ']' : 
                               '..' + a.name);
    const bIndex = path.indexOf(b.type === 'property' ? '.' + b.name : 
                               b.type === 'index' ? '[' + b.index + ']' : 
                               '..' + b.name);
    return aIndex - bIndex;
  });
  
  return segments;
}

/**
 * Find all occurrences of a property in an object (recursive)
 * 
 * @param obj The object to search
 * @param propertyName The property name to find
 * @returns Array of values found
 */
function findAllByProperty(obj: any, propertyName: string): any[] {
  const results: any[] = [];
  
  if (!obj || typeof obj !== 'object') {
    return results;
  }
  
  // Helper function for recursive search
  function search(current: any) {
    if (!current || typeof current !== 'object') {
      return;
    }
    
    if (Array.isArray(current)) {
      // Search each array element
      for (const item of current) {
        search(item);
      }
    } else {
      // Check if current object has the property
      if (propertyName === '*') {
        // For wildcard, include all properties
        for (const key in current) {
          results.push(current[key]);
        }
      } else if (propertyName in current) {
        results.push(current[propertyName]);
      }
      
      // Search nested objects
      for (const key in current) {
        search(current[key]);
      }
    }
  }
  
  search(obj);
  return results;
}

/**
 * Highlights paths in a JSON object
 * 
 * @param data The JSON data
 * @param path The JSON path to highlight
 * @returns Object with highlight paths
 */
export function getHighlightedPaths(data: any, path: string): string[] {
  try {
    // Parse the path into segments
    const segments = parseJsonPath(path);
    
    // Start with the root path
    let paths: string[] = [''];
    
    // Build up the highlight paths
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const newPaths: string[] = [];
      
      for (const currentPath of paths) {
        if (segment.type === 'property' && segment.name) {
          if (segment.name === '*') {
            // Wildcard property: add all properties
            const node = getNodeAtPath(data, currentPath);
            if (node && typeof node === 'object' && !Array.isArray(node)) {
              for (const key in node) {
                newPaths.push(`${currentPath}${currentPath ? '.' : ''}${key}`);
              }
            }
          } else {
            newPaths.push(`${currentPath}${currentPath ? '.' : ''}${segment.name}`);
          }
        } else if (segment.type === 'index' && segment.index !== undefined) {
          if (segment.index === '*') {
            // Wildcard index: add all array elements
            const node = getNodeAtPath(data, currentPath);
            if (Array.isArray(node)) {
              for (let j = 0; j < node.length; j++) {
                newPaths.push(`${currentPath}[${j}]`);
              }
            }
          } else {
            newPaths.push(`${currentPath}[${segment.index}]`);
          }
        } else if (segment.type === 'recursive' && segment.name) {
          // Recursive descent: find all matching paths
          const recursivePaths = findAllPathsByProperty(data, segment.name, currentPath);
          newPaths.push(...recursivePaths);
        }
      }
      
      paths = newPaths;
    }
    
    return paths;
  } catch (error) {
    jsonArtifactLogger.error(`Error getting highlighted paths for: ${path}`, error);
    return [];
  }
}

/**
 * Get the node at a specific path
 * 
 * @param data The JSON data
 * @param path The path to the node (dot notation)
 * @returns The node at the path
 */
function getNodeAtPath(data: any, path: string): any {
  if (!path) {
    return data;
  }
  
  const parts = path.split('.');
  let current = data;
  
  for (const part of parts) {
    const indexMatch = part.match(/(.+?)\[(\d+)\]$/);
    
    if (indexMatch) {
      // Handle array indexing (e.g., "items[0]")
      const arrayName = indexMatch[1];
      const index = parseInt(indexMatch[2], 10);
      
      if (!current[arrayName] || !Array.isArray(current[arrayName])) {
        return undefined;
      }
      
      current = current[arrayName][index];
    } else {
      // Regular property access
      if (!current || typeof current !== 'object' || !(part in current)) {
        return undefined;
      }
      
      current = current[part];
    }
  }
  
  return current;
}

/**
 * Find all paths to a property in an object (recursive)
 * 
 * @param obj The object to search
 * @param propertyName The property name to find
 * @param basePath The base path to prepend
 * @returns Array of paths found
 */
function findAllPathsByProperty(obj: any, propertyName: string, basePath: string = ''): string[] {
  const paths: string[] = [];
  
  if (!obj || typeof obj !== 'object') {
    return paths;
  }
  
  // Helper function for recursive search
  function search(current: any, path: string) {
    if (!current || typeof current !== 'object') {
      return;
    }
    
    if (Array.isArray(current)) {
      // Search each array element
      for (let i = 0; i < current.length; i++) {
        search(current[i], `${path}[${i}]`);
      }
    } else {
      // Check if current object has the property
      if (propertyName === '*') {
        // For wildcard, include all properties
        for (const key in current) {
          paths.push(`${path}${path ? '.' : ''}${key}`);
        }
      } else if (propertyName in current) {
        paths.push(`${path}${path ? '.' : ''}${propertyName}`);
      }
      
      // Search nested objects
      for (const key in current) {
        search(current[key], `${path}${path ? '.' : ''}${key}`);
      }
    }
  }
  
  search(obj, basePath);
  return paths;
}