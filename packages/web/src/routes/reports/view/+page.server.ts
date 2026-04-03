import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord, NameRecord, TransactionRecord, DetailRecord, ProductRecord } from '$lib/api/types';
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
	} else if (reportId === 'aged-payables') {
		return await generateAgedPayables(token);
	} else if (reportId === 'profit-month') {
		return await generateProfitMonth(token);
	} else if (reportId === 'profit-comparison') {
		return await generateProfitComparison(token);
	} else if (reportId === 'ledger-report') {
		return await generateLedgerReport(token);
	} else if (reportId === 'address-list') {
		return await generateAddressList(token);
	} else if (reportId === 'item-sales') {
		return await generateItemSales(token);
	} else if (reportId === 'backorders-customer') {
		return await generateBackordersByCustomer(token);
	} else if (reportId === 'customer-sales-summary') {
		return await generateCustomerSalesSummary(token);
	} else if (reportId === 'transaction-posting') {
		return await generateTransactionPosting(token);
	} else if (reportId === 'budget-year') {
		return await generateBudgetYear(token);
	} else if (reportId === 'forecast') {
		return await generateForecast(token);
	} else if (reportId === 'customer-sales-item') {
		return await generateCustomerSalesByItem(token);
	} else if (reportId === 'purchases-over-time') {
		return await generatePurchasesOverTime(token);
	} else if (reportId === 'backorders-product') {
		return await generateBackordersByProduct(token);
	} else if (reportId === 'job-active-list') {
		return await generateJobActiveList(token);
	} else if (reportId === 'job-detailed') {
		return await generateJobDetailed(token);
	} else if (reportId === 'job-pl') {
		return await generateJobPL(token);
	} else if (reportId === 'job-pl-summary') {
		return await generateJobPLSummary(token);
	} else if (reportId === 'job-resource-summary') {
		return await generateJobResourceSummary(token);
	} else if (reportId === 'job-costcentre-summary') {
		return await generateJobCostCentreSummary(token);
	} else if (reportId === 'job-account-summary') {
		return await generateJobAccountSummary(token);
	} else if (reportId === 'asset-report') {
		return await generateAssetReport(token);
	} else if (reportId === 'asset-register') {
		return await generateAssetRegister(token);
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
		code: t.Ourref ?? '', description: `${t.Transdate ?? ''} — ${t.Namecode ?? ''} — ${t.Description ?? ''}`,
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
		const name = code;
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

async function generateAgedPayables(token: string) {
	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, filter: 'SupplierType>="2"', limit: 200 });
	} catch {
		return { reportId: 'aged-payables', title: 'Aged Payables', lines: [], totals: {} as Record<string, number> };
	}

	const lines: ReportLine[] = [];
	for (const n of (namesRes.data ?? [])) {
		const total = n.CCurrent ?? 0;
		if (total < 0.01) continue;
		lines.push({ code: n.Code ?? '', description: n.Name ?? '', amount: total });
	}
	lines.sort((a, b) => b.amount - a.amount);
	return { reportId: 'aged-payables', title: 'Aged Payables', lines, totals: { total: lines.reduce((s, l) => s + l.amount, 0) } as Record<string, number> };
}

async function generateProfitMonth(token: string) {
	// Same as profit-year but labeled as current month
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
	return { reportId: 'profit-month', title: 'Profit This Month', lines, totals: {} as Record<string, number> };
}

async function generateProfitComparison(token: string) {
	const exprs: Record<string, string> = {
		income: 'GetBalance("Type=\\"IN\\"", Today())',
		costOfSales: 'GetBalance("Type=\\"CS\\"", Today())',
		expenses: 'GetBalance("Type=\\"EX\\"", Today())'
	};
	const b = await apiEvalBatch(exprs, token);
	const income = Math.abs(parseNum(b.income));
	const cos = Math.abs(parseNum(b.costOfSales));
	const expenses = Math.abs(parseNum(b.expenses));

	const lines: ReportLine[] = [
		{ code: '', description: 'Income', amount: income, bold: true },
		{ code: '', description: 'Cost of Sales', amount: cos },
		{ code: '', description: 'Gross Profit', amount: income - cos, bold: true },
		{ code: '', description: 'Expenses', amount: expenses },
		{ code: '', description: 'Net Profit', amount: income - cos - expenses, bold: true }
	];
	return { reportId: 'profit-comparison', title: 'Profit Comparison', lines, totals: {} as Record<string, number> };
}

