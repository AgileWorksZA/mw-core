import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, AccountRecord, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function formatDate(d: Date): string {
	return d.toISOString().split('T')[0];
}

function sumGross(transactions: TransactionRecord[]): number {
	return transactions.reduce((sum, t) => sum + (t.Gross ?? 0), 0);
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;
	const now = new Date();
	const today = formatDate(now);
	const sevenDaysAgo = formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
	const thirtyDaysAgo = formatDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

	// Fetch data in parallel — all queries use table API
	let salesRes, purchasesRes, receiptsRes, paymentsRes, accountsRes, namesRes, companyRes;
	try {
		[salesRes, purchasesRes, receiptsRes, paymentsRes, accountsRes, namesRes] = await Promise.all([
			// Sales invoices in last 30 days
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="DI" AND Transdate>="${thirtyDaysAgo}"`,
				limit: 500
			}).catch(() => ({ data: [] }) as any),
			// Purchase invoices in last 30 days
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="CI" AND Transdate>="${thirtyDaysAgo}"`,
				limit: 500
			}).catch(() => ({ data: [] }) as any),
			// Receipts in last 30 days
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="CR" AND Transdate>="${thirtyDaysAgo}"`,
				limit: 500
			}).catch(() => ({ data: [] }) as any),
			// Payments in last 30 days
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="CP" AND Transdate>="${thirtyDaysAgo}"`,
				limit: 500
			}).catch(() => ({ data: [] }) as any),
			// Accounts for balance computation
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 }),
			// Names for debtor/creditor balances
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, limit: 500 })
		]);
	} catch {
		return {
			date: today,
			periods: { today: emptyPeriod(), sevenDay: emptyPeriod(), thirtyDay: emptyPeriod() },
			balances: { receivables: 0, payables: 0, bankAccounts: [] },
			debtors: { current: 0, oneCycle: 0, twoCycles: 0, threeOrMore: 0 }
		};
	}

	// Compute period-based transaction summaries
	const sales30 = salesRes.data ?? [];
	const purchases30 = purchasesRes.data ?? [];

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

	const salesToday = sales30.filter((t) => t.Transdate === today);
	const purchasesToday = purchases30.filter((t) => t.Transdate === today);
	const sales7 = sales30.filter((t) => t.Transdate >= sevenDaysAgo);
	const purchases7 = purchases30.filter((t) => t.Transdate >= sevenDaysAgo);

	// Compute debtor aging from Names
	const names = namesRes.data ?? [];
	const debtors = {
		current: names.reduce((s, n) => s + (n.DCurrent ?? 0), 0),
		oneCycle: names.reduce((s, n) => s + (n.D30Plus ?? 0), 0),
		twoCycles: names.reduce((s, n) => s + (n.D60Plus ?? 0), 0),
		threeOrMore: names.reduce((s, n) => s + (n.D90Plus ?? 0), 0)
	};

	// Receivables / Payables totals
	const receivables = names.reduce((s, n) => s + (n.DCurrent ?? 0) + (n.D30Plus ?? 0) + (n.D60Plus ?? 0) + (n.D90Plus ?? 0), 0);
	const payables = names.reduce((s, n) => s + (n.CCurrent ?? 0), 0);

	// Bank accounts
	const accounts = accountsRes.data ?? [];
	const bankAccounts = accounts
		.filter((a) => a.System === 'BK' || a.System === 'CC')
		.map((a) => ({ code: a.Code, description: a.Description ?? '', type: a.System ?? '' }));

	return {
		date: today,
		periods: {
			today: periodMetrics(salesToday, purchasesToday),
			sevenDay: periodMetrics(sales7, purchases7),
			thirtyDay: periodMetrics(sales30, purchases30)
		},
		balances: {
			receivables,
			payables,
			bankAccounts
		},
		debtors
	};
};

function emptyPeriod() {
	return { sales: 0, cogs: 0, grossMargin: 0, marginPct: 0, invoiceCount: 0 };
}
