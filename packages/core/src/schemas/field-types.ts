/**
 * Field Type Definitions for MoneyWorks Tables
 * 
 * Defines which fields should be treated as strings, numbers, dates, etc.
 * This ensures consistent data type handling across the system.
 */

export type FieldType = "string" | "number" | "boolean" | "date" | "datetime" | "money";

/**
 * Field type mappings for all tables
 * Fields not listed here will use automatic type detection
 */
export const fieldTypes: Record<string, Record<string, FieldType>> = {
  Name: {
    // Identifiers - always strings
    code: "string",
    taxnumber: "string",
    creditcardnum: "string",
    abuid: "string",
    einvoicingid: "string",
    
    // Dates
    dateoflastsale: "date",
    creditcardexpiry: "date",
    
    // Date times
    lastmodifiedtime: "datetime",
    
    // Money/numeric fields
    creditlimit: "money",
    d90plus: "money",
    d60plus: "money", 
    d30plus: "money",
    dcurrent: "money",
    ccurrent: "money",
    dbalance: "money",
    cbalance: "money",
    discount: "number",
    splitpercent: "number",
    
    // Integer fields
    customertype: "number",
    suppliertype: "number",
    debtorterms: "number",
    creditorterms: "number",
    hold: "number",
    kind: "number",
    colour: "number",
    paymentmethod: "number",
    lastpaymentmethod: "number",
    custpromptpaymentterms: "number",
    custpromptpaymentdiscount: "number",
    supppromptpaymentterms: "number",
    supppromptpaymentdiscount: "number",
    receiptmethod: "number",
    flags: "number",
    role: "number",
    role2: "number",
    usernum: "number",
    
    // All address/text fields are strings by default
  },
  
  Account: {
    // Identifiers
    code: "string",
    accountantscode: "string",
    bankaccountnumber: "string",
    
    // Dates
    created: "date",
    laststatementimport: "date",
    
    // Date times
    lastmodifiedtime: "datetime",
    
    // Money fields
    balance: "money",
    balancef: "money",
    localbalance: "money",
    
    // Numbers
    type: "number",
    colour: "number",
    hidden: "number",
    securitylevel: "number",
    system: "number",
    pandl: "number",
    ebitda: "number",
    flags: "number",
    usernum: "number",
    manualchequenumber: "number",
    printedchequenumber: "number",
  },
  
  Transaction: {
    // Identifiers
    sequencenumber: "string",
    ourref: "string",
    theirref: "string",
    
    // Dates
    transdate: "date",
    enterdate: "date",
    duedate: "date",
    created: "date",
    
    // Date times
    lastmodifiedtime: "datetime",
    timeposted: "datetime",
    
    // Money fields
    gross: "money",
    net: "money",
    taxamount: "money",
    amtpaid: "money",
    amtwrittenoff: "money",
    balance: "money",
    
    // Numbers
    type: "number",
    status: "number",
    period: "number",
    printed: "number",
    transferred: "number",
    securitylevel: "number",
    recurring: "number",
    hold: "number",
    flags: "number",
    usernum: "number",
    
    // Special fields - keep as is
    subfile: "string", // Actually an object/array but we don't want it converted
  },
  
  Product: {
    // Identifiers
    code: "string",
    barcode: "string",
    supplierscode: "string",
    
    // Date times
    lastmodifiedtime: "datetime",
    
    // Money fields
    sellprice: "money",
    buyprice: "money",
    
    // Numbers
    stockonhand: "number",
    stockavailable: "number",
    stockonorder: "number",
    reorderlevel: "number",
    flags: "number",
    usernum: "number",
  },
  
  Detail: {
    // Identifiers - always strings
    sequencenumber: "string",
    parentseq: "string",
    serialnumber: "string",
    batchnumber: "string",
    transactiontype: "string",
    moreflags: "string", // Even though it looks numeric, it's often "0"
    
    // Date times
    lastmodifiedtime: "datetime",
    date: "date",
    
    // Money fields
    debit: "money",
    credit: "money",
    gross: "money",
    net: "money",
    tax: "money",
    unitprice: "money",
    costprice: "money",
    discount: "money",
    basecurrencynet: "money",
    originalunitcost: "money",
    
    // Numbers
    stockqty: "number",
    postedqty: "number",
    orderqty: "number",
    backorderqty: "number",
    prevshipqty: "number",
    sort: "number",
    statement: "number",
    flags: "number",
    orderstatus: "number",
    expensedtax: "number",
    securitylevel: "number",
    period: "number",
    usernum: "number",
    noninvrcvdnotinvoicedqty: "number",
  }
};

/**
 * Get field type for a specific table and field
 */
export function getFieldType(table: string, field: string): FieldType | undefined {
  const tableTypes = fieldTypes[table];
  if (!tableTypes) return undefined;
  
  // Normalize field name to lowercase for lookup
  const normalizedField = field.toLowerCase();
  return tableTypes[normalizedField];
}

/**
 * Check if a field should be kept as string (not converted to number)
 */
export function shouldKeepAsString(table: string, field: string, value: string): boolean {
  const fieldType = getFieldType(table, field);
  
  // If we have explicit type info, use it
  if (fieldType === "string" || fieldType === "date" || fieldType === "datetime") {
    return true;
  }
  
  // For unknown fields, use heuristics
  // Keep as string if it looks like an identifier or date
  if (field.toLowerCase().includes("number") || 
      field.toLowerCase().includes("code") ||
      field.toLowerCase().includes("id") ||
      field.toLowerCase().includes("ref")) {
    return true;
  }
  
  // Date pattern check
  if (/^\d{8}$/.test(value) || /^\d{14}$/.test(value)) {
    return true;
  }
  
  return false;
}