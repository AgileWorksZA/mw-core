import { apiGet } from '$lib/api/client';
import type { ApiResponse, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let namesRes: ApiResponse<NameRecord[]>;
	try {
		namesRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
			token, filter: 'CustomerType>="2"', limit: 500
		});
	} catch {
		return { customers: [] };
	}

	const customers = (namesRes.data ?? []).map((n) => {
		const balance = (n.DCurrent ?? 0) + (n.D30Plus ?? 0) + (n.D60Plus ?? 0) + (n.D90Plus ?? 0);
		return {
			code: n.Code, name: n.Name, balance,
			email: n.Email || n.email || ''
		};
	});

	return { customers };
};
