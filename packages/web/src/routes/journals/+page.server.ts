import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="JN"', limit: 500
		});
	} catch {
		return { journals: [], summary: { total: 0, totalGross: 0, posted: 0 } };
	}

	const all = txRes.data ?? [];
	const journals = all.map((t) => ({
		seq: t.Sequencenumber ?? 0, ref: t.Ourref ?? '',
		description: t.Description ?? '', date: t.Transdate ?? '',
		period: t.Period ?? 0, gross: t.Gross ?? 0,
		status: t.Status ?? '', recurring: t.Recurring ?? false
	}));

	return {
		journals,
		summary: {
			total: journals.length,
			totalGross: journals.reduce((s, j) => s + Math.abs(j.gross), 0),
			posted: journals.filter((j) => j.status === 'P').length
		}
	};
};
