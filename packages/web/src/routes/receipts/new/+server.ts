import { json } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const {
		nameCode, bankAccount, amount, transDate, description,
		paidBy, colour, isCustomerMode, allocations, detailLines
	} = body as {
		nameCode: string;
		bankAccount: string;
		amount: number;
		transDate: string;
		description: string;
		paidBy: number;
		colour: number;
		isCustomerMode: boolean;
		allocations: Array<{ invoice: string; amount: number; seq: number }>;
		detailLines: Array<{ account: string; description: string; net: number; taxCode: string; tax: number; gross: number }>;
	};

	if (!bankAccount || !amount || amount <= 0) {
		return json({ error: 'Bank account and amount are required' }, { status: 400 });
	}

	const mwDate = transDate.replace(/-/g, '');

	// Build description from allocated invoice numbers if not provided
	let desc = description;
	if (isCustomerMode && allocations?.length > 0 && !desc) {
		desc = allocations.map((a) => a.invoice).join(', ');
	}

	// Build detail lines
	const detail: Array<Record<string, any>> = [];

	if (isCustomerMode && allocations?.length > 0) {
		// Payment on Invoice mode: allocate against invoices
		for (const alloc of allocations) {
			if (alloc.amount <= 0) continue;
			detail.push({
				Account: '1500', // Accounts Receivable default
				Gross: alloc.amount,
				Description: `Invoice ${alloc.invoice}`
			});
		}
	} else if (detailLines?.length > 0) {
		// By Account mode: manual detail lines
		for (const line of detailLines) {
			if (!line.account) continue;
			detail.push({
				Account: line.account,
				Gross: line.gross || line.net || 0,
				Description: line.description || '',
				TaxCode: line.taxCode || ''
			});
		}
	}

	const record: Record<string, any> = {
		Type: 'CR',
		Status: 'P',
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
		return json({ error: err.message || 'Failed to create receipt' }, { status: 500 });
	}
};
