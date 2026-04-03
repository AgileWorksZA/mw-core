import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import { handleImportError } from '$lib/api/import-result';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const {
		nameCode, transDate, dueDate, description, colour, orderLines
	} = body as {
		nameCode: string;
		transDate: string;
		dueDate: string;
		description: string;
		colour: number;
		orderLines: Array<{
			itemCode: string; qty: number; description: string;
			unitPrice: number; taxCode: string;
		}>;
	};

	if (!nameCode) {
		return json({ error: 'Supplier is required' }, { status: 400 });
	}
	if (!orderLines?.length || !orderLines.some((l) => l.itemCode && l.qty > 0)) {
		return json({ error: 'At least one order line is required' }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');
	const mwDueDate = dueDate ? dueDate.replace(/-/g, '') : mwDate;

	const detail: Array<Record<string, any>> = [];
	let totalGross = 0;

	for (const line of orderLines) {
		if (!line.itemCode || line.qty <= 0) continue;
		const ext = Math.round(line.qty * line.unitPrice * 100) / 100;
		detail.push({
			StockCode: line.itemCode,
			StockQty: line.qty,
			UnitPrice: line.unitPrice,
			Gross: ext,
			Net: ext,
			Tax: 0,
			Description: line.description || '',
			TaxCode: line.taxCode || 'Z'
		});
		totalGross += ext;
	}

	const record: Record<string, any> = {
		Type: 'PO',
		Transdate: mwDate,
		Duedate: mwDueDate,
		Namecode: nameCode,
		Gross: Math.round(totalGross * 100) / 100,
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
		return handleImportError(err, 'purchase order');
	}
};
