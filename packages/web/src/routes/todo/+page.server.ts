import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;
	const today = new Date().toISOString().split('T')[0];

	// Fetch data for live badges in parallel
	let receivablesRes: any, payablesRes: any;
	try {
		[receivablesRes, payablesRes] = await Promise.all([
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 2000
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: 'left(Type,2)="CI" AND Status="P"', limit: 2000
			}).catch(() => ({ data: [] }))
		]);
	} catch {
		receivablesRes = { data: [] };
		payablesRes = { data: [] };
	}

	// Count overdue receivables
	const receivables = (receivablesRes.data ?? [])
		.filter((t: TransactionRecord) => {
			const outstanding = (t.Gross ?? 0) - (t.Amtpaid ?? 0);
			const dueDate = t.Duedate ?? '';
			return outstanding > 0.01 && dueDate !== '' && dueDate < today;
		}).length;

	// Count overdue payables
	const payables = (payablesRes.data ?? [])
		.filter((t: TransactionRecord) => {
			const outstanding = (t.Gross ?? 0) - (t.Amtpaid ?? 0);
			const dueDate = t.Duedate ?? '';
			return outstanding > 0.01 && dueDate !== '' && dueDate < today;
		}).length;

	return { today, overdueReceivables: receivables, overduePayables: payables };
};
