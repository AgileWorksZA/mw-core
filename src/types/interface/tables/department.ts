/**
 * Department table interface
 * file_num: 3
 */
export interface Department {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="6" */
  Code: string;
  /** @mutable="freely, script-only" size="36" */
  Description: string;
  /** size="6" */
  Classification: string;
  /** @mutable="freely, script-only" size="16" */
  Custom1: string;
  /** @mutable="freely, script-only" size="10" */
  Custom2: string;
  Flags: number;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}

export type DepartmentField = keyof Department;

export const DepartmentFields: DepartmentField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Code",
  "Description",
  "Classification",
  "Custom1",
  "Custom2",
  "Flags",
  "UserNum",
  "UserText",
  "TaggedText",
];
