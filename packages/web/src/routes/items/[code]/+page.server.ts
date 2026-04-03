import { error } from '@sveltejs/kit';
import { apiGet, ApiError } from '$lib/api/client';
import type {
	ApiResponse,
	ProductRecord,
	TaxRateRecord,
	AccountRecord,
	ItemScreenData,
	TransactionRecord
} from '$lib/api/types';
import type { PageServerLoad } from './$types';

interface DetailRecord {
	Sequencenumber: number;
	Stockcode: string;
	Description: string;
	Quantity: number;
	Unitprice: number;
	Gross: number;
	Account: string;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const { code } = params;
	const token = locals.token;

	let productRes, taxRatesRes, accountsRes, detailRes;
	try {
		[productRes, taxRatesRes, accountsRes, detailRes] = await Promise.all([
			apiGet<ApiResponse<ProductRecord[]>>('/tables/product', {
				token,
				filter: `Code="${code}"`
			}),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token }),
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token }),
			apiGet<ApiResponse<DetailRecord[]>>('/tables/detail', {
				token,
				filter: `Stockcode="${code}"`,
				limit: 200
			}).catch(() => ({ data: [], metadata: { count: 0 } } as any))
		]);
	} catch (err) {
		if (err instanceof ApiError) {
			throw error(err.status === 401 ? 401 : 502, `API error: ${err.message}`);
		}
		throw error(500, `Failed to load item: ${err}`);
	}

	const p = productRes.data[0];
	if (!p) {
		throw error(404, `Item "${code}" not found`);
	}

	const accountMap = new Map(accountsRes.data.map((a) => [a.Code, a.Description]));

	// Flags bitmask: 1=WeBuy, 2=WeSell, 4=WeCount, 8=WeStock
	const flags = p.Flags ?? 0;

	return {
		item: {
			header: {
				code: p.Code,
				description: p.Description ?? '',
				type: p.Type ?? '',
				colour: p.Colour ?? 0,
				category1: p.Category1 ?? '',
				category2: p.Category2 ?? '',
				category3: p.Category3 ?? '',
				category4: p.Category4 ?? '',
				barcode: p.Barcode ?? '',
				comment: p.Comment ?? ''
			},
			flags: {
				weBuy: !!(flags & 2),
				weSell: !!(flags & 4),
				weCount: !!(flags & 8),
				weStock: !!(flags & 8)
			},
			controlAccounts: {
				salesAcct: p.Salesacct ?? '',
				salesAcctDesc: accountMap.get(p.Salesacct ?? '') ?? '',
				cogsAcct: p.Cogacct ?? '',
				cogsAcctDesc: accountMap.get(p.Cogacct ?? '') ?? '',
				stockAcct: p.Stockacct ?? '',
				stockAcctDesc: accountMap.get(p.Stockacct ?? '') ?? ''
			},
			buying: {
				supplier: p.Supplier ?? '',
				supplierCode: p.Supplierscode ?? '',
				buyPrice: p.Buyprice ?? 0,
				buyUnit: p.Buyunit ?? '',
				buyTaxCode: p.Buytaxcodeoverride ?? '',
				plussage: p.Plussage ?? 0,
				reorderLevel: p.Reorderlevel ?? 0,
				leadTimeDays: p.Leadtimedays ?? 0,
				conversionFactor: p.Conversionfactor ?? 0
			},
			selling: {
				sellPrice: p.Sellprice ?? 0,
				sellUnit: p.Sellunit ?? '',
				sellTaxCode: p.Selltaxcodeoverride ?? '',
				discount: p.Selldiscount ?? 0,
				marginWarning: p.Marginwarning ?? 0,
				sellWeight: p.Sellweight ?? 0,
				useMultiplePrices: !!(p.Usemultipleprices),
				priceB: p.Sellpriceb ?? 0,
				priceC: p.Sellpricec ?? 0,
				priceD: p.Sellpriced ?? 0,
				priceE: p.Sellpricee ?? 0,
				priceF: p.Sellpricef ?? 0
			},
			inventory: {
				stockOnHand: p.Stockonhand ?? 0,
				stockValue: p.Stockvalue ?? 0,
				costPrice: p.Costprice ?? 0
			}
		},
		lookups: {
			taxCodes: taxRatesRes.data.map((t) => ({
				code: t.TaxCode,
				name: t.Ratename,
				rate: t.Rate2 || t.Rate1
			})),
			accounts: accountsRes.data.map((a) => ({
				code: a.Code,
				description: a.Description,
				type: a.Type
			}))
		},
		// History: detail lines for this product
		history: ((detailRes?.data as DetailRecord[]) ?? []).map((d: any) => ({
			id: d.Sequencenumber ?? 0,
			type: (d.TransType ?? d.Type ?? '').substring(0, 2),
			ourRef: d.Ourref ?? d.Reference ?? '',
			date: d.Transdate ?? d.Date ?? '',
			nameCode: d.Namecode ?? '',
			description: d.Description ?? '',
			quantity: d.Quantity ?? 0,
			unitPrice: d.Unitprice ?? 0,
			gross: d.Gross ?? 0
		})),
		// Costing: derived from product fields
		costing: {
			costPrice: p.Costprice ?? 0,
			stockValue: p.Stockvalue ?? 0,
			stockOnHand: p.Stockonhand ?? 0,
			avgCost: (p.Stockonhand ?? 0) > 0 ? (p.Stockvalue ?? 0) / (p.Stockonhand ?? 1) : 0,
			buyPrice: p.Buyprice ?? 0,
			sellPrice: p.Sellprice ?? 0,
			margin: (p.Sellprice ?? 0) - (p.Costprice ?? 0),
			marginPercent: (p.Sellprice ?? 0) > 0
				? (((p.Sellprice ?? 0) - (p.Costprice ?? 0)) / (p.Sellprice ?? 1)) * 100
				: 0
		},
		// BOM: empty for now — MW BOM data not exposed via standard table API
		bom: []
	};
};