async function generateLedgerReport(token: string) {
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'Status="P"', limit: 500
		});
	} catch {
		return { reportId: 'ledger-report', title: 'Ledger Report', lines: [], totals: {} as Record<string, number> };
	}

	const lines: ReportLine[] = (txRes.data ?? []).map((t) => ({
		code: t.Ourref ?? '',
		description: `${t.Transdate ?? ''} | ${(t.Type ?? '').substring(0, 2)} | ${t.Namecode ?? ''} — ${t.Description ?? ''}`,
		amount: t.Gross ?? 0
	}));

	return { reportId: 'ledger-report', title: 'Ledger Report', lines, totals: { count: lines.length } as Record<string, number> };
}

async function generateAddressList(token: string) {
	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, limit: 500 });
	} catch {
		return { reportId: 'address-list', title: 'Address List', lines: [], totals: {} as Record<string, number> };
	}

	const lines: ReportLine[] = (namesRes.data ?? []).map((n) => ({
		code: n.Code ?? '',
		description: `${n.Name ?? ''} — ${n.Phone ?? ''} — ${n.email ?? ''}`,
		amount: 0
	})).sort((a, b) => a.description.localeCompare(b.description));

	return { reportId: 'address-list', title: 'Address List', lines, totals: { count: lines.length } as Record<string, number> };
}

async function generateItemSales(token: string) {
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 5000
		});
	} catch {
		return { reportId: 'item-sales', title: 'Item Sales', lines: [], totals: {} as Record<string, number> };
	}

	// Aggregate by description as item proxy
	const itemMap = new Map<string, number>();
	for (const t of (txRes.data ?? [])) {
		const desc = t.Description ?? 'Other';
		itemMap.set(desc, (itemMap.get(desc) ?? 0) + (t.Gross ?? 0));
	}

	const lines: ReportLine[] = Array.from(itemMap.entries())
		.map(([desc, total]) => ({ code: '', description: desc, amount: total }))
		.sort((a, b) => b.amount - a.amount);

	return { reportId: 'item-sales', title: 'Item Sales', lines, totals: { total: lines.reduce((s, l) => s + l.amount, 0) } as Record<string, number> };
}

async function generateBackordersByCustomer(token: string) {
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="SO"', limit: 500
		});
	} catch {
		return { reportId: 'backorders-customer', title: 'Backorders by Customer', lines: [], totals: {} as Record<string, number> };
	}

	const customerMap = new Map<string, { name: string; total: number }>();
	for (const t of (txRes.data ?? [])) {
		const code = t.Namecode ?? 'Unknown';
		const name = code;
		const existing = customerMap.get(code);
		if (existing) { existing.total += t.Gross ?? 0; }
		else { customerMap.set(code, { name, total: t.Gross ?? 0 }); }
	}

	const lines: ReportLine[] = Array.from(customerMap.entries())
		.map(([code, { name, total }]) => ({ code, description: name, amount: total }))
		.sort((a, b) => b.amount - a.amount);

	return { reportId: 'backorders-customer', title: 'Backorders by Customer', lines, totals: { total: lines.reduce((s, l) => s + l.amount, 0) } as Record<string, number> };
}

