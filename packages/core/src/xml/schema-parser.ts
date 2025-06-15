/**
 * Schema-Aware XML Parser for MoneyWorks
 * 
 * Uses Zod schemas to validate and transform parsed XML data
 */

import { z } from "zod";
import { parseXML as baseParseXML } from "./parser";
import { getFieldType } from "../schemas/field-types";
import type { TableName, TableMapCamel } from "../tables";

/**
 * Create a Zod schema for a Detail record based on field types
 */
const createDetailSchema = () => {
  return z.object({
    // Identifiers - keep as strings
    sequenceNumber: z.union([z.string(), z.number()]).transform(String),
    lastModifiedTime: z.union([z.string(), z.number()]).transform(String),
    parentSeq: z.union([z.string(), z.number()]).transform(String),
    transactionType: z.string().optional(),
    moreFlags: z.union([z.string(), z.number()]).transform(String).optional(),
    
    // Dates
    date: z.string().optional(),
    
    // Numbers
    sort: z.number().optional(),
    postedQty: z.number().optional(),
    stockQty: z.number().optional(),
    orderQty: z.number().optional(),
    backorderQty: z.number().optional(),
    prevShipQty: z.number().optional(),
    statement: z.number().optional(),
    flags: z.number().optional(),
    orderStatus: z.number().optional(),
    expensedTax: z.number().optional(),
    securityLevel: z.number().optional(),
    period: z.number().optional(),
    userNum: z.number().optional(),
    nonInvRcvdNotInvoicedQty: z.number().optional(),
    lineNumber: z.number().optional(),
    
    // Money fields
    gross: z.number().optional(),
    tax: z.number().optional(),
    net: z.number().optional(),
    debit: z.number().optional(),
    credit: z.number().optional(),
    unitPrice: z.number().optional(),
    costPrice: z.number().optional(),
    discount: z.number().optional(),
    baseCurrencyNet: z.number().optional(),
    originalUnitCost: z.number().optional(),
    
    // Strings
    account: z.string().optional(),
    dept: z.string().optional(),
    department: z.string().optional(), // Alternative name
    taxCode: z.string().optional(),
    description: z.string().optional(),
    stockCode: z.string().optional(),
    job: z.string().optional(),
    jobCode: z.string().optional(), // Alternative name
    saleUnit: z.string().optional(),
    serialNumber: z.string().optional(),
    stockLocation: z.string().optional(),
    userText: z.string().optional(),
    taggedText: z.string().optional(),
    custom1: z.string().optional(),
    custom2: z.string().optional(),
  }).passthrough(); // Allow additional fields
};

/**
 * Create a Zod schema for a Transaction record
 */
const createTransactionSchema = () => {
  return z.object({
    // Identifiers - keep as strings
    sequenceNumber: z.string(),
    lastModifiedTime: z.string(),
    timePosted: z.string(),
    
    // Dates (as strings in YYYYMMDD format)
    transDate: z.string(),
    enterDate: z.string(),
    dueDate: z.string(),
    datePaid: z.string(),
    promptPaymentDate: z.string(),
    
    // Core fields
    ourRef: z.string(),
    theirRef: z.string(),
    type: z.string(),
    nameCode: z.string(),
    flag: z.string(),
    description: z.string(),
    status: z.string(),
    
    // Numbers
    period: z.number(),
    hold: z.number(),
    aging: z.number(),
    taxCycle: z.number(),
    recurring: z.number(),
    printed: z.number(),
    flags: z.number(),
    taxProcessed: z.number(),
    colour: z.number(),
    bankJnSeq: z.number(),
    paymentMethod: z.number(),
    securityLevel: z.number(),
    userNum: z.number(),
    emailed: z.number(),
    transferred: z.number(),
    
    // Money fields
    gross: z.number(),
    taxAmount: z.number(),
    amtPaid: z.number(),
    payAmount: z.number(),
    promptPaymentAmt: z.number(),
    freightAmount: z.number(),
    amtWrittenOff: z.number(),
    orderTotal: z.number(),
    orderShipped: z.number(),
    orderDeposit: z.number(),
    exchangeRate: z.number(),
    promptPaymentTerms: z.number(),
    promptPaymentDisc: z.number(),
    
    // Strings
    analysis: z.string(),
    contra: z.union([z.string(), z.number()]).transform(String),
    toFrom: z.string(),
    salesPerson: z.string(),
    prodPriceCode: z.string(),
    mailingAddress: z.string(),
    deliveryAddress: z.string(),
    freightCode: z.string(),
    freightDetails: z.string(),
    specialBank: z.string(),
    specialBranch: z.string(),
    specialAccount: z.string(),
    currency: z.string(),
    enteredBy: z.string(),
    postedBy: z.string().optional().default(""),
    approvedBy1: z.string(),
    approvedBy2: z.string(),
    userText: z.string(),
    user1: z.string(),
    user2: z.string(),
    user3: z.string(),
    user4: z.string(),
    user5: z.string(),
    user6: z.string(),
    user7: z.string(),
    user8: z.string(),
    taggedText: z.string(),
    
    // Sequence numbers
    originatingOrderSeq: z.number(),
    currencyTransferSeq: z.number(),
    
    // Details array
    details: z.array(createDetailSchema()).optional(),
  }).passthrough(); // Allow additional fields
};

