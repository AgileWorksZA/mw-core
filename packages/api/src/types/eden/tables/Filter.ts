import { t } from "elysia";

export const FilterOne = t.Object(
  {
    SequenceNumber: t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this filter record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    File: t.Integer({
      description: "Numeric code representing the internal file/table the filter applies to (e.g., Transaction, Account). See FilterFileEnum for typical targets."
    }),
    TabSet: t.Nullable(t.Integer({
      description: "Numeric code representing the Tab Set (e.g., 'View by Status', 'View by Type') for tabbed lists like Transactions. 0 if not applicable."
    })),
    Tab: t.Nullable(t.Integer({
      description: "Numeric code representing the specific Tab within a Tab Set the filter applies to (e.g., 'All', 'Invoices', 'Payments'). 0 for all tabs in the set or if not applicable."
    })),
    Type: t.Nullable(t.Integer({
      description: "Numeric code representing the type or behavior of the filter (e.g., simple filter, preset search, ask for code)."
    })),
    User: t.String({
      description: "User initials identifying the user who owns this filter. Filters are user-specific. Max 3 chars.",
      maxLength: 3
    }),
    Name: t.String({
      description: "The name of the filter as it appears in the filter dropdown menu.",
      maxLength: 63
    }),
    FilterFunction: t.Nullable(t.String({
      description: "The MoneyWorks search expression defining the filter criteria.",
      maxLength: 1024
    })),
    Order: t.Nullable(t.Integer({
      description: "The display order of the filter within the dropdown menu for the user."
    })),
  },
  { additionalProperties: true },
);
