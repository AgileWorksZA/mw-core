import { apiGet } from '$lib/api/client';
import type { ApiResponse, TaxRateRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

interface CompanyData {
	name: string;
	address: { line1: string; line2: string; line3: string; line4: string };
	contact: { phone: string; fax: string; email: string; website: string };
	accounting: { periodsInYear: number; currentPeriod: number; baseCurrency: string; multiCurrencyEnabled: boolean };
	tax: { gstCycleMonths: number; gstRegistrationNumber: string };
	system: { version: string; platform: string };
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let companyRes: any;
	let taxRes: ApiResponse<TaxRateRecord[]>;
	try {
		[companyRes, taxRes] = await Promise.all([
			apiGet<{ data: CompanyData }>('/company', { token }),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token, limit: 50 })
		]);
	} catch {
		return { company: null, taxRates: [] };
	}

	const company = companyRes.data ?? null;
	const taxRates = (taxRes.data ?? []).map((t) => ({
		code: t.TaxCode ?? t.Code ?? '',
		description: t.Description ?? '',
		rate: t.Rate ?? 0
	}));

	return { company, taxRates };
};
