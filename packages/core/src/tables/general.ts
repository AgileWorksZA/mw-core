/**
 * MoneyWorks General Table Interface
 *
 * The General table is a multi-purpose table that holds three logical tables:
 * - Account Categories (Code prefix: A_)
 * - Department Classifications (Code prefix: D_)
 * - Groups (Code prefix: G_)
 *
 * This single file design allows tracking of categorization and reporting
 * groupings across different dimensions of the accounting system.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_account_categories__department_classifications_and_groups.html
 */

/**
 * Type discriminator for General table entries
 */
export enum GeneralType {
  /** Account Categories */
  CATEGORY = "C",
  /** Department Classifications */
  CLASSIFICATION = "D",
  /** Groups */
  GROUP = "S",
}

/**
 * MoneyWorks General Table (Raw Interface)
 * @description Complete interface for the General table with exact field names
 */
export interface General {
  /**
   * Item code with type prefix
   * @maxLength 5
   * @description Unique identifier with prefix indicating type:
   * - C = Account Category
   * - D = Department Classification
   * - S = Group
   * @example "C100" for an account category
   * @example "DADM" for a department classification
   * @example "S001" for a group
   */
  Code: string;

  /**
   * Item description
   * @maxLength 25
   * @description Display name for the category, classification, or group
   * @example "Current Assets" for an account category
   * @example "Administrative" for a department classification
   * @example "Primary Group" for a group
   */
  Description?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date/time when this record was last changed
   * @readonly
   * @note Does not track changes to account balances, only to the category record itself
   */
  LastModifiedTime?: string;
}

/**
 * MoneyWorks General Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface GeneralCamel {
  /**
   * Item code with type prefix
   * @maxLength 5
   * @description Unique identifier with prefix indicating type:
   * - C = Account Category
   * - D = Department Classification
   * - S = Group
   * @example "C100" for an account category
   * @example "DADM" for a department classification
   * @example "S001" for a group
   */
  code: string;

  /**
   * Item description
   * @maxLength 25
   * @description Display name for the category, classification, or group
   * @example "Current Assets" for an account category
   * @example "Administrative" for a department classification
   * @example "Primary Group" for a group
   */
  description?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date/time when this record was last changed
   * @readonly
   * @note Does not track changes to account balances, only to the category record itself
   */
  lastModifiedTime?: string;
}

/**
 * Type guard functions for General table entries
 */
export const generalTypeGuards = {
  /**
   * Check if a General entry is an Account Category
   */
  isCategory(general: General | GeneralCamel): boolean {
    const code = "Code" in general ? general.Code : general.code;
    return code.startsWith(GeneralType.CATEGORY);
  },

  /**
   * Check if a General entry is a Department Classification
   */
  isClassification(general: General | GeneralCamel): boolean {
    const code = "Code" in general ? general.Code : general.code;
    return code.startsWith(GeneralType.CLASSIFICATION);
  },

  /**
   * Check if a General entry is a Group
   */
  isGroup(general: General | GeneralCamel): boolean {
    const code = "Code" in general ? general.Code : general.code;
    return code.startsWith(GeneralType.GROUP);
  },

  /**
   * Get the type of a General entry
   */
  getType(general: General | GeneralCamel): GeneralType | null {
    const code = "Code" in general ? general.Code : general.code;
    if (code.startsWith(GeneralType.CATEGORY)) return GeneralType.CATEGORY;
    if (code.startsWith(GeneralType.CLASSIFICATION))
      return GeneralType.CLASSIFICATION;
    if (code.startsWith(GeneralType.GROUP)) return GeneralType.GROUP;
    return null;
  },
};

/**
 * Converter utilities for General table
 */
export const generalConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: General): GeneralCamel {
    return {
      code: raw.Code,
      description: raw.Description,
      lastModifiedTime: raw.LastModifiedTime,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: GeneralCamel): General {
    return {
      Code: camel.code,
      Description: camel.description,
      LastModifiedTime: camel.lastModifiedTime,
    };
  },
};

/**
 * Helper functions for General table
 */
