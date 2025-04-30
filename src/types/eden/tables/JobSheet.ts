import { t } from "elysia";

export const JobSheetOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this job sheet item."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Job: t.String({
      description: "The job code this item belongs to. Must be an existing Job code. Indexed. Max 9 chars.",
      maxLength: 9
    }),
    Qty: t.Nullable(t.Number({
      description: "The quantity of the resource or product used/budgeted."
    })),
    Resource: t.Nullable(t.String({
      description: "The code for the product or resource used/budgeted. Must be an existing Product code. Indexed. Max 31 chars.",
      maxLength: 31
    })),
    Date: t.Date({
      description: "The date the resource was used or the budget item applies to. Should be specified in YYYY-MM-DD format."
    }),
    CostCentre: t.Nullable(t.String({
      description: "The cost centre (Department code) associated with this item. Must be a valid Department code. Max 5 chars.",
      maxLength: 5
    })),
    Account: t.Nullable(t.String({
      description: "The general ledger expense or income account code for the resource/item. Indexed. Max 13 chars.",
      maxLength: 13
    })),
    Period: t.Nullable(t.Number({
      description: "The accounting period this item falls into, determined by the Date field."
    })),
    Units: t.Nullable(t.String({
      description: "The units of the resource or product (e.g., Hr, Kg, Km). Max 3 chars.",
      maxLength: 3
    })),
    CostPrice: t.Nullable(t.Number({
      description: "The cost price of the product or resource used (excluding tax)."
    })),
    SellPrice: t.Nullable(t.Number({
      description: "The anticipated charged value (sell price) of the product or resource used (excluding tax)."
    })),
    Memo: t.Nullable(t.String({
      description: "A description or memo for the job sheet item. Max 255 chars.",
      maxLength: 255
    })),
    DestTransSeq: t.Nullable(t.Number({
      description: "The sequence number of the invoice on which this item was billed out (0 if unbilled)."
    })),
    SourceTransSeq: t.Nullable(t.Number({
      description: "The sequence number of the originating transaction if entered via transaction tagging (0 if entered directly)."
    })),
    DateEntered: t.Nullable(t.Date({
      description: "The date the job sheet item was entered. Should be specified in YYYY-MM-DD format."
    })),
    Flags: t.Nullable(t.Number({
      description: "Bitmapped flags field. Flag 1 = Time, Flag 2 = Material."
    })),
    Colour: t.Nullable(t.Number({
      description: "Display color for the job sheet record (0-7 index).",
      minimum: 0,
      maximum: 7
    })),
    Status: t.Nullable(t.String({
      description: "The status of the job sheet item. Values: PE: Pending - Item has been recorded but not yet invoiced/billed to the client, PR: Processed - Item has been included in an invoice to the client, BU: Budget - Represents a budgeted item or resource for the job, not an actual cost/time entry."
    })),
    Type: t.Nullable(t.String({
      description: "The type of the job sheet item. Values: IN: Income - Represents revenue or billed amounts associated with the job, EX: Expense - Represents costs, time, or materials used on the job."
    })),
    Analysis: t.Nullable(t.String({
      description: "The analysis code associated with the item. Max 9 chars.",
      maxLength: 9
    })),
    BillValue: t.Nullable(t.Number({
      description: "The actual value billed for this item on an invoice (may differ from SellPrice)."
    })),
    ActivityCode: t.Nullable(t.String({
      description: "A free-form activity code. Max 9 chars.",
      maxLength: 9
    })),
    Comments: t.Nullable(t.String({
      description: "General comments on the entry. Max 255 chars.",
      maxLength: 255
    })),
    Batch: t.Nullable(t.Number({
      description: "For items entered via Timesheet, the sequence number of the first item in the batch."
    })),
    EnteredBy: t.Nullable(t.String({
      description: "User initials who entered the job sheet record. Max 3 chars.",
      maxLength: 3
    })),
    SerialNumber: t.Nullable(t.String({
      description: "Serial or batch number for inventoried items. Max 31 chars.",
      maxLength: 31
    })),
    StockLocation: t.Nullable(t.String({
      description: "Stock location for inventoried items. Max 15 chars.",
      maxLength: 15
    })),
    UserNum: t.Nullable(t.Number({
      description: "User-defined numeric field (scriptable)."
    })),
    UserText: t.Nullable(t.String({
      description: "User-defined text field (scriptable). Max 255 chars.",
      maxLength: 255
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage for key-value pairs. Max 255 chars.",
      maxLength: 255
    })),
    TimeProcessed: t.Nullable(t.Date({
      description: "Timestamp for when the job sheet item was processed (billed)."
    })),
  },
  { additionalProperties: true },
);
