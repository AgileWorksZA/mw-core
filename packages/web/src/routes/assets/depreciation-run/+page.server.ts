import { apiGet } from '$lib/api/client';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let companyRes: any;
	let categoriesRes: any;

	try {
		[companyRes, categoriesRes] = await Promise.all([
			apiGet<{ data: any }>('/company', { token }),
			apiGet<ApiResponse<any[]>>('/tables/assetcategory', { token, limit: 100 })
				.catch(() => ({ data: [] }))
		]);
	} catch {
		return { currentPeriod: 0, periodsInYear: 12, categories: [] };
	}

	const categories = (categoriesRes.data ?? []).map((c: any) => ({
		code: c.Code ?? '',
		description: c.Description ?? '',
		depreciationType: c.DepreciationType ?? c.Type ?? '',
		rate: c.DepreciationRate ?? c.Rate ?? 0,
	}));

	return {
		currentPeriod: companyRes.data?.accounting?.currentPeriod ?? 0,
		periodsInYear: companyRes.data?.accounting?.periodsInYear ?? 12,
		categories,
	};
};
