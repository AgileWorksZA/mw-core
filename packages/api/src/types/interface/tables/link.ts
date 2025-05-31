/**
 * Link table interface
 * file_num: 4
 */
export interface Link {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @indexed size="6" */
  Dept: string;
  /** @indexed size="6" */
  Group: string;
}

export type LinkField = keyof Link;

export const LinkFields: LinkField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Dept",
  "Group",
];
