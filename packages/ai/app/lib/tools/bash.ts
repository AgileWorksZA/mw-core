/**
 * Bash tool - Execute shell commands with timeout and output capture
 */

import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { validateDirectoryPath, SecurityError, getProjectRoot } from "./security";

/**
 * Bash tool using betaTool pattern with JSON Schema
 */
export const bashTool = betaTool({
  name: "bash",
  description:
    "Execute a shell command with timeout. Returns stdout, stderr, and exit code. Use for running build commands, tests, git operations, etc. Commands run in PROJECT_ROOT by default.",
  inputSchema: {
    type: "object" as const,
    properties: {
      command: {
        type: "string",
        description: "The shell command to execute",
      },
      timeout_ms: {
        type: "number",
        description: "Timeout in milliseconds (default: 30000ms = 30 seconds)",
      },
      cwd: {
        type: "string",
        description: "Working directory for the command. If not provided, uses PROJECT_ROOT.",
      },
    },
    required: ["command"] as const,
  },
  run: async (input) => {
    try {
      // Validate and get working directory
      let workingDir = getProjectRoot();
      if (input.cwd) {
        try {
          workingDir = validateDirectoryPath(input.cwd);
        } catch (error) {
          if (error instanceof SecurityError) {
            return `Security Error: ${error.message}`;
          }
          throw error;
        }
      }

      const timeoutMs = input.timeout_ms ?? 30000;

      // Create a promise that will timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Command timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      // Execute the command
      const commandPromise = (async () => {
        // Filter process.env to only include string values (exclude Vite's boolean values)
        const filteredEnv: Record<string, string> = {};
        for (const [key, value] of Object.entries(process.env)) {
          if (typeof value === "string") {
            filteredEnv[key] = value;
          }
        }

        const proc = Bun.spawn(["sh", "-c", input.command], {
          cwd: workingDir,
          stdout: "pipe",
          stderr: "pipe",
          env: {
            ...filteredEnv,
            // Disable interactive features
            TERM: "dumb",
            CI: "true",
          },
        });

        // Collect output
        const stdoutReader = proc.stdout.getReader();
        const stderrReader = proc.stderr.getReader();

        let stdout = "";
        let stderr = "";

        // Read stdout
        const readStdout = async () => {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await stdoutReader.read();
            if (done) break;
            stdout += decoder.decode(value, { stream: true });
          }
        };

        // Read stderr
        const readStderr = async () => {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await stderrReader.read();
            if (done) break;
            stderr += decoder.decode(value, { stream: true });
          }
        };

        // Wait for all streams and exit
        await Promise.all([readStdout(), readStderr(), proc.exited]);

        return {
          stdout,
          stderr,
          exitCode: proc.exitCode ?? -1,
        };
      })();

      // Race between command and timeout
      const result = await Promise.race([commandPromise, timeoutPromise]);

      // Truncate output if too long
      const maxOutputLength = 50000;
      let stdoutOutput = result.stdout;
      let stderrOutput = result.stderr;

      if (stdoutOutput.length > maxOutputLength) {
        stdoutOutput =
          stdoutOutput.slice(0, maxOutputLength) +
          `\n\n[... stdout truncated, ${result.stdout.length - maxOutputLength} more characters ...]`;
      }
      if (stderrOutput.length > maxOutputLength) {
        stderrOutput =
          stderrOutput.slice(0, maxOutputLength) +
          `\n\n[... stderr truncated, ${result.stderr.length - maxOutputLength} more characters ...]`;
      }

      // Format output
      let output = `Exit code: ${result.exitCode}\n`;

      if (stdoutOutput) {
        output += `\n--- stdout ---\n${stdoutOutput}`;
      }
      if (stderrOutput) {
        output += `\n--- stderr ---\n${stderrOutput}`;
      }
      if (!stdoutOutput && !stderrOutput) {
        output += "\n(no output)";
      }

      return output;
    } catch (error) {
      if (error instanceof Error && error.message.includes("timed out")) {
        return `Error: ${error.message}. Consider increasing timeout_ms or using a background process.`;
      }
      return `Error executing command: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
