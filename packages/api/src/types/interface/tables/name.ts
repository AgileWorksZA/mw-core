/**
 * Name table interface
 * file_num: 10
 */
export interface Name {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="12" */
  Code: string;
  /** @mutable="freely, script-only" size="256" */
  Name: string;
  /** @mutable="freely, script-only" size="40" */
  Contact: string;
  /** @mutable="freely, script-only" size="40" */
  Position: string;
  /** @mutable="freely, script-only" size="60" */
  Address1: string;
  /** @mutable="freely, script-only" size="60" */
  Address2: string;
  /** @mutable="freely, script-only" size="60" */
  Address3: string;
  /** @mutable="freely, script-only" size="60" */
  Address4: string;
  /** @mutable="freely, script-only" size="60" */
  Delivery1: string;
  /** @mutable="freely, script-only" size="60" */
  Delivery2: string;
  /** @mutable="freely, script-only" size="60" */
  Delivery3: string;
  /** @mutable="freely, script-only" size="60" */
  Delivery4: string;
  /** @mutable="freely, script-only" size="20" */
  Phone: string;
  /** @mutable="freely, script-only" size="20" */
  Fax: string;
  /** @mutable="freely, script-only" size="16" */
  Category1: string;
  /** @mutable="freely, script-only" size="16" */
  Category2: string;
  /** @mutable="freely, script-only" size="16" */
  Category3: string;
  /** @mutable="freely, script-only" size="16" */
  Category4: string;
  /** @indexed */
  CustomerType: number;
  D90Plus: number;
  D60Plus: number;
  D30Plus: number;
  DCurrent: number;
  CCurrent: number;
  DebtorTerms: number;
  CreditorTerms: number;
  /** @mutable="freely, script-only" size="8" */
  Bank: string;
  /** @mutable="freely, script-only" size="64" */
  AccountName: string;
  /** @mutable="freely, script-only" size="22" */
  BankBranch: string;
  /** @mutable="freely, script-only" size="16" */
  TheirRef: string;
  /** @mutable="freely, script-only" */
  Hold: boolean;
  /** size="8" */
  RecAccount: string;
  /** size="8" */
  PayAccount: string;
  /** @indexed */
  Kind: number;
  /** @mutable="freely, script-only" */
  CreditLimit: number;
  /** @mutable="freely, script-only" */
  Discount: number;
  /** @mutable="freely, script-only" size="1024" */
  Comment: string;
  /** @indexed */
  SupplierType: number;
  /** @mutable="conditionally" */
  Colour: number;
  /** @mutable="freely, script-only" size="6" */
  Salesperson: string;
  /** size="6" */
  TaxCode: string;
  SplitMode: number;
  /** @mutable="freely, script-only" size="12" */
  PostCode: string;
  /** @mutable="freely, script-only" size="8" */
  State: string;
  /** @mutable="freely, script-only" size="24" */
  BankAccountNumber: string;
  /** size="4" */
  Currency: string;
  /** @mutable="conditionally" */
  PaymentMethod: number;
  DBalance: number;
  /** @mutable="freely, script-only" size="20" */
  DDI: string;
  /** @mutable="freely, script-only" size="140" */
  eMail: string;
  /** @mutable="freely, script-only" size="20" */
  Mobile: string;
  /** @mutable="freely, script-only" size="20" */
  AfterHours: string;
  /** @mutable="freely, script-only" size="40" */
  Contact2: string;
  /** @mutable="freely, script-only" size="40" */
  Position2: string;
  /** @mutable="freely, script-only" size="20" */
  DDI2: string;
  /** @mutable="freely, script-only" size="140" */
  eMail2: string;
  /** @mutable="freely, script-only" size="20" */
  Mobile2: string;
  /** @mutable="freely, script-only" size="20" */
  AfterHours2: string;
  /** @mutable="freely, script-only" size="64" */
  WebURL: string;
  /** @mutable="conditionally" size="2" */
  ProductPricing: string;
  DateOfLastSale: Date;
  /** size="14" */
  SplitAcct1: string;
  /** size="14" */
  SplitAcct2: string;
  SplitPercent: number;
  SplitAmount: number;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="conditionally" */
  CustPromptPaymentTerms: number;
  /** @mutable="conditionally" */
  CustPromptPaymentDiscount: number;
  /** @mutable="conditionally" */
  SuppPromptPaymentTerms: number;
  /** @mutable="conditionally" */
  SuppPromptPaymentDiscount: number;
  LastPaymentMethod: number;
  /** @mutable="freely, script-only" size="20" */
  CreditCardNum: string;
  /** @mutable="freely, script-only" size="6" */
  CreditCardExpiry: string;
  /** @mutable="freely, script-only" size="64" */
  CreditCardName: string;
  /** @mutable="freely, script-only" size="32" */
  TaxNumber: string;
  /** @mutable="freely, script-only" size="256" */
  Custom1: string;
  /** @mutable="freely, script-only" size="256" */
  Custom2: string;
  /** @mutable="freely, script-only" size="16" */
  Custom3: string;
  /** @mutable="freely, script-only" size="16" */
  Custom4: string;
  /** @mutable="freely, script-only" size="12" */
  DeliveryPostcode: string;
  /** @mutable="freely, script-only" size="8" */
  DeliveryState: string;
  /** @mutable="freely, script-only" size="60" */
  AddressCountry: string;
  /** @mutable="freely, script-only" size="60" */
  DeliveryCountry: string;
  /** @mutable="conditionally" */
  ReceiptMethod: number;
  /** size="32" */
  ABUID: string;
  /** @mutable="freely, script-only" size="32" */
  BankParticulars: string;
  Flags: number;
  /** @mutable="freely, script-only" size="40" */
  Salutation: string;
  /** @mutable="freely, script-only" size="40" */
  Salutation2: string;
  /** @mutable="freely, script-only" size="256" */
  Memo: string;
  /** @mutable="freely, script-only" size="256" */
  Memo2: string;
  /** @mutable="freely, script-only" */
  Role: number;
  /** @mutable="freely, script-only" */
  Role2: number;
  /** @mutable="freely, script-only" size="16" */
  Custom5: string;
  /** @mutable="freely, script-only" size="16" */
  Custom6: string;
  /** @mutable="freely, script-only" size="16" */
  Custom7: string;
  /** @mutable="freely, script-only" size="16" */
  Custom8: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" size="32" */
  EInvoicingID: string;
}

