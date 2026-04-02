import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const { transDate, description, colour, journalLines } = body as {
		transDate: string;
		description: string;
		colour: number;
		journalLines: Array<{
			account: string; description: string;
			debit: number; credit: number; taxCode: string;
		}>;
	};

	if (!journalLines?.length || journalLines.length < 2) {
		return json({ error: 'At least two journal lines are required' }, { status: 400 });
	}

	// Validate debits = credits
	let totalDebit = 0;
	let totalCredit = 0;
	for (const line of journalLines) {
		totalDebit += line.debit || 0;
		totalCredit += line.credit || 0;
	}

	if (Math.abs(totalDebit - totalCredit) > 0.01) {
		return json({ error: `Journal must balance: Debits (${totalDebit.toFixed(2)}) ≠ Credits (${totalCredit.toFixed(2)})` }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');

	const detail: Array<Record<string, any>> = [];
	for (const line of journalLines) {
		if (!line.account) continue;
		const net = (line.debit || 0) - (line.credit || 0);
		if (net === 0) continue;
		detail.push({
			Account: line.account,
			Gross: net,
			Net: net,
			Tax: 0,
			Description: line.description || '',
			TaxCode: line.taxCode || 'Z'
		});
	}

	const record: Record<string, any> = {
		Type: 'JN',
		Transdate: mwDate,
		Gross: Math.round(totalDebit * 100) / 100,
		Description: description || '',
		Colour: colour || 0,
		Detail: detail
	};

	try {
		const result = await apiPost('/tables/transaction/import', {
			records: [record],
			mode: 'insert',
			validate: true
		}, token);
		return json({ success: true, result });
	} catch (err: any) {
		return json({ error: err.message || 'Failed to create journal' }, { status: 500 });
	}
};
