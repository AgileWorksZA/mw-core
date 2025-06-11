/**
 * MoneyWorks Departments Table Interface
 *
 * The Departments file contains departmental codes used for tracking
 * income and expenses by department or division within the organization.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_departments.html
 */

/**
 * MoneyWorks Departments Table (Raw Interface)
 * @description Complete interface for the Departments table with exact field names
 */
export interface Department {
  /**
   * Department code
   * @maxLength 5
   * @description Unique identifier for the department
   * @example "SALES"
   */
  Code: string;

  /**
   * Department description
   * @maxLength 35
   * @description Display name for the department
   * @example "Sales Department"
   */
  Description?: string;

  /**
   * Classification code
   * @maxLength 5
   * @description Classification or grouping code
   */
  Classification?: string;

  /**
   * User-defined custom field 1
   * @maxLength 15
   * @description For your own use
   */
  Custom1?: string;

  /**
   * User-defined custom field 2
   * @maxLength 9
   * @description For your own use
   */
  Custom2?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  UserNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  UserText?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  TaggedText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date department record was last changed
   * @readonly
   */
  LastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  ModUser?: string;
}

/**
 * MoneyWorks Departments Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface DepartmentCamel {
  /**
   * Department code
   * @maxLength 5
   * @description Unique identifier for the department
   * @example "SALES"
   */
  code: string;

  /**
   * Department description
   * @maxLength 35
   * @description Display name for the department
   * @example "Sales Department"
   */
  description?: string;

  /**
   * Classification code
   * @maxLength 5
   * @description Classification or grouping code
   */
  classification?: string;

  /**
   * User-defined custom field 1
   * @maxLength 15
   * @description For your own use
   */
  custom1?: string;

  /**
   * User-defined custom field 2
   * @maxLength 9
   * @description For your own use
   */
  custom2?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  userNum?: number;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  userText?: string;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  taggedText?: string;

  /**
   * Last modification timestamp
   * @format ISO 8601
   * @description Date department record was last changed
   * @readonly
   */
  lastModifiedTime?: string;

  /**
   * User who last modified
   * @readonly
   * @note This field may not be present in all MoneyWorks versions
   */
  modUser?: string;
}

/**
 * Converter utilities for Departments table
 */
export const departmentConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: Department): DepartmentCamel {
    return {
      code: raw.Code,
      description: raw.Description,
      classification: raw.Classification,
      custom1: raw.Custom1,
      custom2: raw.Custom2,
      userNum: raw.UserNum,
      userText: raw.UserText,
      taggedText: raw.TaggedText,
      lastModifiedTime: raw.LastModifiedTime,
      modUser: raw.ModUser,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: DepartmentCamel): Department {
    return {
      Code: camel.code,
      Description: camel.description,
      Classification: camel.classification,
      Custom1: camel.custom1,
      Custom2: camel.custom2,
      UserNum: camel.userNum,
      UserText: camel.userText,
      TaggedText: camel.taggedText,
      LastModifiedTime: camel.lastModifiedTime,
      ModUser: camel.modUser,
    };
  },
};

/**
 * Helper functions for Departments table
 */
export const departmentHelpers = {
  /**
   * Format department code to uppercase
   * @param code - The department code
   * @returns Formatted code in uppercase
   */
  formatCode(code: string): string {
    return code.toUpperCase().substring(0, 5);
  },

  /**
   * Check if department belongs to a classification
   * @param department - The department record
   * @param classification - The classification to check
   * @returns True if department belongs to the classification
   */
  isInClassification(department: Department, classification: string): boolean {
    return department.Classification === classification;
  },

  /**
   * Create a display label for the department
   * @param department - The department record
   * @returns Formatted display string
   */
  getDisplayLabel(department: Department): string {
    if (department.Description) {
      return `${department.Code} - ${department.Description}`;
    }
    return department.Code;
  },
};
