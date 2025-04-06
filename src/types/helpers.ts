export function yyyyMmDdToDate(yyyyMmDd_?: number | string | Date): Date {
  const yyyyMmDd = String(yyyyMmDd_);
  if (!yyyyMmDd) return new Date(-1);

  if (/^\d{8}$/.test(yyyyMmDd)) {
    const year = Number.parseInt(yyyyMmDd.slice(0, 4), 10);
    const month = Number.parseInt(yyyyMmDd.slice(4, 6), 10) - 1; // JS months are 0-based
    const day = Number.parseInt(yyyyMmDd.slice(6, 8), 10);
    return new Date(year, month, day);
  }

  // Try standard date parsing
  return new Date(yyyyMmDd);
}

export function yyyyMmDdHhMmSsToDate(yyyyMmDdHhMmSs: string): Date {
  if (!yyyyMmDdHhMmSs) {
    return new Date(-1);
  }
  const year = Number.parseInt(yyyyMmDdHhMmSs.slice(0, 4), 10);
  const month = Number.parseInt(yyyyMmDdHhMmSs.slice(4, 6), 10) - 1; // JS months are 0-based
  const day = Number.parseInt(yyyyMmDdHhMmSs.slice(6, 8), 10);
  const hour = Number.parseInt(yyyyMmDdHhMmSs.slice(8, 10), 10);
  const minute = Number.parseInt(yyyyMmDdHhMmSs.slice(10, 12), 10);
  const second = Number.parseInt(yyyyMmDdHhMmSs.slice(12, 14), 10);
  return new Date(year, month, day, hour, minute, second);
}

export function enforceType(
  input:
    | string
    | number
    | boolean
    | Date
    | {
        "#text": number | string | boolean;
        _system?: boolean;
      },
  type: "string" | "integer" | "boolean" | "number" | "date" | "date-time",
): string | number | boolean | Date | null {
  const value =
    typeof input === "object" && input !== null && "_system" in input
      ? input._system
        ? input["#text"]
        : null
      : input;

  if (value === undefined) return null;

  if (type === "string") {
    return String(value);
  }
  if (type === "integer") {
    return Number.parseInt(String(value), 10);
  }
  if (type === "boolean") {
    return Boolean(value);
  }
  if (type === "number") {
    return Number.parseFloat(String(value));
  }
  if (type === "date") {
    return yyyyMmDdToDate(String(value));
  }
  if (type === "date-time") {
    return yyyyMmDdHhMmSsToDate(String(value));
  }
  throw new Error(`Unknown type: ${type}`);
}
