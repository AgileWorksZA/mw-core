/**
 * MoneyWorks Login table interfaces and utilities
 *
 * The Login table stores user authentication and authorization information.
 * Note: The Password field is encrypted and the Privileges field encodes access rights.
 * There is no explicit Code field as primary key.
 */

// Raw interface matching MoneyWorks field names (PascalCase)
export interface Login {
  /** User Category (max 31 characters) */
  Category: string;

  /** User email (max 63 characters) */
  Email: string;

  /** User Flags */
  Flags: number;

  /** User initials (max 3 characters) */
  Initials: string;

  /** Last record modification timestamp */
  LastModifiedTime: Date;

  /** User name (max 31 characters) */
  Name: string;

  /** User password (encrypted) */
  Password: string;

  /** Privilege map (max 65 characters) - encodes access rights */
  Privileges: string;

  /** User Role (max 3 characters) */
  Role: string;

  /** Numeric security level */
  SecurityLevel: number;

  /** Scriptable tag storage (max 255 characters) */
  TaggedText: string;

  /** Scriptable number */
  UserNum: number;

  /** Scriptable text (max 255 characters) */
  UserText: string;
}

// CamelCase companion interface
export interface LoginCamel {
  /** User Category (max 31 characters) */
  category: string;

  /** User email (max 63 characters) */
  email: string;

  /** User Flags */
  flags: number;

  /** User initials (max 3 characters) */
  initials: string;

  /** Last record modification timestamp */
  lastModifiedTime: Date;

  /** User name (max 31 characters) */
  name: string;

  /** User password (encrypted) */
  password: string;

  /** Privilege map (max 65 characters) - encodes access rights */
  privileges: string;

  /** User Role (max 3 characters) */
  role: string;

  /** Numeric security level */
  securityLevel: number;

  /** Scriptable tag storage (max 255 characters) */
  taggedText: string;

  /** Scriptable number */
  userNum: number;

  /** Scriptable text (max 255 characters) */
  userText: string;
}

// Field name mappings
export const LOGIN_FIELD_MAP = {
  Category: "category",
  Email: "email",
  Flags: "flags",
  Initials: "initials",
  LastModifiedTime: "lastModifiedTime",
  Name: "name",
  Password: "password",
  Privileges: "privileges",
  Role: "role",
  SecurityLevel: "securityLevel",
  TaggedText: "taggedText",
  UserNum: "userNum",
  UserText: "userText",
} as const;

// Reverse mapping for camelCase to PascalCase
export const LOGIN_FIELD_MAP_REVERSE = Object.fromEntries(
  Object.entries(LOGIN_FIELD_MAP).map(([k, v]) => [v, k]),
) as Record<keyof LoginCamel, keyof Login>;

// Converter utilities
export function convertLoginToCamel(login: Login): LoginCamel {
  return {
    category: login.Category,
    email: login.Email,
    flags: login.Flags,
    initials: login.Initials,
    lastModifiedTime: login.LastModifiedTime,
    name: login.Name,
    password: login.Password,
    privileges: login.Privileges,
    role: login.Role,
    securityLevel: login.SecurityLevel,
    taggedText: login.TaggedText,
    userNum: login.UserNum,
    userText: login.UserText,
  };
}

export function convertLoginToPascal(login: LoginCamel): Login {
  return {
    Category: login.category,
    Email: login.email,
    Flags: login.flags,
    Initials: login.initials,
    LastModifiedTime: login.lastModifiedTime,
    Name: login.name,
    Password: login.password,
    Privileges: login.privileges,
    Role: login.role,
    SecurityLevel: login.securityLevel,
    TaggedText: login.taggedText,
    UserNum: login.userNum,
    UserText: login.userText,
  };
}

// Partial converters for updates
export function convertPartialLoginToCamel(
  login: Partial<Login>,
): Partial<LoginCamel> {
  const result: Partial<LoginCamel> = {};

  if (login.Category !== undefined) result.category = login.Category;
  if (login.Email !== undefined) result.email = login.Email;
  if (login.Flags !== undefined) result.flags = login.Flags;
  if (login.Initials !== undefined) result.initials = login.Initials;
  if (login.LastModifiedTime !== undefined)
    result.lastModifiedTime = login.LastModifiedTime;
  if (login.Name !== undefined) result.name = login.Name;
  if (login.Password !== undefined) result.password = login.Password;
  if (login.Privileges !== undefined) result.privileges = login.Privileges;
  if (login.Role !== undefined) result.role = login.Role;
  if (login.SecurityLevel !== undefined)
    result.securityLevel = login.SecurityLevel;
  if (login.TaggedText !== undefined) result.taggedText = login.TaggedText;
  if (login.UserNum !== undefined) result.userNum = login.UserNum;
  if (login.UserText !== undefined) result.userText = login.UserText;

  return result;
}

