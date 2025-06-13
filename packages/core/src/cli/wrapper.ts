/**
 * MoneyWorks CLI Wrapper
 * 
 * Provides a programmatic interface to the MoneyWorks command-line tool
 * for operations that are not available through the REST API.
 */

import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";

export interface CLIConfig {
  username: string;
  password?: string;
  filePath?: string;
  debug?: boolean;
}

export interface CLIResult {
  success: boolean;
  output: string;
  error?: string;
}

export class MoneyWorksCLI {
  private config: CLIConfig;
  private tempDir?: string;

  constructor(config: CLIConfig) {
    this.config = config;
  }

  /**
   * Execute a MoneyWorks CLI command
   */
  async execute(command: string, filePath?: string): Promise<CLIResult> {
    const args: string[] = [];
    
    // Add authentication
    if (this.config.username) {
      const auth = this.config.password 
        ? `${this.config.username}:${this.config.password}`
        : this.config.username;
      args.push("-u", auth);
    }

    // Add file path
    const targetFile = filePath || this.config.filePath;
    if (targetFile) {
      args.push(targetFile);
    }

    // Add command
    args.push("-e", command);

    if (this.config.debug) {
      console.log("Executing MoneyWorks CLI:", "moneyworks", args.join(" "));
    }

    return new Promise((resolve) => {
      const proc = spawn("moneyworks", args);
      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      proc.on("close", (code) => {
        const success = code === 0 && !stderr.includes("[FAIL]") && !stderr.includes("[ERROR]");
        
        resolve({
          success,
          output: stdout.trim(),
          error: stderr.trim() || undefined,
        });
      });

      proc.on("error", (err) => {
        resolve({
          success: false,
          output: "",
          error: err.message,
        });
      });
    });
  }

  /**
   * Evaluate a MWScript expression
   */
  async evaluate(expression: string): Promise<string> {
    const result = await this.execute(`evaluate expr='${expression}'`);
    
    if (!result.success) {
      throw new Error(`Evaluation failed: ${result.error || "Unknown error"}`);
    }

    return result.output;
  }

  /**
   * Export data using CLI (for formats not supported by REST API)
   */
  async export(table: string, format: string, options: {
    filter?: string;
    output?: string;
  } = {}): Promise<string> {
    let command = `export table='${table}' format='${format}'`;
    
    if (options.filter) {
      command += ` search='${options.filter}'`;
    }

    if (options.output) {
      command += ` output='${options.output}'`;
    }

    const result = await this.execute(command);
    
    if (!result.success) {
      throw new Error(`Export failed: ${result.error || "Unknown error"}`);
    }

    // If output file was specified, read it
    if (options.output) {
      try {
        return await fs.readFile(options.output, "utf-8");
      } catch (error) {
        throw new Error(`Failed to read export file: ${error}`);
      }
    }

    return result.output;
  }

  /**
   * Import data using CLI
   */
  async import(filePath: string, mapName: string, options: {
    update?: boolean;
    post?: boolean;
    returnSeq?: boolean;
  } = {}): Promise<CLIResult> {
    let command = `import file='${filePath}' map='${mapName}'`;
    
    if (options.update) {
      command += " update='true'";
    }
    if (options.post) {
      command += " post='true'";
    }
    if (options.returnSeq) {
      command += " return_seq='true'";
    }

    return this.execute(command);
  }

  /**
   * Generate a report
   */
  async generateReport(reportPath: string, options: {
    format?: "text" | "html" | "pdf";
    from?: string;
    to?: string;
    output?: string;
  } = {}): Promise<string> {
    let command = `doreport report='${reportPath}'`;
    
    if (options.format) {
      command += ` format='${options.format}'`;
    }
    if (options.from) {
      command += ` from='${options.from}'`;
    }
    if (options.to) {
      command += ` to='${options.to}'`;
    }
    if (options.output) {
      command += ` output='${options.output}'`;
    }

    const result = await this.execute(command);
    
    if (!result.success) {
      throw new Error(`Report generation failed: ${result.error || "Unknown error"}`);
    }

    // If output file was specified, read it
    if (options.output) {
      try {
        const content = await fs.readFile(options.output);
        return content.toString("base64");
      } catch (error) {
        throw new Error(`Failed to read report file: ${error}`);
      }
    }

    return result.output;
  }

  /**
   * Copy a MoneyWorks file for CLI operations
   */
  async copyFileForCLI(sourcePath: string): Promise<string> {
    if (!this.tempDir) {
      this.tempDir = await fs.mkdtemp(path.join("/tmp", "mw-cli-"));
    }

    const fileName = path.basename(sourcePath);
    const destPath = path.join(this.tempDir, fileName);
    
    await fs.copyFile(sourcePath, destPath);
    await fs.chmod(destPath, 0o644);
    
    return destPath;
  }

  /**
   * Clean up temporary files
   */
  async cleanup(): Promise<void> {
    if (this.tempDir) {
      try {
        await fs.rm(this.tempDir, { recursive: true, force: true });
      } catch (error) {
        console.error("Failed to clean up temp directory:", error);
      }
      this.tempDir = undefined;
    }
  }
}