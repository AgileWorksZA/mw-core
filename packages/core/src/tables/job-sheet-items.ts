/**
 * MoneyWorks Job Sheet Items Table Interface
 *
 * The Job Sheet Items file tracks time, materials, and expenses allocated to jobs.
 * It records detailed resource usage including labor hours, materials consumed,
 * and expenses incurred for job costing and billing purposes.
 *
 * @see https://cognito.co.nz/manual/moneyworks_appendix_job_sheet_items.html
 */

/**
 * Job sheet item status
 * @description Billing and processing status
 */
export enum JobSheetStatus {
  /** Unbilled - not yet invoiced */
  Unbilled = 0,
  /** Billed - included on an invoice */
  Billed = 1,
  /** Written off - not billable */
  WrittenOff = 2,
  /** In progress - being processed */
  InProgress = 3,
}

/**
 * Job sheet color codes
 * @description Visual categorization
 */
export enum JobSheetColor {
  Black = 0,
  White = 1,
  Red = 2,
  Green = 3,
  Blue = 4,
  Yellow = 5,
  Magenta = 6,
  Cyan = 7,
}

/**
 * MoneyWorks Job Sheet Items Table (Raw Interface)
 * @description Complete interface for the Job Sheet Items table with exact field names
 */
export interface JobSheetItem {
  /**
   * Sequence number
   * @description Unique identifier for the job sheet item
   * @readonly
   */
  SequenceNumber?: number;

  /**
   * Job code
   * @maxLength 9
   * @description Job this item is allocated to
   * @relationship References Job.Code
   * @required
   */
  JobCode: string;

  /**
   * Date used
   * @format date
   * @description Date the resource was used
   * @required
   */
  Date: Date | string;

  /**
   * Activity code
   * @maxLength 9
   * @description Type of activity performed
   * @example "CONSULT"
   */
  ActivityCode?: string;

  /**
   * Resource/person
   * @maxLength 9
   * @description Employee or resource identifier
   * @example "EMP001"
   */
  Resource?: string;

  /**
   * Product code
   * @maxLength 19
   * @description Product used (if applicable)
   * @relationship References Product.Code
   */
  ProductCode?: string;

  /**
   * Description
   * @maxLength 255
   * @description Detailed description of work performed
   */
  Description?: string;

  /**
   * Quantity/hours
   * @description Number of units or hours
   * @example 2.5 (for 2.5 hours)
   */
  Qty?: number;

  /**
   * Unit of measure
   * @maxLength 9
   * @description Unit for quantity (hours, each, etc.)
   * @example "Hours"
   */
  Unit?: string;

  /**
   * Cost price
   * @description Cost per unit
   * @example 75.00
   */
  CostPrice?: number;

  /**
   * Sell price
   * @description Billing rate per unit
   * @example 150.00
   */
  SellPrice?: number;

  /**
   * General ledger account
   * @maxLength 7
   * @description Expense account for the resource
   * @relationship References Account.Code
   */
  Account?: string;

  /**
   * Cost centre/department
   * @maxLength 5
   * @description Department code
   * @relationship References Department.Code
   */
  CostCentre?: string;

  /**
   * Analysis code
   * @maxLength 9
   * @description Additional categorization
   */
  Analysis?: string;

  /**
   * Status
   * @description Billing status
   * @default 0 (Unbilled)
   */
  Status?: JobSheetStatus;

  /**
   * Invoice number
   * @description Invoice this item was billed on
   * @relationship References Transaction.OurRef
   * @readonly
   */
  InvoiceNum?: string;

  /**
   * Date entered
   * @format date
   * @description Date the job sheet item was created
   * @readonly
   */
  DateEntered?: Date | string;

  /**
   * Entry batch
   * @description Batch number for timesheet imports
   */
  Batch?: number;

  /**
   * Comments
   * @maxLength 255
   * @description Additional notes
   */
  Comments?: string;

  /**
   * Color coding
   * @description Visual categorization
   * @default 0
   */
  Colour?: JobSheetColor;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  TaggedText?: string;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  UserText?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  UserNum?: number;

  /**
   * Last modification timestamp
   * @format ISO 8601
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
 * MoneyWorks Job Sheet Items Table (CamelCase Interface)
 * @description Developer-friendly interface with camelCase property names
 */
export interface JobSheetItemCamel {
  /**
   * Sequence number
   * @description Unique identifier for the job sheet item
   * @readonly
   */
  sequenceNumber?: number;

  /**
   * Job code
   * @maxLength 9
   * @description Job this item is allocated to
   * @relationship References Job.Code
   * @required
   */
  jobCode: string;

