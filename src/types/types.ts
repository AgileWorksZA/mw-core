export type BaseColumnDef<T> = {
  key: keyof T & string;
  caption: string;
  type?: "string" | "date" | "number" | "boolean" | "expression" | "currency";
  system?: boolean;
  fromNow?: boolean;
  hidden?: boolean;
  fetch?: boolean;
  hiddenWhenEmpty?: boolean;
  hiddenWhenZero?: boolean;
  hiddenFrom?: "xs" | "sm" | "md" | "lg" | "xl";
  visibleFrom?: "xs" | "sm" | "md" | "lg" | "xl";
  maxSize?: number;
  minSize?: number;
  align?: "left" | "right" | "center";
};
