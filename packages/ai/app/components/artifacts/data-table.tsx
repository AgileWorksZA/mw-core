/**
 * Data Table Component
 *
 * Renders tabular data with sortable columns, pagination,
 * and proper financial formatting.
 */

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { TableData, TableColumn } from "~/lib/artifacts/types";
import { formatCurrency, formatPercentage, formatNumber } from "~/lib/artifacts/types";

interface DataTableProps {
  data: TableData;
  className?: string;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

function formatCellValue(value: unknown, column: TableColumn, currency = "USD"): string {
  if (value === null || value === undefined) {
    return "-";
  }

  const numValue = typeof value === "number" ? value : parseFloat(String(value));

  switch (column.type) {
    case "currency":
      return isNaN(numValue) ? String(value) : formatCurrency(numValue, currency);
    case "percentage":
      return isNaN(numValue) ? String(value) : formatPercentage(numValue);
    case "number":
      return isNaN(numValue) ? String(value) : formatNumber(numValue);
    case "date":
      return String(value);
    default:
      return String(value);
  }
}

function getAlignment(column: TableColumn): string {
  if (column.align) {
    switch (column.align) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
    }
  }

  // Default alignment based on type
  switch (column.type) {
    case "currency":
    case "percentage":
    case "number":
      return "text-right";
    default:
      return "text-left";
  }
}

export function DataTable({ data, className }: DataTableProps) {
  const { columns, rows, pageSize = 10, sortable = true, currency = "USD" } = data;
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [currentPage, setCurrentPage] = useState(0);

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sort.column || !sort.direction) {
      return rows;
    }

    return [...rows].sort((a, b) => {
      const aVal = a[sort.column!];
      const bVal = b[sort.column!];

      // Handle null/undefined
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Numeric comparison
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sort]);

  // Paginate
  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const paginatedRows = sortedRows.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleSort = (columnKey: string) => {
    const column = columns.find(c => c.key === columnKey);
    if (!sortable || column?.sortable === false) return;

    setSort(prev => {
      if (prev.column !== columnKey) {
        return { column: columnKey, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { column: columnKey, direction: "desc" };
      }
      return { column: null, direction: null };
    });
  };

  const getSortIcon = (columnKey: string) => {
    if (sort.column !== columnKey) {
      return <ChevronsUpDown className="size-4 opacity-50" />;
    }
    if (sort.direction === "asc") {
      return <ChevronUp className="size-4" />;
    }
    return <ChevronDown className="size-4" />;
  };

  return (
    <div className={cn("w-full overflow-hidden rounded-lg border", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map(column => {
                const isSortable = sortable && column.sortable !== false;
                return (
                  <th
                    key={column.key}
                    className={cn(
                      "px-4 py-3 font-medium",
                      getAlignment(column),
                      isSortable && "cursor-pointer select-none hover:bg-muted"
                    )}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() => handleSort(column.key)}
                  >
                    <div className={cn(
                      "flex items-center gap-1",
                      column.align === "right" && "justify-end",
                      column.align === "center" && "justify-center"
                    )}>
                      <span>{column.label}</span>
                      {isSortable && getSortIcon(column.key)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/30">
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-3", getAlignment(column))}
                    >
                      {formatCellValue(row[column.key], column, currency)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2">
          <span className="text-xs text-muted-foreground">
            Showing {currentPage * pageSize + 1}-
            {Math.min((currentPage + 1) * pageSize, sortedRows.length)} of{" "}
            {sortedRows.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-2 text-xs">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
