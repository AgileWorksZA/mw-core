/**
 * User Table - Script Persistent Storage
 *
 * The User table is used for storing script data with key-value pairs.
 * Keys can be up to 63 characters (despite documentation showing 9)
 * and data can be up to 245 characters.
 *
 * Many plug-ins use their own set of keys, so key conflicts need to be managed.
 * Records can be inserted via XML import or using SetPersistent function.
 * If a key already exists, the record will be overwritten.
 * If data is empty for an existing key, the record will be deleted.
 */

// Raw interface matching MoneyWorks field names (PascalCase)
export interface User {
  /** The date and time that this record was last changed */
  LastModifiedTime?: string;

  /** A unique key to identify the record (up to 63 characters) */
  Key: string;

  /** Text data for the key (up to 245 characters) */
  Data?: string;
}

// CamelCase companion interface
export interface UserCamel {
  /** The date and time that this record was last changed */
  lastModifiedTime?: string;

  /** A unique key to identify the record (up to 63 characters) */
  key: string;

  /** Text data for the key (up to 245 characters) */
  data?: string;
}

// Field name mappings
export const USER_FIELD_MAPPINGS = {
  // PascalCase to camelCase
  toCalel: {
    LastModifiedTime: "lastModifiedTime",
    Key: "key",
    Data: "data",
  },
  // camelCase to PascalCase
  toPascal: {
    lastModifiedTime: "LastModifiedTime",
    key: "Key",
    data: "Data",
  },
} as const;

// Type definitions
export type UserFieldPascal = keyof User;
export type UserFieldCamel = keyof UserCamel;

// Converter utilities
export const UserConverters = {
  /**
   * Convert from PascalCase (MoneyWorks) to camelCase
   */
  toCamel(record: User): UserCamel {
    return {
      lastModifiedTime: record.LastModifiedTime,
      key: record.Key,
      data: record.Data,
    };
  },

  /**
   * Convert from camelCase to PascalCase (MoneyWorks)
   */
  toPascal(record: UserCamel): User {
    return {
      LastModifiedTime: record.lastModifiedTime,
      Key: record.key,
      Data: record.data,
    };
  },

  /**
   * Convert array of records from PascalCase to camelCase
   */
  toCamelArray(records: User[]): UserCamel[] {
    return records.map((record) => UserConverters.toCamel(record));
  },

  /**
   * Convert array of records from camelCase to PascalCase
   */
  toPascalArray(records: UserCamel[]): User[] {
    return records.map((record) => UserConverters.toPascal(record));
  },
};

// Helper functions for working with User table
export const UserHelpers = {
  /**
   * Validate key length (max 63 characters)
   */
  validateKey(key: string): boolean {
    return key.length > 0 && key.length <= 63;
  },

  /**
   * Validate data length (max 245 characters)
   */
  validateData(data: string): boolean {
    return data.length <= 245;
  },

  /**
   * Create a new User record
   */
  create(key: string, data: string): User {
    if (!UserHelpers.validateKey(key)) {
      throw new Error("Key must be 1-63 characters long");
    }
    if (!UserHelpers.validateData(data)) {
      throw new Error("Data must be 245 characters or less");
    }
    return {
      Key: key,
      Data: data,
    };
  },

  /**
   * Create a namespaced key to avoid conflicts with other plugins
   * @param namespace - Your plugin or module namespace
   * @param key - The actual key within your namespace
   */
  createNamespacedKey(namespace: string, key: string): string {
    const fullKey = `${namespace}:${key}`;
    if (!UserHelpers.validateKey(fullKey)) {
      throw new Error(`Namespaced key "${fullKey}" exceeds 63 character limit`);
    }
    return fullKey;
  },

  /**
   * Parse a namespaced key
   */
  parseNamespacedKey(key: string): { namespace: string; key: string } | null {
    const parts = key.split(":");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return null;
    }
    return {
      namespace: parts[0],
      key: parts[1],
    };
  },
};

// Type guard functions
export function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "Key" in value;
}

export function isUserCamel(value: unknown): value is UserCamel {
  return typeof value === "object" && value !== null && "key" in value;
}

// Constants
export const USER_CONSTRAINTS = {
  KEY_MAX_LENGTH: 63,
  DATA_MAX_LENGTH: 245,
} as const;

// Example usage:
/*
// Create a new user record
const userRecord = UserHelpers.create('myapp:setting1', 'value1');

// Create with namespace to avoid conflicts
const key = UserHelpers.createNamespacedKey('myapp', 'user_preference');
const record: User = {
  Key: key,
  Data: JSON.stringify({ theme: 'dark', language: 'en' })
};

// Convert between formats
const camelRecord = UserConverters.toCamel(record);
const pascalRecord = UserConverters.toPascal(camelRecord);
*/
