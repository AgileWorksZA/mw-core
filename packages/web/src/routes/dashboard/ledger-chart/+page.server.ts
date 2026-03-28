import { apiEvalBatch } from '$lib/api/client';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number {
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Get balances for key account types for the ledger overview
	const exprs: Record<string, string> = {
		income: 'GetBalance("Type=\\"IN\\"", Today())',
		costOfSales: 'GetBalance("Type=\\"CS\\"", Today())',
		expenses: 'GetBalance("Type=\\"EX\\"", Today())',
		otherIncome: 'GetBalance("Type=\\"SA\\"", Today())',
		currentAssets: 'GetBalance("Type=\\"CA\\"", Today())',
		fixedAssets: 'GetBalance("Type=\\"FA\\"", Today())',
		currentLiabilities: 'GetBalance("Type=\\"CL\\"", Today())',
		equity: 'GetBalance("Type=\\"SF\\"", Today())'
	};

	const balances = await apiEvalBatch(exprs, token);

	const income = Math.abs(parseNum(balances.income));
	const costOfSales = Math.abs(parseNum(balances.costOfSales));
	const expenses = Math.abs(parseNum(balances.expenses));
	const otherIncome = Math.abs(parseNum(balances.otherIncome));
	const grossProfit = income - costOfSales;
	const netProfit = grossProfit + otherIncome - expenses;

	return {
		tradingProfit: {
			income, costOfSales, grossProfit, otherIncome, expenses, netProfit
		},
		balanceSheet: {
			currentAssets: parseNum(balances.currentAssets),
			fixedAssets: parseNum(balances.fixedAssets),
			currentLiabilities: Math.abs(parseNum(balances.currentLiabilities)),
			equity: Math.abs(parseNum(balances.equity))
		}
	};
};
