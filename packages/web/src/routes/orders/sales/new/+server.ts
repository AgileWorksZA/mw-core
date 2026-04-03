import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import { handleImportError } from '$lib/api/import-result';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const {
		nameCode, transDate, dueDate, description, colour,
		orderType, processStage, orderLines
	} = body as {
		nameCode: string;
		transDate: string;
		dueDate: string;
		description: string;
		colour: number;
		orderType: 'SO' | 'QU';
		processStage: string;
		orderLines: Array<{
			itemCode: string; orderQty: number; shipQty: number;
			description: string; unitPrice: number; discount: number;
			taxCode: string; done: boolean;
		}>;
	};

	if (!nameCode) {
		return json({ error: 'Customer is required' }, { status: 400 });
	}
	if (!orderLines?.length || !orderLines.some((l) => l.itemCode && l.orderQty > 0)) {
		return json({ error: 'At least one order line is required' }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');
	const mwDueDate = dueDate ? dueDate.replace(/-/g, '') : mwDate;

	const detail: Array<Record<string, any>> = [];
	let totalGross = 0;

	for (const line of orderLines) {
		if (!line.itemCode || line.orderQty <= 0) continue;
		const ext = Math.round(line.orderQty * line.unitPrice * (1 - (line.discount || 0) / 100) * 100) / 100;
		detail.push({
			StockCode: line.itemCode,
			StockQty: line.orderQty,
			UnitPrice: line.unitPrice,
			Discount: line.discount || 0,
			Gross: ext,
			Net: ext,
			Tax: 0,
			Description: line.description || '',
			TaxCode: line.taxCode || 'Z'
		});
		totalGross += ext;
	}

	const record: Record<string, any> = {
		Type: orderType,
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
		return handleImportError(err, 'order');
	}
};
