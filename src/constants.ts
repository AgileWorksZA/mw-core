import { z } from "zod";
import { AccountFields } from "./moneyworks/types/account";
import { AutoSplitFields } from "./moneyworks/types/auto-split";
import { BankRecsFields } from "./moneyworks/types/bank-recs";
import { BuildFields } from "./moneyworks/types/build";
import { DepartmentFields } from "./moneyworks/types/department";
import { DetailFields } from "./moneyworks/types/detail";
import { FilterFields } from "./moneyworks/types/filter";
import { GeneralFields } from "./moneyworks/types/general";
import { JobFields } from "./moneyworks/types/job";
import { JobSheetFields } from "./moneyworks/types/job-sheet";
import { LedgerFields } from "./moneyworks/types/ledger";
import { LinkFields } from "./moneyworks/types/link";
import { ListsFields } from "./moneyworks/types/lists";
import { LogFields } from "./moneyworks/types/log";
import { LoginFields } from "./moneyworks/types/login";
import { MemoFields } from "./moneyworks/types/memo";
import { MessageFields } from "./moneyworks/types/message";
import { NameFields } from "./moneyworks/types/name";
import { OffLedgerFields } from "./moneyworks/types/off-ledger";
import { PaymentsFields } from "./moneyworks/types/payments";
import { ProductFields } from "./moneyworks/types/product";
import { StickiesFields } from "./moneyworks/types/stickies";
import { TaxRateFields } from "./moneyworks/types/tax-rate";
import { TransactionFields } from "./moneyworks/types/transaction";
import { UserFields } from "./moneyworks/types/user";
import { User2Fields } from "./moneyworks/types/user2";

export const TablesNames = [
  "account",
  "autosplit",
  "bankrecs",
  "build",
  "department",
  "detail",
  "filter",
  "general",
  "job",
  "job_sheet",
  "ledger",
  "link",
  "list",
  "log",
  "login",
  "memo",
  "message",
  "name",
  "off_ledger",
  "payments",
  "product",
  "stickies",
  "tax_rate",
  "transaction",
  "user",
  "user2",
];

export const accountZodKeys = z.enum(AccountFields as [string]);
export const autoSplitZodKeys = z.enum(AutoSplitFields as [string]);
export const bankRecsZodKeys = z.enum(BankRecsFields as [string]);
export const buildZodKeys = z.enum(BuildFields as [string]);
export const departmentZodKeys = z.enum(DepartmentFields as [string]);
export const detailZodKeys = z.enum(DetailFields as [string]);
export const filterZodKeys = z.enum(FilterFields as [string]);
export const generalZodKeys = z.enum(GeneralFields as [string]);
export const jobZodKeys = z.enum(JobFields as [string]);
export const jobSheetZodKeys = z.enum(JobSheetFields as [string]);
export const ledgerZodKeys = z.enum(LedgerFields as [string]);
export const linkZodKeys = z.enum(LinkFields as [string]);
export const listsZodKeys = z.enum(ListsFields as [string]);
export const logZodKeys = z.enum(LogFields as [string]);
export const loginZodKeys = z.enum(LoginFields as [string]);
export const memoZodKeys = z.enum(MemoFields as [string]);
export const messageZodKeys = z.enum(MessageFields as [string]);
export const nameZodKeys = z.enum(NameFields as [string]);
export const offLedgerZodKeys = z.enum(OffLedgerFields as [string]);
export const paymentsZodKeys = z.enum(PaymentsFields as [string]);
export const productZodKeys = z.enum(ProductFields as [string]);
export const stickiesZodKeys = z.enum(StickiesFields as [string]);
export const taxRateZodKeys = z.enum(TaxRateFields as [string]);
export const transactionZodKeys = z.enum(TransactionFields as [string]);
export const userZodKeys = z.enum(UserFields as [string]);
export const user2ZodKeys = z.enum(User2Fields as [string]);
