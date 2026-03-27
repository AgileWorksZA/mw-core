import { apiGet, apiEval, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, AccountRecord, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function formatDate(d: Date): string {
	return d.toISOString().split('T')[0];
}

function formatMWDate(d: Date): string {
	return d.toISOString().split('T')[0].replace(/-/g, '');
}

function sumGross(transactions: TransactionRecord[]): number {
	return transactions.reduce((sum, t) => sum + (t.Gross ?? 0), 0);
}

function monthLabel(d: Date): string {
	return d.toLocaleString('en', { month: 'short' });
}

function parseNum(s: string): number {
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

/**
 * Build a GetBalance expression for the MW evaluate endpoint.
 * GetBalance searches the Ledger table — first arg is a search expression
 * using Ledger fields: AccountCode, Department, Category, Classification, Type.
 */
function balanceExpr(field: string, value: string): string {
	return `GetBalance("${field}=\\"${value}\\"", Today())`;
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;
	const now = new Date();
	const today = formatDate(now);
	const sevenDaysAgo = formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
	const thirtyDaysAgo = formatDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

	// Build date range for last 12 months (for charts)
	const months: { label: string; start: string; end: string }[] = [];
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
		months.push({
			label: monthLabel(d),
			start: formatMWDate(d),
			end: formatMWDate(endD)
		});
	}
	const yearStart = months[0].start;

	// Fetch table data + accounts in parallel
	let salesRes: any, purchasesRes: any, accountsRes: any, namesRes: any;
	let yearSalesRes: any, yearPurchasesRes: any;
	try {
		[salesRes, purchasesRes, accountsRes, namesRes, yearSalesRes, yearPurchasesRes] = await Promise.all([
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="DI" AND Transdate>="${thirtyDaysAgo}"`,
				limit: 500
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="CI" AND Transdate>="${thirtyDaysAgo}"`,
				limit: 500
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 }),
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, limit: 500 }),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="DI" AND Transdate>="${yearStart}"`,
				limit: 2000
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="CI" AND Transdate>="${yearStart}"`,
				limit: 2000
			}).catch(() => ({ data: [] }))
		]);
	} catch {
		return emptyDashboard(today);
	}

	const sales30 = salesRes.data ?? [];
	const purchases30 = purchasesRes.data ?? [];
	const accounts = accountsRes.data ?? [];
	const names = namesRes.data ?? [];
	const yearSales = yearSalesRes.data ?? [];
	const yearPurchases = yearPurchasesRes.data ?? [];

	// Get bank account records
	const bankAccountRecords = accounts.filter((a: AccountRecord) => a.System === 'BK' || a.System === 'CC');

	// Build eval expressions for all balances we need
	const evalExprs: Record<string, string> = {
		currentAssets: balanceExpr('Type', 'CA'),
		currentLiabilities: balanceExpr('Type', 'CL'),
		receivables: balanceExpr('AccountCode', '1500'),
		payables: balanceExpr('AccountCode', '2500')
	};
	for (const bank of bankAccountRecords) {
		evalExprs[`bank_${bank.Code}`] = balanceExpr('AccountCode', bank.Code);
	}

	// Execute all balance queries in parallel
	const balanceResults = await apiEvalBatch(evalExprs, token);

	// Map bank balances
	const bankAccounts = bankAccountRecords.map((a: AccountRecord) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.System ?? '',
		balance: parseNum(balanceResults[`bank_${a.Code}`] || '0')
	}));

	// GL-based receivables/payables
	const receivables = parseNum(balanceResults.receivables);
	const payables = Math.abs(parseNum(balanceResults.payables));

	// Current ratio from GL
	const currentAssets = parseNum(balanceResults.currentAssets);
	const currentLiabilities = Math.abs(parseNum(balanceResults.currentLiabilities));
	const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;

	// Period metrics for transaction table
	function periodMetrics(sales: TransactionRecord[], purchases: TransactionRecord[]) {
		const salesTotal = sumGross(sales);
		const purchasesTotal = sumGross(purchases);
		return {
			sales: salesTotal,
			cogs: purchasesTotal,
			grossMargin: salesTotal - purchasesTotal,
			marginPct: salesTotal > 0 ? ((salesTotal - purchasesTotal) / salesTotal) * 100 : 0,
			invoiceCount: sales.length
		};
	}

	const salesToday = sales30.filter((t: TransactionRecord) => t.Transdate === today);
	const purchasesToday = purchases30.filter((t: TransactionRecord) => t.Transdate === today);
	const sales7 = sales30.filter((t: TransactionRecord) => t.Transdate >= sevenDaysAgo);
	const purchases7 = purchases30.filter((t: TransactionRecord) => t.Transdate >= sevenDaysAgo);

	// Debtor aging from Names table
	const debtors = {
		current: names.reduce((s: number, n: NameRecord) => s + (n.DCurrent ?? 0), 0),
		oneCycle: names.reduce((s: number, n: NameRecord) => s + (n.D30Plus ?? 0), 0),
		twoCycles: names.reduce((s: number, n: NameRecord) => s + (n.D60Plus ?? 0), 0),
		threeOrMore: names.reduce((s: number, n: NameRecord) => s + (n.D90Plus ?? 0), 0)
	};

	// Monthly profit chart
	const profitChart = months.map((m) => {
		const mSales = yearSales.filter((t: TransactionRecord) => {
			const td = (t.Transdate ?? '').replace(/-/g, '');
			return td >= m.start && td <= m.end;
		});
		const mPurchases = yearPurchases.filter((t: TransactionRecord) => {
			const td = (t.Transdate ?? '').replace(/-/g, '');
			return td >= m.start && td <= m.end;
		});
		const income = sumGross(mSales);
		const expenses = sumGross(mPurchases);
		return { label: m.label, income, expenses, profit: income - expenses };
	});

	return {
		date: today,
		periods: {
			today: periodMetrics(salesToday, purchasesToday),
			sevenDay: periodMetrics(sales7, purchases7),
			thirtyDay: periodMetrics(sales30, purchases30)
		},
		balances: { receivables, payables, bankAccounts },
		debtors,
		currentRatio,
		profitChart
	};
};

function emptyDashboard(date: string) {
	return {
		date,
		periods: {
			today: { sales: 0, cogs: 0, grossMargin: 0, marginPct: 0, invoiceCount: 0 },
			sevenDay: { sales: 0, cogs: 0, grossMargin: 0, marginPct: 0, invoiceCount: 0 },
			thirtyDay: { sales: 0, cogs: 0, grossMargin: 0, marginPct: 0, invoiceCount: 0 }
		},
		balances: { receivables: 0, payables: 0, bankAccounts: [] },
		debtors: { current: 0, oneCycle: 0, twoCycles: 0, threeOrMore: 0 },
		currentRatio: 0,
		profitChart: []
	};
}
