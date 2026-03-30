import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();
	const { action } = body as { action: string };

	if (action === 'cancel') {
		// Cancel Transaction: create a reversal entry
		const { seq, type, gross, contra, nameCode, description, date } = body;
		const mwDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

		const record: Record<string, any> = {
			Type: type,
			Transdate: mwDate,
			Gross: -gross,
			Contra: contra || '',
			Description: `Reversal of ${description || seq}`,
			Detail: [{
				Account: contra || '4000',
				Gross: -gross,
				Net: -gross,
				Tax: 0,
				TaxCode: 'Z',
				Description: `Reversal of ${description || seq}`
			}]
		};
		if (nameCode) record.Namecode = nameCode;

		try {
			const result = await apiPost('/tables/transaction/import', {
				records: [record], mode: 'insert', validate: true
			}, token);
			return json({ success: true, result });
		} catch (err: any) {
			return json({ error: err.message || 'Cancellation failed' }, { status: 500 });
		}
	}

	if (action === 'writeoff') {
		// Write Off: post a journal to bad debts account
		const { seq, ref, nameCode, outstanding } = body;
		const mwDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

		const record: Record<string, any> = {
			Type: 'JN',
			Transdate: mwDate,
			Gross: 0,
			Description: `Write off bad debt: ${ref} (${nameCode})`,
			Detail: [
				{ Account: '7300', Gross: outstanding, Net: outstanding, Tax: 0, TaxCode: 'Z', Description: `Bad debt: ${ref}` },
				{ Account: '1500', Gross: -outstanding, Net: -outstanding, Tax: 0, TaxCode: 'Z', Description: `Write off: ${ref}` }
			]
		};

		try {
			const result = await apiPost('/tables/transaction/import', {
				records: [record], mode: 'insert', validate: true
			}, token);
			return json({ success: true, result });
		} catch (err: any) {
			return json({ error: err.message || 'Write-off failed' }, { status: 500 });
		}
	}

	if (action === 'refund-debtor') {
		// Send Refund to Debtor: create a payment (CP)
		const { nameCode, amount, bankAccount } = body;
		const mwDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

		const record: Record<string, any> = {
			Type: 'CP',
			Transdate: mwDate,
			Namecode: nameCode,
			Gross: amount,
			Contra: bankAccount || '1000',
			Description: `Refund to debtor ${nameCode}`,
			Detail: [{
				Account: '1500', Gross: amount, Net: amount, Tax: 0, TaxCode: 'Z',
				Description: `Refund to ${nameCode}`
			}]
		};

		try {
			const result = await apiPost('/tables/transaction/import', {
				records: [record], mode: 'insert', validate: true
			}, token);
			return json({ success: true, result });
		} catch (err: any) {
			return json({ error: err.message || 'Refund failed' }, { status: 500 });
		}
	}

	if (action === 'refund-creditor') {
		// Receive Refund from Creditor: create a receipt (CR)
		const { nameCode, amount, bankAccount } = body;
		const mwDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

		const record: Record<string, any> = {
			Type: 'CR',
			Transdate: mwDate,
			Namecode: nameCode,
			Gross: amount,
			Contra: bankAccount || '1000',
			Description: `Refund from creditor ${nameCode}`,
			Detail: [{
				Account: '2000', Gross: amount, Net: amount, Tax: 0, TaxCode: 'Z',
				Description: `Refund from ${nameCode}`
			}]
		};

		try {
			const result = await apiPost('/tables/transaction/import', {
				records: [record], mode: 'insert', validate: true
			}, token);
			return json({ success: true, result });
		} catch (err: any) {
			return json({ error: err.message || 'Refund failed' }, { status: 500 });
		}
	}

	return json({ error: 'Unknown action' }, { status: 400 });
};
