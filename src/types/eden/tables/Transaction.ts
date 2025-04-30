import { t } from "elysia";

export const TransactionOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). This is the unique internal identifier for the transaction."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this transaction record was last changed."
    }),
    OurRef: t.Nullable(t.String({
      description: "Our reference (indexed, mutable: conditionally). For Cash Payments, the cheque number; for Cash Receipts, the receipt number; for Debtor Invoices, the invoice number; for Creditor Invoices, your order number. For Journals, it is the Journal number, prefixed with the type of journal (JN for general journal, JS for stock journal, BK for banking journal)."
    })),
    TransDate: t.String({
      description: "Transaction date (indexed, mutable: conditionally). The date of the transaction."
    }),
    EnterDate: t.Nullable(t.String({
      description: "Date entered (indexed). The date on which the transaction was entered."
    })),
    DueDate: t.Nullable(t.String({
      description: "Due date (mutable: conditionally). For invoices, this is the date that the invoice is due for payment."
    })),
    Period: t.Nullable(t.Integer({
      description: "Period (indexed). A number representing the period of the transaction (100 * year_number + period_number)."
    })),
    Type: t.String({
      description: "Transaction type (indexed). Defines the nature of the transaction."
    }),
    TheirRef: t.Nullable(t.String({
      description: "Their reference . For debtor invoices, the customer's order number; for creditor invoices, the supplier's invoice number; for receipts, the cheque number.",
      maxLength: 32
    })),
    NameCode: t.Nullable(t.String({
      description: "Name code (indexed). Customer or Supplier Code associated with the transaction.",
      maxLength: 12
    })),
    Flag: t.Nullable(t.String({
      description: "Flag . If this field is not blank, a flag icon shows up in the status column of the transaction list.",
      maxLength: 6
    })),
    Description: t.Nullable(t.String({
      description: "Description (mutable: conditionally). The description of the transaction.",
      maxLength: 1024
    })),
    Gross: t.Nullable(t.Integer({
      description: "Gross amount. The gross value of the transaction. This must be equal to the sum of the detail line gross values."
    })),
    Analysis: t.Nullable(t.String({
      description: "Analysis code . Can be used to tag a transaction (e.g., batch number, user initials).",
      maxLength: 10
    })),
    Contra: t.Nullable(t.String({
      description: "Contra account. For CP and CR transactions, the bank account code. For invoices, the accounts payable/receivable control account.",
      maxLength: 8
    })),
    ToFrom: t.Nullable(t.String({
      description: "To/From details (mutable: conditionally). The name of the person/entity the transaction is to or from. For a payment, the To field. For a receipt, the From field.",
      maxLength: 256
    })),
    Status: t.Nullable(t.String({
      description: "Status (indexed). U for unposted or P for posted."
    })),
    Hold: t.Nullable(t.Boolean({
      description: "Hold status (mutable: conditionally). If true, transaction cannot be posted."
    })),
    DatePaid: t.Nullable(t.String({
      description: "Date paid. The date the last payment for an invoice was made."
    })),
    AmtPaid: t.Nullable(t.Integer({
      description: "Amount paid. The amount of the invoice that has been paid."
    })),
    PayAmount: t.Nullable(t.Integer({
      description: "Payment amount. The amount of the invoice that you have elected to pay a creditor in the next payment run."
    })),
    Aging: t.Nullable(t.Integer({
      description: "Aging period. The aging cycle for the transaction."
    })),
    TaxAmount: t.Nullable(t.Integer({
      description: "Tax amount. The amount of GST/VAT/Tax involved for the transaction."
    })),
    TaxCycle: t.Nullable(t.Integer({
      description: "Tax cycle. A number representing the GST/VAT/Tax cycle in which the transaction was processed. 0 for transactions not yet processed."
    })),
    Recurring: t.Nullable(t.Boolean({
      description: "Recurring transaction flag. True if the transaction is set up to recur in the future."
    })),
    Printed: t.Nullable(t.Integer({
      description: "Print status . 0 if not Printed; 1 if Printed."
    })),
    Flags: t.Nullable(t.Integer({
      description: "Flags. See Transaction Flags table in documentation."
    })),
    TaxProcessed: t.Nullable(t.Integer({
      description: "Tax processed amount."
    })),
    Salesperson: t.Nullable(t.String({
      description: "Salesperson code (mutable: conditionally). Can be used for appending department to product control accounts.",
      maxLength: 6
    })),
    Colour: t.Nullable(t.Integer({
      description: "Display color (mutable: conditionally). The color index, 0-7.",
      min: 0,
      max: 7
    })),
    BankJNSeq: t.Nullable(t.Integer({
      description: "Bank journal sequence. The sequence number of the journal which banked the receipt (using the Banking command)."
    })),
    PaymentMethod: t.Nullable(t.Integer({
      description: "Payment method. 0=None, 1=Cash, 2=Cheque, 3=Electronic, 4=Credit Card, 5-7=User Defined."
    })),
    TimePosted: t.Nullable(t.String({
      description: "Time posted. Date and time transaction is posted."
    })),
    SecurityLevel: t.Nullable(t.Integer({
      description: "Security level (indexed). Transaction's security level, highest of visible detail lines."
    })),
    User1: t.Nullable(t.String({
      description: "User field 1 .",
      maxLength: 256
    })),
    User2: t.Nullable(t.String({
      description: "User field 2 .",
      maxLength: 256
    })),
    User3: t.Nullable(t.String({
      description: "User field 3 .",
      maxLength: 256
    })),
    PromptPaymentDate: t.Nullable(t.String({
      description: "Prompt payment date . The date the prompt payment discount expires."
    })),
    PromptPaymentAmt: t.Nullable(t.Integer({
      description: "Prompt payment amount. The amount of the eligible prompt payment discount."
    })),
    ProdPriceCode: t.Nullable(t.String({
      description: "Product price code. Pricing level (A-F).",
      maxLength: 2
    })),
    MailingAddress: t.Nullable(t.String({
      description: "Mailing address (mutable: conditionally). Blank if default from name.",
      maxLength: 256
    })),
    DeliveryAddress: t.Nullable(t.String({
      description: "Delivery address (mutable: conditionally). Blank if default from name.",
      maxLength: 256
    })),
    FreightCode: t.Nullable(t.String({
      description: "Freight code used for orders.",
      maxLength: 32
    })),
    FreightAmount: t.Nullable(t.Integer({
      description: "Freight amount of order."
    })),
    FreightDetails: t.Nullable(t.String({
      description: "Freight details .",
      maxLength: 256
    })),
    SpecialBank: t.Nullable(t.String({
      description: "Special bank . For receipts, the bank number of the cheque/card.",
      maxLength: 32
    })),
    SpecialBranch: t.Nullable(t.String({
      description: "Special branch . For receipts, the branch of the cheque/card.",
      maxLength: 32
    })),
    SpecialAccount: t.Nullable(t.String({
      description: "Special account . For receipts, the account number of the cheque/card.",
      maxLength: 32
    })),
    Currency: t.Nullable(t.String({
      description: "Currency code (empty for local currency).",
      maxLength: 4
    })),
    ExchangeRate: t.Nullable(t.Integer({
      description: "Exchange rate (0 for base currency transactions)."
    })),
    EnteredBy: t.Nullable(t.String({
      description: "Entered by user. Initials of user who entered the transaction.",
      maxLength: 4
    })),
    PostedBy: t.Nullable(t.String({
      description: "Posted by user. Initials of user who posted the transaction.",
      maxLength: 4
    })),
    AmtWrittenOff: t.Nullable(t.Integer({
      description: "Amount written off. For invoices, the amount written off in a write-off."
    })),
    OrderTotal: t.Nullable(t.Integer({
      description: "Order total. The total of the order."
    })),
    OrderShipped: t.Nullable(t.Integer({
      description: "Order shipped amount."
    })),
    OrderDeposit: t.Nullable(t.Integer({
      description: "Order deposit. The accumulated deposit on an order."
    })),
    OriginatingOrderSeq: t.Nullable(t.Integer({
      description: "Originating order sequence. The sequence number of the order that created the invoice through the ship or receive goods commands."
    })),
    CurrencyTransferSeq: t.Nullable(t.Integer({
      description: "Currency transfer sequence."
    })),
    PromptPaymentTerms: t.Nullable(t.Integer({
      description: "Prompt payment terms. 0=None; >0 = days; <0 = Nth day of month following."
    })),
    PromptPaymentDisc: t.Nullable(t.Integer({
      description: "Prompt payment discount percentage."
    })),
    ApprovedBy1: t.Nullable(t.String({
      description: "First approval user (mutable: conditionally, script-only).",
      maxLength: 4
    })),
    ApprovedBy2: t.Nullable(t.String({
      description: "Second approval user (mutable: conditionally, script-only).",
      maxLength: 4
    })),
    UserNum: t.Nullable(t.Integer({
      description: "User number ."
    })),
    UserText: t.Nullable(t.String({
      description: "User text .",
      maxLength: 256
    })),
    User4: t.Nullable(t.String({
      description: "User field 4 .",
      maxLength: 16
    })),
    User5: t.Nullable(t.String({
      description: "User field 5 .",
      maxLength: 16
    })),
    User6: t.Nullable(t.String({
      description: "User field 6 .",
      maxLength: 16
    })),
    User7: t.Nullable(t.String({
      description: "User field 7 .",
      maxLength: 16
    })),
    User8: t.Nullable(t.String({
      description: "User field 8 .",
      maxLength: 16
    })),
    TaggedText: t.Nullable(t.String({
      description: "Tagged text . Scriptable tag storage.",
      maxLength: 256
    })),
    Emailed: t.Nullable(t.Integer({
      description: "Email status . Non-zero if transaction has been emailed."
    })),
    Transferred: t.Nullable(t.Integer({
      description: "Transfer status . Non-zero if transaction has been sent as eInvoice."
    })),
  },
  { additionalProperties: true },
);