import { error } from '@sveltejs/kit';
import { apiGet, ApiError } from '$lib/api/client';
import type { ApiResponse, AccountRecord, TransactionRecord } from '$lib/api/types';
import { ACCOUNT_TYPE_LABELS } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { code } = params;
	const token = locals.token;

	let accountRes, transactionsRes;
	try {
		[accountRes, transactionsRes] = await Promise.all([
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', {
				token,
				filter: `Code="${code}"`
			}),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token,
				filter: `Contra="${code}"`,
				limit: 200
			})
		]);
	} catch (err) {
		if (err instanceof ApiError) {
			throw error(err.status === 401 ? 401 : 502, `API error: ${err.message}`);
		}
		throw error(500, `Failed to load account enquiry: ${err}`);
	}

	const acct = accountRes.data[0];
	if (!acct) {
		throw error(404, `Account "${code}" not found`);
	}

	const movements = transactionsRes.data.map((t) => ({
		date: t.Transdate ?? '',
		ref: t.Ourref ?? '',
		nameCode: t.Namecode ?? '',
		description: t.Description ?? '',
		type: (t.Type ?? '').substring(0, 2),
		gross: t.Gross ?? 0,
		status: t.Status ?? ''
	}));

	// Compute totals from movements
	const totalDebits = movements.reduce((sum, m) => sum + (m.gross > 0 ? m.gross : 0), 0);
	const totalCredits = movements.reduce((sum, m) => sum + (m.gross < 0 ? Math.abs(m.gross) : 0), 0);

	return {
		account: {
			code: acct.Code,
			description: acct.Description ?? '',
			type: acct.Type ?? '',
			typeLabel: ACCOUNT_TYPE_LABELS[acct.Type ?? ''] ?? acct.Type ?? ''
		},
		movements,
		totals: {
			debits: totalDebits,
			credits: totalCredits,
			net: totalDebits - totalCredits,
			count: movements.length
		}
	};
};
