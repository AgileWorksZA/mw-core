import { json } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const token = locals.token;
	const nameCode = url.searchParams.get('nameCode');
	const type = url.searchParams.get('type') || 'customer';

	if (!nameCode) {
		return json({ error: 'nameCode is required' }, { status: 400 });
	}

	// Customer = outstanding sales invoices (DI), Supplier = outstanding purchase invoices (CI)
	const typeFilter = type === 'supplier' ? 'left(Type,2)="CI"' : 'left(Type,2)="DI"';
	const filter = `Namecode="${nameCode}" AND ${typeFilter} AND Status="P"`;

	try {
		const res = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token,
			filter,
			limit: 500
		});

		const all = res.data ?? [];

		// Filter to only invoices with outstanding balance
		const outstanding = [];
		for (const t of all) {
			const gross = t.Gross ?? 0;
			const paid = t.Amtpaid ?? 0;
			const writtenOff = t.Amtwrittenoff ?? 0;
			const outstandingAmt = gross - paid - writtenOff;
			if (outstandingAmt > 0.005) {
				outstanding.push({
					seq: t.Sequencenumber ?? 0,
					invoice: t.Ourref ?? '',
					order: t.Theirref ?? '',
					description: t.Description ?? '',
					date: t.Transdate ?? '',
					gross,
					outstanding: Math.round(outstandingAmt * 100) / 100
				});
			}
		}

		return json({ invoices: outstanding });
	} catch (err: any) {
		return json({ error: err.message || 'Failed to fetch outstanding invoices' }, { status: 500 });
	}
};
