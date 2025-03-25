/**
 * User table interface
 * file_num: 24
 */
export interface User {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed size="10" */
  Key: string;
  /** @mutable="freely, script-only" size="246" */
  Data: string;
}

export type UserField = keyof User;

export const UserFields: UserField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Key",
  "Data",
];

