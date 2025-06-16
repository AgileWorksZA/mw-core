/**
 * Export Builder
 *
 * Fluent API for building export queries.
 */

import type { MoneyWorksRESTClient } from "../rest/client";
import type { ExportFormat, ExportOptions } from "../rest/types";
import type { TableMapCamel, TableName } from "../tables";

/**
 * Type-safe export builder
 */
export class ExportBuilder<T extends TableName> {
  private table: T;
  private options: ExportOptions = {};

  constructor(table: T) {
    this.table = table;
  }

  /**
   * Set export format
   */
  format(format: ExportFormat): this {
    this.options.format = format;
    return this;
  }

  /**
   * Add filter expression
   */
  where(filter: string): this {
    this.options.filter = filter;
    return this;
  }

  /**
   * Filter by field value
   */
  whereField<K extends keyof TableMapCamel[T]>(
    field: K,
    operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE",
    value: TableMapCamel[T][K],
  ): this {
    // Convert camelCase field to MoneyWorks field name
    const mwField = this.getMWFieldName(String(field));
    // Add space before LIKE operator
    const op = operator === "LIKE" ? ` ${operator} ` : operator;
    const filterExpr = `${mwField}${op}${this.formatValue(value)}`;

    if (this.options.filter) {
      this.options.filter += ` AND ${filterExpr}`;
    } else {
      this.options.filter = filterExpr;
    }

    return this;
  }

  /**
   * Set starting record
   */
  start(offset: number): this {
    this.options.start = offset;
    return this;
  }

  /**
   * Set record limit
   */
  limit(count: number): this {
    this.options.limit = count;
    return this;
  }

  /**
   * Order by field
   */
  orderBy<K extends keyof TableMapCamel[T]>(
    field: K,
    direction: "ASC" | "DESC" = "ASC",
  ): this {
    // Convert camelCase field to MoneyWorks field name
    const mwField = this.getMWFieldName(String(field));
    this.options.orderBy = `${mwField} ${direction}`;
    return this;
  }

  /**
   * Include calculated fields
   */
  includeCalculated(): this {
    this.options.includeCalculated = true;
    return this;
  }

  /**
   * Don't maintain connection
   */
  noLinger(): this {
    this.options.noLinger = true;
    return this;
  }

  /**
   * Execute export with client
   */
  async execute(client: MoneyWorksRESTClient): Promise<TableMapCamel[T][]> {
    // Default to JSON format for typed results
    const options = {
      ...this.options,
      format: this.options.format || "json",
    };

    const result = await client.export(this.table, options);

    // Ensure we get typed array
    if (typeof result === "string") {
      throw new Error("Export format returned string instead of records");
    }

    return result;
  }

  /**
   * Execute and get raw string result
   */
  async executeRaw(client: MoneyWorksRESTClient): Promise<string> {
    const result = await client.export(this.table, this.options);

    // Convert to string if needed
    if (typeof result !== "string") {
      throw new Error("Export format returned records instead of string");
    }

    return result;
  }

  /**
   * Get built options
   */
  getOptions(): ExportOptions {
    return { ...this.options };
  }

  /**
   * Convert camelCase field name to MoneyWorks field name
   */
  private getMWFieldName(camelField: string): string {
    // Comprehensive field mappings from camelCase to MoneyWorks
    const fieldMap: Record<string, string> = {
      // Common fields across tables
      sequenceNumber: "sequencenumber",
      lastModifiedTime: "lastmodifiedtime",
      code: "code",
      colour: "colour",
      userNum: "usernum",
      userText: "usertext",

      // Transaction fields
      nameCode: "namecode",
      transDate: "transdate",
      ourRef: "ourref",
      theirRef: "theirref",
      typeCode: "type",
      enterDate: "enterdate",
      gross: "gross",
      tax: "tax",
      net: "net",
      subTotal: "subtotal",
      allocated: "allocated",
      balance: "balance",
      flagAlert: "flagalert",
      flagInProgress: "flaginprogress",
      analysisCodeID: "analysiscodeid",
      batchCode: "batchcode",
      ourRef2: "ourref2",
      printedFormID: "printedformid",

      // Account fields
      accountType: "type",
      name: "description", // For accounts, description is the name
      bankAccountNumber: "bankaccountnumber",
      accountantCode: "accountantcode",
      securityLevel: "securitylevel",
      manualChequeNumber: "manualchequenumber",
      printedChequeNumber: "printedchequenumber",
      lastStatementImport: "laststatementimport",
      feedID: "feedid",
      cashFlow: "cashflow",
      cashForecast: "cashforecast",
      importFormat: "importformat",

      // Name (customer/supplier) fields
      customerType: "customertype",
      supplierType: "suppliertype",
      creditLimit: "creditlimit",
      creditTerms: "creditterms",
      supplierTerms: "supplierterms",
      accountCode: "accountcode",
      postCode: "postcode",
      deliveryPostCode: "deliverypostcode",
      taxNumber: "taxnumber",
      bankName: "bankname",
      bankBranch: "bankbranch",
      bankAccount: "bankaccount",
      holdFlag: "holdflag",
      webSite: "website",
      customerPricingLevel: "customerpricinglevel",
      cacheBalance: "cachebalance",

      // Product fields
      sellUnit: "sellunit",
      sellPrice: "sellprice",
      buyUnit: "buyunit",
      buyPrice: "buyprice",
      stockOnHand: "stockonhand",
      minimumStock: "minimumstock",
      maximumStock: "maximumstock",
      customDuty: "customduty",
      supplierCode: "suppliercode",
      reorderQuantity: "reorderquantity",
      salesAccCode: "salesacccode",
      stockAccCode: "stockacccode",
      cogAccCode: "cogacccode",
      buildAccCode: "buildacccode",
      serialisedAlways: "serialisedalways",
      serialisedOnSale: "serialisedonsale",
      leadDays: "leaddays",
      stockLocations: "stocklocations",
      barCode: "barcode",
      binLocation: "binlocation",
      suppliersProductCode: "suppliersproductcode",
      customField1: "customfield1",
      customField2: "customfield2",
      customField3: "customfield3",
      customField4: "customfield4",

      // Department fields
      departmentCode: "departmentcode",

      // Job fields
      jobCode: "jobcode",
      startDate: "startdate",
      dueDate: "duedate",
      completedDate: "completeddate",

      // Asset fields
      assetCode: "assetcode",
      purchaseDate: "purchasedate",
      purchasePrice: "purchaseprice",
      currentValue: "currentvalue",
      depreciationMethod: "depreciationmethod",

      // Detail fields
      parentSeq: "Detail.ParentSeq",
      account: "Detail.Account",
      debit: "Detail.Debit",
      credit: "Detail.Credit",
      description: "Detail.Description",
      taxCode: "Detail.TaxCode",
      job: "Detail.Job",
      stockCode: "Detail.StockCode",
      stockQty: "Detail.StockQty",
      unitPrice: "Detail.UnitPrice",
    };

    // Check if field has table-specific override
    const override = fieldMap[camelField];
    if (override) {
      return override;
    }

    // Default: convert to lowercase
    return camelField.toLowerCase();
  }

  /**
   * Format value for filter
   */
  private formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return "NULL";
    }

    if (typeof value === "string") {
      // Escape quotes
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }

    if (value instanceof Date) {
      // Format as YYYYMMDD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      return `"${year}${month}${day}"`;
    }

    if (typeof value === "boolean") {
      return value ? "1" : "0";
    }

    return String(value);
  }
}

/**
 * Create export builder for a table
 */
export function exportFrom<T extends TableName>(table: T): ExportBuilder<T> {
  return new ExportBuilder(table);
}
