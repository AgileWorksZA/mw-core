import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token,
			filter: 'left(Type,2)="CR"',
			limit: 500
		});
	} catch {
		return { receipts: [], summary: { total: 0, totalGross: 0 } };
	}

	const all = txRes.data ?? [];

	const receipts = all.map((t) => ({
		seq: t.Sequencenumber ?? 0,
		ref: t.Ourref ?? '',
		nameCode: t.Namecode ?? '',
		name: t.Tofrom ?? t.Namecode ?? '',
		description: t.Description ?? '',
		date: t.Transdate ?? '',
		period: t.Period ?? 0,
		gross: t.Gross ?? 0,
		bank: t.Contra ?? '',
		status: t.Status ?? ''
	}));

	return {
		receipts,
		summary: {
			total: receipts.length,
			totalGross: receipts.reduce((s, r) => s + r.gross, 0)
		}
	};
};
