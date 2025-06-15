/**
 * Field Converter
 *
 * Converts field names between camelCase (TypeScript) and PascalCase (MoneyWorks).
 * Also handles lowercase field names from MoneyWorks XML/TSV exports.
 */

import type {
  Account,
  AccountCamel,
  Product,
  ProductCamel,
  TableMap,
  TableMapCamel,
  TableName,
  Transaction,
  TransactionCamel,
} from "../tables";
import type { Name, NameCamel } from "../tables";
import type { DetailCamel, Detail as DetailPascal } from "../tables/detail";
import { fromCamelCase, toCamelCase } from "./key-converter";

/**
 * Field mappings for Detail table
 * Maps camelCase to PascalCase field names
 */
const detailFieldMappings: Record<keyof DetailCamel, keyof DetailPascal> = {
  // Core fields
  sequenceNumber: "SequenceNumber",
  lastModifiedTime: "LastModifiedTime",
  parentSeq: "Detail.ParentSeq",
  account: "Detail.Account",
  debit: "Detail.Debit",
  credit: "Detail.Credit",
  description: "Detail.Description",
  taxCode: "Detail.TaxCode",
  gross: "Detail.Gross",
  net: "Detail.Net",
  tax: "Detail.Tax",

  // Additional fields
  department: "Detail.Department",
  job: "Detail.Job",
  stockCode: "Detail.StockCode",
  stockQty: "Detail.StockQty",
  unitPrice: "Detail.UnitPrice",
  costPrice: "Detail.CostPrice",
  saleUnit: "Detail.SaleUnit",
  lineNumber: "Detail.LineNumber",
  flags: "Detail.Flags",
  moreFlags: "Detail.MoreFlags",
  custom1: "Detail.Custom1",
  custom2: "Detail.Custom2",
  serialNumber: "Detail.SerialNumber",
  batchNumber: "Detail.BatchNumber",
  discount: "Detail.Discount",
};

/**
 * Convert from PascalCase (MoneyWorks) to camelCase (TypeScript)
 */
export function convertPascalToCamel<T extends TableName>(
  table: T,
  record: Partial<TableMap[T]>,
): Partial<TableMapCamel[T]> {
  // Use table-specific converters when available
  switch (table) {
    case "Detail":
      return convertDetailPascalToCamel(
        record as Partial<DetailPascal>,
      ) as Partial<TableMapCamel[T]>;
    case "Account":
      return convertAccountToCamel(record as Partial<Account>) as Partial<
        TableMapCamel[T]
      >;
    case "Transaction":
      return convertTransactionToCamel(
        record as Partial<Transaction>,
      ) as Partial<TableMapCamel[T]>;
    case "Name":
      return convertNameToCamel(record as Partial<Name>) as Partial<
        TableMapCamel[T]
      >;
    case "Product":
      return convertProductToCamel(record as Partial<Product>) as Partial<
        TableMapCamel[T]
      >;
    default:
      // Fallback to generic conversion
      return genericToCamelCase(record);
  }
}

/**
 * Convert from camelCase (TypeScript) to PascalCase (MoneyWorks)
 */
export function convertCamelToPascal<T extends TableName>(
  table: T,
  record: Partial<TableMapCamel[T]>,
): Partial<TableMap[T]> {
  // For Detail table, use special mapping
  if (table === "Detail") {
    return convertDetailCamelToPascal(
      record as Partial<DetailCamel>,
    ) as Partial<TableMap[T]>;
  }

  // Fallback to generic conversion
  return genericFromCamelCase(record);
}

/**
 * Convert Detail from PascalCase to camelCase
 */
function convertDetailPascalToCamel(
  record: Partial<DetailPascal>,
): Partial<DetailCamel> {
  const result: Partial<DetailCamel> = {};

  // Map of lowercase field names to camelCase for Detail
  const fieldMap: Record<string, string> = {
    // Core fields
    sequencenumber: "sequenceNumber",
    lastmodifiedtime: "lastModifiedTime",
    parentseq: "parentSeq",
    sort: "sort",
    account: "account",
    dept: "dept",
    
    // Quantity and tax fields
    postedqty: "postedQty",
    taxcode: "taxCode",
    gross: "gross",
    tax: "tax",
    net: "net",
    debit: "debit",
    credit: "credit",
    
    // Description and stock fields
    description: "description",
    stockqty: "stockQty",
    stockcode: "stockCode",
    costprice: "costPrice",
    unitprice: "unitPrice",
    
    // Job and sales fields
    statement: "statement",
    jobcode: "jobCode",
    saleunit: "saleUnit",
    discount: "discount",
    
    // Order fields
    orderqty: "orderQty",
    backorderqty: "backorderQty",
    prevshipqty: "prevShipQty",
    basecurrencynet: "baseCurrencyNet",
    
    // Serial and tracking
    serialnumber: "serialNumber",
    batchnumber: "batchNumber",
    period: "period",
    transactiontype: "transactionType",
    securitylevel: "securityLevel",
    stocklocation: "stockLocation",
    
    // Status fields
    orderstatus: "orderStatus",
    expensedtax: "expensedTax",
    date: "date",
    moreflags: "moreFlags",
    
    // User fields
    usernum: "userNum",
    usertext: "userText",
    taggedtext: "taggedText",
    
    // Non-inventory fields
    noninvrcvdnotinvoicedqty: "nonInvRcvdNotInvoicedQty",
    custom1: "custom1",
    custom2: "custom2",
    originalunitcost: "originalUnitCost",
  };

  for (const [key, value] of Object.entries(record)) {
    const lowerKey = key.toLowerCase();
    const camelKey = fieldMap[lowerKey] || toCamelCase(key);
    if (camelKey) {
      (result as Record<string, unknown>)[camelKey] = value;
    }
  }

  return result;
}

