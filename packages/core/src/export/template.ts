/**
 * Export Template Utilities
 *
 * Pre-built templates and utilities for custom exports.
 */

import type { ExportFormat } from "../rest/types";

/**
 * Transaction templates
 */
export const transactionTemplates = {
  /**
   * Simple transaction summary
   */
  summary: "[OurRef]\t[TransDate]\t[Gross]\t[Description]",

  /**
   * Transaction with details
   */
  withDetails: `
[OurRef] - [Description]
Date: [TransDate]
Total: [Gross]

Details:
{[Detail.Account]: [Detail.Description] $[Detail.Gross]}
`,

  /**
   * Invoice format
   */
  invoice: `
Invoice: [OurRef]
Customer: GetNameField([NameCode], "Name")
Due: DateAdd([TransDate], GetNameField([NameCode], "Terms"))

{[Detail.Description]: [Detail.Net] + [Detail.Tax]}

Subtotal: [Net]
Tax: [Tax]
Total: [Gross]
`,

  /**
   * Statement format
   */
  statement: `
Statement for: GetNameField([NameCode], "Name")
Date: [TransDate]

[Description]: [Gross]
Balance: GetNameField([NameCode], "Balance")
`,
};

/**
 * Name/Customer templates
 */
export const nameTemplates = {
  /**
   * Customer list
   */
  list: "[Code]\t[Name]\t[Phone]\t[Email]",

  /**
   * Address labels
   */
  addressLabel: `
[Name]
[Addr1]
[Addr2]
[Addr3]
[Addr4]
[Postcode]
`,

  /**
   * Contact details
   */
  contactCard: `
Name: [Name]
Code: [Code]
Type: If([Type]=1, "Customer", If([Type]=2, "Supplier", "Other"))
Phone: [Phone]
Mobile: [Mobile]
Email: [Email]
Website: [Web]
`,
};

/**
 * Product templates
 */
export const productTemplates = {
  /**
   * Price list
   */
  priceList: "[Code]\t[Description]\t[SellUnit]\t[SellPrice]",

  /**
   * Inventory status
   */
  inventory: `
Product: [Code] - [Description]
On Hand: [StockOnHand]
Available: [StockAvailable]
Value: [StockOnHand] * [StockAverageCost]
`,

  /**
   * Product catalog
   */
  catalog: `
[Code]: [Description]
Price: $[SellPrice] per [SellUnit]
Category: GetGeneralField([Category], "Description")
Stock: [StockOnHand] units
`,
};

/**
 * Report templates
 */
export const reportTemplates = {
  /**
   * Aged receivables
   */
  agedReceivables: `
Customer: [Code] - [Name]
Current: [Balance_0]
30 Days: [Balance_1]
60 Days: [Balance_2]
90+ Days: [Balance_3]
Total: [Balance]
`,

  /**
   * Sales summary
   */
  salesSummary: `
Period: [Period]
Customer: [NameCode]
Sales: Sum([Gross] WHERE [TypeCode]="DI")
Credits: Sum([Gross] WHERE [TypeCode]="DC")
Net: Sales - Credits
`,
};

/**
 * Build custom template
 */
export function buildTemplate(
  template: string,
  variables?: Record<string, unknown>,
): ExportFormat {
  let processed = template;

  // Replace variables
  if (variables) {
    for (const [key, value] of Object.entries(variables)) {
      processed = processed.replace(
        new RegExp(`\\$${key}`, "g"),
        String(value),
      );
    }
  }

  return { template: processed };
}

/**
 * Build script format
 */
export function buildScript(scriptCode: string): ExportFormat {
  return { script: scriptCode };
}

/**
 * Common MWScript functions for templates
 */
export const templateFunctions = {
  /**
   * Get field from related record
   */
  getField: (table: string, code: string, field: string) =>
    `Get${table}Field("${code}", "${field}")`,

  /**
   * Date calculations
   */
  dateAdd: (date: string, days: number) => `DateAdd(${date}, ${days})`,

  /**
   * Conditional logic
   */
  if: (condition: string, trueValue: string, falseValue: string) =>
    `If(${condition}, ${trueValue}, ${falseValue})`,

  /**
   * Aggregations
   */
  sum: (field: string, filter?: string) =>
    filter ? `Sum(${field} WHERE ${filter})` : `Sum(${field})`,

  count: (table: string, filter?: string) =>
    filter ? `Count(${table} WHERE ${filter})` : `Count(${table})`,

  /**
   * String operations
   */
  concat: (...values: string[]) => values.join(" + "),

  upper: (value: string) => `Upper(${value})`,

  lower: (value: string) => `Lower(${value})`,
};

/**
 * Build complex template with MWScript
 */
export function buildComplexTemplate(
  baseTemplate: string,
  calculations: Record<string, string>,
): ExportFormat {
  let template = baseTemplate;

  // Add calculations as script expressions
  for (const [key, expr] of Object.entries(calculations)) {
    template = template.replace(new RegExp(`\\[${key}\\]`, "g"), `[=${expr}]`);
  }

  return { template };
}

// Export legacy-style object for backward compatibility
export const ExportTemplate = {
  transaction: transactionTemplates,
  name: nameTemplates,
  product: productTemplates,
  reports: reportTemplates,
  build: buildTemplate,
  script: buildScript,
  functions: templateFunctions,
  buildComplex: buildComplexTemplate,
};
