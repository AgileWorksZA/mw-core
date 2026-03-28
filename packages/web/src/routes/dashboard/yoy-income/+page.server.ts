import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function sumGross(txs: TransactionRecord[]): number {
	return txs.reduce((s, t) => s + (t.Gross ?? 0), 0);
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Fetch all sales invoices (up to 3 years back)
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 5000
		});
	} catch {
		return { years: [] };
	}

	const all = txRes.data ?? [];

	// Group by fiscal year and month
	// MW periods: 3-digit number where first digit(s) = year offset, last 2 = month
	const periodMap = new Map<number, { period: number; gross: number }[]>();
	for (const t of all) {
		const period = t.Period ?? 0;
		const yearKey = Math.floor(period / 100);
		if (!periodMap.has(yearKey)) periodMap.set(yearKey, []);
		periodMap.get(yearKey)!.push({ period: period % 100, gross: t.Gross ?? 0 });
	}

	// Build yearly series with cumulative monthly totals
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const colors = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#8b5cf6'];

	const yearKeys = Array.from(periodMap.keys()).sort();
	const years = yearKeys.map((yearKey, idx) => {
		const entries = periodMap.get(yearKey)!;
		// Aggregate by month within the year
		const monthTotals = new Array(12).fill(0);
		for (const e of entries) {
			const monthIdx = (e.period - 1) % 12;
			if (monthIdx >= 0 && monthIdx < 12) monthTotals[monthIdx] += e.gross;
		}
		// Cumulative
		const cumulative: number[] = [];
		let running = 0;
		for (let i = 0; i < 12; i++) {
			running += monthTotals[i];
			cumulative.push(running);
		}
		return {
			label: `Year ${yearKey}`,
			color: colors[idx % colors.length],
			data: cumulative
		};
	});

	return { years, months };
};
