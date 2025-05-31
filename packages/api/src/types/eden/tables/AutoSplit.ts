import { t } from "elysia";

export const AutoSplitOne = t.Object(
  {
    // TODO: Omitting the sequence number and last modified time for now
    // TODO: Log bug with Grant Cowie
    SequenceNumber: t.Optional(t.Nullable(t.Integer({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for the auto-allocation rule."
    }))),
    LastModifiedTime: t.Optional(t.Nullable(t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }))),
    MatchFunction: t.String({
      description: "The matching text/function that triggers the split rule. Can be complex expression.",
      maxLength: 255
    }),
    SplitMode: t.Nullable(t.Integer({
      description: "The type of split: 0 for Percentage, 1 for Amount."
    })),
    SplitAcct1: t.Nullable(t.String({
      description: "The first split account code.",
      maxLength: 13
    })),
    SplitAcct2: t.Nullable(t.String({
      description: "The second split account code (often the remainder).",
      maxLength: 13
    })),
    SplitAmount1: t.Nullable(t.Integer({
      description: "Percent or amount to allocate to the first split account."
    })),
    SplitAmount2: t.Nullable(t.Integer({
      description: "Second split amount to allocate."
    })),
    SplitAcct3: t.Nullable(t.String({
      description: "The third split account code.",
      maxLength: 13
    })),
    SplitAcct4: t.Nullable(t.String({
      description: "The fourth split account code.",
      maxLength: 13
    })),
    SplitAmount3: t.Nullable(t.Integer({
      description: "Third split amount to allocate."
    })),
    MatchName: t.Nullable(t.String({
      description: "The unique name of the rule. Indexed.",
      maxLength: 11
    })),
    Priority: t.Nullable(t.Integer({
      description: "Priority of the rule (higher numbers checked first). Determines the order in which rules are applied."
    })),
  },
  { additionalProperties: true },
);
