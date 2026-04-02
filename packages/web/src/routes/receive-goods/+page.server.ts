import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, DetailRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const selectedPO = url.searchParams.get('po') || '';

	// Fetch open purchase orders
	let poRes: ApiResponse<TransactionRecord[]>;
	try {
		poRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="PO" AND Status<>"P"', limit: 200
		});
	} catch {
		return { orders: [], selectedPO: '', poHeader: null, poLines: [] };
	}

	const orders = (poRes.data ?? []).map((t) => ({
		seq: t.Sequencenumber ?? 0,
		ref: t.Ourref ?? '',
		name: t.Tofrom ?? t.Namecode ?? '',
		description: t.Description ?? '',
		date: t.Transdate ?? '',
		dueDate: t.Duedate ?? '',
		gross: t.Gross ?? 0,
		status: t.Status ?? ''
	}));

	if (!selectedPO) {
		return { orders, selectedPO: '', poHeader: null, poLines: [] };
	}

	// Fetch the selected PO details
	const po = orders.find((o) => o.ref === selectedPO);
	if (!po) {
		return { orders, selectedPO, poHeader: null, poLines: [] };
	}

	// Fetch detail lines for this PO
	let detailRes: ApiResponse<DetailRecord[]>;
	try {
		detailRes = await apiGet<ApiResponse<DetailRecord[]>>('/tables/detail', {
			token,
			filter: `TransSeq=${po.seq}`,
			limit: 100
		});
	} catch {
		return { orders, selectedPO, poHeader: po, poLines: [] };
	}

	const poLines = (detailRes.data ?? []).map((d) => ({
		stockCode: d.StockCode ?? '',
		description: d.Description ?? '',
		qty: d.StockQty ?? 0,
		unitPrice: d.UnitPrice ?? 0,
		gross: d.Gross ?? 0,
		account: d.Account ?? '',
		taxCode: d.TaxCode ?? ''
	}));

	return { orders, selectedPO, poHeader: po, poLines };
};