async function generateCustomerSalesSummary(token: string) {
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 5000
		});
	} catch {
		return { reportId: 'customer-sales-summary', title: 'Customer Sales Summary', lines: [], totals: {} as Record<string, number> };
	}

	const customerMap = new Map<string, { name: string; total: number; count: number }>();
	for (const t of (txRes.data ?? [])) {
		const code = t.Namecode ?? 'Unknown';
		const name = code;
		const existing = customerMap.get(code);
		if (existing) {
			existing.total += t.Gross ?? 0;
			existing.count++;
		} else {
			customerMap.set(code, { name, total: t.Gross ?? 0, count: 1 });
		}
	}

	const lines: ReportLine[] = Array.from(customerMap.entries())
		.map(([code, { name, total, count }]) => ({
			code, description: `${name} (${count} invoices)`, amount: total
		}))
		.sort((a, b) => b.amount - a.amount);

	const grandTotal = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'customer-sales-summary', title: 'Customer Sales Summary', lines, totals: { total: grandTotal } as Record<string, number> };
}

async function generateTransactionPosting(token: string) {
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'Status="P"', limit: 1000
		});
	} catch {
		return { reportId: 'transaction-posting', title: 'Transaction Posting Report', lines: [], totals: {} as Record<string, number> };
	}

	const txs = txRes.data ?? [];

	// Group by type for a journal-style view
	const typeMap = new Map<string, { count: number; totalDebit: number; totalCredit: number }>();
	for (const t of txs) {
		const type = (t.Type ?? 'UNK').substring(0, 3);
		const existing = typeMap.get(type);
		const gross = t.Gross ?? 0;
		if (existing) {
			existing.count++;
			if (gross >= 0) existing.totalDebit += gross;
			else existing.totalCredit += Math.abs(gross);
		} else {
			typeMap.set(type, {
				count: 1,
				totalDebit: gross >= 0 ? gross : 0,
				totalCredit: gross < 0 ? Math.abs(gross) : 0
			});
		}
	}

	const typeLabels: Record<string, string> = {
		DII: 'Sales Invoices', DIC: 'Sales Credit Notes',
		CII: 'Purchase Invoices', CIC: 'Purchase Credit Notes',
		REC: 'Receipts', PAY: 'Payments',
		JNL: 'Journals', SOO: 'Sales Orders', POO: 'Purchase Orders'
	};

	const lines: ReportLine[] = [];
	let grandDebit = 0;
	let grandCredit = 0;

	for (const [type, data] of Array.from(typeMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
		lines.push({
			code: type,
			description: `${typeLabels[type] ?? type} (${data.count} transactions)`,
			amount: data.totalDebit - data.totalCredit,
			bold: true
		});
		grandDebit += data.totalDebit;
		grandCredit += data.totalCredit;
	}

	lines.push({ code: '', description: '', amount: 0 });
	lines.push({ code: '', description: 'Total Posted Transactions', amount: txs.length, bold: true });

	return { reportId: 'transaction-posting', title: 'Transaction Posting Report', lines, totals: { debit: grandDebit, credit: grandCredit } as Record<string, number> };
}

async function generateBudgetYear(token: string) {
	// Get actual figures by account type, then show budget comparison structure
	const exprs: Record<string, string> = {
		income: 'GetBalance("Type=\\"IN\\"", Today())',
		costOfSales: 'GetBalance("Type=\\"CS\\"", Today())',
		expenses: 'GetBalance("Type=\\"EX\\"", Today())',
		otherIncome: 'GetBalance("Type=\\"SA\\"", Today())',
		currentAssets: 'GetBalance("Type=\\"CA\\"", Today())',
		fixedAssets: 'GetBalance("Type=\\"FA\\"", Today())',
		liabilities: 'GetBalance("Type=\\"CL\\"", Today())'
	};
	const b = await apiEvalBatch(exprs, token);

	const income = Math.abs(parseNum(b.income));
	const cos = Math.abs(parseNum(b.costOfSales));
	const expenses = Math.abs(parseNum(b.expenses));
	const otherIncome = Math.abs(parseNum(b.otherIncome));
	const ca = parseNum(b.currentAssets);
	const fa = parseNum(b.fixedAssets);
	const cl = Math.abs(parseNum(b.liabilities));

	const lines: ReportLine[] = [
		{ code: '', description: 'Revenue', amount: 0, bold: true },
		{ code: 'IN', description: 'Income', amount: income, indent: 1 },
		{ code: 'SA', description: 'Other Income', amount: otherIncome, indent: 1 },
		{ code: '', description: 'Total Revenue', amount: income + otherIncome, bold: true },
		{ code: '', description: '', amount: 0 },
		{ code: '', description: 'Expenditure', amount: 0, bold: true },
		{ code: 'CS', description: 'Cost of Sales', amount: cos, indent: 1 },
		{ code: 'EX', description: 'Operating Expenses', amount: expenses, indent: 1 },
		{ code: '', description: 'Total Expenditure', amount: cos + expenses, bold: true },
		{ code: '', description: '', amount: 0 },
		{ code: '', description: 'Net Surplus / (Deficit)', amount: income + otherIncome - cos - expenses, bold: true },
		{ code: '', description: '', amount: 0 },
		{ code: '', description: 'Assets & Liabilities', amount: 0, bold: true },
		{ code: 'CA', description: 'Current Assets', amount: ca, indent: 1 },
		{ code: 'FA', description: 'Fixed Assets', amount: fa, indent: 1 },
		{ code: 'CL', description: 'Current Liabilities', amount: cl, indent: 1 },
		{ code: '', description: 'Net Position', amount: ca + fa - cl, bold: true }
	];

	return { reportId: 'budget-year', title: 'Financial Year Summary', lines, totals: {} as Record<string, number> };
}

