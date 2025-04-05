/**
 * Ledger table interface
 * file_num: 1
 */
export interface Ledger {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** size="8" */
  AccountCode: string;
  /** @indexed size="6" */
  Department: string;
  /** @indexed size="8" */
  Category: string;
  /** @indexed size="6" */
  Classification: string;
  /** @indexed char_short */
  Type: string;
  BalanceLast91: number;
  BalanceLast90: number;
  BalanceLast89: number;
  BalanceLast88: number;
  BalanceLast87: number;
  BalanceLast86: number;
  BalanceLast85: number;
  BalanceLast84: number;
  BalanceLast83: number;
  BalanceLast82: number;
  BalanceLast81: number;
  BalanceLast80: number;
  BalanceLast79: number;
  BalanceLast78: number;
  BalanceLast77: number;
  BalanceLast76: number;
  BalanceLast75: number;
  BalanceLast74: number;
  BalanceLast73: number;
  BalanceLast72: number;
  BalanceLast71: number;
  BalanceLast70: number;
  BalanceLast69: number;
  BalanceLast68: number;
  BalanceLast67: number;
  BalanceLast66: number;
  BalanceLast65: number;
  BalanceLast64: number;
  BalanceLast63: number;
  BalanceLast62: number;
  BalanceLast61: number;
  BalanceLast60: number;
  BalanceLast59: number;
  BalanceLast58: number;
  BalanceLast57: number;
  BalanceLast56: number;
  BalanceLast55: number;
  BalanceLast54: number;
  BalanceLast53: number;
  BalanceLast52: number;
  BalanceLast51: number;
  BalanceLast50: number;
  BalanceLast49: number;
  BalanceLast48: number;
  BalanceLast47: number;
  BalanceLast46: number;
  BalanceLast45: number;
  BalanceLast44: number;
  BalanceLast43: number;
  BalanceLast42: number;
  BalanceLast41: number;
  BalanceLast40: number;
  BalanceLast39: number;
  BalanceLast38: number;
  BalanceLast37: number;
  BalanceLast36: number;
  BalanceLast35: number;
  BalanceLast34: number;
  BalanceLast33: number;
  BalanceLast32: number;
  BalanceLast31: number;
  BalanceLast30: number;
  BalanceLast29: number;
  BalanceLast28: number;
  BalanceLast27: number;
  BalanceLast26: number;
  BalanceLast25: number;
  BalanceLast24: number;
  BalanceLast23: number;
  BalanceLast22: number;
  BalanceLast21: number;
  BalanceLast20: number;
  BalanceLast19: number;
  BalanceLast18: number;
  BalanceLast17: number;
  BalanceLast16: number;
  BalanceLast15: number;
  BalanceLast14: number;
  BalanceLast13: number;
  BalanceLast12: number;
  BalanceLast11: number;
  BalanceLast10: number;
  BalanceLast09: number;
  BalanceLast08: number;
  BalanceLast07: number;
  BalanceLast06: number;
  BalanceLast05: number;
  BalanceLast04: number;
  BalanceLast03: number;
  BalanceLast02: number;
  BalanceLast01: number;
  Balance: number;
  BudgetALast29: number;
  BudgetALast28: number;
  BudgetALast27: number;
  BudgetALast26: number;
  BudgetALast25: number;
  BudgetALast24: number;
  BudgetALast23: number;
  BudgetALast22: number;
  BudgetALast21: number;
  BudgetALast20: number;
  BudgetALast19: number;
  BudgetALast18: number;
  BudgetALast17: number;
  BudgetALast16: number;
  BudgetALast15: number;
  BudgetALast14: number;
  BudgetALast13: number;
  BudgetALast12: number;
  BudgetALast11: number;
  BudgetALast10: number;
  BudgetALast09: number;
  BudgetALast08: number;
  BudgetALast07: number;
  BudgetALast06: number;
  BudgetALast05: number;
  BudgetALast04: number;
  BudgetALast03: number;
  BudgetALast02: number;
  BudgetALast01: number;
  BudgetA: number;
  BudgetANext01: number;
  BudgetANext02: number;
  BudgetANext03: number;
  BudgetANext04: number;
  BudgetANext05: number;
  BudgetANext06: number;
  BudgetANext07: number;
  BudgetANext08: number;
  BudgetANext09: number;
  BudgetANext10: number;
  BudgetANext11: number;
  BudgetANext12: number;
  BudgetANext13: number;
  BudgetANext14: number;
  BudgetANext15: number;
  BudgetANext16: number;
  BudgetANext17: number;
  BudgetANext18: number;
  BudgetBLast29: number;
  BudgetBLast28: number;
  BudgetBLast27: number;
  BudgetBLast26: number;
  BudgetBLast25: number;
  BudgetBLast24: number;
  BudgetBLast23: number;
  BudgetBLast22: number;
  BudgetBLast21: number;
  BudgetBLast20: number;
  BudgetBLast19: number;
  BudgetBLast18: number;
  BudgetBLast17: number;
  BudgetBLast16: number;
  BudgetBLast15: number;
  BudgetBLast14: number;
  BudgetBLast13: number;
  BudgetBLast12: number;
  BudgetBLast11: number;
  BudgetBLast10: number;
  BudgetBLast09: number;
  BudgetBLast08: number;
  BudgetBLast07: number;
  BudgetBLast06: number;
  BudgetBLast05: number;
  BudgetBLast04: number;
  BudgetBLast03: number;
  BudgetBLast02: number;
  BudgetBLast01: number;
  BudgetB: number;
  BudgetBNext01: number;
  BudgetBNext02: number;
  BudgetBNext03: number;
  BudgetBNext04: number;
  BudgetBNext05: number;
  BudgetBNext06: number;
  BudgetBNext07: number;
  BudgetBNext08: number;
  BudgetBNext09: number;
  BudgetBNext10: number;
  BudgetBNext11: number;
  BudgetBNext12: number;
  BudgetBNext13: number;
  BudgetBNext14: number;
  BudgetBNext15: number;
  BudgetBNext16: number;
  BudgetBNext17: number;
  BudgetBNext18: number;
  /** @indexed size="14" */
  Concat: string;
  /** @indexed char_short */
  System: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}

