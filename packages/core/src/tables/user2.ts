/**
 * MoneyWorks User2 Table Interface
 *
 * Extended script persistent storage table with enhanced capabilities:
 * - Key field supports up to 255 characters (vs 63 in User table)
 * - Native format for dates and numbers
 * - Can segment data using DevKey
 * - Additional fields: UserNum, UserText, and TaggedText
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_user2_file.html
 */

import type { Timestamp } from "../types";

/**
 * User2 record interface with PascalCase field names matching MoneyWorks
 */
export interface User2 {
  /** Timestamp of last modification */
  LastModifiedTime: Timestamp;

  /** Developer key - unsigned integer > 65535 (#FFFF) for segmenting data */
  DevKey: number;

  /** Unique key to identify the record (up to 255 characters) */
  Key: string;

  /** Signed integer field 1 */
  Int1: number;

  /** Signed integer field 2 */
  Int2: number;

  /** Signed integer field 3 */
  Int3: number;

  /** Signed integer field 4 */
  Int4: number;

  /** Floating point number field 1 */
  Float1: number;

  /** Floating point number field 2 */
  Float2: number;

  /** Floating point number field 3 */
  Float3: number;

  /** Floating point number field 4 */
  Float4: number;

  /** Date field 1 */
  Date1: Date | null;

  /** Date field 2 */
  Date2: Date | null;

  /** Text field 1 (up to 255 characters) */
  Text1: string;

  /** Text field 2 (up to 255 characters) */
  Text2: string;

  /** Large text field (up to 1020 characters) */
  Text: string;

  /** Text field 3 (up to 255 characters) */
  Text3: string;

  /** Text field 4 (up to 255 characters) */
  Text4: string;

  /** Tagged text field (up to 255 characters) */
  TaggedText: string;
}

/**
 * User2 record interface with camelCase field names
 */
export interface User2Camel {
  /** Timestamp of last modification */
  lastModifiedTime: Timestamp;

  /** Developer key - unsigned integer > 65535 (#FFFF) for segmenting data */
  devKey: number;

  /** Unique key to identify the record (up to 255 characters) */
  key: string;

  /** Signed integer field 1 */
  int1: number;

  /** Signed integer field 2 */
  int2: number;

  /** Signed integer field 3 */
  int3: number;

  /** Signed integer field 4 */
  int4: number;

  /** Floating point number field 1 */
  float1: number;

  /** Floating point number field 2 */
  float2: number;

  /** Floating point number field 3 */
  float3: number;

  /** Floating point number field 4 */
  float4: number;

  /** Date field 1 */
  date1: Date | null;

  /** Date field 2 */
  date2: Date | null;

  /** Text field 1 (up to 255 characters) */
  text1: string;

  /** Text field 2 (up to 255 characters) */
  text2: string;

  /** Large text field (up to 1020 characters) */
  text: string;

  /** Text field 3 (up to 255 characters) */
  text3: string;

  /** Text field 4 (up to 255 characters) */
  text4: string;

  /** Tagged text field (up to 255 characters) */
  taggedText: string;
}

/**
 * Field name mappings between PascalCase and camelCase
 */
export const USER2_FIELD_MAP = {
  LastModifiedTime: "lastModifiedTime",
  DevKey: "devKey",
  Key: "key",
  Int1: "int1",
  Int2: "int2",
  Int3: "int3",
  Int4: "int4",
  Float1: "float1",
  Float2: "float2",
  Float3: "float3",
  Float4: "float4",
  Date1: "date1",
  Date2: "date2",
  Text1: "text1",
  Text2: "text2",
  Text: "text",
  Text3: "text3",
  Text4: "text4",
  TaggedText: "taggedText",
} as const;

/**
 * DevKey constants - values must be > 65535 (#FFFF)
 */
export const USER2_DEVKEY = {
  /** Minimum allowed DevKey value */
  MIN: 65536,

  /** Example DevKey ranges for different purposes */
  SCRIPT_DATA: 70000,
  CONFIG_DATA: 80000,
  CACHE_DATA: 90000,
  CUSTOM_DATA: 100000,
} as const;

/**
 * Field size limits
 */
export const USER2_FIELD_LIMITS = {
  KEY: 255,
  TEXT_SMALL: 255,
  TEXT_LARGE: 1020,
  TAGGED_TEXT: 255,
} as const;

/**
 * Convert User2 record from PascalCase to camelCase
 */
