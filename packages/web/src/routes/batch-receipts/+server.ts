import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();
	const { action } = body;

	if (action === 'enter') {
		// Enter a single receipt
		const { nameCode, amount, bankAccount, receiptDate, description, allocations } = body;

		if (!nameCode || !amount || amount <= 0 || !bankAccount) {
			return json({ error: 'Name, amount, and bank account are required' }, { status: 400 });
		}

		const mwDate = receiptDate?.replace(/-/g, '') || new Date().toISOString().slice(0, 10).replace(/-/g, '');

		const detail: Array<Record<string, any>> = [];
		if (allocations?.length > 0) {
			for (const alloc of allocations as Array<{ invoice: string; amount: number }>) {
				if (alloc.amount <= 0) continue;
				detail.push({
					Account: '1500', Gross: alloc.amount, Net: alloc.amount,
					Tax: 0, TaxCode: 'Z', Description: `Invoice ${alloc.invoice}`
				});
			}
		} else {
			detail.push({
				Account: '1500', Gross: amount, Net: amount,
				Tax: 0, TaxCode: 'Z', Description: description || `Receipt from ${nameCode}`
			});
		}

		const record: Record<string, any> = {
			Type: 'CR', Transdate: mwDate, Namecode: nameCode,
			Gross: amount, Contra: bankAccount,
			Description: description || `Receipt from ${nameCode}`,
			Detail: detail
		};

		try {
			const result = await apiPost('/tables/transaction/import', {
				records: [record], mode: 'insert', validate: true
			}, token);
			return json({ success: true, result });
		} catch (err: any) {
			return json({ error: err.message || 'Receipt failed' }, { status: 500 });
		}
	}

	if (action === 'accept') {
		// Accept finalizes the batch — receipts are already created individually via 'enter'
		return json({ success: true, message: 'Batch accepted' });
	}

	// Legacy: batch mode (keep backward compat)
	const { receipts, bankAccount, receiptDate } = body as {
		receipts: Array<{ code: string; name: string; amount: number }>;
		bankAccount: string; receiptDate: string;
	};

	if (!receipts?.length || !bankAccount) {
		return json({ error: 'No receipts to process' }, { status: 400 });
	}

	const mwDate = receiptDate?.replace(/-/g, '') || new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const records = [];
	for (const r of receipts) {
		if (r.amount <= 0) continue;
		records.push({
			Type: 'CR', Transdate: mwDate, Namecode: r.code,
			Gross: r.amount, Contra: bankAccount,
			Description: `Receipt from ${r.name}`,
			Detail: [{
				Account: '1500', Gross: r.amount, Net: r.amount,
				Tax: 0, TaxCode: 'Z', Description: `Receipt from ${r.name}`
			}]
		});
	}

	if (records.length === 0) {
		return json({ error: 'No valid receipt amounts' }, { status: 400 });
	}

	try {
		const result = await apiPost('/tables/transaction/import', {
			records, mode: 'insert', validate: true
		}, token);
		return json({ success: true, count: records.length, result });
	} catch (err: any) {
		return json({ error: err.message || 'Batch receipt failed' }, { status: 500 });
	}
};
