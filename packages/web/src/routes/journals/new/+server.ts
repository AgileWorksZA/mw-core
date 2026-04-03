import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import { handleImportError } from '$lib/api/import-result';
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

	// MW journal XML format (from export):
	//   detail.gross = absolute amount (always positive)
	//   detail.net = signed: negative for debit side, positive for credit side
	//   No TaxCode needed on journal detail lines
	//   Header gross = total debit amount
	const detail: Array<Record<string, any>> = [];
	for (const line of journalLines) {
		if (!line.account) continue;
		const debit = line.debit || 0;
		const credit = line.credit || 0;
		if (debit === 0 && credit === 0) continue;
		const amount = debit || credit;
		const isDebit = debit > 0;
		detail.push({
			Account: line.account,
			Gross: amount,
			Net: isDebit ? -amount : amount,
			Description: line.description || ''
		});
	}

	const record: Record<string, any> = {
		Type: 'JN',
		Transdate: mwDate,
		Gross: totalDebit,
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
		return handleImportError(err, 'journal');
	}
};