async function generateForecast(token: string) {
	// Get current actuals and project remaining months
	const exprs: Record<string, string> = {
		income: 'GetBalance("Type=\\"IN\\"", Today())',
		costOfSales: 'GetBalance("Type=\\"CS\\"", Today())',
		expenses: 'GetBalance("Type=\\"EX\\"", Today())'
	};
	const b = await apiEvalBatch(exprs, token);

	const income = Math.abs(parseNum(b.income));
	const cos = Math.abs(parseNum(b.costOfSales));
	const expenses = Math.abs(parseNum(b.expenses));
	const netProfit = income - cos - expenses;

	// Estimate months elapsed (assume fiscal year = calendar year)
	const now = new Date();
	const monthsElapsed = Math.max(1, now.getMonth() + 1);
	const monthsRemaining = 12 - monthsElapsed;

	const monthlyIncome = income / monthsElapsed;
	const monthlyCos = cos / monthsElapsed;
	const monthlyExp = expenses / monthsElapsed;

	const projectedIncome = income + monthlyIncome * monthsRemaining;
	const projectedCos = cos + monthlyCos * monthsRemaining;
	const projectedExp = expenses + monthlyExp * monthsRemaining;

	const lines: ReportLine[] = [
		{ code: '', description: `Year-to-Date (${monthsElapsed} months)`, amount: 0, bold: true },
		{ code: '', description: 'Income', amount: income, indent: 1 },
		{ code: '', description: 'Cost of Sales', amount: -cos, indent: 1 },
		{ code: '', description: 'Expenses', amount: -expenses, indent: 1 },
		{ code: '', description: 'Net Profit (YTD)', amount: netProfit, bold: true },
		{ code: '', description: '', amount: 0 },
		{ code: '', description: `Monthly Average`, amount: 0, bold: true },
		{ code: '', description: 'Income / month', amount: monthlyIncome, indent: 1 },
		{ code: '', description: 'Cost of Sales / month', amount: -monthlyCos, indent: 1 },
		{ code: '', description: 'Expenses / month', amount: -monthlyExp, indent: 1 },
		{ code: '', description: 'Net Profit / month', amount: (netProfit) / monthsElapsed, bold: true },
		{ code: '', description: '', amount: 0 },
		{ code: '', description: `Full Year Projection (${monthsRemaining} months remaining)`, amount: 0, bold: true },
		{ code: '', description: 'Projected Income', amount: projectedIncome, indent: 1 },
		{ code: '', description: 'Projected Cost of Sales', amount: -projectedCos, indent: 1 },
		{ code: '', description: 'Projected Expenses', amount: -projectedExp, indent: 1 },
		{ code: '', description: 'Projected Net Profit', amount: projectedIncome - projectedCos - projectedExp, bold: true }
	];

	return { reportId: 'forecast', title: 'Forecast', lines, totals: {} as Record<string, number> };
}

