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

	// MW journals: each detail line has Gross (positive=debit, negative=credit)
	// Net = Gross for zero-tax, header Gross = sum of all detail Gross values
	const detail: Array<Record<string, any>> = [];
	let headerGross = 0;
	for (const line of journalLines) {
		if (!line.account) continue;
		const debit = line.debit || 0;
		const credit = line.credit || 0;
		if (debit === 0 && credit === 0) continue;
		const gross = debit - credit;
		headerGross += gross;
		detail.push({
			Account: line.account,
			Gross: gross,
			Net: gross,
			Tax: 0,
			Description: line.description || '',
			TaxCode: line.taxCode || 'Z'
		});
	}

	const record: Record<string, any> = {
		Type: 'JN',
		Transdate: mwDate,
		Gross: headerGross,
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
