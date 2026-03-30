import { json } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const { customerCodes, statementDate, omitZero, omitCredit, message } = body as {
		customerCodes: string[];
		statementDate: string;
		omitZero: boolean;
		omitCredit: boolean;
		message: string;
	};

	if (!customerCodes?.length) {
		return json({ error: 'Select at least one customer' }, { status: 400 });
	}

	// Fetch outstanding transactions for each customer
	const statements = [];

	for (const code of customerCodes) {
		try {
			const res = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `Namecode="${code}" AND left(Type,2)="DI" AND Status="P"`,
				limit: 200
			});

			const txns = (res.data ?? []).map((t) => {
				const outstanding = (t.Gross ?? 0) - (t.Amtpaid ?? 0) - (t.Amtwrittenoff ?? 0);
				return {
					ref: t.Ourref ?? '', date: t.Transdate ?? '',
					dueDate: t.Duedate ?? '', description: t.Description ?? '',
					gross: t.Gross ?? 0, paid: t.Amtpaid ?? 0, outstanding
				};
			}).filter((t) => t.outstanding > 0.005);

			const total = txns.reduce((s, t) => s + t.outstanding, 0);

			if (omitZero && Math.abs(total) < 0.01) continue;
			if (omitCredit && total < 0) continue;

			statements.push({
				code, transactions: txns, total,
				statementDate, message
			});
		} catch { /* skip failures */ }
	}

	return json({ statements, count: statements.length });
};