async function generateCustomerSalesByItem(token: string) {
	// Use Detail table to get item-level sales breakdown per customer
	let [detailRes, txRes] = await Promise.all([
		apiGet<ApiResponse<DetailRecord[]>>('/tables/detail', {
			token, filter: 'left(TransactionType,2)="DI"', limit: 5000
		}).catch(() => null),
		apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 5000
		}).catch(() => null)
	]);

	// Build parent-seq -> customer name lookup
	const txMap = new Map<number, string>();
	if (txRes?.data) {
		for (const t of txRes.data) {
			txMap.set(t.Sequencenumber ?? 0, t.Namecode ?? 'Unknown');
		}
	}

	if (detailRes?.data && detailRes.data.length > 0) {
		// We have detail data — aggregate by customer + item
		const map = new Map<string, { amount: number }>();
		for (const d of detailRes.data) {
			const customer = txMap.get(d.ParentSeq) ?? `#${d.ParentSeq}`;
			const item = d.StockCode || d.Description || 'Other';
			const key = `${customer} | ${item}`;
			const existing = map.get(key);
			if (existing) existing.amount += d.Gross ?? 0;
			else map.set(key, { amount: d.Gross ?? 0 });
		}

		const lines: ReportLine[] = Array.from(map.entries())
			.map(([desc, { amount }]) => ({ code: '', description: desc, amount }))
			.sort((a, b) => b.amount - a.amount);

		return { reportId: 'customer-sales-item', title: 'Customer Sales by Item', lines, totals: { total: lines.reduce((s, l) => s + l.amount, 0) } as Record<string, number> };
	}

	// Fallback: aggregate transactions by customer + description
	if (txRes?.data) {
		const map = new Map<string, { amount: number }>();
		for (const t of txRes.data) {
			const customer = t.Namecode ?? 'Unknown';
			const desc = t.Description ?? 'Other';
			const key = `${customer} | ${desc}`;
			const existing = map.get(key);
			if (existing) existing.amount += t.Gross ?? 0;
			else map.set(key, { amount: t.Gross ?? 0 });
		}

		const lines: ReportLine[] = Array.from(map.entries())
			.map(([desc, { amount }]) => ({ code: '', description: desc, amount }))
			.sort((a, b) => b.amount - a.amount);

		return { reportId: 'customer-sales-item', title: 'Customer Sales by Item', lines, totals: { total: lines.reduce((s, l) => s + l.amount, 0) } as Record<string, number> };
	}

	return { reportId: 'customer-sales-item', title: 'Customer Sales by Item', lines: [], totals: {} as Record<string, number> };
}

async function generatePurchasesOverTime(token: string) {
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="CI" AND Status="P"', limit: 5000
		});
	} catch {
		return { reportId: 'purchases-over-time', title: 'Purchases over Time', lines: [], totals: {} as Record<string, number> };
	}

	const txs = txRes.data ?? [];

	// Group by month (YYYY-MM)
	const monthMap = new Map<string, { total: number; count: number }>();
	for (const t of txs) {
		const date = t.Transdate ?? '';
		const month = date.length >= 7 ? date.substring(0, 7) : 'Unknown';
		const existing = monthMap.get(month);
		if (existing) {
			existing.total += Math.abs(t.Gross ?? 0);
			existing.count++;
		} else {
			monthMap.set(month, { total: Math.abs(t.Gross ?? 0), count: 1 });
		}
	}

	const lines: ReportLine[] = Array.from(monthMap.entries())
		.sort((a, b) => b[0].localeCompare(a[0]))
		.map(([month, { total, count }]) => ({
			code: month, description: `${count} purchase invoices`, amount: total
		}));

	const grandTotal = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'purchases-over-time', title: 'Purchases over Time', lines, totals: { total: grandTotal } as Record<string, number> };
}

