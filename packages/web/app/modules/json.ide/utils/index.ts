/**
 * Utility functions for working with JSON data
 */

// Export schema utilities
export * from './schema';
export * from './logger';

import type { JsonArray, JsonObject, JsonValue } from '../types';

/**
 * Updates a value in a deeply nested object using a path string
 * 
 * @param data The original data object
 * @param path Path to the property (e.g. "person.address.city")
 * @param value New value to set
 * @returns New object with the updated value
 */
export function updateNestedValue(data: JsonObject, path: string, value: JsonValue): JsonObject {
  if (!path) {
    // If value is an object, return it as is
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as JsonObject;
    }
    // Otherwise wrap primitive value in an object
    return { value } as JsonObject;
  }

  const updatedData = { ...data };
  const keys = path.split('.');
  let current = updatedData;
  
  // Navigate to the parent object of the property to update
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}; // Create object if it doesn't exist
    }
    current = current[key];
  }
  
  // Update the target property
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  
  return updatedData;
}

/**
 * Removes a property from a deeply nested object
 * 
 * @param data The original data object
 * @param path Path to the property to remove
 * @returns New object with the property removed
 */
export function removeNestedProperty(data: JsonObject, path: string): JsonObject {
  if (!path) {
    return {}; // Clear everything at root
  }

  const updatedData = { ...data };
  const keys = path.split('.');
  let current = updatedData;
  
  // Navigate to the parent object
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      return updatedData; // Path doesn't exist, return unchanged
    }
    current = current[key];
  }
  
  // Remove the property
  const lastKey = keys[keys.length - 1];
  if (current && typeof current === 'object') {
    delete current[lastKey];
  }
  
  return updatedData;
}

/**
 * Adds or updates a field in an object
 * 
 * @param data The original data object
 * @param key Field key/name
 * @param value Field value
 * @returns New object with the field added/updated
 */
export function updateField(data: JsonObject, key: string, value: JsonValue): JsonObject {
  return {
    ...data,
    [key]: value
  };
}

/**
 * Renames a field in an object
 * 
 * @param data The original data object
 * @param oldKey Current field name
 * @param newKey New field name
 * @returns New object with the field renamed
 */
export function renameField(data: JsonObject, oldKey: string, newKey: string): JsonObject {
  if (oldKey === newKey) {
    return data; // No change needed
  }
  
  const { [oldKey]: value, ...restData } = data;
  
  return {
    ...restData,
    [newKey]: value
  };
}

/**
 * Duplicates a field in an object with auto-incrementing name
 * 
 * @param data The original data object
 * @param key Field to duplicate
 * @returns New object with the duplicated field
 */
export function duplicateField(data: JsonObject, key: string): JsonObject {
  if (!data || !key || !(key in data)) {
    return data; // Nothing to duplicate
  }
  
  // Deep copy the value to duplicate
  const valueToDuplicate = JSON.parse(JSON.stringify(data[key]));
  
  // Generate a new key with Copy suffix
  let newKey = `${key}Copy`;
  let counter = 1;
  
  while (newKey in data) {
    newKey = `${key}Copy${counter}`;
    counter++;
  }
  
  return {
    ...data,
    [newKey]: valueToDuplicate
  };
}

/**
 * Adds an item to an array at a specific path
 * 
 * @param data The original data object
 * @param path Path to the array
 * @param item Item to add
 * @returns New object with the updated array
 */
export function addItemToArray(data: JsonObject, path: string, item: JsonValue): JsonObject {
  const arrayPath = path.split('.');
  const arrayKey = arrayPath[arrayPath.length - 1];
  const parentPath = arrayPath.slice(0, -1).join('.');
  
  let array = [];
  if (parentPath) {
    const parent = getNestedValue(data, parentPath) as any;
    array = Array.isArray(parent?.[arrayKey]) ? [...parent[arrayKey]] : [];
  } else {
    array = Array.isArray(data[arrayKey]) ? [...data[arrayKey]] : [];
  }
  
  // Add the new item
  array.push(item);
  
  // Update the parent object
  return updateNestedValue(data, path, array);
}

/**
 * Removes an item from an array at a specific path and index
 * 
 * @param data The original data object
 * @param path Path to the array
 * @param index Index to remove
 * @returns New object with the updated array
 */
export function removeArrayItem(data: JsonObject, path: string, index: number): JsonObject {
  const arrayPath = path.split('.');
  const arrayKey = arrayPath[arrayPath.length - 1];
  const parentPath = arrayPath.slice(0, -1).join('.');
  
  let array = [];
  if (parentPath) {
    const parent = getNestedValue(data, parentPath) as any;
    array = Array.isArray(parent?.[arrayKey]) ? [...parent[arrayKey]] : [];
  } else {
    array = Array.isArray(data[arrayKey]) ? [...data[arrayKey]] : [];
  }
  
  // Validate index
  if (index < 0 || index >= array.length) {
    return data; // Invalid index, return unchanged
  }
  
  // Remove the item
  array.splice(index, 1);
  
  // Update the parent object
  return updateNestedValue(data, path, array);
}

/**
 * Updates an item in an array at a specific path and index
 * 
 * @param data The original data object
 * @param path Path to the array
 * @param index Index to update
 * @param item New item value
 * @returns New object with the updated array
 */
export function updateArrayItem(data: JsonObject, path: string, index: number, item: JsonValue): JsonObject {
  const arrayPath = path.split('.');
  const arrayKey = arrayPath[arrayPath.length - 1];
  const parentPath = arrayPath.slice(0, -1).join('.');
  
  let array = [];
  if (parentPath) {
    const parent = getNestedValue(data, parentPath) as any;
    array = Array.isArray(parent?.[arrayKey]) ? [...parent[arrayKey]] : [];
  } else {
    array = Array.isArray(data[arrayKey]) ? [...data[arrayKey]] : [];
  }
  
  // Validate index
  if (index < 0 || index >= array.length) {
    return data; // Invalid index, return unchanged
  }
  
  // Update the item
  array[index] = item;
  
  // Update the parent object
  return updateNestedValue(data, path, array);
}

/**
 * Safely gets a value from a nested object using a path string
 * 
 * @param obj The object to retrieve from
 * @param path Path to the property (e.g. "person.address.city")
 * @param defaultValue Default value if path doesn't exist
 * @returns Value at the path or defaultValue if not found
 */
export function getNestedValue(obj: JsonObject, path: string, defaultValue: JsonValue | undefined = undefined): JsonValue {
  if (!obj || !path) {
    return defaultValue as JsonValue;
  }
  
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return defaultValue as JsonValue;
    }
    current = current[key];
  }
  
  return current === undefined ? (defaultValue as JsonValue) : current;
}

/**
 * Determines the input type based on value
 * 
 * @param value The value to check
 * @returns The appropriate input type
 */
export function getInputTypeForValue(value: JsonValue): string {
  if (typeof value === 'boolean') return 'checkbox';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string' && value.length > 50) return 'textarea';
  return 'text';
}

/**
 * Attempts to parse a string as JSON, returns original string if parsing fails
 * 
 * @param value String to parse
 * @returns Parsed JSON or original string
 */
export function parseJsonSafe(value: string): JsonValue {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}