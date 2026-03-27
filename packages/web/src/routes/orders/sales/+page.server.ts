import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="SO"', limit: 500
		});
	} catch {
		return { orders: [], summary: { total: 0, totalGross: 0 } };
	}

	const all = txRes.data ?? [];
	const orders = all.map((t) => ({
		seq: t.Sequencenumber ?? 0, ref: t.Ourref ?? '', orderRef: t.Theirref ?? '',
		nameCode: t.Namecode ?? '', name: t.Tofrom ?? t.Namecode ?? '',
		description: t.Description ?? '', date: t.Transdate ?? '',
		dueDate: t.Duedate ?? '', gross: t.Gross ?? 0,
		hold: t.Hold ?? false, colour: t.Colour ?? 0
	}));

	return {
		orders,
		summary: { total: orders.length, totalGross: orders.reduce((s, o) => s + o.gross, 0) }
	};
};