async function generateBackordersByProduct(token: string) {
	// Get sales orders and try detail lines for product breakdown
	let [detailRes, txRes] = await Promise.all([
		apiGet<ApiResponse<DetailRecord[]>>('/tables/detail', {
			token, filter: 'left(TransactionType,2)="SO"', limit: 2000
		}).catch(() => null),
		apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="SO"', limit: 500
		}).catch(() => null)
	]);

	if (detailRes?.data && detailRes.data.length > 0) {
		// Aggregate by product code
		const productMap = new Map<string, { description: string; qty: number; amount: number }>();
		for (const d of detailRes.data) {
			const code = d.StockCode || 'NO-CODE';
			const existing = productMap.get(code);
			if (existing) {
				existing.qty += d.StockQty ?? 0;
				existing.amount += d.Gross ?? 0;
			} else {
				productMap.set(code, {
					description: d.Description ?? code,
					qty: d.StockQty ?? 0,
					amount: d.Gross ?? 0
				});
			}
		}

		const lines: ReportLine[] = Array.from(productMap.entries())
			.map(([code, { description, qty, amount }]) => ({
				code, description: `${description} (qty: ${qty})`, amount
			}))
			.sort((a, b) => b.amount - a.amount);

		return { reportId: 'backorders-product', title: 'Backorders by Product', lines, totals: { total: lines.reduce((s, l) => s + l.amount, 0) } as Record<string, number> };
	}

	// Fallback: aggregate SO transactions by description
	if (txRes?.data) {
		const descMap = new Map<string, number>();
		for (const t of txRes.data) {
			const desc = t.Description ?? 'Other';
			descMap.set(desc, (descMap.get(desc) ?? 0) + (t.Gross ?? 0));
		}

		const lines: ReportLine[] = Array.from(descMap.entries())
			.map(([desc, amount]) => ({ code: '', description: desc, amount }))
			.sort((a, b) => b.amount - a.amount);

		return { reportId: 'backorders-product', title: 'Backorders by Product', lines, totals: { total: lines.reduce((s, l) => s + l.amount, 0) } as Record<string, number> };
	}

	return { reportId: 'backorders-product', title: 'Backorders by Product', lines: [], totals: {} as Record<string, number> };
}

// ─── Job Costing Reports ─────────────────────────────────────────

async function fetchJobs(token: string, filter?: string) {
	try {
		const res = await apiGet<ApiResponse<any[]>>('/tables/job', { token, filter, limit: 500 });
		return res.data ?? [];
	} catch { return []; }
}

async function fetchJobSheetItems(token: string, filter?: string) {
	try {
		const res = await apiGet<ApiResponse<any[]>>('/tables/jobsheetitem', { token, filter, limit: 2000 });
		return res.data ?? [];
	} catch { return []; }
}

async function generateJobActiveList(token: string) {
	const jobs = await fetchJobs(token, 'Status="A"');
	const billingLabels: Record<string, string> = { Q: 'Quote', C: 'Cost Plus' };
	const lines: ReportLine[] = jobs.map((j: any) => ({
		code: j.Code ?? '',
		description: `${j.Name || j.Description || ''} — Client: ${j.Client || '—'} — ${billingLabels[j.Billing] ?? '—'} — ${j.PercentComplete ?? 0}% complete`,
		amount: j.BilledToDate ?? 0,
	}));
	const total = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'job-active-list', title: 'Active Job List', lines, totals: { total } as Record<string, number> };
}

async function generateJobDetailed(token: string) {
	const jobs = await fetchJobs(token);
	const items = await fetchJobSheetItems(token);

	const lines: ReportLine[] = [];
	for (const j of jobs) {
		const code = j.Code ?? '';
		lines.push({ code, description: j.Name || j.Description || '', amount: 0, bold: true });
		const jobItems = items.filter((i: any) => i.Job === code);
		for (const item of jobItems) {
			lines.push({
				code: '',
				description: `  ${item.Date ?? ''} — ${item.Resource ?? item.Stockcode ?? ''} — ${item.Memo ?? item.Description ?? ''}`,
				amount: item.Cost ?? 0,
				indent: 1
			});
		}
		const subtotal = jobItems.reduce((s: number, i: any) => s + (i.Cost ?? 0), 0);
		if (jobItems.length > 0) {
			lines.push({ code: '', description: `  Subtotal: ${code}`, amount: subtotal, bold: true, indent: 1 });
		}
	}
	const total = items.reduce((s: number, i: any) => s + (i.Cost ?? 0), 0);
	return { reportId: 'job-detailed', title: 'Job Detailed', lines, totals: { total } as Record<string, number> };
}

