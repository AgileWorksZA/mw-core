import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, NameRecord } from '$lib/api/types';
import { TX_TYPE_LABELS } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const nameCode = url.searchParams.get('name') || '';
	const token = locals.token;

	if (!nameCode) {
		// Return empty state — user needs to select a customer
		return { nameCode: '', customer: null, invoices: [], monthly: [] };
	}

	let nameRes: ApiResponse<NameRecord[]>;
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		[nameRes, txRes] = await Promise.all([
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
				token,
				filter: `Code="${nameCode}"`
			}),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `left(Type,2)="DI" AND Namecode="${nameCode}"`,
				limit: 500
			})
		]);
	} catch {
		return { nameCode, customer: null, invoices: [], monthly: [] };
	}

	const customer = nameRes.data[0]
		? { code: nameRes.data[0].Code, name: nameRes.data[0].Name }
		: null;

	const invoices = txRes.data.map((t) => ({
		ref: t.Ourref ?? '',
		date: t.Transdate ?? '',
		description: t.Description ?? '',
		gross: t.Gross ?? 0,
		amtPaid: t.Amtpaid ?? 0,
		outstanding: (t.Gross ?? 0) - (t.Amtpaid ?? 0),
		status: t.Status ?? '',
		period: t.Period ?? 0,
		type: (t.Type ?? '').substring(0, 2)
	}));

	// Aggregate by period for monthly view
	const periodMap = new Map<number, number>();
	for (const inv of invoices) {
		periodMap.set(inv.period, (periodMap.get(inv.period) ?? 0) + inv.gross);
	}
	const monthly = Array.from(periodMap.entries())
		.map(([period, value]) => ({ period, value }))
		.sort((a, b) => a.period - b.period);

	return { nameCode, customer, invoices, monthly };
};
