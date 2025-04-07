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
}