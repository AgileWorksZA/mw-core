/**
 * Stickies table interface
 * file_num: 27
 */
export interface Stickies {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed */
  FileNum: number;
  Colour: number;
  /** size="4" */
  User: string;
  /** @indexed */
  OwnerSeq: number;
  /** size="256" */
  Message: string;
  Flags: number;
}
