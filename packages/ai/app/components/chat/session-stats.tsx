/**
 * Session Stats Component
 *
 * Displays session statistics: tool calls, tokens, and estimated cost.
 * Uses title attributes for simple tooltips to avoid complex radix dependencies.
 */

import { RotateCcw, Wrench, Coins } from "lucide-react";
import { Button } from "~/components/ui/button";

interface SessionStatsProps {
  toolCalls: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  onClear?: () => void;
}

/**
 * Format a number with commas
 */
function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Format cost in dollars
 */
function formatCost(cost: number): string {
  if (cost < 0.01) {
    return "<$0.01";
  }
  return `$${cost.toFixed(3)}`;
}

export function SessionStats({
  toolCalls,
  inputTokens,
  outputTokens,
  estimatedCost,
  onClear,
}: SessionStatsProps) {
  const totalTokens = inputTokens + outputTokens;

  // Don't show anything if no activity yet
  if (toolCalls === 0 && totalTokens === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      {/* Tool calls */}
      <div
        className="flex items-center gap-1 cursor-help"
        title={`${toolCalls} tool calls this session`}
      >
        <Wrench className="size-3" />
        <span>{toolCalls}</span>
      </div>

      {/* Tokens */}
      <div
        className="flex items-center gap-1 cursor-help"
        title={`Input: ${formatNumber(inputTokens)} tokens\nOutput: ${formatNumber(outputTokens)} tokens`}
      >
        <span className="font-mono">{formatNumber(totalTokens)}</span>
        <span>tok</span>
      </div>

      {/* Cost */}
      <div
        className="flex items-center gap-1 cursor-help"
        title={`Estimated cost: ${formatCost(estimatedCost)}\nBased on Claude 3.5 Sonnet pricing ($3/M input, $15/M output)`}
      >
        <Coins className="size-3" />
        <span>{formatCost(estimatedCost)}</span>
      </div>

      {/* Clear button */}
      {onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={onClear}
          title="Clear session and start fresh"
        >
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  );
}
