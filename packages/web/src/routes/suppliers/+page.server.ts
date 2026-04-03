import { apiGet } from '$lib/api/client';
import type { ApiResponse, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const find = url.searchParams.get('find') || '';

	let baseFilter = 'SupplierType>="1"';
	if (find) baseFilter += ` AND ${find}`;

	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
			token, filter: baseFilter, limit: 500
		});
	} catch {
		return { suppliers: [], summary: { total: 0, creditors: 0, totalOwed: 0 } };
	}

	const all = namesRes.data ?? [];
	const suppliers = all.map((n) => {
		const owed = n.CCurrent ?? 0;
		return {
			code: n.Code ?? '', name: n.Name ?? '',
			phone: n.Phone ?? '', email: n.Email ?? '',
			category: n.Category ?? '',
			isCreditor: (n.SupplierType ?? 0) >= 2,
			owed
		};
	});

	return {
		suppliers,
		summary: {
			total: suppliers.length,
			creditors: suppliers.filter((s) => s.isCreditor).length,
			totalOwed: suppliers.reduce((s, sup) => s + sup.owed, 0)
		}
	};
};
