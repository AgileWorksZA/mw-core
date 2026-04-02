import { apiGet } from '$lib/api/client';
import type { ApiResponse, AccountRecord, TaxRateRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let accountsRes: ApiResponse<AccountRecord[]>;
	let taxRes: ApiResponse<TaxRateRecord[]>;

	try {
		[accountsRes, taxRes] = await Promise.all([
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 }),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token, limit: 100 })
		]);
	} catch {
		return { accounts: [], taxCodes: [] };
	}

	const accounts = (accountsRes.data ?? []).map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.Type ?? ''
	}));

	const taxCodes = (taxRes.data ?? []).map((t: any) => {
		const rate = t.Rate2 || t.Rate1 || 0;
		const label = rate > 0 ? `${rate}%` : 'Zero';
		return { code: t.TaxCode ?? t.Code ?? '', description: label, rate };
	});

	return { accounts, taxCodes };
};