  /**
   * Date used
   * @format date
   * @description Date the resource was used
   * @required
   */
  date: Date | string;

  /**
   * Activity code
   * @maxLength 9
   * @description Type of activity performed
   * @example "CONSULT"
   */
  activityCode?: string;

  /**
   * Resource/person
   * @maxLength 9
   * @description Employee or resource identifier
   * @example "EMP001"
   */
  resource?: string;

  /**
   * Product code
   * @maxLength 19
   * @description Product used (if applicable)
   * @relationship References Product.Code
   */
  productCode?: string;

  /**
   * Description
   * @maxLength 255
   * @description Detailed description of work performed
   */
  description?: string;

  /**
   * Quantity/hours
   * @description Number of units or hours
   * @example 2.5 (for 2.5 hours)
   */
  qty?: number;

  /**
   * Unit of measure
   * @maxLength 9
   * @description Unit for quantity (hours, each, etc.)
   * @example "Hours"
   */
  unit?: string;

  /**
   * Cost price
   * @description Cost per unit
   * @example 75.00
   */
  costPrice?: number;

  /**
   * Sell price
   * @description Billing rate per unit
   * @example 150.00
   */
  sellPrice?: number;

  /**
   * General ledger account
   * @maxLength 7
   * @description Expense account for the resource
   * @relationship References Account.Code
   */
  account?: string;

  /**
   * Cost centre/department
   * @maxLength 5
   * @description Department code
   * @relationship References Department.Code
   */
  costCentre?: string;

  /**
   * Analysis code
   * @maxLength 9
   * @description Additional categorization
   */
  analysis?: string;

  /**
   * Status
   * @description Billing status
   * @default 0 (Unbilled)
   */
  status?: JobSheetStatus;

  /**
   * Invoice number
   * @description Invoice this item was billed on
   * @relationship References Transaction.OurRef
   * @readonly
   */
  invoiceNum?: string;

  /**
   * Date entered
   * @format date
   * @description Date the job sheet item was created
   * @readonly
   */
  dateEntered?: Date | string;

  /**
   * Entry batch
   * @description Batch number for timesheet imports
   */
  batch?: number;

  /**
   * Comments
   * @maxLength 255
   * @description Additional notes
   */
  comments?: string;

  /**
   * Color coding
   * @description Visual categorization
   * @default 0
   */
  colour?: JobSheetColor;

  /**
   * Tagged text
   * @maxLength 255
   * @description Scriptable tag storage
   */
  taggedText?: string;

  /**
   * User-defined text field
   * @maxLength 255
   * @description Scriptable text field
   */
  userText?: string;

  /**
   * User-defined numeric field
   * @description Scriptable numeric field
   */
  userNum?: number;

