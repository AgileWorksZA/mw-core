import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord, NameRecord, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number {
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

function balanceExpr(field: string, value: string): string {
	return `GetBalance("${field}=\\"${value}\\"", Today())`;
}

interface ReportLine {
	code: string;
	description: string;
	amount: number;
	indent?: number;
	bold?: boolean;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const reportId = url.searchParams.get('id') || '';

	if (reportId === 'trial-balance') {
		return await generateTrialBalance(token);
	} else if (reportId === 'profit-year') {
		return await generateProfitYear(token);
	} else if (reportId === 'balance-sheet') {
		return await generateBalanceSheet(token);
	} else if (reportId === 'aged-receivables') {
		return await generateAgedReceivables(token);
	} else if (reportId === 'account-movements') {
		return await generateAccountMovements(token, url.searchParams.get('account') || '');
	} else if (reportId === 'customer-sales-month') {
		return await generateCustomerSalesByMonth(token);
	} else if (reportId === 'accounts-list') {
		return await generateAccountsList(token);
	}

	return { reportId, title: 'Report', lines: [], totals: { debit: 0, credit: 0, total: 0 } as Record<string, number> };
};

async function generateTrialBalance(token: string) {
	let accountsRes: ApiResponse<AccountRecord[]>;
	try {
		accountsRes = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 });
	} catch {
		return { reportId: 'trial-balance', title: 'Trial Balance', lines: [], totals: { debit: 0, credit: 0 } as Record<string, number> };
	}

	const accounts = accountsRes.data ?? [];
	const exprs: Record<string, string> = {};
	for (const a of accounts) {
		exprs[a.Code] = balanceExpr('AccountCode', a.Code);
	}
	const balances = await apiEvalBatch(exprs, token);

	const lines: ReportLine[] = [];
	let totalDebit = 0;
	let totalCredit = 0;

	for (const a of accounts) {
		const balance = parseNum(balances[a.Code] || '0');
		if (Math.abs(balance) < 0.01) continue;
		lines.push({ code: a.Code, description: a.Description ?? '', amount: balance });
		if (balance > 0) totalDebit += balance;
		else totalCredit += Math.abs(balance);
	}

	lines.sort((a, b) => a.code.localeCompare(b.code));

	return { reportId: 'trial-balance', title: 'Trial Balance', lines, totals: { debit: totalDebit, credit: totalCredit } as Record<string, number> };
}

async function generateProfitYear(token: string) {
	const exprs: Record<string, string> = {
		income: 'GetBalance("Type=\\"IN\\"", Today())',
		costOfSales: 'GetBalance("Type=\\"CS\\"", Today())',
		expenses: 'GetBalance("Type=\\"EX\\"", Today())',
		otherIncome: 'GetBalance("Type=\\"SA\\"", Today())'
	};
	const b = await apiEvalBatch(exprs, token);

	const income = Math.abs(parseNum(b.income));
	const cos = Math.abs(parseNum(b.costOfSales));
	const expenses = Math.abs(parseNum(b.expenses));
	const otherIncome = Math.abs(parseNum(b.otherIncome));

	const lines: ReportLine[] = [
		{ code: '', description: 'Income', amount: income, bold: true },
		{ code: '', description: 'Less: Cost of Sales', amount: -cos, indent: 1 },
		{ code: '', description: 'Gross Profit', amount: income - cos, bold: true },
		{ code: '', description: 'Add: Other Income', amount: otherIncome, indent: 1 },
		{ code: '', description: 'Less: Expenses', amount: -expenses, indent: 1 },
		{ code: '', description: 'Net Profit', amount: income - cos + otherIncome - expenses, bold: true }
	];

	return { reportId: 'profit-year', title: 'Profit This Year', lines, totals: {} as Record<string, number> };
}

