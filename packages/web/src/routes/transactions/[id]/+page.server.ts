import { error } from '@sveltejs/kit';
import { apiGet, ApiError } from '$lib/api/client';
import type {
	ApiResponse,
	TransactionRecord,
	DetailRecord,
	NameRecord,
	TaxRateRecord,
	AccountRecord,
	ProductRecord,
	TransactionScreenData
} from '$lib/api/types';
import { TX_TYPE_LABELS } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }): Promise<TransactionScreenData> => {
	const id = params.id;
	const token = locals.token;

	// Phase 1: Fetch transaction + lookups in parallel
	let txRes, taxRatesRes, accountsRes, productsRes;
	let detailRes: ApiResponse<DetailRecord[]> = { data: [], metadata: {} as any };
	try {
		[txRes, taxRatesRes, accountsRes, productsRes] = await Promise.all([
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `Sequencenumber=${id}`
			}),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token }),
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token }),
			apiGet<ApiResponse<ProductRecord[]>>('/tables/product', {
				token,
				limit: 500
			})
		]);
	} catch (err) {
		console.error('Transaction BFF loader error:', err);
		if (err instanceof ApiError) {
			throw error(err.status === 401 ? 401 : 502, `API error: ${err.message}`);
		}
		throw error(500, `Failed to load transaction: ${err}`);
	}

	const tx = txRes.data[0];
	if (!tx) {
		throw error(404, `Transaction ${id} not found`);
	}

	// Fetch detail lines separately — may return 500 if no lines exist
	try {
		detailRes = await apiGet<ApiResponse<DetailRecord[]>>('/tables/detail', {
			token,
			filter: `detail.parentseq=${id}`
		});
	} catch {
		// No detail lines is normal for some transaction types
	}

	// Phase 2: Fetch the name record
	let nameData = { code: tx.Namecode ?? '', name: '', colour: 0 };
	if (tx.Namecode) {
		try {
			const nameRes = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
				token,
				filter: `Code="${tx.Namecode}"`
			});
			const n = nameRes.data[0];
			if (n) {
				nameData = { code: n.Code, name: n.Name, colour: n.Colour };
			}
		} catch {
			// Name lookup failure is non-fatal
		}
	}

	const accountMap = new Map(accountsRes.data.map((a) => [a.Code, a.Description]));
	const baseType = (tx.Type ?? '').substring(0, 2);
	const lines = detailRes.data ?? [];
	const totalTax = lines.reduce((sum, d) => sum + (d.Tax ?? 0), 0);
	const totalGross = lines.reduce((sum, d) => sum + (d.Gross ?? 0), 0);

	return {
		transaction: {
			header: {
				id: tx.Sequencenumber,
				type: baseType,
				typeLabel: TX_TYPE_LABELS[baseType] ?? tx.Type,
				status: tx.Status ?? '',
				ourRef: tx.Ourref ?? '',
				theirRef: tx.Theirref ?? '',
				date: tx.Transdate ?? '',
				dueDate: tx.Duedate ?? '',
				period: tx.Period ?? 0,
				colour: tx.Colour ?? 0,
				hold: tx.Hold ?? false,
				description: tx.Description ?? '',
				analysis: tx.Analysis ?? '',
				salesPerson: tx.Salesperson ?? '',
				contra: tx.Contra ?? '',
				paymentMethod: tx.Paymentmethod ?? 0,
				currency: tx.Currency ?? '',
				exchangeRate: tx.Exchangerate ?? 0,
				deliveryAddress: tx.Deliveryaddress ?? '',
				mailingAddress: tx.Mailingaddress ?? '',
				enteredBy: tx.Enteredby ?? '',
				postedBy: tx.Postedby ?? '',
				enterDate: tx.Enterdate ?? '',
				flag: tx.Flag ?? ''
			},
			name: nameData,
			lineItems: lines.map((d) => ({
				sort: d.Sort ?? 0,
				account: d.Account ?? '',
				accountDescription: accountMap.get(d.Account ?? '') ?? '',
				description: d.Description ?? '',
				debit: d.Debit ?? 0,
				credit: d.Credit ?? 0,
				tax: d.Tax ?? 0,
				gross: d.Gross ?? 0,
				stockCode: d.StockCode ?? '',
				stockQty: d.StockQty ?? 0,
				unitPrice: d.UnitPrice ?? 0,
				discount: d.Discount ?? 0,
				unit: d.SaleUnit ?? '',
				taxCode: d.TaxCode ?? '',
				jobCode: d.JobCode ?? ''
			})),
			totals: {
				subtotal: totalGross - totalTax,
				tax: totalTax,
				gross: tx.Gross ?? totalGross,
				amtPaid: tx.Amtpaid ?? 0,
				outstanding: (tx.Gross ?? 0) - (tx.Amtpaid ?? 0),
				lineCount: lines.length
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
			})),
			products: productsRes.data.map((p) => ({
				code: p.Code,
				description: p.Description,
				price: p.Sellprice,
				unit: p.Sellunit ?? ''
			}))
		}
	};
};
