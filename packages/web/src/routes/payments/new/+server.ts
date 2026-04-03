import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import { handleImportError } from '$lib/api/import-result';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const {
		nameCode, bankAccount, amount, transDate, description,
		paidBy, colour, isSupplierMode, allocations, detailLines, itemLines
	} = body as {
		nameCode: string;
		bankAccount: string;
		amount: number;
		transDate: string;
		description: string;
		paidBy: number;
		colour: number;
		isSupplierMode: boolean;
		allocations: Array<{ invoice: string; amount: number; seq: number }>;
		detailLines: Array<{ account: string; description: string; net: number; taxCode: string; tax: number; gross: number }>;
		itemLines: Array<{ itemCode: string; qty: number; description: string; unitPrice: number; discount: number; taxCode: string }>;
	};

	if (!bankAccount || !amount || amount <= 0) {
		return json({ error: 'Bank account and amount are required' }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');

	let desc = description;
	if (isSupplierMode && allocations?.length > 0 && !desc) {
		desc = allocations.map((a) => a.invoice).join(', ');
	}

	const detail: Array<Record<string, any>> = [];

	if (isSupplierMode && allocations?.length > 0) {
		for (const alloc of allocations) {
			if (alloc.amount <= 0) continue;
			detail.push({
				Account: '2000',
				Gross: alloc.amount,
				Net: alloc.amount,
				Tax: 0,
				TaxCode: 'Z',
				Description: `Invoice ${alloc.invoice}`
			});
		}
	} else if (itemLines?.length > 0) {
		for (const line of itemLines) {
			if (!line.itemCode || line.qty <= 0) continue;
			const ext = Math.round(line.qty * line.unitPrice * (1 - (line.discount || 0) / 100) * 100) / 100;
			detail.push({
				StockCode: line.itemCode,
				StockQty: line.qty,
				UnitPrice: line.unitPrice,
				Discount: line.discount || 0,
				Gross: ext,
				Net: ext,
				Tax: 0,
				Description: line.description || '',
				TaxCode: line.taxCode || 'Z'
			});
		}
	} else if (detailLines?.length > 0) {
		for (const line of detailLines) {
			if (!line.account) continue;
			detail.push({
				Account: line.account,
				Gross: line.gross || line.net || 0,
				Net: line.net || line.gross || 0,
				Tax: line.tax || 0,
				Description: line.description || '',
				TaxCode: line.taxCode || 'Z'
			});
		}
	}

	const record: Record<string, any> = {
		Type: 'CP',
		Transdate: mwDate,
		Gross: amount,
		Contra: bankAccount,
		Description: desc || '',
		Colour: colour || 0,
		Paymentmethod: paidBy || 0
	};

	if (nameCode) {
		record.Namecode = nameCode;
	}

	if (detail.length > 0) {
		record.Detail = detail;
	}

	try {
		const result = await apiPost('/tables/transaction/import', {
			records: [record],
			mode: 'insert',
			validate: true
		}, token);
		return json({ success: true, result });
	} catch (err: any) {
		return handleImportError(err, 'payment');
	}
};