export function convertPartialLoginToPascal(
  login: Partial<LoginCamel>,
): Partial<Login> {
  const result: Partial<Login> = {};

  if (login.category !== undefined) result.Category = login.category;
  if (login.email !== undefined) result.Email = login.email;
  if (login.flags !== undefined) result.Flags = login.flags;
  if (login.initials !== undefined) result.Initials = login.initials;
  if (login.lastModifiedTime !== undefined)
    result.LastModifiedTime = login.lastModifiedTime;
  if (login.name !== undefined) result.Name = login.name;
  if (login.password !== undefined) result.Password = login.password;
  if (login.privileges !== undefined) result.Privileges = login.privileges;
  if (login.role !== undefined) result.Role = login.role;
  if (login.securityLevel !== undefined)
    result.SecurityLevel = login.securityLevel;
  if (login.taggedText !== undefined) result.TaggedText = login.taggedText;
  if (login.userNum !== undefined) result.UserNum = login.userNum;
  if (login.userText !== undefined) result.UserText = login.userText;

  return result;
}

// Helper functions

/**
 * Validates field lengths according to MoneyWorks constraints
 */
export function validateLoginFieldLengths(login: Partial<Login>): string[] {
  const errors: string[] = [];

  if (login.Category !== undefined && login.Category.length > 31) {
    errors.push("Category exceeds maximum length of 31 characters");
  }

  if (login.Email !== undefined && login.Email.length > 63) {
    errors.push("Email exceeds maximum length of 63 characters");
  }

  if (login.Initials !== undefined && login.Initials.length > 3) {
    errors.push("Initials exceeds maximum length of 3 characters");
  }

  if (login.Name !== undefined && login.Name.length > 31) {
    errors.push("Name exceeds maximum length of 31 characters");
  }

  if (login.Privileges !== undefined && login.Privileges.length > 65) {
    errors.push("Privileges exceeds maximum length of 65 characters");
  }

  if (login.Role !== undefined && login.Role.length > 3) {
    errors.push("Role exceeds maximum length of 3 characters");
  }

  if (login.TaggedText !== undefined && login.TaggedText.length > 255) {
    errors.push("TaggedText exceeds maximum length of 255 characters");
  }

  if (login.UserText !== undefined && login.UserText.length > 255) {
    errors.push("UserText exceeds maximum length of 255 characters");
  }

  return errors;
}

/**
 * Creates a new Login object with default values
 * Note: Password should be encrypted before saving
 */
export function createDefaultLogin(): Login {
  return {
    Category: "",
    Email: "",
    Flags: 0,
    Initials: "",
    LastModifiedTime: new Date(),
    Name: "",
    Password: "", // Must be encrypted before use
    Privileges: "",
    Role: "",
    SecurityLevel: 0,
    TaggedText: "",
    UserNum: 0,
    UserText: "",
  };
}

/**
 * Type guard to check if an object is a valid Login
 */
export function isLogin(obj: unknown): obj is Login {
  return (
    obj !== null &&
    typeof obj === "object" &&
    typeof (obj as Login).Category === "string" &&
    typeof (obj as Login).Email === "string" &&
    typeof (obj as Login).Flags === "number" &&
    typeof (obj as Login).Initials === "string" &&
    (obj as Login).LastModifiedTime instanceof Date &&
    typeof (obj as Login).Name === "string" &&
    typeof (obj as Login).Password === "string" &&
    typeof (obj as Login).Privileges === "string" &&
    typeof (obj as Login).Role === "string" &&
    typeof (obj as Login).SecurityLevel === "number" &&
    typeof (obj as Login).TaggedText === "string" &&
    typeof (obj as Login).UserNum === "number" &&
    typeof (obj as Login).UserText === "string"
  );
}

// Export types for the field maps
export type LoginFieldMap = typeof LOGIN_FIELD_MAP;
export type LoginFieldMapReverse = typeof LOGIN_FIELD_MAP_REVERSE;
