import { z } from "zod";

// --- AutoSplit Enums ---

/**
 * Defines how the split amounts are interpreted for an Auto-Allocation rule.
 * Although not explicitly documented with numeric values in Appendix A,
 * common usage implies:
 * 0: Amounts represent percentages of the total transaction amount.
 * 1: Amounts represent fixed currency values.
 */
export const SplitModeEnum = z
  .enum(["0", "1"])
  .describe(`Defines how the split amounts are interpreted.
  0: Amounts represent percentages.
  1: Amounts represent fixed currency values.`);

// --- AutoSplit Schema (Auto-Allocation Rules) ---

export const autoSplitZod = z.object({
  /** Unsigned long sequence number (indexed). Unique internal identifier for the auto-allocation rule. */
  SequenceNumber: z
    .number()
    .positive()
    .describe(
      "Unsigned long sequence number (indexed). Unique internal identifier for the auto-allocation rule.",
    ),
  /** Last modified timestamp. The date and time that this record was last changed. */
  LastModifiedTime: z
    .string()
    .describe(
      "Last modified timestamp. The date and time that this record was last changed.",
    ),
  /** The matching text/function that triggers the split rule. Can be complex expression. */
  MatchFunction: z
    .string()
    .max(255) // Max length for text fields if not specified
    .describe(
      "The matching text/function that triggers the split rule. Can be complex expression.",
    ),
  /** The type of split: 0 for Percentage, 1 for Amount. */
  SplitMode: SplitModeEnum,
  /** The first split account code. */
  SplitAcct1: z
    .string()
    .max(13) // Account code + potential department
    .describe("The first split account code."),
  /** The second split account code (often the remainder). */
  SplitAcct2: z
    .string()
    .max(13)
    .nullable()
    .optional() // Optional depending on split configuration
    .describe("The second split account code (often the remainder)."),
  /** Percent or amount to allocate to the first split account. */
  SplitAmount1: z
    .number()
    .describe("Percent or amount to allocate to the first split account."),
  /** Second split amount to allocate. */
  SplitAmount2: z
    .number()
    .nullable()
    .optional() // Optional depending on split configuration
    .describe("Second split amount to allocate."),
  /** The third split account code. */
  SplitAcct3: z
    .string()
    .max(13)
    .nullable()
    .optional() // Optional depending on split configuration
    .describe("The third split account code."),
  /** The fourth split account code. */
  SplitAcct4: z
    .string()
    .max(13)
    .nullable()
    .optional() // Optional depending on split configuration
    .describe("The fourth split account code."),
  /** Third split amount to allocate. */
  SplitAmount3: z
    .number()
    .nullable()
    .optional() // Optional depending on split configuration
    .describe("Third split amount to allocate."),
  /** The unique name of the rule. Indexed. */
  MatchName: z
    .string()
    .max(11) // Assuming similar length to NameCode based on UI examples
    .describe("The unique name of the rule. Indexed."),
  /** Priority of the rule (higher numbers checked first). */
  Priority: z
    .number()
    .describe(
      "Priority of the rule (higher numbers checked first). Determines the order in which rules are applied.",
    ),
});

/**
 * Inferred TypeScript type from the autoSplitZod schema.
 * Represents a fully validated Auto-Allocation Rule record.
 */
export type AutoSplitZod = z.infer<typeof autoSplitZod>;
