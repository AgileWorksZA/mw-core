/**
 * User2 table interface
 * file_num: 30
 */
export interface User2 {
  SequenceNumber: number;
  LastModifiedTime: Date;
  /** @indexed @mutable="freely, script-only" */
  DevKey: number;
  /** @indexed @mutable="freely, script-only" size="28" */
  Key: string;
  /** @mutable="freely, script-only" */
  Int1: number;
  /** @mutable="freely, script-only" */
  Int2: number;
  /** @mutable="freely, script-only" */
  Float1: number;
  /** @mutable="freely, script-only" */
  Float2: number;
  /** @mutable="freely, script-only" */
  Date1: Date;
  /** @mutable="freely, script-only" */
  Date2: Date;
  /** @mutable="freely, script-only" size="256" */
  Text1: string;
  /** @mutable="freely, script-only" size="256" */
  Text2: string;
  /** @mutable="freely, script-only" size="1024" */
  Text: string;
  /** @mutable="freely, script-only" */
  Int3: number;
  /** @mutable="freely, script-only" */
  Int4: number;
  /** @mutable="freely, script-only" */
  Float3: number;
  /** @mutable="freely, script-only" */
  Float4: number;
  /** @mutable="freely, script-only" */
  Date3: Date;
  /** @mutable="freely, script-only" */
  Date4: Date;
  /** @mutable="freely, script-only" size="256" */
  Text3: string;
  /** @mutable="freely, script-only" size="256" */
  Text4: string;
  /** @mutable="freely, script-only" size="256" */
  TaggedText: string;
  /** @mutable="freely, script-only" */
  Colour: number;
}
