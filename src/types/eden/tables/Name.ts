import { t } from "elysia";

export const NameOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this Name record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Code: t.String({
      description: "Unique code identifying the Name (customer, supplier, etc.). Indexed.",
      maxLength: 11
    }),
    Name: t.String({
      description: "Name of the company or person.",
      maxLength: 255
    }),
    Contact: t.Nullable(t.String({
      description: "Primary contact person's name.",
      maxLength: 25
    })),
    Position: t.Nullable(t.String({
      description: "Primary contact person's position.",
      maxLength: 29
    })),
    Address1: t.Nullable(t.String({
      description: "Mailing Address line 1.",
      maxLength: 59
    })),
    Address2: t.Nullable(t.String({
      description: "Mailing Address line 2.",
      maxLength: 59
    })),
    Address3: t.Nullable(t.String({
      description: "Mailing Address line 3.",
      maxLength: 59
    })),
    Address4: t.Nullable(t.String({
      description: "Mailing Address line 4 (often Country).",
      maxLength: 59
    })),
    Delivery1: t.Nullable(t.String({
      description: "Delivery Address line 1.",
      maxLength: 59
    })),
    Delivery2: t.Nullable(t.String({
      description: "Delivery Address line 2.",
      maxLength: 59
    })),
    Delivery3: t.Nullable(t.String({
      description: "Delivery Address line 3.",
      maxLength: 59
    })),
    Delivery4: t.Nullable(t.String({
      description: "Delivery Address line 4 (often Country).",
      maxLength: 59
    })),
    Phone: t.Nullable(t.String({
      description: "Main phone number.",
      maxLength: 19
    })),
    Fax: t.Nullable(t.String({
      description: "Main fax number.",
      maxLength: 19
    })),
    Category1: t.Nullable(t.String({
      description: "User-defined category 1.",
      maxLength: 15
    })),
    Category2: t.Nullable(t.String({
      description: "User-defined category 2.",
      maxLength: 15
    })),
    Category3: t.Nullable(t.String({
      description: "User-defined category 3.",
      maxLength: 15
    })),
    Category4: t.Nullable(t.String({
      description: "User-defined category 4.",
      maxLength: 15
    })),
    CustomerType: t.Nullable(t.Number({
      description: "Customer type: 0=Not Customer, 1=Customer, 2=Debtor."
    })),
    D90Plus: t.Nullable(t.Number({
      description: "Debtor balance aged 90+ days/cycles."
    })),
    D60Plus: t.Nullable(t.Number({
      description: "Debtor balance aged 60-89 days/cycles."
    })),
    D30Plus: t.Nullable(t.Number({
      description: "Debtor balance aged 30-59 days/cycles."
    })),
    DCurrent: t.Nullable(t.Number({
      description: "Debtor balance aged less than 30 days/cycles (current)."
    })),
    CCurrent: t.Nullable(t.Number({
      description: "Creditor current balance (total amount owing)."
    })),
    DebtorTerms: t.Nullable(t.Number({
      description: "Debtor payment terms: positive N = N days, negative -N = Nth day of following month."
    })),
    CreditorTerms: t.Nullable(t.Number({
      description: "Creditor payment terms: positive N = N days, negative -N = Nth day of following month."
    })),
    Bank: t.Nullable(t.String({
      description: "Customer's bank name (used for deposit slips).",
      maxLength: 7
    })),
    AccountName: t.Nullable(t.String({
      description: "Customer's bank account name (used for deposit slips).",
      maxLength: 21
    })),
    BankBranch: t.Nullable(t.String({
      description: "Customer's bank branch (used for deposit slips).",
      maxLength: 21
    })),
    TheirRef: t.Nullable(t.String({
      description: "Their reference code for your company.",
      maxLength: 15
    })),
    Hold: t.Nullable(t.Boolean({
      description: "Hold flag. If true, transactions for this Name default to 'Hold'."
    })),
    RecAccount: t.Nullable(t.String({
      description: "Accounts Receivable control GL account code for this debtor.",
      maxLength: 7
    })),
    PayAccount: t.Nullable(t.String({
      description: "Accounts Payable control GL account code for this creditor.",
      maxLength: 7
    })),
    Kind: t.Nullable(t.Number({
      description: "Kind of Name: 0=Template, 1=Normal."
    })),
    CreditLimit: t.Nullable(t.Number({
      description: "Credit limit extended to this debtor (0 = unlimited)."
    })),
    Discount: t.Nullable(t.Number({
      description: "Default discount percentage for this customer."
    })),
    Comment: t.Nullable(t.String({
      description: "General comment field.",
      maxLength: 1020
    })),
    SupplierType: t.Nullable(t.Number({
      description: "Supplier type: 0=Not Supplier, 1=Supplier, 2=Creditor."
    })),
    Colour: t.Nullable(t.Number({
      description: "Display color index (0-7).",
      min: 0,
      max: 7
    })),
    Salesperson: t.Nullable(t.String({
      description: "Default salesperson code associated with this Name.",
      maxLength: 5
    })),
    TaxCode: t.Nullable(t.String({
      description: "Override tax code applied to transactions for this Name.",
      maxLength: 5
    })),
    SplitMode: t.Nullable(t.Number({
      description: "Auto-allocation split mode (not explicitly documented in Appendix A)."
    })),
    PostCode: t.Nullable(t.String({
      description: "Postal code/zip code for mailing address.",
      maxLength: 11
    })),
    State: t.Nullable(t.String({
      description: "State/province for mailing address.",
      maxLength: 3
    })),
    BankAccountNumber: t.Nullable(t.String({
      description: "Bank account number for electronic payments (creditor) or direct debits (debtor).",
      maxLength: 23
    })),
    Currency: t.Nullable(t.String({
      description: "Default currency code for this Name (empty if base currency).",
      maxLength: 3
    })),
    PaymentMethod: t.Nullable(t.Number({
      description: "Default payment method when paying this creditor. Values: 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=User Defined."
    })),
    DBalance: t.Nullable(t.Number({
      description: "Total debtor balance (sum of DCurrent, D30Plus, D60Plus, D90Plus)."
    })),
    DDI: t.Nullable(t.String({
      description: "Direct dial phone number for primary contact.",
      maxLength: 19
    })),
    eMail: t.Nullable(t.String({
      description: "Email address for primary contact.",
      maxLength: 80
    })),
    Mobile: t.Nullable(t.String({
      description: "Mobile phone number for primary contact.",
      maxLength: 14
    })),
    AfterHours: t.Nullable(t.String({
      description: "After hours phone number for primary contact.",
      maxLength: 11
    })),
    Contact2: t.Nullable(t.String({
      description: "Secondary contact person's name.",
      maxLength: 29
    })),
    Position2: t.Nullable(t.String({
      description: "Secondary contact person's position.",
      maxLength: 29
    })),
    DDI2: t.Nullable(t.String({
      description: "Direct dial phone number for secondary contact.",
      maxLength: 19
    })),
    eMail2: t.Nullable(t.String({
      description: "Email address for secondary contact.",
      maxLength: 80
    })),
    Mobile2: t.Nullable(t.String({
      description: "Mobile phone number for secondary contact.",
      maxLength: 13
    })),
    AfterHours2: t.Nullable(t.String({
      description: "After hours phone number for secondary contact.",
      maxLength: 11
    })),
    WebURL: t.Nullable(t.String({
      description: "Website URL.",
      maxLength: 63
    })),
    ProductPricing: t.Nullable(t.String({
      description: "Product pricing level (A-F) for this customer."
    })),
    DateOfLastSale: t.Nullable(t.Date({
      description: "Date of the last sales invoice or cash sale to this customer."
    })),
    SplitAcct1: t.Nullable(t.String({
      description: "First account code for auto-allocation split.",
      maxLength: 13
    })),
    SplitAcct2: t.Nullable(t.String({
      description: "Second (remainder) account code for auto-allocation split.",
      maxLength: 13
    })),
    SplitPercent: t.Nullable(t.Number({
      description: "Percentage allocation to SplitAcct1 for auto-allocation."
    })),
    SplitAmount: t.Nullable(t.Number({
      description: "Amount allocation for auto-allocation."
    })),
    UserNum: t.Nullable(t.Number({
      description: "User-defined numeric field (scriptable)."
    })),
    UserText: t.Nullable(t.String({
      description: "User-defined text field (scriptable).",
      maxLength: 255
    })),
    CustPromptPaymentTerms: t.Nullable(t.Number({
      description: "Customer prompt payment terms: positive N = N days, negative -N = Nth day of following month."
    })),
    CustPromptPaymentDiscount: t.Nullable(t.Number({
      description: "Customer prompt payment discount percentage."
    })),
    SuppPromptPaymentTerms: t.Nullable(t.Number({
      description: "Supplier prompt payment terms: positive N = N days, negative -N = Nth day of following month."
    })),
    SuppPromptPaymentDiscount: t.Nullable(t.Number({
      description: "Supplier prompt payment discount percentage offered."
    })),
    LastPaymentMethod: t.Nullable(t.Number({
      description: "Payment method used in the last transaction with this Name. Values: 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=User Defined."
    })),
    CreditCardNum: t.Nullable(t.String({
      description: "Credit card number.",
      maxLength: 19
    })),
    CreditCardExpiry: t.Nullable(t.String({
      description: "Credit card expiry date (e.g., MM/YY).",
      maxLength: 5
    })),
    CreditCardName: t.Nullable(t.String({
      description: "Name on credit card.",
      maxLength: 19
    })),
    TaxNumber: t.Nullable(t.String({
      description: "Their tax registration number (GST#, VAT#, ABN, etc.).",
      maxLength: 19
    })),
    Custom1: t.Nullable(t.String({
      description: "Custom field 1.",
      maxLength: 255
    })),
    Custom2: t.Nullable(t.String({
      description: "Custom field 2.",
      maxLength: 255
    })),
    Custom3: t.Nullable(t.String({
      description: "Custom field 3.",
      maxLength: 15
    })),
    Custom4: t.Nullable(t.String({
      description: "Custom field 4.",
      maxLength: 15
    })),
    DeliveryPostcode: t.Nullable(t.String({
      description: "Postcode/zip code for delivery address.",
      maxLength: 12
    })),
    DeliveryState: t.Nullable(t.String({
      description: "State/province for delivery address.",
      maxLength: 4
    })),
    AddressCountry: t.Nullable(t.String({
      description: "Country for mailing address (from Address4).",
      maxLength: 59
    })),
    DeliveryCountry: t.Nullable(t.String({
      description: "Country for delivery address (from Delivery4).",
      maxLength: 59
    })),
    ReceiptMethod: t.Nullable(t.Number({
      description: "Preferred payment method used by this customer. Values: 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=User Defined."
    })),
    ABUID: t.Nullable(t.String({
      description: "Mac Address Book Universal ID (set only if imported from Address Book)."
    })),
    BankParticulars: t.Nullable(t.String({
      description: "Bank particulars/reference for electronic payments.",
      maxLength: 32
    })),
    Flags: t.Nullable(t.Number({
      description: "Bitmapped flags field. See documentation for Name Flags."
    })),
    Salutation: t.Nullable(t.String({
      description: "Salutation for primary contact.",
      maxLength: 39
    })),
    Salutation2: t.Nullable(t.String({
      description: "Salutation for secondary contact.",
      maxLength: 39
    })),
    Memo: t.Nullable(t.String({
      description: "Memo/notes for primary contact.",
      maxLength: 255
    })),
    Memo2: t.Nullable(t.String({
      description: "Memo/notes for secondary contact.",
      maxLength: 255
    })),
    Role: t.Nullable(t.Number({
      description: "Bitmapped field representing roles assigned to primary contact."
    })),
    Role2: t.Nullable(t.Number({
      description: "Bitmapped field representing roles assigned to secondary contact."
    })),
    Custom5: t.Nullable(t.String({
      description: "Custom field 5.",
      maxLength: 15
    })),
    Custom6: t.Nullable(t.String({
      description: "Custom field 6.",
      maxLength: 15
    })),
    Custom7: t.Nullable(t.String({
      description: "Custom field 7.",
      maxLength: 15
    })),
    Custom8: t.Nullable(t.String({
      description: "Custom field 8.",
      maxLength: 15
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage for key-value pairs.",
      maxLength: 255
    })),
    EInvoicingID: t.Nullable(t.String({
      description: "eInvoicing ID (e.g., ABN, NZBN, UEN, VAT#) for Peppol network.",
      maxLength: 31
    })),
  },
  { additionalProperties: true },
);