/**
 * Message table interface
 * file_num: 9
 */
export interface Message {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @mutable="freely, script-only" */
  StartDate: Date;
  /** @mutable="freely, script-only" */
  EndDate: Date;
  /** @indexed @mutable="freely, script-only" */
  NextDate: Date;
  Keep: boolean;
  Ref: number;
  LastDay: number;
  NDaily: number;
  NWeekly: number;
  NMonthly: number;
  Once: number;
  XTimes: number;
  Forever: number;
  Day: number;
  Type: number;
  DayOfWeek: number;
  N: number;
  X: number;
  AvoidWeekends: number;
  Reverse: number;
  kill_next_time: number;
  /** @mutable="freely, script-only" size="256" */
  Message: string;
  /** size="4" */
  User: string;
  /** @mutable="freely, script-only" */
  UserNum: number;
  /** @mutable="freely, script-only" size="256" */
  UserText: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
}
