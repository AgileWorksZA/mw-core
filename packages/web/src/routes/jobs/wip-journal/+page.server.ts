import { apiGet } from '$lib/api/client';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let companyRes: any;

	try {
		companyRes = await apiGet<{ data: any }>('/company', { token });
	} catch {
		return { currentPeriod: 0, periodsInYear: 12 };
	}

	return {
		currentPeriod: companyRes.data?.accounting?.currentPeriod ?? 0,
		periodsInYear: companyRes.data?.accounting?.periodsInYear ?? 12,
	};
};
