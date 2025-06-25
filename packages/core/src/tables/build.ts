/**
 * MoneyWorks Build Table Interface
 *
 * Stores product build recipes/Bill of Materials (BOM) for manufacturing and assembly.
 * Links to Products table via ProductSeq and PartCode fields.
 */

/**
 * Raw Build record interface matching MoneyWorks field names
 */
export interface Build {
  /** The date and time that this record was last changed */
  LastModifiedTime?: string;

  /** Memo for the component (max 255 chars) */
  "Build.Memo"?: string;

  /** The sequence number of the Product record to which the recipe belongs */
  "Build.ProductSeq"?: number;

  /** Quantity of component required */
  "Build.Qty"?: number;

  /** Code of component (max 19 chars) */
  "Build.PartCode"?: string;
}

/**
 * CamelCase Build record interface
 */
export interface BuildCamel {
  /** The date and time that this record was last changed */
  lastModifiedTime?: string;

  /** Memo for the component (max 255 chars) */
  memo?: string;

  /** The sequence number of the Product record to which the recipe belongs */
  productSeq?: number;

  /** Quantity of component required */
  qty?: number;

  /** Code of component (max 19 chars) */
  partCode?: string;
}

/**
 * Field name mappings for converting between Build interfaces
 */
export const buildFieldMappings: Record<keyof BuildCamel, keyof Build> = {
  lastModifiedTime: "LastModifiedTime",
  memo: "Build.Memo",
  productSeq: "Build.ProductSeq",
  qty: "Build.Qty",
  partCode: "Build.PartCode",
};

/**
 * Convert raw Build record to camelCase
 */
export function convertBuildToCamel(raw: Build): BuildCamel {
  return {
    lastModifiedTime: raw.LastModifiedTime,
    memo: raw["Build.Memo"],
    productSeq: raw["Build.ProductSeq"],
    qty: raw["Build.Qty"],
    partCode: raw["Build.PartCode"],
  };
}

/**
 * Convert camelCase Build to raw format
 */
export function convertBuildToRaw(camel: BuildCamel): Build {
  return {
    LastModifiedTime: camel.lastModifiedTime,
    "Build.Memo": camel.memo,
    "Build.ProductSeq": camel.productSeq,
    "Build.Qty": camel.qty,
    "Build.PartCode": camel.partCode,
  };
}

/**
 * Type guard for Build record
 */
export function isBuildRecord(value: unknown): value is Build {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  // Check optional fields have correct types when present
  if (
    "LastModifiedTime" in record &&
    typeof record.LastModifiedTime !== "string"
  ) {
    return false;
  }
  if ("Build.Memo" in record && typeof record["Build.Memo"] !== "string") {
    return false;
  }
  if (
    "Build.ProductSeq" in record &&
    typeof record["Build.ProductSeq"] !== "number"
  ) {
    return false;
  }
  if ("Build.Qty" in record && typeof record["Build.Qty"] !== "number") {
    return false;
  }
  return !(
    "Build.PartCode" in record && typeof record["Build.PartCode"] !== "string"
  );
}

/**
 * Validate Build record field lengths
 */
export function validateBuildFieldLengths(record: Build): string[] {
  const errors: string[] = [];

  if (record["Build.Memo"] && record["Build.Memo"].length > 255) {
    errors.push(
      `Build.Memo exceeds maximum length of 255 characters (current: ${record["Build.Memo"].length})`,
    );
  }

  if (record["Build.PartCode"] && record["Build.PartCode"].length > 19) {
    errors.push(
      `Build.PartCode exceeds maximum length of 19 characters (current: ${record["Build.PartCode"].length})`,
    );
  }

  return errors;
}

/**
 * Create a new Build record with defaults
 */
export function createBuildRecord(
  partialRecord: Partial<BuildCamel> = {},
): BuildCamel {
  return {
    lastModifiedTime: new Date().toISOString(),
    memo: "",
    productSeq: undefined,
    qty: 1,
    partCode: "",
    ...partialRecord,
  };
}

/**
 * Helper to format Build record for display
 */
export function formatBuildRecord(record: BuildCamel): string {
  const parts: string[] = [];

  if (record.partCode) {
    parts.push(`Component: ${record.partCode}`);
  }

  if (record.qty !== undefined) {
    parts.push(`Qty: ${record.qty}`);
  }

  if (record.memo) {
    parts.push(`Memo: ${record.memo}`);
  }

  return parts.join(" | ");
}

/**
 * Helper to get build components for a product
 */
export function filterBuildsByProduct(
  builds: BuildCamel[],
  productSeq: number,
): BuildCamel[] {
  return builds.filter((build) => build.productSeq === productSeq);
}

/**
 * Helper to calculate total quantity needed for a component across all builds
 */
export function calculateComponentUsage(
  builds: BuildCamel[],
  partCode: string,
): number {
  return builds
    .filter((build) => build.partCode === partCode)
    .reduce((total, build) => total + (build.qty || 0), 0);
}
