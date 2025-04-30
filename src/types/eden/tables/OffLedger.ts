import { t } from "elysia";

export const OffLedgerOne = t.Object(
  {
    SequenceNumber: t.Number({
      description: "Unsigned long sequence number (indexed). Unique internal identifier for this record."
    }),
    LastModifiedTime: t.String({
      description: "Last modified timestamp. The date and time that this record was last changed."
    }),
    Kind: t.String({
      description: "Kind of record: 'CUR' for Currency or 'USR' for User-defined. Indexed.",
      maxLength: 3
    }),
    Name: t.String({
      description: "Name/identifier for the record (e.g., currency code like 'USD', or user-defined name like 'StaffCount'). Indexed.",
      maxLength: 15
    }),
    Description: t.Nullable(t.String({
      description: "Description of the currency or user-defined value.",
      maxLength: 39
    })),
    Flags: t.Nullable(t.Number({
      description: "Bitmapped flags field (usage not explicitly detailed in appendix)."
    })),
    Balance91: t.Nullable(t.Number({
      description: "Balance/Value for the 91st period prior to the current period. For CUR, this is the exchange rate."
    })),
    Balance90: t.Nullable(t.Number({
      description: "Balance/Value for the 90th period prior to the current period."
    })),
    Balance89: t.Nullable(t.Number({
      description: "Balance/Value for the 89th period prior to the current period."
    })),
    Balance88: t.Nullable(t.Number({
      description: "Balance/Value for the 88th period prior to the current period."
    })),
    Balance87: t.Nullable(t.Number({
      description: "Balance/Value for the 87th period prior to the current period."
    })),
    Balance86: t.Nullable(t.Number({
      description: "Balance/Value for the 86th period prior to the current period."
    })),
    Balance85: t.Nullable(t.Number({
      description: "Balance/Value for the 85th period prior to the current period."
    })),
    Balance84: t.Nullable(t.Number({
      description: "Balance/Value for the 84th period prior to the current period."
    })),
    Balance83: t.Nullable(t.Number({
      description: "Balance/Value for the 83rd period prior to the current period."
    })),
    Balance82: t.Nullable(t.Number({
      description: "Balance/Value for the 82nd period prior to the current period."
    })),
    Balance81: t.Nullable(t.Number({
      description: "Balance/Value for the 81st period prior to the current period."
    })),
    Balance80: t.Nullable(t.Number({
      description: "Balance/Value for the 80th period prior to the current period."
    })),
    Balance79: t.Nullable(t.Number({
      description: "Balance/Value for the 79th period prior to the current period."
    })),
    Balance78: t.Nullable(t.Number({
      description: "Balance/Value for the 78th period prior to the current period."
    })),
    Balance77: t.Nullable(t.Number({
      description: "Balance/Value for the 77th period prior to the current period."
    })),
    Balance76: t.Nullable(t.Number({
      description: "Balance/Value for the 76th period prior to the current period."
    })),
    Balance75: t.Nullable(t.Number({
      description: "Balance/Value for the 75th period prior to the current period."
    })),
    Balance74: t.Nullable(t.Number({
      description: "Balance/Value for the 74th period prior to the current period."
    })),
    Balance73: t.Nullable(t.Number({
      description: "Balance/Value for the 73rd period prior to the current period."
    })),
    Balance72: t.Nullable(t.Number({
      description: "Balance/Value for the 72nd period prior to the current period."
    })),
    Balance71: t.Nullable(t.Number({
      description: "Balance/Value for the 71st period prior to the current period."
    })),
    Balance70: t.Nullable(t.Number({
      description: "Balance/Value for the 70th period prior to the current period."
    })),
    Balance69: t.Nullable(t.Number({
      description: "Balance/Value for the 69th period prior to the current period."
    })),
    Balance68: t.Nullable(t.Number({
      description: "Balance/Value for the 68th period prior to the current period."
    })),
    Balance67: t.Nullable(t.Number({
      description: "Balance/Value for the 67th period prior to the current period."
    })),
    Balance66: t.Nullable(t.Number({
      description: "Balance/Value for the 66th period prior to the current period."
    })),
    Balance65: t.Nullable(t.Number({
      description: "Balance/Value for the 65th period prior to the current period."
    })),
    Balance64: t.Nullable(t.Number({
      description: "Balance/Value for the 64th period prior to the current period."
    })),
    Balance63: t.Nullable(t.Number({
      description: "Balance/Value for the 63rd period prior to the current period."
    })),
    Balance62: t.Nullable(t.Number({
      description: "Balance/Value for the 62nd period prior to the current period."
    })),
    Balance61: t.Nullable(t.Number({
      description: "Balance/Value for the 61st period prior to the current period."
    })),
    Balance60: t.Nullable(t.Number({
      description: "Balance/Value for the 60th period prior to the current period."
    })),
    Balance59: t.Nullable(t.Number({
      description: "Balance/Value for the 59th period prior to the current period."
    })),
    Balance58: t.Nullable(t.Number({
      description: "Balance/Value for the 58th period prior to the current period."
    })),
    Balance57: t.Nullable(t.Number({
      description: "Balance/Value for the 57th period prior to the current period."
    })),
    Balance56: t.Nullable(t.Number({
      description: "Balance/Value for the 56th period prior to the current period."
    })),
    Balance55: t.Nullable(t.Number({
      description: "Balance/Value for the 55th period prior to the current period."
    })),
    Balance54: t.Nullable(t.Number({
      description: "Balance/Value for the 54th period prior to the current period."
    })),
    Balance53: t.Nullable(t.Number({
      description: "Balance/Value for the 53rd period prior to the current period."
    })),
    Balance52: t.Nullable(t.Number({
      description: "Balance/Value for the 52nd period prior to the current period."
    })),
    Balance51: t.Nullable(t.Number({
      description: "Balance/Value for the 51st period prior to the current period."
    })),
    Balance50: t.Nullable(t.Number({
      description: "Balance/Value for the 50th period prior to the current period."
    })),
    Balance49: t.Nullable(t.Number({
      description: "Balance/Value for the 49th period prior to the current period."
    })),
    Balance48: t.Nullable(t.Number({
      description: "Balance/Value for the 48th period prior to the current period."
    })),
    Balance47: t.Nullable(t.Number({
      description: "Balance/Value for the 47th period prior to the current period."
    })),
    Balance46: t.Nullable(t.Number({
      description: "Balance/Value for the 46th period prior to the current period."
    })),
    Balance45: t.Nullable(t.Number({
      description: "Balance/Value for the 45th period prior to the current period."
    })),
    Balance44: t.Nullable(t.Number({
      description: "Balance/Value for the 44th period prior to the current period."
    })),
    Balance43: t.Nullable(t.Number({
      description: "Balance/Value for the 43rd period prior to the current period."
    })),
    Balance42: t.Nullable(t.Number({
      description: "Balance/Value for the 42nd period prior to the current period."
    })),
    Balance41: t.Nullable(t.Number({
      description: "Balance/Value for the 41st period prior to the current period."
    })),
    Balance40: t.Nullable(t.Number({
      description: "Balance/Value for the 40th period prior to the current period."
    })),
    Balance39: t.Nullable(t.Number({
      description: "Balance/Value for the 39th period prior to the current period."
    })),
    Balance38: t.Nullable(t.Number({
      description: "Balance/Value for the 38th period prior to the current period."
    })),
    Balance37: t.Nullable(t.Number({
      description: "Balance/Value for the 37th period prior to the current period."
    })),
    Balance36: t.Nullable(t.Number({
      description: "Balance/Value for the 36th period prior to the current period."
    })),
    Balance35: t.Nullable(t.Number({
      description: "Balance/Value for the 35th period prior to the current period."
    })),
    Balance34: t.Nullable(t.Number({
      description: "Balance/Value for the 34th period prior to the current period."
    })),
    Balance33: t.Nullable(t.Number({
      description: "Balance/Value for the 33rd period prior to the current period."
    })),
    Balance32: t.Nullable(t.Number({
      description: "Balance/Value for the 32nd period prior to the current period."
    })),
    Balance31: t.Nullable(t.Number({
      description: "Balance/Value for the 31st period prior to the current period."
    })),
    Balance30: t.Nullable(t.Number({
      description: "Balance/Value for the 30th period prior to the current period."
    })),
    Balance29: t.Nullable(t.Number({
      description: "Balance/Value for the 29th period prior to the current period."
    })),
    Balance28: t.Nullable(t.Number({
      description: "Balance/Value for the 28th period prior to the current period."
    })),
    Balance27: t.Nullable(t.Number({
      description: "Balance/Value for the 27th period prior to the current period."
    })),
    Balance26: t.Nullable(t.Number({
      description: "Balance/Value for the 26th period prior to the current period."
    })),
    Balance25: t.Nullable(t.Number({
      description: "Balance/Value for the 25th period prior to the current period."
    })),
    Balance24: t.Nullable(t.Number({
      description: "Balance/Value for the 24th period prior to the current period."
    })),
    Balance23: t.Nullable(t.Number({
      description: "Balance/Value for the 23rd period prior to the current period."
    })),
    Balance22: t.Nullable(t.Number({
      description: "Balance/Value for the 22nd period prior to the current period."
    })),
    Balance21: t.Nullable(t.Number({
      description: "Balance/Value for the 21st period prior to the current period."
    })),
    Balance20: t.Nullable(t.Number({
      description: "Balance/Value for the 20th period prior to the current period."
    })),
    Balance19: t.Nullable(t.Number({
      description: "Balance/Value for the 19th period prior to the current period."
    })),
    Balance18: t.Nullable(t.Number({
      description: "Balance/Value for the 18th period prior to the current period."
    })),
    Balance17: t.Nullable(t.Number({
      description: "Balance/Value for the 17th period prior to the current period."
    })),
    Balance16: t.Nullable(t.Number({
      description: "Balance/Value for the 16th period prior to the current period."
    })),
    Balance15: t.Nullable(t.Number({
      description: "Balance/Value for the 15th period prior to the current period."
    })),
    Balance14: t.Nullable(t.Number({
      description: "Balance/Value for the 14th period prior to the current period."
    })),
    Balance13: t.Nullable(t.Number({
      description: "Balance/Value for the 13th period prior to the current period."
    })),
    Balance12: t.Nullable(t.Number({
      description: "Balance/Value for the 12th period prior to the current period."
    })),
    Balance11: t.Nullable(t.Number({
      description: "Balance/Value for the 11th period prior to the current period."
    })),
    Balance10: t.Nullable(t.Number({
      description: "Balance/Value for the 10th period prior to the current period."
    })),
    Balance09: t.Nullable(t.Number({
      description: "Balance/Value for the 9th period prior to the current period."
    })),
    Balance08: t.Nullable(t.Number({
      description: "Balance/Value for the 8th period prior to the current period."
    })),
    Balance07: t.Nullable(t.Number({
      description: "Balance/Value for the 7th period prior to the current period."
    })),
    Balance06: t.Nullable(t.Number({
      description: "Balance/Value for the 6th period prior to the current period."
    })),
    Balance05: t.Nullable(t.Number({
      description: "Balance/Value for the 5th period prior to the current period."
    })),
    Balance04: t.Nullable(t.Number({
      description: "Balance/Value for the 4th period prior to the current period."
    })),
    Balance03: t.Nullable(t.Number({
      description: "Balance/Value for the 3rd period prior to the current period."
    })),
    Balance02: t.Nullable(t.Number({
      description: "Balance/Value for the 2nd period prior to the current period."
    })),
    Balance01: t.Nullable(t.Number({
      description: "Balance/Value for the 1st period prior to the current period (previous period)."
    })),
    Balance00: t.Nullable(t.Number({
      description: "Balance/Value for the current period."
    })),
    Budget29: t.Nullable(t.Number({
      description: "Budget value for the 29th period prior to the current period."
    })),
    Budget28: t.Nullable(t.Number({
      description: "Budget value for the 28th period prior to the current period."
    })),
    Budget27: t.Nullable(t.Number({
      description: "Budget value for the 27th period prior to the current period."
    })),
    Budget26: t.Nullable(t.Number({
      description: "Budget value for the 26th period prior to the current period."
    })),
    Budget25: t.Nullable(t.Number({
      description: "Budget value for the 25th period prior to the current period."
    })),
    Budget24: t.Nullable(t.Number({
      description: "Budget value for the 24th period prior to the current period."
    })),
    Budget23: t.Nullable(t.Number({
      description: "Budget value for the 23rd period prior to the current period."
    })),
    Budget22: t.Nullable(t.Number({
      description: "Budget value for the 22nd period prior to the current period."
    })),
    Budget21: t.Nullable(t.Number({
      description: "Budget value for the 21st period prior to the current period."
    })),
    Budget20: t.Nullable(t.Number({
      description: "Budget value for the 20th period prior to the current period."
    })),
    Budget19: t.Nullable(t.Number({
      description: "Budget value for the 19th period prior to the current period."
    })),
    Budget18: t.Nullable(t.Number({
      description: "Budget value for the 18th period prior to the current period."
    })),
    Budget17: t.Nullable(t.Number({
      description: "Budget value for the 17th period prior to the current period."
    })),
    Budget16: t.Nullable(t.Number({
      description: "Budget value for the 16th period prior to the current period."
    })),
    Budget15: t.Nullable(t.Number({
      description: "Budget value for the 15th period prior to the current period."
    })),
    Budget14: t.Nullable(t.Number({
      description: "Budget value for the 14th period prior to the current period."
    })),
    Budget13: t.Nullable(t.Number({
      description: "Budget value for the 13th period prior to the current period."
    })),
    Budget12: t.Nullable(t.Number({
      description: "Budget value for the 12th period prior to the current period."
    })),
    Budget11: t.Nullable(t.Number({
      description: "Budget value for the 11th period prior to the current period."
    })),
    Budget10: t.Nullable(t.Number({
      description: "Budget value for the 10th period prior to the current period."
    })),
    Budget09: t.Nullable(t.Number({
      description: "Budget value for the 9th period prior to the current period."
    })),
    Budget08: t.Nullable(t.Number({
      description: "Budget value for the 8th period prior to the current period."
    })),
    Budget07: t.Nullable(t.Number({
      description: "Budget value for the 7th period prior to the current period."
    })),
    Budget06: t.Nullable(t.Number({
      description: "Budget value for the 6th period prior to the current period."
    })),
    Budget05: t.Nullable(t.Number({
      description: "Budget value for the 5th period prior to the current period."
    })),
    Budget04: t.Nullable(t.Number({
      description: "Budget value for the 4th period prior to the current period."
    })),
    Budget03: t.Nullable(t.Number({
      description: "Budget value for the 3rd period prior to the current period."
    })),
    Budget02: t.Nullable(t.Number({
      description: "Budget value for the 2nd period prior to the current period."
    })),
    Budget01: t.Nullable(t.Number({
      description: "Budget value for the 1st period prior to the current period (previous period)."
    })),
    Budget00: t.Nullable(t.Number({
      description: "Budget value for the current period."
    })),
    BudgetNext01: t.Nullable(t.Number({
      description: "Budget value for the 1st future period."
    })),
    BudgetNext02: t.Nullable(t.Number({
      description: "Budget value for the 2nd future period."
    })),
    BudgetNext03: t.Nullable(t.Number({
      description: "Budget value for the 3rd future period."
    })),
    BudgetNext04: t.Nullable(t.Number({
      description: "Budget value for the 4th future period."
    })),
    BudgetNext05: t.Nullable(t.Number({
      description: "Budget value for the 5th future period."
    })),
    BudgetNext06: t.Nullable(t.Number({
      description: "Budget value for the 6th future period."
    })),
    BudgetNext07: t.Nullable(t.Number({
      description: "Budget value for the 7th future period."
    })),
    BudgetNext08: t.Nullable(t.Number({
      description: "Budget value for the 8th future period."
    })),
    BudgetNext09: t.Nullable(t.Number({
      description: "Budget value for the 9th future period."
    })),
    BudgetNext10: t.Nullable(t.Number({
      description: "Budget value for the 10th future period."
    })),
    BudgetNext11: t.Nullable(t.Number({
      description: "Budget value for the 11th future period."
    })),
    BudgetNext12: t.Nullable(t.Number({
      description: "Budget value for the 12th future period."
    })),
    BudgetNext13: t.Nullable(t.Number({
      description: "Budget value for the 13th future period."
    })),
    BudgetNext14: t.Nullable(t.Number({
      description: "Budget value for the 14th future period."
    })),
    BudgetNext15: t.Nullable(t.Number({
      description: "Budget value for the 15th future period."
    })),
    BudgetNext16: t.Nullable(t.Number({
      description: "Budget value for the 16th future period."
    })),
    BudgetNext17: t.Nullable(t.Number({
      description: "Budget value for the 17th future period."
    })),
    BudgetNext18: t.Nullable(t.Number({
      description: "Budget value for the 18th future period."
    })),
    LinkedAccountU: t.Nullable(t.String({
      description: "General ledger account code for unrealised currency gain/loss.",
      maxLength: 13
    })),
    LinkedAccountR: t.Nullable(t.String({
      description: "General ledger account code for realised currency gain/loss.",
      maxLength: 13
    })),
    PreferredBankCR: t.Nullable(t.String({
      description: "Preferred bank account code for receiving this currency.",
      maxLength: 7
    })),
    PreferredBankCP: t.Nullable(t.String({
      description: "Preferred bank account code for paying with this currency.",
      maxLength: 7
    })),
    UserNum: t.Nullable(t.Number({
      description: "User-defined numeric field (scriptable)."
    })),
    UserText: t.Nullable(t.String({
      description: "User-defined text field (scriptable).",
      maxLength: 255
    })),
    TaggedText: t.Nullable(t.String({
      description: "Scriptable tag storage for key-value pairs.",
      maxLength: 255
    })),
  },
  { additionalProperties: true },
);