export function convertUser2ToCamel(record: User2): User2Camel {
  return {
    lastModifiedTime: record.LastModifiedTime,
    devKey: record.DevKey,
    key: record.Key,
    int1: record.Int1,
    int2: record.Int2,
    int3: record.Int3,
    int4: record.Int4,
    float1: record.Float1,
    float2: record.Float2,
    float3: record.Float3,
    float4: record.Float4,
    date1: record.Date1,
    date2: record.Date2,
    text1: record.Text1,
    text2: record.Text2,
    text: record.Text,
    text3: record.Text3,
    text4: record.Text4,
    taggedText: record.TaggedText,
  };
}

/**
 * Convert User2 record from camelCase to PascalCase
 */
export function convertUser2ToPascal(record: User2Camel): User2 {
  return {
    LastModifiedTime: record.lastModifiedTime,
    DevKey: record.devKey,
    Key: record.key,
    Int1: record.int1,
    Int2: record.int2,
    Int3: record.int3,
    Int4: record.int4,
    Float1: record.float1,
    Float2: record.float2,
    Float3: record.float3,
    Float4: record.float4,
    Date1: record.date1,
    Date2: record.date2,
    Text1: record.text1,
    Text2: record.text2,
    Text: record.text,
    Text3: record.text3,
    Text4: record.text4,
    TaggedText: record.taggedText,
  };
}

/**
 * Helper function to create a User2 record with defaults
 */
export function createUser2Record(
  key: string,
  devKey: number = USER2_DEVKEY.SCRIPT_DATA,
  data?: Partial<Omit<User2, "Key" | "DevKey" | "LastModifiedTime">>,
): User2 {
  if (key.length > USER2_FIELD_LIMITS.KEY) {
    throw new Error(
      `Key length exceeds maximum of ${USER2_FIELD_LIMITS.KEY} characters`,
    );
  }

  if (devKey <= USER2_DEVKEY.MIN - 1) {
    throw new Error(`DevKey must be greater than ${USER2_DEVKEY.MIN - 1}`);
  }

  return {
    LastModifiedTime: new Date().toISOString(),
    DevKey: devKey,
    Key: key,
    Int1: data?.Int1 ?? 0,
    Int2: data?.Int2 ?? 0,
    Int3: data?.Int3 ?? 0,
    Int4: data?.Int4 ?? 0,
    Float1: data?.Float1 ?? 0.0,
    Float2: data?.Float2 ?? 0.0,
    Float3: data?.Float3 ?? 0.0,
    Float4: data?.Float4 ?? 0.0,
    Date1: data?.Date1 ?? null,
    Date2: data?.Date2 ?? null,
    Text1: data?.Text1 ?? "",
    Text2: data?.Text2 ?? "",
    Text: data?.Text ?? "",
    Text3: data?.Text3 ?? "",
    Text4: data?.Text4 ?? "",
    TaggedText: data?.TaggedText ?? "",
  };
}

/**
 * Validate field sizes for User2 record
 */
export function validateUser2FieldSizes(record: Partial<User2>): string[] {
  const errors: string[] = [];

  if (record.Key && record.Key.length > USER2_FIELD_LIMITS.KEY) {
    errors.push(`Key exceeds ${USER2_FIELD_LIMITS.KEY} character limit`);
  }

  const smallTextFields = [
    "Text1",
    "Text2",
    "Text3",
    "Text4",
    "TaggedText",
  ] as const;
  for (const field of smallTextFields) {
    if (
      record[field] &&
      record[field]?.length > USER2_FIELD_LIMITS.TEXT_SMALL
    ) {
      errors.push(
        `${field} exceeds ${USER2_FIELD_LIMITS.TEXT_SMALL} character limit`,
      );
    }
  }

  if (record.Text && record.Text.length > USER2_FIELD_LIMITS.TEXT_LARGE) {
    errors.push(
      `Text exceeds ${USER2_FIELD_LIMITS.TEXT_LARGE} character limit`,
    );
  }

  if (record.DevKey && record.DevKey <= USER2_DEVKEY.MIN - 1) {
    errors.push(`DevKey must be greater than ${USER2_DEVKEY.MIN - 1}`);
  }

  return errors;
}

/**
 * Type guard to check if a record is a User2 record
 */
export function isUser2Record(record: unknown): record is User2 {
  return (
    typeof record === "object" &&
    record !== null &&
    (record as User2).DevKey > USER2_DEVKEY.MIN - 1
  );
}
