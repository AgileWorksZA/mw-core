import { useState, useCallback, useMemo } from "react";
import { type SchemaProperties } from "~/components/datagrid/designer/types";

/**
 * Hook for filtering schema properties
 */
export function usePropertyFilter(properties: SchemaProperties | undefined) {
  const [filter, setFilter] = useState<string>("");

  /**
   * Filter properties based on the search term
   */
  const filteredProperties = useMemo(() => {
    if (!properties) return {};
    if (!filter.trim()) return properties;

    const result: SchemaProperties = {};
    const filterLower = filter.toLowerCase();

    Object.keys(properties).forEach((name) => {
      const prop = properties[name];
      // Search through property name, type, and description
      if (
        name.toLowerCase().includes(filterLower) ||
        prop.type.toLowerCase().includes(filterLower) ||
        prop.description?.toLowerCase().includes(filterLower)
      ) {
        result[name] = prop;
      }
    });

    return result;
  }, [properties, filter]);

  /**
   * Clear the filter
   */
  const clearFilter = useCallback(() => {
    setFilter("");
  }, []);

  /**
   * Get filter statistics
   */
  const filterStats = useMemo(() => {
    if (!properties) return { total: 0, filtered: 0 };
    const total = Object.keys(properties).length;
    const filtered = Object.keys(filteredProperties).length;
    return { total, filtered };
  }, [properties, filteredProperties]);

  return {
    filter,
    setFilter,
    filteredProperties,
    clearFilter,
    filterStats,
  };
}