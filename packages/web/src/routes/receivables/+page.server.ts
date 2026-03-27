import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;
	const today = new Date().toISOString().split('T')[0];

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token,
			filter: 'left(Type,2)="DI" AND Status="P"',
			limit: 2000
		});
	} catch {
		return { today, invoices: [], summary: emptySummary() };
	}

	const all = txRes.data ?? [];

	// Filter to outstanding only (Gross - Amtpaid > 0.01)
	const invoices = all
		.filter((t) => ((t.Gross ?? 0) - (t.Amtpaid ?? 0)) > 0.01)
		.map((t) => {
			const gross = t.Gross ?? 0;
			const paid = t.Amtpaid ?? 0;
			const outstanding = gross - paid;
			const dueDate = t.Duedate ?? '';
			const overdue = dueDate !== '' && dueDate < today;
			return {
				ref: t.Ourref ?? '',
				nameCode: t.Namecode ?? '',
				name: t.Tofrom ?? t.Namecode ?? '',
				date: t.Transdate ?? '',
				dueDate,
				gross,
				paid,
				outstanding,
				overdue,
				period: t.Period ?? 0
			};
		})
		.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

	// Summary
	const totalOutstanding = invoices.reduce((s, i) => s + i.outstanding, 0);
	const overdueCount = invoices.filter((i) => i.overdue).length;
	const overdueAmount = invoices.filter((i) => i.overdue).reduce((s, i) => s + i.outstanding, 0);

	// Aging buckets based on due date
	const aging = { current: 0, thirtyPlus: 0, sixtyPlus: 0, ninetyPlus: 0 };
	for (const inv of invoices) {
		if (!inv.dueDate) { aging.current += inv.outstanding; continue; }
		const days = Math.floor((new Date(today).getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24));
		if (days <= 0) aging.current += inv.outstanding;
		else if (days <= 30) aging.thirtyPlus += inv.outstanding;
		else if (days <= 60) aging.sixtyPlus += inv.outstanding;
		else aging.ninetyPlus += inv.outstanding;
	}

	return {
		today,
		invoices,
		summary: {
			totalOutstanding,
			invoiceCount: invoices.length,
			overdueCount,
			overdueAmount,
			aging
		}
	};
};

function emptySummary() {
	return {
		totalOutstanding: 0,
		invoiceCount: 0,
		overdueCount: 0,
		overdueAmount: 0,
		aging: { current: 0, thirtyPlus: 0, sixtyPlus: 0, ninetyPlus: 0 }
	};
}