export type NameField = keyof Name;

export const NameFields: NameField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Name",
  "Contact",
  "Position",
  "Address1",
  "Address2",
  "Address3",
  "Address4",
  "Delivery1",
  "Delivery2",
  "Delivery3",
  "Delivery4",
  "Phone",
  "Fax",
  "Category1",
  "Category2",
  "Category3",
  "Category4",
  "CustomerType",
  "D90Plus",
  "D60Plus",
  "D30Plus",
  "DCurrent",
  "CCurrent",
  "DebtorTerms",
  "CreditorTerms",
  "Bank",
  "AccountName",
  "BankBranch",
  "TheirRef",
  "Hold",
  "RecAccount",
  "PayAccount",
  "Kind",
  "CreditLimit",
  "Discount",
  "Comment",
  "SupplierType",
  "Colour",
  "Salesperson",
  "TaxCode",
  "SplitMode",
  "PostCode",
  "State",
  "BankAccountNumber",
  "Currency",
  "PaymentMethod",
  "DBalance",
  "DDI",
  "eMail",
  "Mobile",
  "AfterHours",
  "Contact2",
  "Position2",
  "DDI2",
  "eMail2",
  "Mobile2",
  "AfterHours2",
  "WebURL",
  "ProductPricing",
  "DateOfLastSale",
  "SplitAcct1",
  "SplitAcct2",
  "SplitPercent",
  "SplitAmount",
  "UserNum",
  "UserText",
  "CustPromptPaymentTerms",
  "CustPromptPaymentDiscount",
  "SuppPromptPaymentTerms",
  "SuppPromptPaymentDiscount",
  "LastPaymentMethod",
  "CreditCardNum",
  "CreditCardExpiry",
  "CreditCardName",
  "TaxNumber",
  "Custom1",
  "Custom2",
  "Custom3",
  "Custom4",
  "DeliveryPostcode",
  "DeliveryState",
  "AddressCountry",
  "DeliveryCountry",
  "ReceiptMethod",
  "ABUID",
  "BankParticulars",
  "Flags",
  "Salutation",
  "Salutation2",
  "Memo",
  "Memo2",
  "Role",
  "Role2",
  "Custom5",
  "Custom6",
  "Custom7",
  "Custom8",
  "TaggedText",
  "EInvoicingID",
];