/**
 * Convert Detail from camelCase to PascalCase
 */
function convertDetailCamelToPascal(
  record: Partial<DetailCamel>,
): Partial<DetailPascal> {
  const result: Partial<DetailPascal> = {};

  for (const [key, value] of Object.entries(record)) {
    // Use direct mapping or fallback to PascalCase conversion
    const pascalKey =
      detailFieldMappings[key as keyof DetailCamel] || fromCamelCase(key);
    (result as Record<string, unknown>)[pascalKey] = value;
  }

  return result;
}

/**
 * Convert Account fields from lowercase to camelCase
 */
function convertAccountToCamel(
  record: Partial<Account>,
): Partial<AccountCamel> {
  const result: Partial<AccountCamel> = {};

  // Map of lowercase field names to camelCase
  const fieldMap: Record<string, keyof AccountCamel> = {
    // Core fields
    code: "code",
    type: "type",
    description: "description",

    // Additional fields
    accountantscode: "accountantsCode",
    taxcode: "taxCode",
    bankaccountnumber: "bankAccountNumber",
    currency: "currency",
    colour: "colour",
    hidden: "hidden",
    securitylevel: "securityLevel",
    system: "system",
    // Group and category fields
    category: "category",
    category2: "category2",
    category3: "category3",
    category4: "category4",
    group: "group",
    usernum: "userNum",
    usertext: "userText",
    manualchequenumber: "manualChequeNumber",
    printedchequenumber: "printedChequeNumber",
    laststatementimport: "lastStatementImport",
    // P&L and other fields
    pandl: "pandL",
    ebitda: "ebitda",
    comments: "comments",
    created: "created",
    taggedtext: "taggedText",
    lastmodifiedtime: "lastModifiedTime",
    // Balance fields
    balance: "balance",
    balancef: "balanceF",
    localbalance: "localBalance",
    // Flags and modUser
    flags: "flags",
    moduser: "modUser",
  };

  for (const [key, value] of Object.entries(record)) {
    const lowerKey = key.toLowerCase();
    const camelKey =
      fieldMap[lowerKey] || (toCamelCase(key) as keyof AccountCamel);
    if (camelKey) {
      (result as Record<string, unknown>)[camelKey] = value;
    }
  }

  return result;
}

/**
 * Convert Transaction fields from lowercase to camelCase
 */
