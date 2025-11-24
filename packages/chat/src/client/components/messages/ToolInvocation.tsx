import { CheckCircle, Loader2, Wrench, XCircle } from "lucide-react";
import React from "react";
import type { MoneyWorksToolInvocation } from "../../../shared/types";

export interface ToolInvocationProps {
	invocation: MoneyWorksToolInvocation;
}

export function ToolInvocation({ invocation }: ToolInvocationProps) {
	const getIcon = () => {
		switch (invocation.state) {
			case "pending":
				return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
			case "completed":
				return invocation.result?.success ? (
					<CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
				) : (
					<XCircle className="w-4 h-4 text-destructive" />
				);
			case "failed":
				return <XCircle className="w-4 h-4 text-destructive" />;
			default:
				return <Wrench className="w-4 h-4 text-muted-foreground" />;
		}
	};

	const getToolDisplayName = (toolName: string): string => {
		const names: Record<string, string> = {
			getTransactions: "Fetching transactions",
			getTaxRate: "Looking up tax rate",
			listTaxRates: "Fetching all tax rates",
			getAccount: "Getting account details",
			searchNames: "Searching contacts",
			runReport: "Generating report",
			evaluateExpression: "Calculating",
		};
		return names[toolName] || toolName;
	};

	return (
		<div className="flex items-center gap-2 px-3 py-2 bg-primary/10 dark:bg-primary/20 rounded-md text-sm">
			{getIcon()}
			<span className="text-foreground">
				{getToolDisplayName(invocation.toolName)}
			</span>
			{invocation.state === "completed" && invocation.result?.error && (
				<span className="text-destructive text-xs ml-2">
					({invocation.result.error})
				</span>
			)}
		</div>
	);
}
