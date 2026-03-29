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
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', { token, filter: 'SupplierType>="1"', limit: 500 }),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token, limit: 100 }),
			apiGet<ApiResponse<ProductRecord[]>>('/tables/product', { token, limit: 500 })
		]);
	} catch {
		return { bankAccounts: [], suppliers: [], taxCodes: [], accounts: [], products: [] };
	}

	const allAccounts = accountsRes.data ?? [];
	const bankRecords = allAccounts.filter((a) => a.System === 'BK' || a.System === 'CC');

	const balanceExprs: Record<string, string> = {};
	for (const a of bankRecords) {
		const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
		balanceExprs[a.Code] = `GetBalance("AccountCode=\\"${a.Code}\\"", "${today}")`;
	}
	const balances = await apiEvalBatch(balanceExprs, token);

	const bankAccounts = bankRecords.map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.System ?? '',
		balance: parseNum(balances[a.Code] || '0')
	}));

	const suppliers = (namesRes.data ?? []).map((n) => ({
		code: n.Code,
		name: n.Name
	}));

	const taxCodes = (taxRes.data ?? []).map((t: any) => {
		const rate = t.Rate2 || t.Rate1 || 0;
		const label = rate > 0 ? `${rate}%` : 'Zero';
		return { code: t.TaxCode ?? t.Code ?? '', description: label, rate };
	});

	const accounts = allAccounts.map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.Type ?? ''
	}));

	const products = (productsRes.data ?? []).map((p) => ({
		code: p.Code,
		description: p.Description ?? '',
		sellPrice: p.Sellprice ?? 0,
		buyPrice: p.Buyprice ?? 0,
		unit: p.Sellunit ?? '',
		taxCode: p.Selltaxcodeoverride ?? ''
	}));

	return { bankAccounts, suppliers, taxCodes, accounts, products };
};
