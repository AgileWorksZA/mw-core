import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const status = url.searchParams.get('status') || 'all';
	const today = new Date().toISOString().split('T')[0];

	const filters: string[] = ['left(Type,2)="DI"'];
	if (status === 'posted') filters.push('Status="P"');
	else if (status === 'unposted') filters.push('Status="U"');

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token,
			filter: filters.join(' AND '),
			limit: 500
		});
	} catch {
		return { today, invoices: [], status, summary: { total: 0, posted: 0, unposted: 0, totalGross: 0, totalOutstanding: 0 } };
	}

	const all = txRes.data ?? [];

	const invoices = all.map((t) => {
		const gross = t.Gross ?? 0;
		const paid = t.Amtpaid ?? 0;
		const outstanding = gross - paid;
		const dueDate = t.Duedate ?? '';
		return {
			seq: t.Sequencenumber ?? 0,
			ref: t.Ourref ?? '',
			orderRef: t.Theirref ?? '',
			nameCode: t.Namecode ?? '',
			name: t.Tofrom ?? t.Namecode ?? '',
			description: t.Description ?? '',
			date: t.Transdate ?? '',
			dueDate,
			period: t.Period ?? 0,
			gross,
			paid,
			outstanding,
			status: t.Status ?? '',
			overdue: outstanding > 0.01 && dueDate !== '' && dueDate < today,
			colour: t.Colour ?? 0
		};
	});

	const posted = invoices.filter((i) => i.status === 'P').length;
	const totalGross = invoices.reduce((s, i) => s + i.gross, 0);
	const totalOutstanding = invoices.reduce((s, i) => s + i.outstanding, 0);

	return {
		today,
		invoices,
		status,
		summary: {
			total: invoices.length,
			posted,
			unposted: invoices.length - posted,
			totalGross,
			totalOutstanding
		}
	};
};
