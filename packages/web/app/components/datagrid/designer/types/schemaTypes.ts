export type SchemaPropertyType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object"
  | undefined;

export interface SchemaProperty {
  name: string;
  type: SchemaPropertyType | SchemaPropertyType[];
  format?: string;
  required: boolean;
  description?: string;
  enum?: string[] | number[];
  nullable?: boolean;
}

export interface ProcessedSchema {
  type: SchemaPropertyType | SchemaPropertyType[];
  format?: string;
  nullable?: boolean;
}