async function generateJobPL(token: string) {
	const jobs = await fetchJobs(token);
	const items = await fetchJobSheetItems(token, 'Status<>"B"');

	const lines: ReportLine[] = [];
	let totalIncome = 0, totalExpense = 0;
	for (const j of jobs) {
		const code = j.Code ?? '';
		const jobItems = items.filter((i: any) => i.Job === code);
		const income = j.BilledToDate ?? 0;
		const expense = jobItems.reduce((s: number, i: any) => s + (i.Cost ?? 0), 0);
		const profit = income - expense;
		totalIncome += income;
		totalExpense += expense;
		lines.push({ code, description: `${j.Name || j.Description || ''} — Income: ${income.toFixed(2)} — Expense: ${expense.toFixed(2)}`, amount: profit });
	}
	return { reportId: 'job-pl', title: 'Job P&L', lines, totals: { income: totalIncome, expense: totalExpense, profit: totalIncome - totalExpense } as Record<string, number> };
}

async function generateJobPLSummary(token: string) {
	const jobs = await fetchJobs(token);
	const items = await fetchJobSheetItems(token, 'Status<>"B"');

	let totalIncome = 0, totalExpense = 0;
	const lines: ReportLine[] = [];
	for (const j of jobs) {
		const code = j.Code ?? '';
		const income = j.BilledToDate ?? 0;
		const expense = items.filter((i: any) => i.Job === code).reduce((s: number, i: any) => s + (i.Cost ?? 0), 0);
		totalIncome += income;
		totalExpense += expense;
		lines.push({ code, description: j.Name || j.Description || '', amount: income - expense });
	}
	return { reportId: 'job-pl-summary', title: 'Job P&L Summary', lines, totals: { income: totalIncome, expense: totalExpense, profit: totalIncome - totalExpense } as Record<string, number> };
}

async function generateJobResourceSummary(token: string) {
	const items = await fetchJobSheetItems(token, 'Status<>"B"');
	const resourceMap = new Map<string, { qty: number; cost: number; charge: number }>();
	for (const item of items) {
		const res = item.Resource ?? item.Stockcode ?? 'Unassigned';
		const existing = resourceMap.get(res) ?? { qty: 0, cost: 0, charge: 0 };
		existing.qty += item.Qty ?? item.Quantity ?? 0;
		existing.cost += item.Cost ?? 0;
		existing.charge += item.Charge ?? 0;
		resourceMap.set(res, existing);
	}
	const lines: ReportLine[] = Array.from(resourceMap.entries())
		.map(([resource, data]) => ({ code: resource, description: `Qty: ${data.qty} — Charge: ${data.charge.toFixed(2)}`, amount: data.cost }))
		.sort((a, b) => b.amount - a.amount);
	const total = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'job-resource-summary', title: 'Job Resource Summary', lines, totals: { total } as Record<string, number> };
}

async function generateJobCostCentreSummary(token: string) {
	const items = await fetchJobSheetItems(token, 'Status<>"B"');
	const ccMap = new Map<string, number>();
	for (const item of items) {
		const cc = item.CostCentre ?? 'Unassigned';
		ccMap.set(cc, (ccMap.get(cc) ?? 0) + (item.Cost ?? 0));
	}
	const lines: ReportLine[] = Array.from(ccMap.entries())
		.map(([cc, cost]) => ({ code: cc, description: cc, amount: cost }))
		.sort((a, b) => b.amount - a.amount);
	const total = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'job-costcentre-summary', title: 'Job Cost Centre Summary', lines, totals: { total } as Record<string, number> };
}