/**
 * Create a Zod schema for a Name record
 */
const createNameSchema = () => {
  return z.object({
    // Identifiers - keep as strings
    code: z.string(),
    taxNumber: z.string(),
    creditCardNum: z.string(),
    abuId: z.string(),
    einvoicingId: z.string(),
    lastModifiedTime: z.string(),
    
    // Dates
    dateOfLastSale: z.string(),
    creditCardExpiry: z.string(),
    
    // Core fields
    name: z.string(),
    
    // Contact info
    contact: z.string(),
    phone: z.string(),
    fax: z.string(),
    email: z.string(),
    webURL: z.string(),
    mobile: z.string(),
    
    // Address fields
    address1: z.string(),
    address2: z.string(),
    address3: z.string(),
    address4: z.string(),
    postcode: z.string(),
    state: z.string(),
    addressCountry: z.string(),
    
    // Delivery address
    delivery1: z.string(),
    delivery2: z.string(),
    delivery3: z.string(),
    delivery4: z.string(),
    deliveryPostcode: z.string(),
    deliveryState: z.string(),
    deliveryCountry: z.string(),
    
    // Numbers
    customerType: z.number(),
    supplierType: z.number(),
    debtorTerms: z.number(),
    creditorTerms: z.number(),
    hold: z.number(),
    kind: z.number(),
    colour: z.number(),
    paymentMethod: z.number(),
    lastPaymentMethod: z.number(),
    receiptMethod: z.number(),
    flags: z.number(),
    role: z.number(),
    role2: z.number(),
    userNum: z.number(),
    
    // Money fields
    creditLimit: z.number(),
    d90Plus: z.number(),
    d60Plus: z.number(),
    d30Plus: z.number(),
    dCurrent: z.number(),
    cCurrent: z.number(),
    dBalance: z.number(),
    cBalance: z.number(),
    discount: z.number(),
    splitPercent: z.number(),
    
    // Other fields
    custPromptPaymentTerms: z.number(),
    custPromptPaymentDiscount: z.number(),
    suppPromptPaymentTerms: z.number(),
    suppPromptPaymentDiscount: z.number(),
  }).passthrough();
};

/**
 * Get the appropriate Zod schema for a table
 */
function getTableSchema(table: TableName): z.ZodSchema<any> {
  switch (table) {
    case "Transaction":
      return createTransactionSchema();
    case "Name":
      return createNameSchema();
    // Add more schemas as needed
    default:
      // Return a passthrough schema for unsupported tables
      return z.object({}).passthrough();
  }
}

/**
 * Parse XML with schema validation and transformation
 */
export async function parseXMLWithSchema<T extends TableName>(
  xml: string,
  table: T,
  format: "xml-terse" | "xml-verbose",
): Promise<TableMapCamel[T][]> {
  // First, use the base parser
  const rawRecords = await baseParseXML(xml, table, format);
  
  // Get the schema for this table
  const schema = getTableSchema(table);
  
  // Validate and transform each record
  const validatedRecords = rawRecords.map((record, index) => {
    try {
      // Parse with Zod schema
      const validated = schema.parse(record);
      return validated as TableMapCamel[T];
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn(`Validation warning for ${table} record ${index}:`, error.errors);
        // Return the original record if validation fails
        // This allows us to be lenient while logging issues
        return record;
      }
      throw error;
    }
  });
  
  return validatedRecords;
}

/**
 * Create a dynamic schema based on field types
 */
export function createDynamicSchema(table: TableName): z.ZodSchema<any> {
  const schemaObj: Record<string, z.ZodTypeAny> = {};
  
  // This would need to be expanded to read field definitions
  // For now, returning the predefined schemas
  return getTableSchema(table);
}

/**
 * Validate a single record against schema
 */
export function validateRecord<T extends TableName>(
  table: T,
  record: unknown
): { success: boolean; data?: TableMapCamel[T]; errors?: z.ZodError } {
  const schema = getTableSchema(table);
  const result = schema.safeParse(record);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Transform field value based on schema type
 */
export function transformFieldValue(
  table: string,
  field: string,
  value: unknown
): unknown {
  const fieldType = getFieldType(table, field);
  
  if (!fieldType || value === null || value === undefined) {
    return value;
  }
  
  switch (fieldType) {
    case "string":
    case "date":
    case "datetime":
      return String(value);
      
    case "number":
    case "money":
      if (typeof value === "string" && value !== "") {
        const num = Number(value);
        return isNaN(num) ? value : num;
      }
      return value;
      
    case "boolean":
      return value === "1" || value === 1 || value === true;
      
    default:
      return value;
  }
}