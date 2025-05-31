/**
 * OffLedger table interface
 * file_num: 25
 */
export interface OffLedger {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="4" */
  Kind: string;
  /** @indexed size="16" */
  Name: string;
  /** size="40" */
  Description: string;
  Flags: number;
  Balance91: number;
  Balance90: number;
  Balance89: number;
  Balance88: number;
  Balance87: number;
  Balance86: number;
  Balance85: number;
  Balance84: number;
  Balance83: number;
  Balance82: number;
  Balance81: number;
  Balance80: number;
  Balance79: number;
  Balance78: number;
  Balance77: number;
  Balance76: number;
  Balance75: number;
  Balance74: number;
  Balance73: number;
  Balance72: number;
  Balance71: number;
  Balance70: number;
  Balance69: number;
  Balance68: number;
  Balance67: number;
  Balance66: number;
  Balance65: number;
  Balance64: number;
  Balance63: number;
  Balance62: number;
  Balance61: number;
  Balance60: number;
  Balance59: number;
  Balance58: number;
  Balance57: number;
  Balance56: number;
  Balance55: number;
  Balance54: number;
  Balance53: number;
  Balance52: number;
  Balance51: number;
  Balance50: number;
  Balance49: number;
  Balance48: number;
  Balance47: number;
  Balance46: number;
  Balance45: number;
  Balance44: number;
  Balance43: number;
  Balance42: number;
  Balance41: number;
  Balance40: number;
  Balance39: number;
  Balance38: number;
  Balance37: number;
  Balance36: number;
  Balance35: number;
  Balance34: number;
  Balance33: number;
  Balance32: number;
  Balance31: number;
  Balance30: number;
  Balance29: number;
  Balance28: number;
  Balance27: number;
  Balance26: number;
  Balance25: number;
  Balance24: number;
  Balance23: number;
  Balance22: number;
  Balance21: number;
  Balance20: number;
  Balance19: number;
  Balance18: number;
  Balance17: number;
  Balance16: number;
  Balance15: number;
  Balance14: number;
  Balance13: number;
  Balance12: number;
  Balance11: number;
  Balance10: number;
  Balance09: number;
  Balance08: number;
  Balance07: number;
  Balance06: number;
  Balance05: number;
  Balance04: number;
  Balance03: number;
  Balance02: number;
  Balance01: number;
  Balance00: number;
  Budget29: number;
  Budget28: number;
  Budget27: number;
  Budget26: number;
  Budget25: number;
  Budget24: number;
  Budget23: number;
  Budget22: number;
  Budget21: number;
  Budget20: number;
  Budget19: number;
  Budget18: number;
  Budget17: number;
  Budget16: number;
  Budget15: number;
  Budget14: number;
  Budget13: number;
  Budget12: number;
  Budget11: number;
  Budget10: number;
  Budget09: number;
  Budget08: number;
  Budget07: number;
  Budget06: number;
  Budget05: number;
  Budget04: number;
  Budget03: number;
  Budget02: number;
  Budget01: number;
  Budget00: number;
  BudgetNext01: number;
  BudgetNext02: number;
  BudgetNext03: number;
  BudgetNext04: number;
  BudgetNext05: number;
  BudgetNext06: number;
  BudgetNext07: number;
  BudgetNext08: number;
  BudgetNext09: number;
  BudgetNext10: number;
  BudgetNext11: number;
  BudgetNext12: number;
  BudgetNext13: number;
  BudgetNext14: number;
  BudgetNext15: number;
  BudgetNext16: number;
  BudgetNext17: number;
  BudgetNext18: number;
  /** size="14" */
  LinkedAccountU: string;
  /** size="14" */
  LinkedAccountR: string;
  /** size="8" */
  PreferredBankCR: string;
  /** size="8" */
  PreferredBankCP: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}

export type OffLedgerField = keyof OffLedger;

export const OffLedgerFields: OffLedgerField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Kind",
  "Name",
  "Description",
  "Flags",
  "Balance91",
  "Balance90",
  "Balance89",
  "Balance88",
  "Balance87",
  "Balance86",
  "Balance85",
  "Balance84",
  "Balance83",
  "Balance82",
  "Balance81",
  "Balance80",
  "Balance79",
  "Balance78",
  "Balance77",
  "Balance76",
  "Balance75",
  "Balance74",
  "Balance73",
  "Balance72",
  "Balance71",
  "Balance70",
  "Balance69",
  "Balance68",
  "Balance67",
  "Balance66",
  "Balance65",
  "Balance64",
  "Balance63",
  "Balance62",
  "Balance61",
  "Balance60",
  "Balance59",
  "Balance58",
  "Balance57",
  "Balance56",
  "Balance55",
  "Balance54",
  "Balance53",
  "Balance52",
  "Balance51",
  "Balance50",
  "Balance49",
  "Balance48",
  "Balance47",
  "Balance46",
  "Balance45",
  "Balance44",
  "Balance43",
  "Balance42",
  "Balance41",
  "Balance40",
  "Balance39",
  "Balance38",
  "Balance37",
  "Balance36",
  "Balance35",
  "Balance34",
  "Balance33",
  "Balance32",
  "Balance31",
  "Balance30",
  "Balance29",
  "Balance28",
  "Balance27",
  "Balance26",
  "Balance25",
  "Balance24",
  "Balance23",
  "Balance22",
  "Balance21",
  "Balance20",
  "Balance19",
  "Balance18",
  "Balance17",
  "Balance16",
  "Balance15",
  "Balance14",
  "Balance13",
  "Balance12",
  "Balance11",
  "Balance10",
  "Balance09",
  "Balance08",
  "Balance07",
  "Balance06",
  "Balance05",
  "Balance04",
  "Balance03",
  "Balance02",
  "Balance01",
  "Balance00",
  "Budget29",
  "Budget28",
  "Budget27",
  "Budget26",
  "Budget25",
  "Budget24",
  "Budget23",
  "Budget22",
  "Budget21",
  "Budget20",
  "Budget19",
  "Budget18",
  "Budget17",
  "Budget16",
  "Budget15",
  "Budget14",
  "Budget13",
  "Budget12",
  "Budget11",
  "Budget10",
  "Budget09",
  "Budget08",
  "Budget07",
  "Budget06",
  "Budget05",
  "Budget04",
  "Budget03",
  "Budget02",
  "Budget01",
  "Budget00",
  "BudgetNext01",
  "BudgetNext02",
  "BudgetNext03",
  "BudgetNext04",
  "BudgetNext05",
  "BudgetNext06",
  "BudgetNext07",
  "BudgetNext08",
  "BudgetNext09",
  "BudgetNext10",
  "BudgetNext11",
  "BudgetNext12",
  "BudgetNext13",
  "BudgetNext14",
  "BudgetNext15",
  "BudgetNext16",
  "BudgetNext17",
  "BudgetNext18",
  "LinkedAccountU",
  "LinkedAccountR",
  "PreferredBankCR",
  "PreferredBankCP",
  "UserNum",
  "UserText",
  "TaggedText",
];
