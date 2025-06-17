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
    lastModifiedTime: z.string().optional(),
    timePosted: z.string().optional(),
    
    // Dates (as strings in YYYYMMDD format)
    transDate: z.string().optional(),
    enterDate: z.string().optional(),
    dueDate: z.string().optional(),
    datePaid: z.string().optional(),
    promptPaymentDate: z.string().optional(),
    
    // Core fields
    ourRef: z.string().optional(),
    theirRef: z.string().optional(),
    type: z.string().optional(),
    nameCode: z.string().optional(),
    flag: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    
    // Numbers
    period: z.number().optional(),
    hold: z.number().optional(),
    aging: z.number().optional(),
    taxCycle: z.number().optional(),
    recurring: z.number().optional(),
    printed: z.number().optional(),
    flags: z.number().optional(),
    taxProcessed: z.number().optional(),
    colour: z.number().optional(),
    bankJnSeq: z.number().optional(),
    paymentMethod: z.number().optional(),
    securityLevel: z.number().optional(),
    userNum: z.number().optional(),
    emailed: z.number().optional(),
    transferred: z.number().optional(),
    
    // Money fields
    gross: z.number().optional(),
    taxAmount: z.number().optional(),
    amtPaid: z.number().optional(),
    payAmount: z.number().optional(),
    promptPaymentAmt: z.number().optional(),
    freightAmount: z.number().optional(),
    amtWrittenOff: z.number().optional(),
    orderTotal: z.number().optional(),
    orderShipped: z.number().optional(),
    orderDeposit: z.number().optional(),
    exchangeRate: z.number().optional(),
    promptPaymentTerms: z.number().optional(),
    promptPaymentDisc: z.number().optional(),
    
    // Strings
    analysis: z.string().optional(),
    contra: z.union([z.string(), z.number()]).optional(),
    toFrom: z.string().optional(),
    salesPerson: z.string().optional(),
    prodPriceCode: z.string().optional(),
    mailingAddress: z.string().optional(),
    deliveryAddress: z.string().optional(),
    freightCode: z.string().optional(),
    freightDetails: z.string().optional(),
    specialBank: z.string().optional(),
    specialBranch: z.string().optional(),
    specialAccount: z.string().optional(),
    currency: z.string().optional(),
    enteredBy: z.string().optional(),
    postedBy: z.string().optional().default(""),
    approvedBy1: z.string().optional(),
    approvedBy2: z.string().optional(),
    userText: z.string().optional(),
    user1: z.string().optional(),
    user2: z.string().optional(),
    user3: z.string().optional(),
    user4: z.string().optional(),
    user5: z.string().optional(),
    user6: z.string().optional(),
    user7: z.string().optional(),
    user8: z.string().optional(),
    taggedText: z.string().optional(),
    
    // Sequence numbers
    originatingOrderSeq: z.number().optional(),
    currencyTransferSeq: z.number().optional(),
    
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
    taxNumber: z.string().optional(),
    creditCardNum: z.string().optional(),
    abuId: z.string().optional(),
    einvoicingId: z.string().optional(),
    lastModifiedTime: z.string().optional(),
    
    // Dates
    dateOfLastSale: z.string().optional(),
    creditCardExpiry: z.string().optional(),
    
    // Core fields
    name: z.string(),
    
    // Contact info
    contact: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
    email: z.string().optional(),
    webURL: z.string().optional(),
    mobile: z.string().optional(),
    
    // Address fields
    address1: z.string().optional(),
    address2: z.string().optional(),
    address3: z.string().optional(),
    address4: z.string().optional(),
    postcode: z.string().optional(),
    state: z.string().optional(),
    addressCountry: z.string().optional(),
    
    // Delivery address
    delivery1: z.string().optional(),
    delivery2: z.string().optional(),
    delivery3: z.string().optional(),
    delivery4: z.string().optional(),
    deliveryPostcode: z.string().optional(),
    deliveryState: z.string().optional(),
    deliveryCountry: z.string().optional(),
    
    // Numbers
    customerType: z.number().optional(),
    supplierType: z.number().optional(),
    debtorTerms: z.number().optional(),
    creditorTerms: z.number().optional(),
    hold: z.number().optional(),
    kind: z.number().optional(),
    colour: z.number().optional(),
    paymentMethod: z.number().optional(),
    lastPaymentMethod: z.number().optional(),
    receiptMethod: z.number().optional(),
    flags: z.number().optional(),
    role: z.number().optional(),
    role2: z.number().optional(),
    userNum: z.number().optional(),
    
    // Money fields
    creditLimit: z.number().optional(),
    d90Plus: z.number().optional(),
    d60Plus: z.number().optional(),
    d30Plus: z.number().optional(),
    dCurrent: z.number().optional(),
    cCurrent: z.number().optional(),
    dBalance: z.number().optional(),
    cBalance: z.number().optional(),
    discount: z.number().optional(),
    splitPercent: z.number().optional(),
    
    // Other fields
    custPromptPaymentTerms: z.number().optional(),
    custPromptPaymentDiscount: z.number().optional(),
    suppPromptPaymentTerms: z.number().optional(),
    suppPromptPaymentDiscount: z.number().optional(),
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
  // This would need to be expanded to read field definitions dynamically
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