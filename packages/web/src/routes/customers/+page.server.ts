import { apiGet } from '$lib/api/client';
import type { ApiResponse, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
			token, filter: 'CustomerType>="1"', limit: 500
		});
	} catch {
		return { customers: [], summary: { total: 0, debtors: 0, totalOwed: 0 } };
	}

	const all = namesRes.data ?? [];
	const customers = all.map((n) => {
		const owed = (n.DCurrent ?? 0) + (n.D30Plus ?? 0) + (n.D60Plus ?? 0) + (n.D90Plus ?? 0);
		return {
			code: n.Code ?? '', name: n.Name ?? '',
			phone: n.Phone ?? '', email: n.Email ?? '',
			category: n.Category ?? '',
			isDebtor: (n.CustomerType ?? 0) >= 2,
			owed
		};
	});

	return {
		customers,
		summary: {
			total: customers.length,
			debtors: customers.filter((c) => c.isDebtor).length,
			totalOwed: customers.reduce((s, c) => s + c.owed, 0)
		}
	};
};