async function generateJobAccountSummary(token: string) {
	const items = await fetchJobSheetItems(token, 'Status<>"B"');
	const acctMap = new Map<string, number>();
	for (const item of items) {
		const acct = item.Account ?? 'Unassigned';
		acctMap.set(acct, (acctMap.get(acct) ?? 0) + (item.Cost ?? 0));
	}
	const lines: ReportLine[] = Array.from(acctMap.entries())
		.map(([acct, cost]) => ({ code: acct, description: acct, amount: cost }))
		.sort((a, b) => b.amount - a.amount);
	const total = lines.reduce((s, l) => s + l.amount, 0);
	return { reportId: 'job-account-summary', title: 'Job Account Summary', lines, totals: { total } as Record<string, number> };
}

// ─── Fixed Asset Reports ─────────────────────────────────────────

async function fetchAssets(token: string, filter?: string) {
	try {
		const res = await apiGet<ApiResponse<any[]>>('/tables/asset', { token, filter, limit: 500 });
		return res.data ?? [];
	} catch { return []; }
}

async function generateAssetReport(token: string) {
	const assets = await fetchAssets(token);
	const statusLabels: Record<string, string> = { NEW: 'New', ACT: 'Active', NDP: 'Non-Depr.', OTH: 'Other', DSP: 'Disposed' };

	const lines: ReportLine[] = assets.map((a: any) => {
		const cost = (a.CostPerUnit ?? a.Costperunit ?? 0) * (a.Qty ?? 1);
		const depr = a.AccumDepreciation ?? a.Accumdepreciation ?? 0;
		return {
			code: a.Code ?? '',
			description: `${a.Description ?? ''} [${statusLabels[a.Status] ?? a.Status}] — Cat: ${a.Category ?? '—'} — Cost: ${cost.toFixed(2)} — Depr: ${depr.toFixed(2)}`,
			amount: cost - depr,
		};
	});

	const totalCost = assets.reduce((s: number, a: any) => s + (a.CostPerUnit ?? a.Costperunit ?? 0) * (a.Qty ?? 1), 0);
	const totalDepr = assets.reduce((s: number, a: any) => s + (a.AccumDepreciation ?? a.Accumdepreciation ?? 0), 0);
	return {
		reportId: 'asset-report', title: 'Asset Report', lines,
		totals: { cost: totalCost, depreciation: totalDepr, bookValue: totalCost - totalDepr } as Record<string, number>
	};
}

async function generateAssetRegister(token: string) {
	const assets = await fetchAssets(token, 'Status<>"DSP"');
	const statusLabels: Record<string, string> = { NEW: 'New', ACT: 'Active', NDP: 'Non-Depr.', OTH: 'Other' };

	// Group by category
	const catMap = new Map<string, any[]>();
	for (const a of assets) {
		const cat = a.Category ?? 'Uncategorised';
		if (!catMap.has(cat)) catMap.set(cat, []);
		catMap.get(cat)!.push(a);
	}

	const lines: ReportLine[] = [];
	let totalCost = 0, totalDepr = 0;

	for (const [cat, catAssets] of catMap) {
		lines.push({ code: cat, description: `Category: ${cat}`, amount: 0, bold: true });
		let catCost = 0, catDepr = 0;
		for (const a of catAssets) {
			const cost = (a.CostPerUnit ?? a.Costperunit ?? 0) * (a.Qty ?? 1);
			const depr = a.AccumDepreciation ?? a.Accumdepreciation ?? 0;
			catCost += cost;
			catDepr += depr;
			lines.push({
				code: a.Code ?? '',
				description: `${a.Description ?? ''} [${statusLabels[a.Status] ?? a.Status}]`,
				amount: cost - depr,
				indent: 1
			});
		}
		totalCost += catCost;
		totalDepr += catDepr;
		lines.push({ code: '', description: `  Subtotal ${cat}: Cost ${catCost.toFixed(2)}, Depr ${catDepr.toFixed(2)}`, amount: catCost - catDepr, bold: true, indent: 1 });
	}

	return {
		reportId: 'asset-register', title: 'Asset Register', lines,
		totals: { cost: totalCost, depreciation: totalDepr, bookValue: totalCost - totalDepr } as Record<string, number>
	};
}