function convertTransactionToCamel(
  record: Partial<Transaction>,
): Partial<TransactionCamel> {
  const result: Partial<TransactionCamel> = {};

  // Map of lowercase field names to camelCase
  const fieldMap: Record<string, keyof TransactionCamel> = {
    // Core fields
    sequencenumber: "sequenceNumber",
    namecode: "nameCode",
    transdate: "transDate",
    enterdate: "enterDate",
    description: "description",
    gross: "gross",
    taxamount: "taxAmount",
    net: "net",
    ourref: "ourRef",
    theirref: "theirRef",
    type: "type",

    // Additional fields
    duedate: "dueDate",
    amtpaid: "amtPaid",
    amtwrittenoff: "amtWrittenOff",
    balance: "balance",
    status: "status",
    period: "period",
    tofrom: "toFrom",
    department: "department",
    bankaccount: "bankAccount",
    currency: "currency",
    exchangerate: "exchangeRate",
    recurring: "recurring",
    printed: "printed",
    transferred: "transferred",
    securitylevel: "securityLevel",
    enteredby: "enteredBy",
    postedby: "postedBy",
    timeposted: "timePosted",
    created: "created",
    lastmodifiedtime: "lastModifiedTime",
    hold: "hold",
    usernum: "userNum",
    usertext: "userText",
    flags: "flags",
    moduser: "modUser",
    subfile: "subfile", // Keep as-is for transaction details
    details: "details", // For flattened detail records
    
    // Additional fields found in the data
    datepaid: "datePaid",
    payamount: "payAmount",
    taxcycle: "taxCycle",
    taxprocessed: "taxProcessed",
    salesperson: "salesPerson",
    bankjnseq: "bankJnSeq",
    paymentmethod: "paymentMethod",
    promptpaymentdate: "promptPaymentDate",
    promptpaymentamt: "promptPaymentAmt",
    prodpricecode: "prodPriceCode",
    mailingaddress: "mailingAddress",
    deliveryaddress: "deliveryAddress",
    freightcode: "freightCode",
    freightamount: "freightAmount",
    freightdetails: "freightDetails",
    specialbank: "specialBank",
    specialbranch: "specialBranch",
    specialaccount: "specialAccount",
    ordertotal: "orderTotal",
    ordershipped: "orderShipped",
    orderdeposit: "orderDeposit",
    originatingorderseq: "originatingOrderSeq",
    currencytransferseq: "currencyTransferSeq",
    promptpaymentterms: "promptPaymentTerms",
    promptpaymentdisc: "promptPaymentDisc",
    approvedby1: "approvedBy1",
    approvedby2: "approvedBy2",
    taggedtext: "taggedText",
  };

  for (const [key, value] of Object.entries(record)) {
    const lowerKey = key.toLowerCase();
    
    // Special handling for details array
    if (key === "details" && Array.isArray(value)) {
      // Convert each detail record's fields to camelCase
      (result as Record<string, unknown>).details = value.map((detail: any) => {
        return convertDetailPascalToCamel(detail);
      });
    } else {
      const camelKey =
        fieldMap[lowerKey] || (toCamelCase(key) as keyof TransactionCamel);
      if (camelKey) {
        (result as Record<string, unknown>)[camelKey] = value;
      }
    }
  }

  return result;
}

/**
 * Convert Name fields from lowercase to camelCase
 */
function convertNameToCamel(record: Partial<Name>): Partial<NameCamel> {
  const result: Partial<NameCamel> = {};

  // Map of lowercase field names to camelCase
  const fieldMap: Record<string, keyof NameCamel> = {
    // Core fields
    code: "code",
    name: "name",

    // Contact fields
    contact: "contact",
    phone: "phone",
    fax: "fax",
    mobile: "mobile",
    email: "email",
    weburl: "webURL",

    // Address fields
    address1: "address1",
    address2: "address2",
    address3: "address3",
    address4: "address4",
    delivery1: "delivery1",
    delivery2: "delivery2",
    delivery3: "delivery3",
    delivery4: "delivery4",
    postcode: "postcode",
    state: "state",
    addresscountry: "addressCountry",
    
    // Delivery address fields (consistent naming)
    deliverypostcode: "deliveryPostcode",
    deliverystate: "deliveryState",
    deliverycountry: "deliveryCountry",

    // Financial fields
    customertype: "customerType",
    creditlimit: "creditLimit",
    creditorterms: "creditorTerms",
    debtorterms: "debtorTerms",
    taxnumber: "taxNumber",
    
    // Category fields
    category1: "category1",
    category2: "category2",
    category3: "category3",
    category4: "category4",
    
    // Custom fields
    custom1: "custom1",
    custom2: "custom2",
    custom3: "custom3",
    custom4: "custom4",
    custom5: "custom5",
    custom6: "custom6",
    custom7: "custom7",
    custom8: "custom8",

    // Bank fields
    bank: "bank",
    bankbranch: "bankBranch",
    bankaccountnumber: "bankAccountNumber",

    // Date fields
    dateoflastsale: "dateOfLastSale",
    
    // Payment terms
    custpromptpaymentterms: "custPromptPaymentTerms",
    custpromptpaymentdiscount: "custPromptPaymentDiscount", 
    supppromptpaymentterms: "suppPromptPaymentTerms",
    supppromptpaymentdiscount: "suppPromptPaymentDiscount",
    
    // Credit card fields
    creditcardnum: "creditCardNum",
    creditcardexpiry: "creditCardExpiry",
    creditcardname: "creditCardName",
    
    // Other IDs
    abuid: "abuId",
    einvoicingid: "einvoicingId",
    
    // Sales fields
    salesperson: "salesPerson",
    productpricing: "productPricing",
    
    // User fields
    usernum: "userNum",
    usertext: "userText",
    
    // Contact fields 2
    contact2: "contact2",
    position2: "position2",
    email2: "email2",
    mobile2: "mobile2",
    afterhours: "afterHours",
    afterhours2: "afterHours2",
    ddi: "ddi",
    ddi2: "ddi2",
    
    // Aging fields
    d90plus: "d90Plus",
    d60plus: "d60Plus", 
    d30plus: "d30Plus",
    dcurrent: "dCurrent",
    ccurrent: "cCurrent",
    
    // Account fields
    recaccount: "recAccount",
    payaccount: "payAccount",
    accountname: "accountName",
    
    // Split fields
    splitacct1: "splitAcct1",
    splitacct2: "splitAcct2",
    splitpercent: "splitPercent",
    
    // Payment fields
    paymentmethod: "paymentMethod",
    lastpaymentmethod: "lastPaymentMethod",
    receiptmethod: "receiptMethod",
    
    // Supplier fields
    suppliertype: "supplierType",
    theirref: "theirRef",
    
    // Other fields
    colour: "colour",
    cbalance: "cBalance",
    dbalance: "dBalance",
    lastmodifiedtime: "lastModifiedTime",
    hold: "hold",
    kind: "kind",
    discount: "discount",
    comment: "comment",
    position: "position",
    weburl: "webURL",
    flags: "flags",
    salutation: "salutation",
    salutation2: "salutation2",
    memo: "memo",
    memo2: "memo2",
    role: "role",
    role2: "role2",
    taggedtext: "taggedText",
    moduser: "modUser",
  };

  for (const [key, value] of Object.entries(record)) {
    const lowerKey = key.toLowerCase();
    const camelKey =
      fieldMap[lowerKey] || (toCamelCase(key) as keyof NameCamel);
    if (camelKey) {
      (result as Record<string, unknown>)[camelKey] = value;
    }
  }

  return result;
}