  /**
   * Last modification timestamp
   * @format ISO 8601
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
 * Converter utilities for Job Sheet Items table
 */
export const jobSheetItemConverters = {
  /**
   * Convert from MoneyWorks PascalCase to camelCase
   */
  toCamelCase(raw: JobSheetItem): JobSheetItemCamel {
    return {
      sequenceNumber: raw.SequenceNumber,
      jobCode: raw.JobCode,
      date: raw.Date,
      activityCode: raw.ActivityCode,
      resource: raw.Resource,
      productCode: raw.ProductCode,
      description: raw.Description,
      qty: raw.Qty,
      unit: raw.Unit,
      costPrice: raw.CostPrice,
      sellPrice: raw.SellPrice,
      account: raw.Account,
      costCentre: raw.CostCentre,
      analysis: raw.Analysis,
      status: raw.Status,
      invoiceNum: raw.InvoiceNum,
      dateEntered: raw.DateEntered,
      batch: raw.Batch,
      comments: raw.Comments,
      colour: raw.Colour,
      taggedText: raw.TaggedText,
      userText: raw.UserText,
      userNum: raw.UserNum,
      lastModifiedTime: raw.LastModifiedTime,
      modUser: raw.ModUser,
    };
  },

  /**
   * Convert from camelCase to MoneyWorks PascalCase
   */
  fromCamelCase(camel: JobSheetItemCamel): JobSheetItem {
    return {
      SequenceNumber: camel.sequenceNumber,
      JobCode: camel.jobCode,
      Date: camel.date,
      ActivityCode: camel.activityCode,
      Resource: camel.resource,
      ProductCode: camel.productCode,
      Description: camel.description,
      Qty: camel.qty,
      Unit: camel.unit,
      CostPrice: camel.costPrice,
      SellPrice: camel.sellPrice,
      Account: camel.account,
      CostCentre: camel.costCentre,
      Analysis: camel.analysis,
      Status: camel.status,
      InvoiceNum: camel.invoiceNum,
      DateEntered: camel.dateEntered,
      Batch: camel.batch,
      Comments: camel.comments,
      Colour: camel.colour,
      TaggedText: camel.taggedText,
      UserText: camel.userText,
      UserNum: camel.userNum,
      LastModifiedTime: camel.lastModifiedTime,
      ModUser: camel.modUser,
    };
  },
};

/**
 * Helper functions for Job Sheet Items table
 */
export const jobSheetItemHelpers = {
  /**
   * Check if item is billable
   * @param status - The item status
   * @returns True if the item can be billed
   */
  isBillable(status?: JobSheetStatus): boolean {
    return status === JobSheetStatus.Unbilled || status === undefined;
  },

  /**
   * Check if item has been billed
   * @param status - The item status
   * @returns True if the item has been invoiced
   */
  isBilled(status?: JobSheetStatus): boolean {
    return status === JobSheetStatus.Billed;
  },

  /**
   * Check if item is written off
   * @param status - The item status
   * @returns True if the item has been written off
   */
  isWrittenOff(status?: JobSheetStatus): boolean {
    return status === JobSheetStatus.WrittenOff;
  },

  /**
   * Calculate total cost
   * @param qty - Quantity
   * @param costPrice - Cost per unit
   * @returns Total cost amount
   */
  calculateTotalCost(qty?: number, costPrice?: number): number {
    return Math.round((qty || 0) * (costPrice || 0) * 100) / 100;
  },

  /**
   * Calculate total sell amount
   * @param qty - Quantity
   * @param sellPrice - Sell price per unit
   * @returns Total sell amount
   */
  calculateTotalSell(qty?: number, sellPrice?: number): number {
    return Math.round((qty || 0) * (sellPrice || 0) * 100) / 100;
  },

  /**
   * Calculate markup amount
   * @param item - The job sheet item
   * @returns Markup amount (sell - cost)
   */
  calculateMarkup(item: JobSheetItem): number {
    const cost = this.calculateTotalCost(item.Qty, item.CostPrice);
    const sell = this.calculateTotalSell(item.Qty, item.SellPrice);
    return Math.round((sell - cost) * 100) / 100;
  },

  /**
   * Calculate markup percentage
   * @param item - The job sheet item
   * @returns Markup as percentage of cost
   */
  calculateMarkupPercent(item: JobSheetItem): number | null {
    const cost = this.calculateTotalCost(item.Qty, item.CostPrice);
    if (!cost || cost === 0) return null;

    const markup = this.calculateMarkup(item);
    return Math.round((markup / cost) * 10000) / 100; // Round to 2 decimal places
  },

  /**
   * Get status display name
   * @param status - The status code
   * @returns User-friendly status name
   */
  getStatusName(status?: JobSheetStatus): string {
    switch (status) {
      case JobSheetStatus.Unbilled:
        return "Unbilled";
      case JobSheetStatus.Billed:
        return "Billed";
      case JobSheetStatus.WrittenOff:
        return "Written Off";
      case JobSheetStatus.InProgress:
        return "In Progress";
      default:
        return "Unknown";
    }
  },

  /**
   * Format job sheet item for display
   * @param item - The job sheet item
   * @returns Formatted summary string
   */
  getItemSummary(item: JobSheetItem): string {
    const parts: string[] = [];

    const dateStr =
      typeof item.Date === "string"
        ? item.Date
        : item.Date.toISOString().split("T")[0];
    if (dateStr) {
      parts.push(dateStr);
    }

    if (item.Description) {
      parts.push(item.Description);
    } else if (item.ActivityCode) {
      parts.push(item.ActivityCode);
    }

    if (item.Qty && item.Unit) {
      parts.push(`${item.Qty} ${item.Unit}`);
    }

    const sell = this.calculateTotalSell(item.Qty, item.SellPrice);
    if (sell > 0) {
      parts.push(`$${sell.toLocaleString()}`);
    }

    return parts.join(" - ");
  },

  /**
   * Check if this is a time entry
   * @param unit - The unit of measure
   * @returns True if this appears to be a time/labor entry
   */
  isTimeEntry(unit?: string): boolean {
    if (!unit) return false;
    const timeUnits = ["hours", "hour", "hrs", "hr", "days", "day"];
    return timeUnits.includes(unit.toLowerCase());
  },
};
