/**
 * Tool Execution Logger
 *
 * Wraps tool execution with timing and logging for debugging and observability.
 */

/**
 * Log entry for a tool execution
 */
export interface ToolLogEntry {
  name: string;
  inputSize: number;
  outputSize: number;
  durationMs: number;
  status: "success" | "error";
  timestamp: Date;
}

/**
 * Session statistics
 */
export interface SessionStats {
  toolCalls: number;
  totalDurationMs: number;
  inputTokensEstimate: number;
  outputTokensEstimate: number;
}

/**
 * In-memory log storage (per-request)
 */
let currentSessionLogs: ToolLogEntry[] = [];

/**
 * Clear session logs
 */
export function clearSessionLogs(): void {
  currentSessionLogs = [];
}

/**
 * Get session logs
 */
export function getSessionLogs(): ToolLogEntry[] {
  return [...currentSessionLogs];
}

/**
 * Get session statistics
 */
export function getSessionStats(): SessionStats {
  let totalDurationMs = 0;
  let totalInputSize = 0;
  let totalOutputSize = 0;

  for (const log of currentSessionLogs) {
    totalDurationMs += log.durationMs;
    totalInputSize += log.inputSize;
    totalOutputSize += log.outputSize;
  }

  // Rough token estimate: ~4 chars per token
  return {
    toolCalls: currentSessionLogs.length,
    totalDurationMs,
    inputTokensEstimate: Math.ceil(totalInputSize / 4),
    outputTokensEstimate: Math.ceil(totalOutputSize / 4),
  };
}

/**
 * Log tool execution
 */
function logToolExecution(entry: ToolLogEntry): void {
  currentSessionLogs.push(entry);

  // Console log with consistent format
  const statusEmoji = entry.status === "success" ? "[OK]" : "[ERR]";
  console.log(
    `[Tool:${entry.name}] ${statusEmoji} | input:${entry.inputSize}b | output:${entry.outputSize}b | ${entry.durationMs}ms`
  );
}

/**
 * Wrap a tool's run function with logging
 *
 * @param toolName - Name of the tool
 * @param runFn - The original run function
 * @returns Wrapped run function with logging
 */
export function wrapToolWithLogging<TInput>(
  toolName: string,
  runFn: (input: TInput) => Promise<string>
): (input: TInput) => Promise<string> {
  return async (input: TInput): Promise<string> => {
    const startTime = Date.now();
    const inputStr = JSON.stringify(input);
    const inputSize = inputStr.length;

    console.log(`[Tool:${toolName}] started | input:${inputSize}b`);

    try {
      const result = await runFn(input);
      const durationMs = Date.now() - startTime;
      const outputSize = result.length;

      logToolExecution({
        name: toolName,
        inputSize,
        outputSize,
        durationMs,
        status: "success",
        timestamp: new Date(),
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      logToolExecution({
        name: toolName,
        inputSize,
        outputSize: errorMessage.length,
        durationMs,
        status: "error",
        timestamp: new Date(),
      });

      throw error;
    }
  };
}

/**
 * Create a logged version of a betaTool
 *
 * Usage:
 * ```typescript
 * const loggedTool = createLoggedTool(mwQueryTool);
 * ```
 */
export function createLoggedTool<T extends { name: string; run: (input: any) => Promise<string> }>(
  tool: T
): T {
  return {
    ...tool,
    run: wrapToolWithLogging(tool.name, tool.run),
  };
}

/**
 * Wrap all tools in an array with logging
 */
export function wrapAllToolsWithLogging<T extends { name: string; run: (input: any) => Promise<string> }>(
  tools: T[]
): T[] {
  return tools.map(createLoggedTool);
}