/**
 * Convert Product fields from lowercase to camelCase
 */
function convertProductToCamel(
  record: Partial<Product>,
): Partial<ProductCamel> {
  const result: Partial<ProductCamel> = {};

  // Map of lowercase field names to camelCase
  const fieldMap: Record<string, keyof ProductCamel> = {
    // Core fields
    code: "code",
    description: "description",

    // Pricing fields
    sellunit: "sellUnit",
    sellprice: "sellPrice",
    buyunit: "buyUnit",
    buyprice: "buyPrice",

    // Stock fields
    stockonhand: "stockOnHand",
    reorderlevel: "reorderLevel",

    // Accounting fields
    salesacct: "salesAcct",
    cogacct: "cogAcct",

    // Other fields
    supplier: "supplier",
    supplierscode: "suppliersCode",
    barcode: "barCode",

    // Metadata
    lastmodifiedtime: "lastModifiedTime",
  };

  for (const [key, value] of Object.entries(record)) {
    const lowerKey = key.toLowerCase();
    const camelKey =
      fieldMap[lowerKey] || (toCamelCase(key) as keyof ProductCamel);
    if (camelKey) {
      (result as Record<string, unknown>)[camelKey] = value;
    }
  }

  return result;
}

/**
 * Generic conversion from PascalCase/lowercase to camelCase
 */
function genericToCamelCase<T extends TableName>(
  record: Partial<TableMap[T]>,
): Partial<TableMapCamel[T]> {
  const result: Record<string, unknown> = {};

  // Common field mappings across all tables
  const commonFieldMap: Record<string, string> = {
    sequencenumber: "sequenceNumber",
    lastmodifiedtime: "lastModifiedTime",
    usernum: "userNum",
    usertext: "userText",
    colour: "colour",
    namecode: "nameCode",
    transdate: "transDate",
    accountcode: "accountCode",
    taxcode: "taxCode",
  };

  for (const [key, value] of Object.entries(record)) {
    // Try lowercase mapping first
    const lowerKey = key.toLowerCase();
    const mappedKey = commonFieldMap[lowerKey];

    if (mappedKey) {
      result[mappedKey] = value;
    } else {
      // Use standard camelCase conversion
      result[toCamelCase(key)] = value;
    }
  }

  return result as Partial<TableMapCamel[T]>;
}

/**
 * Generic conversion from camelCase to PascalCase
 */
function genericFromCamelCase<T extends TableName>(
  record: Partial<TableMapCamel[T]>,
): Partial<TableMap[T]> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    result[fromCamelCase(key)] = value;
  }

  return result as Partial<TableMap[T]>;
}

/**
 * Get field mappings for a table
 */
export function getFieldMappings(table: TableName): Record<string, string> {
  if (table === "Detail") {
    return detailFieldMappings as Record<string, string>;
  }

  // Return empty object for tables without special mappings
  return {};
}

/**
 * Convert field name between formats
 */
export function convertFieldName(
  field: string,
  direction: "toCamel" | "fromCamel",
): string {
  if (direction === "toCamel") {
    return toCamelCase(field);
  }
  return fromCamelCase(field);
}

// Re-export for convenience
export { toCamelCase };
