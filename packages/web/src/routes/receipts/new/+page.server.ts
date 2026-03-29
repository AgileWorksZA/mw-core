import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord, NameRecord, TaxRateRecord, ProductRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number {
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

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
		return { bankAccounts: [], customers: [], taxCodes: [], accounts: [], products: [] };
	}

	const allAccounts = accountsRes.data ?? [];
	const bankRecords = allAccounts.filter((a) => a.System === 'BK' || a.System === 'CC');

	// Fetch bank balances
	const balanceExprs: Record<string, string> = {};
	for (const a of bankRecords) {
		balanceExprs[a.Code] = `GetBalance("AccountCode=\\"${a.Code}\\"", Today())`;
	}
	const balances = await apiEvalBatch(balanceExprs, token);

	const bankAccounts = bankRecords.map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.System ?? '',
		balance: parseNum(balances[a.Code] || '0')
	}));

	const customers = (namesRes.data ?? []).map((n) => ({
		code: n.Code,
		name: n.Name
	}));

	const taxCodes = (taxRes.data ?? []).map((t) => ({
		code: t.Code,
		description: t.Description ?? t.Ratename ?? '',
		rate: t.Rate ?? 0
	}));

	const accounts = allAccounts.map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.Type ?? ''
	}));

	const products = (productsRes.data ?? []).map((p) => ({
		code: p.Code,
		description: p.Description ?? '',
		sellPrice: p.Sellprice ?? 0,
		unit: p.Sellunit ?? '',
		taxCode: p.Selltaxcodeoverride ?? ''
	}));

	return { bankAccounts, customers, taxCodes, accounts, products };
};