export type LedgerField = keyof Ledger;

export const LedgerFields: LedgerField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "AccountCode",
  "Department",
  "Category",
  "Classification",
  "Type",
  "BalanceLast91",
  "BalanceLast90",
  "BalanceLast89",
  "BalanceLast88",
  "BalanceLast87",
  "BalanceLast86",
  "BalanceLast85",
  "BalanceLast84",
  "BalanceLast83",
  "BalanceLast82",
  "BalanceLast81",
  "BalanceLast80",
  "BalanceLast79",
  "BalanceLast78",
  "BalanceLast77",
  "BalanceLast76",
  "BalanceLast75",
  "BalanceLast74",
  "BalanceLast73",
  "BalanceLast72",
  "BalanceLast71",
  "BalanceLast70",
  "BalanceLast69",
  "BalanceLast68",
  "BalanceLast67",
  "BalanceLast66",
  "BalanceLast65",
  "BalanceLast64",
  "BalanceLast63",
  "BalanceLast62",
  "BalanceLast61",
  "BalanceLast60",
  "BalanceLast59",
  "BalanceLast58",
  "BalanceLast57",
  "BalanceLast56",
  "BalanceLast55",
  "BalanceLast54",
  "BalanceLast53",
  "BalanceLast52",
  "BalanceLast51",
  "BalanceLast50",
  "BalanceLast49",
  "BalanceLast48",
  "BalanceLast47",
  "BalanceLast46",
  "BalanceLast45",
  "BalanceLast44",
  "BalanceLast43",
  "BalanceLast42",
  "BalanceLast41",
  "BalanceLast40",
  "BalanceLast39",
  "BalanceLast38",
  "BalanceLast37",
  "BalanceLast36",
  "BalanceLast35",
  "BalanceLast34",
  "BalanceLast33",
  "BalanceLast32",
  "BalanceLast31",
  "BalanceLast30",
  "BalanceLast29",
  "BalanceLast28",
  "BalanceLast27",
  "BalanceLast26",
  "BalanceLast25",
  "BalanceLast24",
  "BalanceLast23",
  "BalanceLast22",
  "BalanceLast21",
  "BalanceLast20",
  "BalanceLast19",
  "BalanceLast18",
  "BalanceLast17",
  "BalanceLast16",
  "BalanceLast15",
  "BalanceLast14",
  "BalanceLast13",
  "BalanceLast12",
  "BalanceLast11",
  "BalanceLast10",
  "BalanceLast09",
  "BalanceLast08",
  "BalanceLast07",
  "BalanceLast06",
  "BalanceLast05",
  "BalanceLast04",
  "BalanceLast03",
  "BalanceLast02",
  "BalanceLast01",
  "Balance",
  "BudgetALast29",
  "BudgetALast28",
  "BudgetALast27",
  "BudgetALast26",
  "BudgetALast25",
  "BudgetALast24",
  "BudgetALast23",
  "BudgetALast22",
  "BudgetALast21",
  "BudgetALast20",
  "BudgetALast19",
  "BudgetALast18",
  "BudgetALast17",
  "BudgetALast16",
  "BudgetALast15",
  "BudgetALast14",
  "BudgetALast13",
  "BudgetALast12",
  "BudgetALast11",
  "BudgetALast10",
  "BudgetALast09",
  "BudgetALast08",
  "BudgetALast07",
  "BudgetALast06",
  "BudgetALast05",
  "BudgetALast04",
  "BudgetALast03",
  "BudgetALast02",
  "BudgetALast01",
  "BudgetA",
  "BudgetANext01",
  "BudgetANext02",
  "BudgetANext03",
  "BudgetANext04",
  "BudgetANext05",
  "BudgetANext06",
  "BudgetANext07",
  "BudgetANext08",
  "BudgetANext09",
  "BudgetANext10",
  "BudgetANext11",
  "BudgetANext12",
  "BudgetANext13",
  "BudgetANext14",
  "BudgetANext15",
  "BudgetANext16",
  "BudgetANext17",
  "BudgetANext18",
  "BudgetBLast29",
  "BudgetBLast28",
  "BudgetBLast27",
  "BudgetBLast26",
  "BudgetBLast25",
  "BudgetBLast24",
  "BudgetBLast23",
  "BudgetBLast22",
  "BudgetBLast21",
  "BudgetBLast20",
  "BudgetBLast19",
  "BudgetBLast18",
  "BudgetBLast17",
  "BudgetBLast16",
  "BudgetBLast15",
  "BudgetBLast14",
  "BudgetBLast13",
  "BudgetBLast12",
  "BudgetBLast11",
  "BudgetBLast10",
  "BudgetBLast09",
  "BudgetBLast08",
  "BudgetBLast07",
  "BudgetBLast06",
  "BudgetBLast05",
  "BudgetBLast04",
  "BudgetBLast03",
  "BudgetBLast02",
  "BudgetBLast01",
  "BudgetB",
  "BudgetBNext01",
  "BudgetBNext02",
  "BudgetBNext03",
  "BudgetBNext04",
  "BudgetBNext05",
  "BudgetBNext06",
  "BudgetBNext07",
  "BudgetBNext08",
  "BudgetBNext09",
  "BudgetBNext10",
  "BudgetBNext11",
  "BudgetBNext12",
  "BudgetBNext13",
  "BudgetBNext14",
  "BudgetBNext15",
  "BudgetBNext16",
  "BudgetBNext17",
  "BudgetBNext18",
  "Concat",
  "System",
  "UserNum",
  "UserText",
  "TaggedText"
];

