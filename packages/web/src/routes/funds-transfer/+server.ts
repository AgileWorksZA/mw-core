import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const { fromAccount, toAccount, amount, transferDate, reference, description } = body;

	if (!fromAccount || !toAccount || !amount || fromAccount === toAccount) {
		return json({ error: 'Invalid transfer parameters' }, { status: 400 });
	}

	// Format date as YYYYMMDD for MoneyWorks
	const mwDate = transferDate.replace(/-/g, '');

	// Create a journal entry: debit destination, credit source
	const records = [
		{
			Type: 'JNL',
			Status: 'P',
			Transdate: mwDate,
			Ourref: reference || `TFR-${Date.now()}`,
			Description: description || `Funds transfer: ${fromAccount} → ${toAccount}`,
			Contra: fromAccount,
			Detail: [
				{ Account: toAccount, Debit: amount, Credit: 0, Description: description || 'Funds transfer' },
				{ Account: fromAccount, Debit: 0, Credit: amount, Description: description || 'Funds transfer' }
			]
		}
	];

	try {
		const result = await apiPost('/tables/transaction/import', {
			records,
			mode: 'insert',
			validate: true
		}, token);
		return json({ success: true, result });
	} catch (err: any) {
		return json({ error: err.message || 'Transfer failed' }, { status: 500 });
	}
};
