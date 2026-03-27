import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number {
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

function balanceExpr(code: string): string {
	return `GetBalance("AccountCode=\\"${code}\\"", Today())`;
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Get all accounts to find income and expense accounts
	let accountsRes: ApiResponse<AccountRecord[]>;
	try {
		accountsRes = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 });
	} catch {
		return { incomeAccounts: [], expenseAccounts: [], totals: { income: 0, expenses: 0, net: 0 } };
	}

	const accounts = accountsRes.data ?? [];

	// Income types: IN (Income), SA (Other Income)
	// Expense types: CS (Cost of Sales), EX (Expenses)
	const incomeRecords = accounts.filter((a) => a.Type === 'IN' || a.Type === 'SA');
	const expenseRecords = accounts.filter((a) => a.Type === 'CS' || a.Type === 'EX');

	// Fetch balances for all income + expense accounts via eval
	const allAccounts = [...incomeRecords, ...expenseRecords];
	const exprs: Record<string, string> = {};
	for (const a of allAccounts) {
		exprs[a.Code] = balanceExpr(a.Code);
	}

	const balances = await apiEvalBatch(exprs, token);

	// Build income accounts list with balances
	const incomeAccounts = incomeRecords
		.map((a) => ({
			code: a.Code,
			description: a.Description ?? '',
			type: a.Type ?? '',
			balance: Math.abs(parseNum(balances[a.Code] || '0'))
		}))
		.filter((a) => a.balance > 0.01)
		.sort((a, b) => b.balance - a.balance);

	const expenseAccounts = expenseRecords
		.map((a) => ({
			code: a.Code,
			description: a.Description ?? '',
			type: a.Type ?? '',
			balance: Math.abs(parseNum(balances[a.Code] || '0'))
		}))
		.filter((a) => a.balance > 0.01)
		.sort((a, b) => b.balance - a.balance);

	const totalIncome = incomeAccounts.reduce((s, a) => s + a.balance, 0);
	const totalExpenses = expenseAccounts.reduce((s, a) => s + a.balance, 0);

	return {
		incomeAccounts,
		expenseAccounts,
		totals: {
			income: totalIncome,
			expenses: totalExpenses,
			net: totalIncome - totalExpenses
		}
	};
};
