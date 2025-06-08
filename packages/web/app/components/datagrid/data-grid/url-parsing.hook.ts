// --- URL Parameter Utilities ---

// Parses sorting state like "col1:asc;col2:desc"
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export function parseSorting(sortString: string | null): SortingState {
  if (!sortString) return [];
  return sortString
    .split(";")
    .map((s) => {
      const [id, direction] = s.split(":");
      return { id, desc: direction === "desc" };
    })
    .filter((s) => s.id); // Filter out invalid entries
}

// Serializes sorting state
export function serializeSorting(sorting: SortingState): string {
  return sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(";");
}

// Parses simple filter state like "col1=abc&col2=xyz"
export function parseFilters(
  searchParams: URLSearchParams,
  idPrefix: string,
): ColumnFiltersState {
  const filters: ColumnFiltersState = [];
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith(`${idPrefix}-filter-`)) {
      const columnId = key.substring(`${idPrefix}-filter-`.length);
      filters.push({ id: columnId, value });
    }
  }
  return filters;
}

// Serializes filter state
export function serializeFilters(
  filters: ColumnFiltersState,
  idPrefix: string,
): Record<string, string> {
  const params: Record<string, string> = {};
  for (const f of filters) {
    params[`${idPrefix}-filter-${f.id}`] = String(f.value);
  }
  return params;
}
