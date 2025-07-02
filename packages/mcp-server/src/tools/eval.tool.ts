/**
 * MoneyWorks Eval Tool for MCP
 *
 * @moneyworks-dsl PURE
 */

import type { SmartMoneyWorksClient } from "@moneyworks/data";
import type {
	MoneyWorksEvalParams,
	MoneyWorksEvalResult,
} from "../types/index.js";

export const evalTool = {
	definition: {
		name: "mw_eval",
		description: "Evaluate MWScript expressions in MoneyWorks",
		inputSchema: {
			type: "object",
			properties: {
				expression: {
					type: "string",
					description:
						'MWScript expression to evaluate (e.g., "1+1", "Date()", etc.)',
				},
			},
			required: ["expression"],
		},
	},

	async handler(
		client: SmartMoneyWorksClient,
		params: MoneyWorksEvalParams,
	): Promise<{ content: Array<{ type: "text"; text: string }> }> {
		const { expression } = params;

		if (!expression || expression.trim().length === 0) {
			throw new Error("Expression cannot be empty");
		}

		try {
			const result = await client.evaluate(expression);

			const evalResult: MoneyWorksEvalResult = {
				expression,
				result: result.trim(),
			};

			return {
				content: [{
					type: "text",
					text: JSON.stringify(evalResult, null, 2),
				}],
			};
		} catch (error) {
			// Provide helpful context for common MWScript errors
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			if (errorMessage.includes("Unknown identifier")) {
				throw new Error(
					`${errorMessage}. Note: Direct table references like 'Count(TaxRate)' may not work in REST context. Try simpler expressions like '1+1' or 'Date()'.`,
				);
			}
			if (errorMessage.includes("Syntax error")) {
				throw new Error(`${errorMessage}. Check your MWScript syntax.`);
			}

			throw new Error(`Evaluation failed: ${errorMessage}`);
		}
	},
};
