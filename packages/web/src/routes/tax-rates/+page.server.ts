import { apiGet } from '$lib/api/client';
import type { ApiResponse, TaxRateRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let taxRes: ApiResponse<TaxRateRecord[]>;
	try {
		taxRes = await apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token, limit: 100 });
	} catch {
		return { taxRates: [] };
	}

	const taxRates = (taxRes.data ?? []).map((t) => ({
		code: t.TaxCode ?? t.Code ?? '',
		description: t.Description ?? '',
		rate: t.Rate ?? 0,
		receivedAccount: t.ReceivedAccount ?? '',
		paidAccount: t.PaidAccount ?? ''
	}));

	return { taxRates };
};
