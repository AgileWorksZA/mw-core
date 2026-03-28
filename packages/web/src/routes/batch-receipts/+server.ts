import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const { receipts, bankAccount, receiptDate } = body as {
		receipts: Array<{ code: string; name: string; amount: number }>;
		bankAccount: string;
		receiptDate: string;
	};

	if (!receipts?.length || !bankAccount) {
		return json({ error: 'No receipts to process' }, { status: 400 });
	}

	const mwDate = receiptDate?.replace(/-/g, '') || new Date().toISOString().slice(0, 10).replace(/-/g, '');

	const records = [];
	for (const r of receipts) {
		if (r.amount <= 0) continue;
		records.push({
			Type: 'REC',
			Status: 'P',
			Transdate: mwDate,
			Namecode: r.code,
			Gross: r.amount,
			Contra: bankAccount,
			Description: `Receipt from ${r.name}`
		});
	}

	if (records.length === 0) {
		return json({ error: 'No valid receipt amounts' }, { status: 400 });
	}

	try {
		const result = await apiPost('/tables/transaction/import', {
			records,
			mode: 'insert',
			validate: true
		}, token);
		return json({ success: true, count: records.length, result });
	} catch (err: any) {
		return json({ error: err.message || 'Batch receipt failed' }, { status: 500 });
	}
};
