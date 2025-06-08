import type {InternalTypes, Pointer, Variables} from "~/modules/ide/types";

export function extractInternals(
  variables: Variables<any>,
  type: InternalTypes<any>["internal"],
  previousPath = "",
): { path: string; pointer: Pointer }[] {
  if (typeof variables !== "object") return [];
  if (variables === null) return [];

  if ("internal" in variables && variables.internal === type) {
    return [{ path: previousPath, pointer: variables as Pointer }];
  }

  if (Array.isArray(variables)) {
    return variables.flatMap((v, index) => {
      if (typeof v === "object" && v !== null) {
        if ("internal" in v && v.internal === type) {
          return { path: `${previousPath}${index}`, pointer: v as Pointer };
        }
        return extractInternals(v, type, `${previousPath}/${index}`);
      }
      return [];
    });
  }
  return Object.entries(variables).flatMap(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      if ("internal" in value && value.internal === type) {
        return { path: `${previousPath}${key}`, pointer: value as Pointer };
      }
      if (Array.isArray(value)) {
        // Include array index in the path
        return value.flatMap((v, index) =>
          extractInternals(v, type, `${previousPath}${key}/${index}`),
        );
      }
      return extractInternals(value, type, `${previousPath}${key}/`);
    }
    return [];
  });
}