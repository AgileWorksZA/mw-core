import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, NameRecord, AccountRecord, ProductRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let companyRes: any;
	let txRes: any, namesRes: any, accountsRes: any, productsRes: any;
	try {
		[companyRes, txRes, namesRes, accountsRes, productsRes] = await Promise.all([
			apiGet<any>('/company', { token }),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', { token, limit: 1 }),
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, limit: 1 }),
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 1 }),
			apiGet<ApiResponse<ProductRecord[]>>('/tables/product', { token, limit: 1 })
		]);
	} catch {
		return { company: null, stats: { transactions: 0, names: 0, accounts: 0, products: 0 } };
	}

	const company = companyRes.data ?? null;

	// Use metadata counts from responses
	const stats = {
		transactions: txRes.metadata?.count ?? 0,
		names: namesRes.metadata?.count ?? 0,
		accounts: accountsRes.metadata?.count ?? 0,
		products: productsRes.metadata?.count ?? 0
	};

	return { company, stats };
};
