import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Load data for all tabs in parallel
	let postedTxRes: ApiResponse<TransactionRecord[]>;
	let outstandingDIRes: ApiResponse<TransactionRecord[]>;
	let debtorsRes: ApiResponse<NameRecord[]>;
	let creditorsRes: ApiResponse<NameRecord[]>;

	try {
		[postedTxRes, outstandingDIRes, debtorsRes, creditorsRes] = await Promise.all([
			// Cancel Transaction: all posted transactions
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: 'Status="P"', limit: 500, orderBy: '-Transdate'
			}),
			// Write Off: outstanding sales invoices
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 500
			}),
			// Debtors (for refund)
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
				token, filter: 'CustomerType>="2"', limit: 500
			}),
			// Creditors (for refund)
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
				token, filter: 'SupplierType>="2"', limit: 500
			})
		]);
	} catch {
		return { postedTransactions: [], outstandingInvoices: [], debtors: [], creditors: [] };
	}

	const postedTransactions = (postedTxRes.data ?? []).map((t) => ({
		seq: t.Sequencenumber ?? 0,
		type: t.Type ?? '',
		ref: t.Ourref ?? '',
		description: t.Description ?? '',
		nameCode: t.Namecode ?? '',
		name: t.Tofrom ?? '',
		period: t.Period ?? 0,
		date: t.Transdate ?? '',
		gross: t.Gross ?? 0
	}));

	const outstandingInvoices = (outstandingDIRes.data ?? [])
		.filter((t) => {
			const outstanding = (t.Gross ?? 0) - (t.Amtpaid ?? 0) - (t.Amtwrittenoff ?? 0);
			return outstanding > 0.005;
		})
		.map((t) => ({
			seq: t.Sequencenumber ?? 0,
			ref: t.Ourref ?? '',
			nameCode: t.Namecode ?? '',
			name: t.Tofrom ?? '',
			description: t.Description ?? '',
			period: t.Period ?? 0,
			date: t.Transdate ?? '',
			gross: t.Gross ?? 0,
			outstanding: Math.round(((t.Gross ?? 0) - (t.Amtpaid ?? 0) - (t.Amtwrittenoff ?? 0)) * 100) / 100
		}));

	const debtors = (debtorsRes.data ?? [])
		.map((n) => {
			const owing = (n.DCurrent ?? 0) + (n.D30Plus ?? 0) + (n.D60Plus ?? 0) + (n.D90Plus ?? 0);
			return {
				code: n.Code, name: n.Name, category: n.Category ?? '',
				hold: n.Hold ?? false, phone: n.Phone ?? '', owing
			};
		});

	const creditors = (creditorsRes.data ?? [])
		.map((n) => ({
			code: n.Code, name: n.Name, category: n.Category ?? '',
			hold: n.Hold ?? false, phone: n.Phone ?? '', owed: n.CCurrent ?? 0
		}));

	return { postedTransactions, outstandingInvoices, debtors, creditors };
};
