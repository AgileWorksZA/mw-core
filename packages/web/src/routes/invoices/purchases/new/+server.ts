import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const {
		nameCode, invoiceRef, orderRef, transDate, dueDate,
		description, colour, detailLines
	} = body as {
		nameCode: string;
		invoiceRef: string;
		orderRef: string;
		transDate: string;
		dueDate: string;
		description: string;
		colour: number;
		detailLines: Array<{ account: string; description: string; net: number; taxCode: string; tax: number; gross: number }>;
	};

	if (!nameCode) {
		return json({ error: 'Creditor is required' }, { status: 400 });
	}

	if (!detailLines?.length || !detailLines.some((l) => l.account && l.gross > 0)) {
		return json({ error: 'At least one detail line is required' }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');
	const mwDueDate = dueDate ? dueDate.replace(/-/g, '') : '';

	const detail: Array<Record<string, any>> = [];
	let totalGross = 0;

	for (const line of detailLines) {
		if (!line.account) continue;
		const gross = line.gross || line.net || 0;
		if (gross === 0) continue;
		detail.push({
			Account: line.account,
			Gross: gross,
			Description: line.description || '',
			TaxCode: line.taxCode || ''
		});
		totalGross += gross;
	}

	const record: Record<string, any> = {
		Type: 'CI',
		Status: 'P',
		Transdate: mwDate,
		Namecode: nameCode,
		Gross: Math.round(totalGross * 100) / 100,
		Description: description || '',
		Colour: colour || 0,
		Ourref: invoiceRef || '',
		Theirref: orderRef || '',
		Detail: detail
	};

	if (mwDueDate) {
		record.Duedate = mwDueDate;
	}

	try {
		const result = await apiPost('/tables/transaction/import', {
			records: [record],
			mode: 'insert',
			validate: true
		}, token);
		return json({ success: true, result });
	} catch (err: any) {
		return json({ error: err.message || 'Failed to create purchase invoice' }, { status: 500 });
	}
};
