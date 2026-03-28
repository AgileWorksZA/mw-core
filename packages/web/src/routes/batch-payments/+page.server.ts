import { apiGet } from '$lib/api/client';
import type { ApiResponse, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
			token, filter: 'SupplierType>="2"', limit: 200
		});
	} catch {
		return { creditors: [] };
	}

	const creditors = (namesRes.data ?? [])
		.map((n) => {
			const owed = n.CCurrent ?? 0;
			return { code: n.Code ?? '', name: n.Name ?? '', owed };
		})
		.filter((c) => c.owed > 0.01)
		.sort((a, b) => b.owed - a.owed);

	return { creditors };
};
