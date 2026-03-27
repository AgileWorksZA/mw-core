import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function formatDate(d: Date): string {
	return d.toISOString().split('T')[0];
}

function sumGross(txs: TransactionRecord[]): number {
	return txs.reduce((s, t) => s + (t.Gross ?? 0), 0);
}

function parseNum(s: string): number {
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

function balanceExpr(field: string, value: string): string {
	return `GetBalance("${field}=\\"${value}\\"", Today())`;
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;
	const now = new Date();
	const today = formatDate(now);
	const sevenDaysAgo = formatDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
	const thirtyDaysAgo = formatDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

	// Fetch transactions + GL balances in parallel
	let salesRes: any, purchasesRes: any, otherIncomeRes: any, expensesRes: any, ordersRes: any;
	try {
		[salesRes, purchasesRes, otherIncomeRes, expensesRes, ordersRes] = await Promise.all([
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Type,2)="DI" AND Transdate>="${thirtyDaysAgo}"`, limit: 2000
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Type,2)="CI" AND Transdate>="${thirtyDaysAgo}"`, limit: 2000
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Type,2)="JN" AND Transdate>="${thirtyDaysAgo}"`, limit: 500
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Type,2)="CP" AND Transdate>="${thirtyDaysAgo}"`, limit: 2000
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Type,2)="SO" AND Transdate>="${thirtyDaysAgo}"`, limit: 500
			}).catch(() => ({ data: [] }))
		]);
	} catch {
		return emptyData(today);
	}

	const sales = salesRes.data ?? [];
	const purchases = purchasesRes.data ?? [];
	const orders = ordersRes.data ?? [];

	// GL balances for balance sheet section
	const balances = await apiEvalBatch({
		bank: balanceExpr('Type', 'CA'),
		receivables: balanceExpr('AccountCode', '1500'),
		payables: balanceExpr('AccountCode', '2500')
	}, token);

	// Compute metrics for each period
	function periodMetrics(txs: TransactionRecord[], dateFilter: string) {
		return txs.filter((t) => (t.Transdate ?? '') >= dateFilter);
	}

	function computeRow(salesTxs: TransactionRecord[], purchasesTxs: TransactionRecord[], ordersTxs: TransactionRecord[]) {
		const salesTotal = sumGross(salesTxs);
		const cogsTotal = sumGross(purchasesTxs);
		const grossMargin = salesTotal - cogsTotal;
		const marginPct = salesTotal > 0 ? (grossMargin / salesTotal) * 100 : 0;
		const ordersBooked = sumGross(ordersTxs);
		return { sales: salesTotal, cogs: cogsTotal, grossMargin, marginPct, ordersBooked };
	}

	const todayRow = computeRow(
		periodMetrics(sales, today),
		periodMetrics(purchases, today),
		periodMetrics(orders, today)
	);
	const sevenDayRow = computeRow(
		periodMetrics(sales, sevenDaysAgo),
		periodMetrics(purchases, sevenDaysAgo),
		periodMetrics(orders, sevenDaysAgo)
	);
	const thirtyDayRow = computeRow(sales, purchases, orders);

	return {
		date: today,
		periods: { today: todayRow, sevenDay: sevenDayRow, thirtyDay: thirtyDayRow },
		balances: {
			bank: parseNum(balances.bank),
			receivables: parseNum(balances.receivables),
			payables: Math.abs(parseNum(balances.payables))
		}
	};
};

function emptyData(date: string) {
	const empty = { sales: 0, cogs: 0, grossMargin: 0, marginPct: 0, ordersBooked: 0 };
	return {
		date,
		periods: { today: empty, sevenDay: empty, thirtyDay: empty },
		balances: { bank: 0, receivables: 0, payables: 0 }
	};
}
