/**
 * MoneyWorks OffLedger Entity - Canonical Ontology
 *
 * CRITICAL DISCOVERY: OffLedger is a DUAL-PURPOSE ENTITY
 * Source: Empirical API validation (MoneyWorks Now v9.2.3)
 * Extracted: 2025-11-25
 *
 * ARCHITECTURE:
 * The OffLedger entity serves two distinct but related purposes based on Kind field:
 *
 * KIND='CUR' (Currency Records):
 * - One record per foreign currency in the system
 * - Balance fields store EXCHANGE RATES (not monetary amounts)
 * - Tracks historical exchange rate movements over 92 periods
 * - Links to GL accounts for realised and unrealised FX gains/losses
 * - Specifies preferred bank accounts for foreign currency transactions
 *
 * KIND='USR' (User Off-Ledger Records):
 * - User-created off-balance sheet tracking items
 * - Balance fields store actual off-ledger balances
 * - Budget fields support off-ledger forecasting
 * - Enables tracking of non-financial metrics or shadow accounting
 *
 * Field Structure (similar to Ledger entity):
 * - Period balances: Historical tracking (Balance91 → Balance01) + Current (Balance00) = 92 periods
 * - Budget values: Historical (Budget29 → Budget01) + Current (Budget00) + Future (BudgetNext01 → BudgetNext18) = 48 periods
 * - Currency-specific: LinkedAccountU/R (FX gain/loss accounts), PreferredBank fields
 *
 * TELEOLOGY (Purpose):
 * - Currency management: Track exchange rates and automate FX gain/loss accounting
 * - Off-ledger tracking: Monitor non-balance sheet items (contingent liabilities, shadow metrics)
 * - Historical analysis: Maintain 92 periods of exchange rate or off-ledger data
 * - Budget forecasting: Support budgeting for off-ledger items or FX planning
 * - Integration: Link FX movements to general ledger automatically
 *
 * EITOLOGY (Essence):
 * OffLedger represents the TIME-SERIES STATE of either EXCHANGE RATES or OFF-BALANCE SHEET ITEMS.
 * It is a denormalized, high-performance structure enabling rapid period-based queries for
 * multi-currency operations and shadow accounting.
 *
 * AXIOLOGY (Value):
 * - Multi-currency support: Essential for international business operations
 * - FX automation: Automatic realised/unrealised gain/loss calculation
 * - Completeness: 92 periods of historical data support long-term trend analysis
 * - Flexibility: Generic structure supports both currency and off-ledger use cases
 * - Integration: Seamless linkage to Chart of Accounts for FX accounting
 *
 * FIELD GROUPS:
 * 1. System fields (2): SequenceNumber, LastModifiedTime
 * 2. Identifying fields (4): Kind, Name, Description, Flags
 * 3. Period balances (92): Balance00 (current) through Balance91 (91 periods ago)
 * 4. Budget values (48): Budget00 (current), Budget01-29 (historical), BudgetNext01-18 (future)
 * 5. Currency-specific (4): LinkedAccountU, LinkedAccountR, PreferredBankCR, PreferredBankCP
 * 6. Custom fields (3): UserNum, UserText, TaggedText
 *
 * COVERAGE: 153/154 fields (99.4% - Slot excluded as per standard practice)
 *
 * @version 1.0.0
 * @status Complete
 * @empiricalSource 2025-11-25_full-schema_now.json (live MoneyWorks Now v9.2.3 system)
 * @manualSource moneyworks_appendix_offledgers_and_currency.html
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * MoneyWorks data type specification
 */
export type MoneyWorksDataType =
  | "T"  // Text
  | "A"  // Alphanumeric (text with length constraint)
  | "N"  // Numeric
  | "D"  // Date
  | "B"  // Boolean
  | "M"; // Memo (long text)

/**
 * Foreign key relationship specification
 */
export interface ForeignKeyRelationship {
  targetEntity: string;
  targetField: string;
  relationship: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
  description?: string;
}

