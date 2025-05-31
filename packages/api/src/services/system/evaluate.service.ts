import type { MoneyWorksConfig } from "../../types/moneyworks";
import { MoneyWorksApiService } from "../moneyworks-api.service";

export class EvaluateService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  /**
   * Evaluates a MoneyWorks expression
   *
   * @param expression The expression to evaluate
   * @returns The result of the expression evaluation
   */
  async evaluateExpression(expression: string): Promise<string> {
    try {
      // Call MoneyWorks API evaluate method
      const result = await this.api.evaluate(expression);

      return result as string;
    } catch (error) {
      console.error("Error evaluating expression:", error);
      throw error;
    }
  }

  /**
   * Evaluate a custom template against a specific table in MoneyWorks
   *
   * @param table The table to evaluate against
   * @param template The custom template to use
   * @returns The evaluated template results
   */
  async evaluateTemplate(table: string, template: string): Promise<string[]> {
    try {
      // Add double newline at the end of the template
      const templateWithNewline = `${template}\\n\\n`;

      // Call the export endpoint with the custom template as format
      const rawResponse = await this.api.exportRaw(table, {
        format: templateWithNewline,
      });

      // Split the response on double newline and filter out empty lines
      return rawResponse.split("\n\n").filter((line) => line.trim() !== "");
    } catch (error) {
      console.error(`Error evaluating template against ${table}:`, error);
      throw error;
    }
  }
}
