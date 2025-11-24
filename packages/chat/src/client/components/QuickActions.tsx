import {
	Calculator,
	DollarSign,
	FileText,
	Receipt,
	TrendingUp,
	Users,
} from "lucide-react";
import React from "react";

export interface QuickActionsProps {
	onAction: (action: string) => void;
}

const quickActions = [
	{
		icon: Receipt,
		label: "Overdue invoices",
		action: "Show me all overdue customer invoices",
	},
	{
		icon: DollarSign,
		label: "This month GST",
		action: "Calculate GST summary for this month",
	},
	{
		icon: Users,
		label: "Top customers",
		action: "Show top 10 customers by revenue this year",
	},
	{
		icon: TrendingUp,
		label: "Aged receivables",
		action: "Generate aged receivables report",
	},
	{
		icon: FileText,
		label: "Recent transactions",
		action: "Show recent transactions from the last 7 days",
	},
	{
		icon: Calculator,
		label: "Account balance",
		action: "What is the balance of account 1200?",
	},
];

export function QuickActions({ onAction }: QuickActionsProps) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
			{quickActions.map((item, index) => {
				const Icon = item.icon;
				return (
					<button
						key={index}
						onClick={() => onAction(item.action)}
						className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
					>
						<Icon className="w-4 h-4 text-muted-foreground" />
						<span>{item.label}</span>
					</button>
				);
			})}
		</div>
	);
}