/**
 * Canonical field definition with epistemic metadata
 */
export interface OffLedgerFieldDefinition {
  fieldName: string;
  dataType: MoneyWorksDataType;
  maxLength?: number;
  canonicalDescription: string;
  manualSource: string;
  isRequired?: boolean;
  isSystem?: boolean;
  isCalculated?: boolean;
  isIndexed?: boolean;
  foreignKey?: ForeignKeyRelationship;
  constraints?: string[];
  defaultValue?: string | number;
  notes?: string;
}

/**
 * OffLedger Kind discriminator values
 */
export type OffLedgerKind = "CUR" | "USR";

// ============================================================================
// FIELD DEFINITIONS
// ============================================================================

/**
 * Complete canonical ontology for MoneyWorks OffLedger entity
 * All 153 fields documented with empirical validation (Slot excluded)
 */
export const MONEYWORKS_OFFLEDGER_FIELDS: OffLedgerFieldDefinition[] = [

  // ==========================================================================
  // SYSTEM FIELDS (2 fields)
  // ==========================================================================

  {
    fieldName: "SequenceNumber",
    dataType: "N",
    canonicalDescription: "Primary key - unique sequential identifier for the off-ledger or currency record",
    manualSource: "Empirical API validation - observed value: 5 (GBP currency record)",
    isRequired: true,
    isSystem: true,
    isIndexed: true,
    notes: "Auto-generated by MoneyWorks, immutable after creation"
  },

  {
    fieldName: "LastModifiedTime",
    dataType: "D",
    canonicalDescription: "Timestamp of last modification - format: YYYYMMDDHHmmss",
    manualSource: "Empirical API validation - observed: 20251107143224",
    isSystem: true,
    notes: "Updated automatically by MoneyWorks on any record change"
  },

  // ==========================================================================
  // IDENTIFYING FIELDS (4 fields)
  // ==========================================================================

  {
    fieldName: "Kind",
    dataType: "T",
    maxLength: 3,
    canonicalDescription: "Record type discriminator - 'CUR' for currency definitions, 'USR' for user-created off-ledger records",
    manualSource: "Manual: moneyworks_appendix_offledgers_and_currency.html - 'CUR' is currency, 'USR' is user created offledger record",
    isRequired: true,
    isIndexed: true,
    constraints: ["CUR", "USR"],
    notes: "Critical field determining semantic interpretation of Balance fields: exchange rates (CUR) vs balances (USR)"
  },

  {
    fieldName: "Name",
    dataType: "T",
    maxLength: 15,
    canonicalDescription: "Primary identifier - currency code (e.g., 'GBP', 'USD') or off-ledger record name",
    manualSource: "Manual: The name of the currency/offledger record | Empirical: observed 'GBP'",
    isRequired: true,
    isIndexed: true,
    notes: "For currencies: typically ISO 4217 currency code; For off-ledger: user-defined name"
  },

  {
    fieldName: "Description",
    dataType: "T",
    maxLength: 39,
    canonicalDescription: "Human-readable description of the currency or off-ledger item",
    manualSource: "Manual: Description of currency/offledger record | Empirical: observed 'Pounds Sterling'",
    notes: "Provides context for the record beyond the short Name field"
  },

  {
    fieldName: "Flags",
    dataType: "N",
    canonicalDescription: "Bitfield storing various flags and settings for the off-ledger or currency record",
    manualSource: "Empirical API validation - field exists in schema",
    notes: "Internal MoneyWorks flag storage for record state and configuration"
  },

  // ==========================================================================
  // PERIOD BALANCE FIELDS (92 fields: Balance00 through Balance91)
  // ==========================================================================
  // SEMANTIC INTERPRETATION DEPENDS ON KIND:
  // - KIND='CUR': These fields store EXCHANGE RATES (rate to base currency)
  // - KIND='USR': These fields store OFF-LEDGER BALANCES (monetary or quantity)
  //
  // Balance00 is CURRENT period, Balance01 is PREVIOUS period, Balance91 is 91 periods ago
  // For currencies, all historical rates enable revaluation and FX gain/loss calculation
  // ==========================================================================

  {
    fieldName: "Balance00",
    dataType: "N",
    canonicalDescription: "Current period value - exchange rate (for CUR) or off-ledger balance (for USR)",
    manualSource: "Manual: Balance00 is the current period | Empirical: observed 12.000000 (GBP exchange rate)",
    isCalculated: true,
    notes: "Most recent period - for CUR this is the current exchange rate to base currency"
  },

  {
    fieldName: "Balance01",
    dataType: "N",
    canonicalDescription: "Previous period value (1 period ago) - exchange rate or balance",
    manualSource: "Manual: Balance01 is the previous period | Empirical: observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance02",
    dataType: "N",
    canonicalDescription: "Historical value for 2 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance03",
    dataType: "N",
    canonicalDescription: "Historical value for 3 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance04",
    dataType: "N",
    canonicalDescription: "Historical value for 4 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance05",
    dataType: "N",
    canonicalDescription: "Historical value for 5 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance06",
    dataType: "N",
    canonicalDescription: "Historical value for 6 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance07",
    dataType: "N",
    canonicalDescription: "Historical value for 7 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance08",
    dataType: "N",
    canonicalDescription: "Historical value for 8 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance09",
    dataType: "N",
    canonicalDescription: "Historical value for 9 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance10",
    dataType: "N",
    canonicalDescription: "Historical value for 10 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance11",
    dataType: "N",
    canonicalDescription: "Historical value for 11 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance12",
    dataType: "N",
    canonicalDescription: "Historical value for 12 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance13",
    dataType: "N",
    canonicalDescription: "Historical value for 13 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance14",
    dataType: "N",
    canonicalDescription: "Historical value for 14 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance15",
    dataType: "N",
    canonicalDescription: "Historical value for 15 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance16",
    dataType: "N",
    canonicalDescription: "Historical value for 16 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance17",
    dataType: "N",
    canonicalDescription: "Historical value for 17 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance18",
    dataType: "N",
    canonicalDescription: "Historical value for 18 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance19",
    dataType: "N",
    canonicalDescription: "Historical value for 19 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance20",
    dataType: "N",
    canonicalDescription: "Historical value for 20 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance21",
    dataType: "N",
    canonicalDescription: "Historical value for 21 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance22",
    dataType: "N",
    canonicalDescription: "Historical value for 22 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance23",
    dataType: "N",
    canonicalDescription: "Historical value for 23 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance24",
    dataType: "N",
    canonicalDescription: "Historical value for 24 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance25",
    dataType: "N",
    canonicalDescription: "Historical value for 25 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance26",
    dataType: "N",
    canonicalDescription: "Historical value for 26 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance27",
    dataType: "N",
    canonicalDescription: "Historical value for 27 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance28",
    dataType: "N",
    canonicalDescription: "Historical value for 28 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance29",
    dataType: "N",
    canonicalDescription: "Historical value for 29 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance30",
    dataType: "N",
    canonicalDescription: "Historical value for 30 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance31",
    dataType: "N",
    canonicalDescription: "Historical value for 31 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance32",
    dataType: "N",
    canonicalDescription: "Historical value for 32 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance33",
    dataType: "N",
    canonicalDescription: "Historical value for 33 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance34",
    dataType: "N",
    canonicalDescription: "Historical value for 34 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance35",
    dataType: "N",
    canonicalDescription: "Historical value for 35 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance36",
    dataType: "N",
    canonicalDescription: "Historical value for 36 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance37",
    dataType: "N",
    canonicalDescription: "Historical value for 37 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance38",
    dataType: "N",
    canonicalDescription: "Historical value for 38 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance39",
    dataType: "N",
    canonicalDescription: "Historical value for 39 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance40",
    dataType: "N",
    canonicalDescription: "Historical value for 40 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance41",
    dataType: "N",
    canonicalDescription: "Historical value for 41 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance42",
    dataType: "N",
    canonicalDescription: "Historical value for 42 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance43",
    dataType: "N",
    canonicalDescription: "Historical value for 43 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance44",
    dataType: "N",
    canonicalDescription: "Historical value for 44 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance45",
    dataType: "N",
    canonicalDescription: "Historical value for 45 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance46",
    dataType: "N",
    canonicalDescription: "Historical value for 46 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance47",
    dataType: "N",
    canonicalDescription: "Historical value for 47 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance48",
    dataType: "N",
    canonicalDescription: "Historical value for 48 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance49",
    dataType: "N",
    canonicalDescription: "Historical value for 49 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance50",
    dataType: "N",
    canonicalDescription: "Historical value for 50 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance51",
    dataType: "N",
    canonicalDescription: "Historical value for 51 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance52",
    dataType: "N",
    canonicalDescription: "Historical value for 52 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance53",
    dataType: "N",
    canonicalDescription: "Historical value for 53 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance54",
    dataType: "N",
    canonicalDescription: "Historical value for 54 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance55",
    dataType: "N",
    canonicalDescription: "Historical value for 55 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance56",
    dataType: "N",
    canonicalDescription: "Historical value for 56 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance57",
    dataType: "N",
    canonicalDescription: "Historical value for 57 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance58",
    dataType: "N",
    canonicalDescription: "Historical value for 58 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance59",
    dataType: "N",
    canonicalDescription: "Historical value for 59 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance60",
    dataType: "N",
    canonicalDescription: "Historical value for 60 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance61",
    dataType: "N",
    canonicalDescription: "Historical value for 61 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance62",
    dataType: "N",
    canonicalDescription: "Historical value for 62 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance63",
    dataType: "N",
    canonicalDescription: "Historical value for 63 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance64",
    dataType: "N",
    canonicalDescription: "Historical value for 64 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance65",
    dataType: "N",
    canonicalDescription: "Historical value for 65 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance66",
    dataType: "N",
    canonicalDescription: "Historical value for 66 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance67",
    dataType: "N",
    canonicalDescription: "Historical value for 67 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance68",
    dataType: "N",
    canonicalDescription: "Historical value for 68 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance69",
    dataType: "N",
    canonicalDescription: "Historical value for 69 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance70",
    dataType: "N",
    canonicalDescription: "Historical value for 70 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance71",
    dataType: "N",
    canonicalDescription: "Historical value for 71 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance72",
    dataType: "N",
    canonicalDescription: "Historical value for 72 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance73",
    dataType: "N",
    canonicalDescription: "Historical value for 73 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance74",
    dataType: "N",
    canonicalDescription: "Historical value for 74 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance75",
    dataType: "N",
    canonicalDescription: "Historical value for 75 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance76",
    dataType: "N",
    canonicalDescription: "Historical value for 76 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance77",
    dataType: "N",
    canonicalDescription: "Historical value for 77 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance78",
    dataType: "N",
    canonicalDescription: "Historical value for 78 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance79",
    dataType: "N",
    canonicalDescription: "Historical value for 79 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance80",
    dataType: "N",
    canonicalDescription: "Historical value for 80 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance81",
    dataType: "N",
    canonicalDescription: "Historical value for 81 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance82",
    dataType: "N",
    canonicalDescription: "Historical value for 82 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance83",
    dataType: "N",
    canonicalDescription: "Historical value for 83 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance84",
    dataType: "N",
    canonicalDescription: "Historical value for 84 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance85",
    dataType: "N",
    canonicalDescription: "Historical value for 85 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance86",
    dataType: "N",
    canonicalDescription: "Historical value for 86 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance87",
    dataType: "N",
    canonicalDescription: "Historical value for 87 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance88",
    dataType: "N",
    canonicalDescription: "Historical value for 88 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance89",
    dataType: "N",
    canonicalDescription: "Historical value for 89 periods ago",
    manualSource: "Empirical API validation - observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance90",
    dataType: "N",
    canonicalDescription: "Historical value for 90 periods ago",
    manualSource: "Manual: Balance90 is 90 periods ago | Empirical: observed 12.000000",
    isCalculated: true
  },

  {
    fieldName: "Balance91",
    dataType: "N",
    canonicalDescription: "Historical value for 91 periods ago - oldest historical data point",
    manualSource: "Empirical API validation - field exists in schema",
    isCalculated: true,
    notes: "Oldest historical balance/exchange rate in the 92-period series"
  },

  // ==========================================================================
  // BUDGET FIELDS (48 fields: Budget00 through BudgetNext18)
  // ==========================================================================
  // Historical budgets (30): Budget29 through Budget00
  // Future budgets (18): BudgetNext01 through BudgetNext18
  // Used for off-ledger forecasting or currency planning
  // ==========================================================================

  {
    fieldName: "Budget00",
    dataType: "N",
    canonicalDescription: "Current period budget value",
    manualSource: "Manual: Budget00 is the current period | Empirical: observed 0.000000",
    notes: "Current period budget forecast"
  },

  {
    fieldName: "Budget01",
    dataType: "N",
    canonicalDescription: "Budget for 1 period ago",
    manualSource: "Manual: Budget01 is the previous period | Empirical: observed 0.000000"
  },

  {
    fieldName: "Budget02",
    dataType: "N",
    canonicalDescription: "Budget for 2 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget03",
    dataType: "N",
    canonicalDescription: "Budget for 3 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget04",
    dataType: "N",
    canonicalDescription: "Budget for 4 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget05",
    dataType: "N",
    canonicalDescription: "Budget for 5 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget06",
    dataType: "N",
    canonicalDescription: "Budget for 6 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget07",
    dataType: "N",
    canonicalDescription: "Budget for 7 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget08",
    dataType: "N",
    canonicalDescription: "Budget for 8 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget09",
    dataType: "N",
    canonicalDescription: "Budget for 9 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget10",
    dataType: "N",
    canonicalDescription: "Budget for 10 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget11",
    dataType: "N",
    canonicalDescription: "Budget for 11 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget12",
    dataType: "N",
    canonicalDescription: "Budget for 12 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget13",
    dataType: "N",
    canonicalDescription: "Budget for 13 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget14",
    dataType: "N",
    canonicalDescription: "Budget for 14 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget15",
    dataType: "N",
    canonicalDescription: "Budget for 15 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget16",
    dataType: "N",
    canonicalDescription: "Budget for 16 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget17",
    dataType: "N",
    canonicalDescription: "Budget for 17 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget18",
    dataType: "N",
    canonicalDescription: "Budget for 18 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget19",
    dataType: "N",
    canonicalDescription: "Budget for 19 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget20",
    dataType: "N",
    canonicalDescription: "Budget for 20 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget21",
    dataType: "N",
    canonicalDescription: "Budget for 21 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget22",
    dataType: "N",
    canonicalDescription: "Budget for 22 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget23",
    dataType: "N",
    canonicalDescription: "Budget for 23 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget24",
    dataType: "N",
    canonicalDescription: "Budget for 24 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget25",
    dataType: "N",
    canonicalDescription: "Budget for 25 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget26",
    dataType: "N",
    canonicalDescription: "Budget for 26 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget27",
    dataType: "N",
    canonicalDescription: "Budget for 27 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget28",
    dataType: "N",
    canonicalDescription: "Budget for 28 periods ago",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "Budget29",
    dataType: "N",
    canonicalDescription: "Budget for 29 periods ago - oldest historical budget",
    manualSource: "Manual: Budget29 is 29 periods ago | Empirical: observed 0.000000",
    notes: "Oldest budget data point in the 48-period series"
  },

  {
    fieldName: "BudgetNext01",
    dataType: "N",
    canonicalDescription: "Budget forecast for 1 period ahead",
    manualSource: "Manual: BudgetNext01 is the budget for next period | Empirical: observed 0.000000",
    notes: "First future budget period"
  },

  {
    fieldName: "BudgetNext02",
    dataType: "N",
    canonicalDescription: "Budget forecast for 2 periods ahead",
    manualSource: "Manual: BudgetNext02 for the subsequent period | Empirical: observed 0.000000"
  },

  {
    fieldName: "BudgetNext03",
    dataType: "N",
    canonicalDescription: "Budget forecast for 3 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext04",
    dataType: "N",
    canonicalDescription: "Budget forecast for 4 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext05",
    dataType: "N",
    canonicalDescription: "Budget forecast for 5 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext06",
    dataType: "N",
    canonicalDescription: "Budget forecast for 6 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext07",
    dataType: "N",
    canonicalDescription: "Budget forecast for 7 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext08",
    dataType: "N",
    canonicalDescription: "Budget forecast for 8 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext09",
    dataType: "N",
    canonicalDescription: "Budget forecast for 9 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext10",
    dataType: "N",
    canonicalDescription: "Budget forecast for 10 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext11",
    dataType: "N",
    canonicalDescription: "Budget forecast for 11 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext12",
    dataType: "N",
    canonicalDescription: "Budget forecast for 12 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext13",
    dataType: "N",
    canonicalDescription: "Budget forecast for 13 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext14",
    dataType: "N",
    canonicalDescription: "Budget forecast for 14 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext15",
    dataType: "N",
    canonicalDescription: "Budget forecast for 15 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext16",
    dataType: "N",
    canonicalDescription: "Budget forecast for 16 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext17",
    dataType: "N",
    canonicalDescription: "Budget forecast for 17 periods ahead",
    manualSource: "Empirical API validation - observed 0.000000"
  },

  {
    fieldName: "BudgetNext18",
    dataType: "N",
    canonicalDescription: "Budget forecast for 18 periods ahead - furthest future forecast",
    manualSource: "Manual: BudgetNext18 is 18 periods ahead | Empirical: observed 0.000000",
    notes: "Maximum forward budget forecast"
  },

  // ==========================================================================
  // CURRENCY-SPECIFIC FIELDS (4 fields)
  // ==========================================================================
  // Only applicable when Kind='CUR' - links currency to GL accounts and bank accounts
  // ==========================================================================

  {
    fieldName: "LinkedAccountU",
    dataType: "T",
    maxLength: 13,
    canonicalDescription: "General ledger account for unrealised foreign exchange gains/losses",
    manualSource: "Manual: The currency unrealised gain general ledger account | Empirical: observed '4420'",
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one",
      description: "GL account for unrealised FX revaluation"
    },
    notes: "Only used for Kind='CUR' - stores unrealised FX movements when currency balances are revalued"
  },

  {
    fieldName: "LinkedAccountR",
    dataType: "T",
    maxLength: 13,
    canonicalDescription: "General ledger account for realised foreign exchange gains/losses",
    manualSource: "Manual: The currency realised gain general ledger account | Empirical: observed '4410'",
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one",
      description: "GL account for realised FX movements"
    },
    notes: "Only used for Kind='CUR' - stores realised FX gains/losses when transactions settle"
  },

  {
    fieldName: "PreferredBankCR",
    dataType: "T",
    maxLength: 7,
    canonicalDescription: "Preferred bank account for receiving payments in this currency",
    manualSource: "Manual: Preferred bank receipts account for currency | Empirical: field exists",
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one",
      description: "Default bank account for foreign currency receipts"
    },
    notes: "Only used for Kind='CUR' - automatically selected when receiving money in this currency"
  },

  {
    fieldName: "PreferredBankCP",
    dataType: "T",
    maxLength: 7,
    canonicalDescription: "Preferred bank account for making payments in this currency",
    manualSource: "Manual: Preferred bank payments account for currency | Empirical: observed '7132'",
    foreignKey: {
      targetEntity: "Account",
      targetField: "Code",
      relationship: "many-to-one",
      description: "Default bank account for foreign currency payments"
    },
    notes: "Only used for Kind='CUR' - automatically selected when paying money in this currency"
  },

  // ==========================================================================
  // CUSTOM EXTENSION FIELDS (3 fields)
  // ==========================================================================

  {
    fieldName: "UserNum",
    dataType: "N",
    canonicalDescription: "User-defined numeric field for custom calculations or categorization",
    manualSource: "Manual: Scriptable number | Empirical: observed 0.000000",
    defaultValue: 0,
    notes: "Extensibility field for custom business logic"
  },

  {
    fieldName: "UserText",
    dataType: "T",
    maxLength: 255,
    canonicalDescription: "User-defined text field for custom notes or classification",
    manualSource: "Manual: Scriptable text | Empirical: observed '' (empty string)",
    defaultValue: "",
    notes: "Flexible text field for organization-specific metadata"
  },

  {
    fieldName: "TaggedText",
    dataType: "T" as const,
    canonicalDescription: "Structured key-value storage field for extensible metadata using XML-like tags",
    manualSource: "Manual: Scriptable tag storage | Empirical: observed '' (empty string)",
    defaultValue: "",
    maxLength: 255,
    notes: "Format: <tag1>value</tag1><tag2>value</tag2> - enables dynamic field extension without schema changes"
  }
];

