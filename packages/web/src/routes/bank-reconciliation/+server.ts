import { json } from '@sveltejs/kit';
import { apiGet, apiPost } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { RequestHandler } from './$types';

/** Fetch unreconciled transactions for a bank account */
export const GET: RequestHandler = async ({ locals, url }) => {
	const token = locals.token;
	const bankCode = url.searchParams.get('bankCode');

	if (!bankCode) {
		return json({ error: 'bankCode is required' }, { status: 400 });
	}

	// Fetch all posted transactions for this bank account
	const filter = `Contra="${bankCode}" AND Status="P"`;

	try {
		const res = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token,
			filter,
			limit: 1000,
			orderBy: 'Transdate'
		});

		const all = res.data ?? [];

		const transactions = all.map((t) => ({
			seq: t.Sequencenumber ?? 0,
			type: t.Type ?? '',
			date: t.Transdate ?? '',
			description: t.Description ?? '',
			nameCode: t.Namecode ?? '',
			name: t.Tofrom ?? '',
			ref: t.Ourref ?? '',
			analysis: t.Analysis ?? '',
			status: t.Status ?? '',
			amount: t.Gross ?? 0,
			deposit: (t.Gross ?? 0) > 0 ? t.Gross : 0,
			withdrawal: (t.Gross ?? 0) < 0 ? Math.abs(t.Gross) : 0
		}));

		return json({ transactions });
	} catch (err: any) {
		return json({ error: err.message || 'Failed to fetch transactions' }, { status: 500 });
	}
};

/** Mark transactions as reconciled */
export const POST: RequestHandler = async ({ locals, request }) => {
	const token = locals.token;
	const body = await request.json();

	const { bankCode, reconciledSeqs, statementDate, closingBalance } = body as {
		bankCode: string;
		reconciledSeqs: number[];
		statementDate: string;
		closingBalance: number;
	};

	if (!bankCode || !reconciledSeqs?.length) {
		return json({ error: 'Bank code and reconciled transactions are required' }, { status: 400 });
	}

	// MoneyWorks marks transactions as reconciled by updating their reconciliation flag
	// We update each transaction's Flag field to mark it as reconciled against this bank
	const errors: string[] = [];
	let successCount = 0;

	for (const seq of reconciledSeqs) {
		try {
			await apiPost(`/tables/transaction/${seq}`, {
				Flag: `R:${bankCode}:${statementDate}`
			}, token);
			successCount++;
		} catch (err: any) {
			errors.push(`Seq ${seq}: ${err.message}`);
		}
	}

	if (errors.length > 0 && successCount === 0) {
		return json({ error: `Failed to reconcile: ${errors[0]}` }, { status: 500 });
	}

	return json({
		success: true,
		reconciled: successCount,
		failed: errors.length,
		errors: errors.length > 0 ? errors : undefined
	});
};
