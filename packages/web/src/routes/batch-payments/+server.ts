import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const { payments, bankAccount, paymentDate } = body as {
		payments: Array<{ code: string; name: string; amount: number }>;
		bankAccount: string;
		paymentDate: string;
	};

	if (!payments?.length || !bankAccount) {
		return json({ error: 'No payments to process' }, { status: 400 });
	}

	const mwDate = paymentDate?.replace(/-/g, '') || new Date().toISOString().slice(0, 10).replace(/-/g, '');

	const records = [];
	for (const p of payments) {
		if (p.amount <= 0) continue;
		records.push({
			Type: 'PAY',
			Status: 'P',
			Transdate: mwDate,
			Namecode: p.code,
			Gross: p.amount,
			Contra: bankAccount,
			Description: `Payment to ${p.name}`
		});
	}

	if (records.length === 0) {
		return json({ error: 'No valid payment amounts' }, { status: 400 });
	}

	try {
		const result = await apiPost('/tables/transaction/import', {
			records,
			mode: 'insert',
			validate: true
		}, token);
		return json({ success: true, count: records.length, result });
	} catch (err: any) {
		return json({ error: err.message || 'Batch payment failed' }, { status: 500 });
	}
};
