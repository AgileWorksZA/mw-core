export interface CompanyInformation {
  Name: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Address4: string;
  State: string;
  PostCode: string;
  Delivery1: string;
  Delivery2: string;
  Delivery3: string;
  Delivery4: string;
  DeliveryState: string;
  DeliveryPostCode: string;
  Phone: string;
  Fax: string;
  Email: string;
  WebURL: string;
  TaxName: string;
  GstNum: string;
  RegNum: string;
  RemittanceMessage: string;
  Have_Logo: boolean;
  BaseCurrency: string;
  Locale: string;
  Version: string;
  PeriodsInYear: number;
  CurrentPer: number; //Current Period
  AgingCycle: number;
  GstCycleEndDate: string;
  GSTCycleMonths: number;
  GstCycleNum: number;
  GstIncomeInvoiceBasis: boolean;
  CoRegName: string;
  ExtendedJobCosting: boolean;
  GSTExpensesInvoiceBasis: boolean;
  GSTIncomeInvoiceBasis: boolean;
  GSTProcessingSuppressed: boolean;
  GSTGuideName: string;
  GSTRegName: string;
  LastAgedDebtors: string;
  LastBackup: string;
  LastStocktake: string;
  LocaleFriendlyName: string;
  LogFilePath: string;
  Mobile: string;
  MultiCurrencyEnabled: boolean;
  NavigatorActive: boolean;
  NetworkLatency: number;
  PeriodNames: string;
  StartupSequenceNumJob: number;
}

export type CompanyInformationField = keyof CompanyInformation;

export const CompanyInformationFields: CompanyInformationField[] = [
  "Name",
  "Address1",
  "Address2",
  "Address3",
  "Address4",
  "State",
  "PostCode",
  "Delivery1",
  "Delivery2",
  "Delivery3",
  "Delivery4",
  "DeliveryState",
  "DeliveryPostCode",
  "Phone",
  "Fax",
  "Email",
  "WebURL",
  "TaxName",
  "GstNum",
  "RegNum",
  "RemittanceMessage",
  "Have_Logo",
  "BaseCurrency",
  "Locale",
  "Version",
  "PeriodsInYear",
  "CurrentPer",
  "AgingCycle",
  "GstCycleEndDate",
  "GSTCycleMonths",
  "GstCycleNum",
  "GstIncomeInvoiceBasis",
  "CoRegName",
  "ExtendedJobCosting",
  "GSTExpensesInvoiceBasis",
  "GSTIncomeInvoiceBasis",
  "GSTProcessingSuppressed",
  "GSTGuideName",
  "GSTRegName",
  "LastAgedDebtors",
  "LastBackup",
  "LastStocktake",
  "LocaleFriendlyName",
  "LogFilePath",
  "Mobile",
  "MultiCurrencyEnabled",
  "NavigatorActive",
  "NetworkLatency",
  "PeriodNames",
  "StartupSequenceNumJob",
];

export const CompanyInformationEnum: Record<
  CompanyInformationField,
  CompanyInformationField
> = {
  Name: "Name",
  Address1: "Address1",
  Address2: "Address2",
  Address3: "Address3",
  Address4: "Address4",
  State: "State",
  PostCode: "PostCode",
  Delivery1: "Delivery1",
  Delivery2: "Delivery2",
  Delivery3: "Delivery3",
  Delivery4: "Delivery4",
  DeliveryState: "DeliveryState",
  DeliveryPostCode: "DeliveryPostCode",
  Phone: "Phone",
  Fax: "Fax",
  Email: "Email",
  WebURL: "WebURL",
  TaxName: "TaxName",
  GstNum: "GstNum",
  RegNum: "RegNum",
  RemittanceMessage: "RemittanceMessage",
  Have_Logo: "Have_Logo",
  BaseCurrency: "BaseCurrency",
  Locale: "Locale",
  Version: "Version",
  PeriodsInYear: "PeriodsInYear",
  CurrentPer: "CurrentPer",
  AgingCycle: "AgingCycle",
  GstCycleEndDate: "GstCycleEndDate",
  GSTCycleMonths: "GSTCycleMonths",
  GstCycleNum: "GstCycleNum",
  GstIncomeInvoiceBasis: "GstIncomeInvoiceBasis",
  CoRegName: "CoRegName",
  ExtendedJobCosting: "ExtendedJobCosting",
  GSTExpensesInvoiceBasis: "GSTExpensesInvoiceBasis",
  GSTIncomeInvoiceBasis: "GSTIncomeInvoiceBasis",
  GSTProcessingSuppressed: "GSTProcessingSuppressed",
  GSTGuideName: "GSTGuideName",
  GSTRegName: "GSTRegName",
  LastAgedDebtors: "LastAgedDebtors",
  LastBackup: "LastBackup",
  LastStocktake: "LastStocktake",
  LocaleFriendlyName: "LocaleFriendlyName",
  LogFilePath: "LogFilePath",
  Mobile: "Mobile",
  MultiCurrencyEnabled: "MultiCurrencyEnabled",
  NavigatorActive: "NavigatorActive",
  NetworkLatency: "NetworkLatency",
  PeriodNames: "PeriodNames",
  StartupSequenceNumJob: "StartupSequenceNumJob",
};

export type CompanyInformationObject = Record<CompanyInformationField, string>;
