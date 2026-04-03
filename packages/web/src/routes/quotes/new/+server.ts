import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import { handleImportError } from '$lib/api/import-result';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const { nameCode, transDate, expiresDate, description, colour, lines } = body as {
		nameCode: string;
		transDate: string;
		expiresDate: string;
		description: string;
		colour: number;
		lines: Array<{
			itemCode: string; qty: number; description: string;
			unitPrice: number; discount: number; taxCode: string;
		}>;
	};

	if (!nameCode) {
		return json({ error: 'Customer is required' }, { status: 400 });
	}
	if (!lines?.length || !lines.some((l) => l.itemCode && l.qty > 0)) {
		return json({ error: 'At least one line item is required' }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');
	const mwExpires = expiresDate ? expiresDate.replace(/-/g, '') : '';

	const detail: Array<Record<string, any>> = [];
	let totalGross = 0;

	for (const line of lines) {
		if (!line.itemCode || line.qty <= 0) continue;
		const ext = Math.round(line.qty * line.unitPrice * (1 - (line.discount || 0) / 100) * 100) / 100;
		detail.push({
			StockCode: line.itemCode,
			StockQty: line.qty,
			UnitPrice: line.unitPrice,
			Discount: line.discount || 0,
			Gross: ext, Net: ext, Tax: 0,
			Description: line.description || '',
			TaxCode: line.taxCode || 'Z'
		});
		totalGross += ext;
	}

	const record: Record<string, any> = {
		Type: 'QU',
		Transdate: mwDate,
		Namecode: nameCode,
		Gross: Math.round(totalGross * 100) / 100,
		Description: description || '',
		Colour: colour || 0,
		Detail: detail
	};
	if (mwExpires) record.Duedate = mwExpires;

	try {
		const result = await apiPost('/tables/transaction/import', {
			records: [record], mode: 'insert', validate: true
		}, token);
		return json({ success: true, result });
	} catch (err: any) {
		return handleImportError(err, 'quote');
	}
};