// ============================================================================
// ENTITY METADATA
// ============================================================================

/**
 * OffLedger entity metadata and validation summary
 */
export const OFFLEDGER_ENTITY_METADATA = {
  entityName: "OffLedger",
  totalFields: 153,
  coverage: "99.4%",
  excludedFields: ["Slot"],

  fieldCounts: {
    system: 2,
    identifying: 4,
    balances: 92,
    budgets: 48,
    currencySpecific: 4,
    custom: 3
  },

  empiricalSource: {
    file: "2025-11-25_full-schema_now.json",
    extractedAt: "2025-11-25T08:40:37.159Z",
    environment: "MoneyWorks Now v9.2.3",
    documentName: "GMS Software Factory 2019 plus.moneyworks",
    sampleRecord: "SequenceNumber: 5 (GBP currency)"
  },

  manualSource: {
    file: "moneyworks_appendix_offledgers_and_currency.html",
    section: "Offledgers and Currency"
  },

  relationships: [
    {
      field: "LinkedAccountU",
      target: "Account.Code",
      type: "many-to-one",
      description: "Unrealised FX gain/loss GL account (CUR only)"
    },
    {
      field: "LinkedAccountR",
      target: "Account.Code",
      type: "many-to-one",
      description: "Realised FX gain/loss GL account (CUR only)"
    },
    {
      field: "PreferredBankCR",
      target: "Account.Code",
      type: "many-to-one",
      description: "Preferred receipts bank account (CUR only)"
    },
    {
      field: "PreferredBankCP",
      target: "Account.Code",
      type: "many-to-one",
      description: "Preferred payments bank account (CUR only)"
    }
  ],

  keyConcepts: {
    essence: "Dual-purpose time-series entity for currency exchange rates and off-ledger tracking",
    purpose: "Multi-currency management and off-balance sheet item monitoring",
    architecture: "Denormalized pivot table with 92 historical + 48 budget periods",
    value: "Automated FX accounting and flexible shadow ledger capabilities"
  },

  criticalInsights: [
    "KIND DISCRIMINATOR: 'CUR' = currency (Balance fields are exchange rates), 'USR' = off-ledger (Balance fields are balances)",
    "Balance fields have dual semantics: exchange rates for CUR, monetary/quantity values for USR",
    "Balance00 is CURRENT period (not Balance01) - different numbering from Ledger entity",
    "92 period depth matches Ledger entity for consistent historical reporting",
    "Currency-specific fields (LinkedAccount*, PreferredBank*) only relevant for Kind='CUR'",
    "Single budget scenario (vs Ledger's dual Budget A/B scenarios)",
    "Enables automated FX gain/loss calculation through linked GL accounts",
    "Period granularity determined by document fiscal period setup"
  ],

  notes: [
    "One record exists per currency (Kind='CUR') or user-defined off-ledger item (Kind='USR')",
    "For currencies: Balance fields store exchange rates to base currency",
    "For off-ledger: Balance fields store actual off-balance sheet values",
    "Budget fields support forecasting for both currencies and off-ledger items",
    "Period balance numbering: Balance00 (current) through Balance91 (oldest)",
    "Budget numbering: Budget00 (current), Budget01-29 (historical), BudgetNext01-18 (future)",
    "Total 140 time-series fields (92 balance + 48 budget)",
    "Preferred bank accounts streamline foreign currency transaction entry",
    "FX gain/loss accounts enable automatic accounting for currency fluctuations"
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get field definition by name
 */
export function getOffLedgerField(fieldName: string): OffLedgerFieldDefinition | undefined {
  return MONEYWORKS_OFFLEDGER_FIELDS.find(f =>
    f.fieldName.toLowerCase() === fieldName.toLowerCase()
  );
}

/**
 * Get all balance period fields
 */
export function getBalanceFields(): OffLedgerFieldDefinition[] {
  return MONEYWORKS_OFFLEDGER_FIELDS.filter(f =>
    f.fieldName.startsWith("Balance")
  );
}

/**
 * Get all budget fields (historical and future)
 */
export function getBudgetFields(): OffLedgerFieldDefinition[] {
  return MONEYWORKS_OFFLEDGER_FIELDS.filter(f =>
    f.fieldName.startsWith("Budget")
  );
}

/**
 * Get historical budget fields only
 */
export function getHistoricalBudgetFields(): OffLedgerFieldDefinition[] {
  return MONEYWORKS_OFFLEDGER_FIELDS.filter(f =>
    f.fieldName.startsWith("Budget") && !f.fieldName.includes("Next")
  );
}

/**
 * Get future budget fields only
 */
export function getFutureBudgetFields(): OffLedgerFieldDefinition[] {
  return MONEYWORKS_OFFLEDGER_FIELDS.filter(f =>
    f.fieldName.startsWith("BudgetNext")
  );
}

/**
 * Get currency-specific fields
 */
export function getCurrencyFields(): OffLedgerFieldDefinition[] {
  return MONEYWORKS_OFFLEDGER_FIELDS.filter(f =>
    ["LinkedAccountU", "LinkedAccountR", "PreferredBankCR", "PreferredBankCP"].includes(f.fieldName)
  );
}

/**
 * Get identifying fields
 */
export function getIdentifyingFields(): OffLedgerFieldDefinition[] {
  return MONEYWORKS_OFFLEDGER_FIELDS.filter(f =>
    ["Kind", "Name", "Description", "Flags"].includes(f.fieldName)
  );
}

/**
 * Validate field count
 */
export function validateFieldCount(): { isValid: boolean; actual: number; expected: number } {
  const actual = MONEYWORKS_OFFLEDGER_FIELDS.length;
  const expected = 153;
  return {
    isValid: actual === expected,
    actual,
    expected
  };
}

/**
 * Type guard to check if a record is a currency (Kind='CUR')
 */
export function isCurrencyRecord(kind: string): kind is "CUR" {
  return kind === "CUR";
}

/**
 * Type guard to check if a record is a user off-ledger (Kind='USR')
 */
export function isUserOffLedgerRecord(kind: string): kind is "USR" {
  return kind === "USR";
}
