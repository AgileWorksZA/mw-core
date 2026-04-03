import { apiGet } from '$lib/api/client';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let jobsRes: any;
	let productsRes: any;

	try {
		[jobsRes, productsRes] = await Promise.all([
			apiGet<ApiResponse<any[]>>('/tables/job', {
				token,
				filter: 'Status="A"',
				limit: 500
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<any[]>>('/tables/product', {
				token,
				filter: 'Type="S" OR Type="T"',
				limit: 500
			}).catch(() => ({ data: [] }))
		]);
	} catch {
		return { jobs: [], resources: [] };
	}

	const jobs = (jobsRes.data ?? []).map((j: any) => ({
		code: j.Code ?? '',
		name: j.Name || j.Description || '',
	}));

	const resources = (productsRes.data ?? []).map((p: any) => ({
		code: p.Code ?? '',
		description: p.Description ?? '',
		sellPrice: p.Sellprice ?? 0,
		costPrice: p.Costprice ?? 0,
		unit: p.Sellunit ?? '',
	}));

	return { jobs, resources };
};