export const generalHelpers = {
  /**
   * Create a new Account Category code
   * @param suffix - The code suffix (without prefix)
   * @returns Formatted category code
   */
  createCategoryCode(suffix: string): string {
    const formatted = suffix.toUpperCase().substring(0, 4);
    return `${GeneralType.CATEGORY}${formatted}`;
  },

  /**
   * Create a new Department Classification code
   * @param suffix - The code suffix (without prefix)
   * @returns Formatted classification code
   */
  createClassificationCode(suffix: string): string {
    const formatted = suffix.toUpperCase().substring(0, 4);
    return `${GeneralType.CLASSIFICATION}${formatted}`;
  },

  /**
   * Create a new Group code
   * @param suffix - The code suffix (without prefix)
   * @returns Formatted group code
   */
  createGroupCode(suffix: string): string {
    const formatted = suffix.toUpperCase().substring(0, 4);
    return `${GeneralType.GROUP}${formatted}`;
  },

  /**
   * Extract the suffix from a General code (removes the type prefix)
   * @param code - The full code with prefix
   * @returns The code suffix without prefix
   */
  getCodeSuffix(code: string): string {
    if (code.length > 1 && (code[0] === "C" || code[0] === "D" || code[0] === "S")) {
      return code.substring(1);
    }
    return code;
  },

  /**
   * Format a code with the appropriate prefix
   * @param type - The type of General entry
   * @param suffix - The code suffix
   * @returns Formatted code with prefix
   */
  formatCode(type: GeneralType, suffix: string): string {
    const formatted = suffix.toUpperCase().substring(0, 4);
    return `${type}${formatted}`;
  },

  /**
   * Create a display label for a General entry
   * @param general - The General record
   * @returns Formatted display string with type indicator
   */
  getDisplayLabel(general: General | GeneralCamel): string {
    const code = "Code" in general ? general.Code : general.code;
    const description =
      "Code" in general ? general.Description : general.description;
    const type = generalTypeGuards.getType(general);

    let typeLabel = "";
    switch (type) {
      case GeneralType.CATEGORY:
        typeLabel = "[Category] ";
        break;
      case GeneralType.CLASSIFICATION:
        typeLabel = "[Classification] ";
        break;
      case GeneralType.GROUP:
        typeLabel = "[Group] ";
        break;
    }

    if (description) {
      return `${typeLabel}${code} - ${description}`;
    }
    return `${typeLabel}${code}`;
  },

  /**
   * Filter General entries by type
   * @param entries - Array of General entries
   * @param type - The type to filter by
   * @returns Filtered array of entries
   */
  filterByType<T extends General | GeneralCamel>(
    entries: T[],
    type: GeneralType,
  ): T[] {
    return entries.filter((entry) => {
      const code = "Code" in entry ? entry.Code : entry.code;
      return code.startsWith(type);
    });
  },

  /**
   * Get all Account Categories from a General array
   */
  getCategories<T extends General | GeneralCamel>(entries: T[]): T[] {
    return generalHelpers.filterByType(entries, GeneralType.CATEGORY);
  },

  /**
   * Get all Department Classifications from a General array
   */
  getClassifications<T extends General | GeneralCamel>(entries: T[]): T[] {
    return generalHelpers.filterByType(entries, GeneralType.CLASSIFICATION);
  },

  /**
   * Get all Groups from a General array
   */
  getGroups<T extends General | GeneralCamel>(entries: T[]): T[] {
    return generalHelpers.filterByType(entries, GeneralType.GROUP);
  },
};

/**
 * Type-specific interfaces for better type safety
 */

/**
 * Account Category (subset of General)
 */
export interface AccountCategory extends General {
  Code: `C${string}`;
}

/**
 * Department Classification (subset of General)
 */
export interface DepartmentClassification extends General {
  Code: `D${string}`;
}

/**
 * Group (subset of General)
 */
export interface Group extends General {
  Code: `S${string}`;
}

/**
 * Account Category (camelCase)
 */
export interface AccountCategoryCamel extends GeneralCamel {
  code: `C${string}`;
}

/**
 * Department Classification (camelCase)
 */
export interface DepartmentClassificationCamel extends GeneralCamel {
  code: `D${string}`;
}

/**
 * Group (camelCase)
 */
export interface GroupCamel extends GeneralCamel {
  code: `S${string}`;
}

/**
 * Type assertion functions for stricter typing
 */
export const generalTypeAssertions = {
  /**
   * Assert that a General entry is an Account Category
   */
  assertCategory(general: General): asserts general is AccountCategory {
    if (!generalTypeGuards.isCategory(general)) {
      throw new Error(
        `Expected Account Category but got code: ${general.Code}`,
      );
    }
  },

  /**
   * Assert that a General entry is a Department Classification
   */
  assertClassification(
    general: General,
  ): asserts general is DepartmentClassification {
    if (!generalTypeGuards.isClassification(general)) {
      throw new Error(
        `Expected Department Classification but got code: ${general.Code}`,
      );
    }
  },

  /**
   * Assert that a General entry is a Group
   */
  assertGroup(general: General): asserts general is Group {
    if (!generalTypeGuards.isGroup(general)) {
      throw new Error(`Expected Group but got code: ${general.Code}`);
    }
  },
};