async function generateBalanceSheet(token: string) {
	const exprs: Record<string, string> = {
		ca: 'GetBalance("Type=\\"CA\\"", Today())',
		fa: 'GetBalance("Type=\\"FA\\"", Today())',
		cl: 'GetBalance("Type=\\"CL\\"", Today())',
		sf: 'GetBalance("Type=\\"SF\\"", Today())'
	};
	const b = await apiEvalBatch(exprs, token);

	const ca = parseNum(b.ca);
	const fa = parseNum(b.fa);
	const cl = Math.abs(parseNum(b.cl));
	const sf = Math.abs(parseNum(b.sf));

	const lines: ReportLine[] = [
		{ code: '', description: 'Current Assets', amount: ca, bold: true },
		{ code: '', description: 'Fixed Assets', amount: fa, bold: true },
		{ code: '', description: 'Total Assets', amount: ca + fa, bold: true },
		{ code: '', description: '', amount: 0 },
		{ code: '', description: 'Current Liabilities', amount: cl, bold: true },
		{ code: '', description: 'Equity', amount: sf, bold: true },
		{ code: '', description: 'Total Liabilities & Equity', amount: cl + sf, bold: true }
	];

	return { reportId: 'balance-sheet', title: 'Balance Sheet', lines, totals: {} as Record<string, number> };
}

async function generateAgedReceivables(token: string) {
	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, filter: 'CustomerType>="2"', limit: 200 });
	} catch {
		return { reportId: 'aged-receivables', title: 'Aged Receivables', lines: [], totals: {} as Record<string, number> };
	}

	const names = namesRes.data ?? [];
	const lines: ReportLine[] = [];

	for (const n of names) {
		const total = (n.DCurrent ?? 0) + (n.D30Plus ?? 0) + (n.D60Plus ?? 0) + (n.D90Plus ?? 0);
		if (total < 0.01) continue;
		lines.push({ code: n.Code ?? '', description: n.Name ?? '', amount: total });
	}

	lines.sort((a, b) => b.amount - a.amount);
	const totalOwed = lines.reduce((s, l) => s + l.amount, 0);

	return { reportId: 'aged-receivables', title: 'Aged Receivables', lines, totals: { total: totalOwed } as Record<string, number> };
}

async function generateAccountMovements(token: string, accountCode: string) {
	if (!accountCode) {
		return { reportId: 'account-movements', title: 'Account Movements', lines: [], totals: {} as Record<string, number> };
	}

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: `Contra="${accountCode}" AND Status="P"`, limit: 500
		});
	} catch {
		return { reportId: 'account-movements', title: `Account Movements: ${accountCode}`, lines: [], totals: {} as Record<string, number> };
	}

	const txs = txRes.data ?? [];
	const lines: ReportLine[] = txs.map((t) => ({
		code: t.Ourref ?? '', description: `${t.Transdate ?? ''} — ${t.Tofrom ?? t.Namecode ?? ''} — ${t.Description ?? ''}`,
		amount: t.Gross ?? 0
	}));

	const total = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'account-movements', title: `Account Movements: ${accountCode}`, lines, totals: { total } as Record<string, number> };
}

async function generateCustomerSalesByMonth(token: string) {
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 5000
		});
	} catch {
		return { reportId: 'customer-sales-month', title: 'Customer Sales by Month', lines: [], totals: {} as Record<string, number> };
	}

	const txs = txRes.data ?? [];

	// Group by customer, then aggregate total
	const customerMap = new Map<string, { name: string; total: number }>();
	for (const t of txs) {
		const code = t.Namecode ?? 'Unknown';
		const name = t.Tofrom ?? code;
		const existing = customerMap.get(code);
		if (existing) {
			existing.total += t.Gross ?? 0;
		} else {
			customerMap.set(code, { name, total: t.Gross ?? 0 });
		}
	}

	const lines: ReportLine[] = Array.from(customerMap.entries())
		.map(([code, { name, total }]) => ({ code, description: name, amount: total }))
		.sort((a, b) => b.amount - a.amount);

	const grandTotal = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'customer-sales-month', title: 'Customer Sales Summary', lines, totals: { total: grandTotal } as Record<string, number> };
}

async function generateAccountsList(token: string) {
	let accountsRes: ApiResponse<AccountRecord[]>;
	try {
		accountsRes = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 });
	} catch {
		return { reportId: 'accounts-list', title: 'Accounts List', lines: [], totals: {} as Record<string, number> };
	}

	const accounts = accountsRes.data ?? [];
	const lines: ReportLine[] = accounts
		.map((a) => ({ code: a.Code, description: `${a.Description ?? ''} (${a.Type ?? ''})`, amount: 0 }))
		.sort((a, b) => a.code.localeCompare(b.code));

	return { reportId: 'accounts-list', title: 'Accounts List', lines, totals: { count: accounts.length } as Record<string, number> };
}
