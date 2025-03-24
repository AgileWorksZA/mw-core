/**
 * Link table interface
 * file_num: 4
 */
export interface Link {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed size="6" */
  Dept: string;
  /** @indexed size="6" */
  Group: string;
}
