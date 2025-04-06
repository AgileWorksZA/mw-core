/**
 * Job table interface
 * file_num: 15
 */
export interface Job {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="10" */
  Code: string;
  /** @mutable="freely, script-only" size="256" */
  Description: string;
  /** size="12" */
  Client: string;
  /** @mutable="freely, script-only" size="1024" */
  Comment: string;
  /** @mutable="freely, script-only" */
  StartDate: Date;
  /** @mutable="freely, script-only" */
  Markup: number;
  /** @mutable="freely, script-only" */
  Quote: number;
  Billed: number;
  /** @indexed @mutable="conditionally" char_short */
  Status: string;
  Flags: number;
  /** @mutable="conditionally" */
  Colour: number;
  /** size="14" */
  WIPAccount: string;
  /** @mutable="freely, script-only" size="16" */
  Category1: string;
  /** @mutable="freely, script-only" size="16" */
  Category2: string;
  /** @mutable="freely, script-only" size="16" */
  Category3: string;
  /** @mutable="freely, script-only" size="16" */
  Category4: string;
  /** @mutable="freely, script-only" size="32" */
  OrderNum: string;
  /** @mutable="freely, script-only" size="64" */
  Contact: string;
  /** @mutable="freely, script-only" size="20" */
  Phone: string;
  /** @mutable="freely, script-only" */
  EndDate: Date;
  /** @mutable="freely, script-only" size="4" */
  Manager: string;
  PercentComplete: number;
  Variations: number;
  RetentionsHeld: number;
  RetentionsOwing: number;
  /** size="2" */
  ProductPricing: string;
  RetainPercent: number;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** size="10" */
  Project: string;
  /** @mutable="freely, script-only" */
  TargetDate: Date;
  /** @mutable="freely, script-only" size="256" */
  Custom1: string;
  /** @mutable="freely, script-only" size="256" */
  Custom2: string;
  /** @mutable="freely, script-only" size="16" */
  Custom3: string;
  /** @mutable="freely, script-only" size="16" */
  Custom4: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" size="16" */
  Custom5: string;
  /** @mutable="freely, script-only" size="16" */
  Custom6: string;
  /** @mutable="freely, script-only" size="16" */
  Custom7: string;
  /** @mutable="freely, script-only" size="16" */
  Custom8: string;
}

export type JobField = keyof Job;

export const JobFields: JobField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Description",
  "Client",
  "Comment",
  "StartDate",
  "Markup",
  "Quote",
  "Billed",
  "Status",
  "Flags",
  "Colour",
  "WIPAccount",
  "Category1",
  "Category2",
  "Category3",
  "Category4",
  "OrderNum",
  "Contact",
  "Phone",
  "EndDate",
  "Manager",
  "PercentComplete",
  "Variations",
  "RetentionsHeld",
  "RetentionsOwing",
  "ProductPricing",
  "RetainPercent",
  "UserNum",
  "UserText",
  "Project",
  "TargetDate",
  "Custom1",
  "Custom2",
  "Custom3",
  "Custom4",
  "TaggedText",
  "Custom5",
  "Custom6",
  "Custom7",
  "Custom8",
];
