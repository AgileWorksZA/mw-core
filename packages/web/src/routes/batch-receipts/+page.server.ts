import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, AccountRecord, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number { const n = parseFloat(s); return isNaN(n) ? 0 : n; }

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
			token, filter: 'CustomerType>="2"', limit: 200
		});
	} catch {
		return { debtors: [] };
	}

	const debtors = (namesRes.data ?? [])
		.map((n) => {
			const owed = (n.DCurrent ?? 0) + (n.D30Plus ?? 0) + (n.D60Plus ?? 0) + (n.D90Plus ?? 0);
			return { code: n.Code ?? '', name: n.Name ?? '', owed };
		})
		.filter((d) => d.owed > 0.01)
		.sort((a, b) => b.owed - a.owed);

	return { debtors };
};
