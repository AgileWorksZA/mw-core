/**
 * Inventory table interface
 * file_num: 51
 */
export interface Inventory {
  SequenceNumber: number;
  LastModifiedTime: string;
  /** @mutable="conditionally" size="31" */
  Identifier: string;
  /** @mutable="conditionally" size="15" */
  Location: string | null;
  /** @mutable="conditionally" */
  ProductSeq: number;
  /** @mutable="conditionally" */
  Qty: number;
  /** @mutable="conditionally" */
  Expiry: Date | null;
}

export type InventoryField = keyof Inventory;

export const InventoryFields: InventoryField[] = [
  "SequenceNumber",
  "LastModifiedTime",
  "Identifier",
  "Location",
  "ProductSeq",
  "Qty",
  "Expiry",
];

export type InventoryObject = Record<InventoryField, string>;
