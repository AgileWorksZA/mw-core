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
		detailLines: Array<{
			stockCode: string;
			description: string;
			qty: number;
			unitPrice: number;
			taxCode: string;
			tax: number;
			gross: number;
		}>;
	};

	if (!nameCode) {
		return json({ error: 'Customer is required' }, { status: 400 });
	}

	if (!detailLines?.length || !detailLines.some((l) => l.gross > 0)) {
		return json({ error: 'At least one detail line is required' }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');
	const mwDueDate = dueDate ? dueDate.replace(/-/g, '') : '';

	const detail: Array<Record<string, any>> = [];
	let totalGross = 0;

	for (const line of detailLines) {
		const gross = line.gross || 0;
		if (gross === 0) continue;
		const net = gross - (line.tax || 0);
		detail.push({
			StockCode: line.stockCode || '',
			Description: line.description || '',
			StockQty: line.qty || 0,
			UnitPrice: line.unitPrice || 0,
			Gross: gross,
			Net: net,
			Tax: line.tax || 0,
			TaxCode: line.taxCode || 'Z'
		});
		totalGross += gross;
	}

	const record: Record<string, any> = {
		Type: 'DI',
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
		return json({ error: err.message || 'Failed to create sales invoice' }, { status: 500 });
	}
};
