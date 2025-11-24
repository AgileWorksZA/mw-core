import { Calculator, Info } from "lucide-react";
import React from "react";

interface TaxRate {
	TaxCode: string;
	TaxName: string;
	TaxRate: number;
	TaxRateReduced?: number;
	TaxRateForeign?: number;
	Type?: string;
	Account?: string;
	InclusiveExclusiveIndicator?: "I" | "E";
}

export interface TaxRateDisplayProps {
	data: TaxRate | null;
}

export function TaxRateDisplay({ data }: TaxRateDisplayProps) {
	if (!data) {
		return (
			<div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
				Tax rate not found
			</div>
		);
	}

	const formatPercentage = (rate: number) => {
		return `${(rate * 100).toFixed(2)}%`;
	};

	const calculateTax = (amount: number, rate: number, inclusive: boolean) => {
		if (inclusive) {
			const tax = amount - amount / (1 + rate);
			return {
				tax: tax.toFixed(2),
				net: (amount - tax).toFixed(2),
				gross: amount.toFixed(2),
			};
		}
		const tax = amount * rate;
		return {
			tax: tax.toFixed(2),
			net: amount.toFixed(2),
			gross: (amount + tax).toFixed(2),
		};
	};

	const isInclusive = data.InclusiveExclusiveIndicator === "I";
	const exampleAmount = 100;
	const calculation = calculateTax(exampleAmount, data.TaxRate, isInclusive);

	return (
		<div className="bg-white rounded-lg border overflow-hidden">
			<div className="bg-gray-50 px-4 py-3 border-b">
				<div className="flex items-center gap-2">
					<Calculator className="w-4 h-4 text-gray-500" />
					<span className="font-medium">Tax Rate Details</span>
				</div>
			</div>

			<div className="p-4 space-y-3">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="text-sm text-gray-600">Tax Code</div>
						<div className="font-semibold">{data.TaxCode}</div>
					</div>
					<div>
						<div className="text-sm text-gray-600">Tax Name</div>
						<div className="font-semibold">{data.TaxName}</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="text-sm text-gray-600">Standard Rate</div>
						<div className="font-semibold text-lg">
							{formatPercentage(data.TaxRate)}
						</div>
					</div>
					<div>
						<div className="text-sm text-gray-600">Type</div>
						<div className="font-semibold">
							{isInclusive ? "Tax Inclusive" : "Tax Exclusive"}
						</div>
					</div>
				</div>

				{(data.TaxRateReduced !== undefined ||
					data.TaxRateForeign !== undefined) && (
					<div className="grid grid-cols-2 gap-4">
						{data.TaxRateReduced !== undefined && (
							<div>
								<div className="text-sm text-gray-600">Reduced Rate</div>
								<div className="font-semibold">
									{formatPercentage(data.TaxRateReduced)}
								</div>
							</div>
						)}
						{data.TaxRateForeign !== undefined && (
							<div>
								<div className="text-sm text-gray-600">Foreign Rate</div>
								<div className="font-semibold">
									{formatPercentage(data.TaxRateForeign)}
								</div>
							</div>
						)}
					</div>
				)}

				{data.Account && (
					<div>
						<div className="text-sm text-gray-600">GL Account</div>
						<div className="font-semibold">{data.Account}</div>
					</div>
				)}

				<div className="mt-4 p-3 bg-blue-50 rounded-lg">
					<div className="flex items-center gap-2 mb-2">
						<Info className="w-4 h-4 text-blue-600" />
						<span className="text-sm font-medium text-blue-900">
							Example Calculation
						</span>
					</div>

					<div className="text-sm space-y-1">
						<div className="flex justify-between">
							<span className="text-gray-600">
								{isInclusive
									? "Gross Amount (incl. tax):"
									: "Net Amount (excl. tax):"}
							</span>
							<span className="font-medium">
								${isInclusive ? calculation.gross : calculation.net}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">
								Tax Amount ({formatPercentage(data.TaxRate)}):
							</span>
							<span className="font-medium">${calculation.tax}</span>
						</div>
						<div className="flex justify-between border-t pt-1">
							<span className="text-gray-600">
								{isInclusive ? "Net Amount:" : "Total Amount:"}
							</span>
							<span className="font-semibold">
								${isInclusive ? calculation.net : calculation.gross}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
