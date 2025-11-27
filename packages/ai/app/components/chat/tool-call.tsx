/**
 * ToolCall component - Display tool calls with collapsible input/output
 */

import { useState } from "react";
import { ChevronDown, ChevronRight, Terminal, Check, AlertCircle, Loader2, Clock } from "lucide-react";
import { cn } from "~/lib/utils";

export interface ToolCallData {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output: string;
  status: "pending" | "success" | "error";
  durationMs?: number;
}

interface ToolCallProps {
  toolCall: ToolCallData;
  defaultExpanded?: boolean;
}

/**
 * Format JSON for display with proper indentation
 */
function formatJson(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

/**
 * Format duration in human-readable form
 */
function formatDuration(ms: number | undefined): string {
  if (ms === undefined) return "";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Get icon based on tool name
 */
function getToolIcon(name: string) {
  // Could expand this with different icons per tool
  return Terminal;
}

/**
 * Get status display properties
 */
function getStatusDisplay(status: ToolCallData["status"]) {
  switch (status) {
    case "pending":
      return {
        icon: Loader2,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        animate: "animate-spin",
        label: "Running",
      };
    case "success":
      return {
        icon: Check,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        animate: "",
        label: "Success",
      };
    case "error":
      return {
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        animate: "",
        label: "Error",
      };
  }
}

/**
 * Get a friendly tool name
 */
function getToolDisplayName(name: string): string {
  const displayNames: Record<string, string> = {
    mw_tables: "List Tables",
    mw_schema: "Get Schema",
    mw_query: "Query Data",
    mw_eval: "Evaluate Expression",
    mw_report: "Generate Report",
  };
  return displayNames[name] || name;
}

export function ToolCall({ toolCall, defaultExpanded = false }: ToolCallProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const ToolIcon = getToolIcon(toolCall.name);
  const statusDisplay = getStatusDisplay(toolCall.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="border rounded-lg bg-muted/50 overflow-hidden my-2">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-3 hover:bg-muted/80 transition-colors text-left"
      >
        {/* Expand/collapse indicator */}
        {isExpanded ? (
          <ChevronDown className="size-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
        )}

        {/* Tool icon */}
        <div className="p-1.5 rounded bg-purple-500/10">
          <ToolIcon className="size-3.5 text-purple-500" />
        </div>

        {/* Tool name */}
        <span className="font-mono text-sm font-medium">
          {getToolDisplayName(toolCall.name)}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          ({toolCall.name})
        </span>

        {/* Spacer */}
        <span className="flex-1" />

        {/* Duration */}
        {toolCall.durationMs !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
            <Clock className="size-3" />
            <span>{formatDuration(toolCall.durationMs)}</span>
          </div>
        )}

        {/* Status indicator */}
        <div className={cn("px-2 py-0.5 rounded text-xs flex items-center gap-1", statusDisplay.bgColor)}>
          <StatusIcon className={cn("size-3", statusDisplay.color, statusDisplay.animate)} />
          <span className={statusDisplay.color}>{statusDisplay.label}</span>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t">
          {/* Input section */}
          <div className="p-3 border-b">
            <div className="text-xs font-medium text-muted-foreground mb-2">Input</div>
            <pre className="text-xs font-mono bg-background p-2 rounded overflow-x-auto max-h-40">
              {formatJson(toolCall.input)}
            </pre>
          </div>

          {/* Output section */}
          <div className="p-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">Output</div>
            <pre
              className={cn(
                "text-xs font-mono bg-background p-2 rounded overflow-x-auto max-h-60 whitespace-pre-wrap",
                toolCall.status === "error" && "text-red-500"
              )}
            >
              {toolCall.output || "(no output yet)"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact tool call indicator for inline display
 */
interface ToolCallInlineProps {
  name: string;
  status: "pending" | "success" | "error";
  durationMs?: number;
}

export function ToolCallInline({ name, status, durationMs }: ToolCallInlineProps) {
  const statusDisplay = getStatusDisplay(status);
  const StatusIcon = statusDisplay.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono",
        statusDisplay.bgColor
      )}
    >
      <StatusIcon className={cn("size-3", statusDisplay.color, statusDisplay.animate)} />
      <span className="text-muted-foreground">{name}</span>
      {durationMs !== undefined && (
        <span className="text-muted-foreground/70">{formatDuration(durationMs)}</span>
      )}
    </span>
  );
}
