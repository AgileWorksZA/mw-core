import { d } from "@moneyworks/utilities";
import { AlertCircle, FileText } from "lucide-react";
import React from "react";
import { cn } from "../../../utils/cn";

interface Transaction {
	Type: string;
	Status: string;
	NameCode: string;
	TransDate: string;
	DueDate: string;
	Total: number;
	Balance?: number;
	OurRef?: string;
	Description?: string;
	SequenceNumber?: string;
}

export interface TransactionDisplayProps {
	data: Transaction | Transaction[];
	metadata?: {
		count?: number;
		totalAmount?: number;
	};
}

export function TransactionDisplay({
	data,
	metadata,
}: TransactionDisplayProps) {
	const transactions = Array.isArray(data) ? data : [data];

	if (transactions.length === 0) {
		return (
			<div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
				No transactions found
			</div>
		);
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	const getTransactionTypeName = (type: string) => {
		const types: Record<string, string> = {
			DII: "Customer Invoice",
			CIC: "Supplier Invoice",
			DIP: "Customer Invoice (Posted)",
			CIP: "Supplier Invoice (Posted)",
		};
		return types[type] || type;
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			U: { label: "Unposted", className: "bg-yellow-100 text-yellow-800" },
			P: { label: "Posted", className: "bg-blue-100 text-blue-800" },
			C: { label: "Paid", className: "bg-green-100 text-green-800" },
		};
		const config = statusConfig[status as keyof typeof statusConfig] || {
			label: status,
			className: "bg-gray-100 text-gray-800",
		};

		return (
			<span className={cn("px-2 py-1 text-xs rounded-full", config.className)}>
				{config.label}
			</span>
		);
	};

	const isOverdue = (dueDate: string) => {
		try {
			const due = d`${dueDate}`;
			const today = d`${new Date()}`;
			return due.lt(today);
		} catch {
			return false;
		}
	};

	return (
		<div className="bg-white rounded-lg border overflow-hidden">
			<div className="bg-gray-50 px-4 py-2 border-b">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="w-4 h-4 text-gray-500" />
						<span className="font-medium text-sm">
							Transactions {metadata?.count && `(${metadata.count})`}
						</span>
					</div>
					{metadata?.totalAmount && (
						<span className="text-sm font-medium">
							Total: {formatCurrency(metadata.totalAmount)}
						</span>
					)}
				</div>
			</div>

			<div className="divide-y">
				{transactions.slice(0, 10).map((tx, index) => {
					const overdue = isOverdue(tx.DueDate);

					return (
						<div
							key={tx.SequenceNumber || index}
							className="p-4 hover:bg-gray-50"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-medium">{tx.NameCode}</span>
										<span className="text-sm text-gray-500">
											{getTransactionTypeName(tx.Type)}
										</span>
										{tx.OurRef && (
											<span className="text-sm text-gray-500">
												#{tx.OurRef}
											</span>
										)}
										{getStatusBadge(tx.Status)}
									</div>

									{tx.Description && (
										<p className="text-sm text-gray-600 mb-1">
											{tx.Description}
										</p>
									)}

									<div className="flex items-center gap-4 text-xs text-gray-500">
										<span>Date: {d`${tx.TransDate}`.format("/")}</span>
										<span className={cn(overdue && "text-red-500 font-medium")}>
											Due: {d`${tx.DueDate}`.format("/")}
										</span>
										{overdue && (
											<span className="flex items-center gap-1 text-red-500">
												<AlertCircle className="w-3 h-3" />
												Overdue by {d`${new Date()}`.subtract(d`${tx.DueDate}`)}{" "}
												days
											</span>
										)}
									</div>
								</div>

								<div className="text-right">
									<div className="font-semibold">
										{formatCurrency(tx.Total)}
									</div>
									{tx.Balance !== undefined && tx.Balance > 0 && (
										<div className="text-sm text-gray-500">
											Balance: {formatCurrency(tx.Balance)}
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}

				{transactions.length > 10 && (
					<div className="p-3 text-center text-sm text-gray-500">
						... and {transactions.length - 10} more transactions
					</div>
				)}
			</div>
		</div>
	);
}
