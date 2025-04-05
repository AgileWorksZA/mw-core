/**
 * Login table interface
 * file_num: 29
 */
export interface Login {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed size="4" */
  Initials: string;
  /** size="32" */
  Name: string;
  /** size="34" */
  Password: string;
  SecurityLevel: number;
  /** size="66" */
  Privileges: string;
  /** size="64" */
  Email: string;
  Flags: number;
  /** @mutable="freely, script-only" size="32" */
  Category: string;
  /** size="4" */
  Role: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" size="4" */
  SettingsDonor: string;
}

export type LoginField = keyof Login;

export const LoginFields: LoginField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Initials",
  "Name",
  "Password",
  "SecurityLevel",
  "Privileges",
  "Email",
  "Flags",
  "Category",
  "Role",
  "UserNum",
  "UserText",
  "TaggedText",
  "SettingsDonor",
];
