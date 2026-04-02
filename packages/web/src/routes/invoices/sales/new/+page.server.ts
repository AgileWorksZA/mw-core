import { apiGet } from '$lib/api/client';
import type { ApiResponse, AccountRecord, NameRecord, TaxRateRecord, ProductRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let accountsRes: ApiResponse<AccountRecord[]>;
	let namesRes: ApiResponse<NameRecord[]>;
	let taxRes: ApiResponse<TaxRateRecord[]>;
	let productsRes: ApiResponse<ProductRecord[]>;

	try {
		[accountsRes, namesRes, taxRes, productsRes] = await Promise.all([
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 }),
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, filter: 'CustomerType>="1"', limit: 500 }),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token, limit: 100 }),
			apiGet<ApiResponse<ProductRecord[]>>('/tables/product', { token, limit: 500 })
		]);
	} catch {
		return { customers: [], taxCodes: [], accounts: [], products: [] };
	}

	const customers = (namesRes.data ?? []).map((n) => ({
		code: n.Code,
		name: n.Name
	}));

	const taxCodes = (taxRes.data ?? []).map((t: any) => {
		const rate = t.Rate2 || t.Rate1 || 0;
		const label = rate > 0 ? `${rate}%` : 'Zero';
		return { code: t.TaxCode ?? t.Code ?? '', description: label, rate };
	});

	const accounts = (accountsRes.data ?? []).map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.Type ?? ''
	}));

	const products = (productsRes.data ?? []).map((p) => ({
		code: p.Code,
		description: p.Description ?? '',
		sellPrice: p.Sellprice ?? 0,
		taxCode: p.Taxcode ?? ''
	}));

	return { customers, taxCodes, accounts, products };
};
