import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Show open purchase orders that can receive goods
	let poRes: ApiResponse<TransactionRecord[]>;
	try {
		poRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="PO"', limit: 200
		});
	} catch {
		return { orders: [] };
	}

	const orders = (poRes.data ?? []).map((t) => ({
		seq: t.Sequencenumber ?? 0, ref: t.Ourref ?? '',
		name: t.Tofrom ?? t.Namecode ?? '',
		description: t.Description ?? '', date: t.Transdate ?? '',
		dueDate: t.Duedate ?? '', gross: t.Gross ?? 0
	}));

	return { orders };
};
