import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord, NameRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number { const n = parseFloat(s); return isNaN(n) ? 0 : n; }

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let namesRes: ApiResponse<NameRecord[]>;
	let accountsRes: ApiResponse<AccountRecord[]>;

	try {
		[namesRes, accountsRes] = await Promise.all([
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
				token, filter: 'CustomerType>="2"', limit: 500
			}),
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 })
		]);
	} catch {
		return { debtors: [], bankAccounts: [] };
	}

	const debtors = (namesRes.data ?? [])
		.map((n) => {
			const owed = (n.DCurrent ?? 0) + (n.D30Plus ?? 0) + (n.D60Plus ?? 0) + (n.D90Plus ?? 0);
			return {
				code: n.Code ?? '', name: n.Name ?? '', owed,
				address: [n.Address1, n.Address2, n.Address3, n.Address4].filter(Boolean).join(', '),
				phone: n.Phone ?? ''
			};
		})
		.filter((d) => d.owed > 0.01)
		.sort((a, b) => b.owed - a.owed);

	// Bank accounts with balances
	const allAccounts = accountsRes.data ?? [];
	const bankRecords = allAccounts.filter((a) => a.System === 'BK' || a.System === 'CC');
	const balanceExprs: Record<string, string> = {};
	const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	for (const a of bankRecords) {
		balanceExprs[a.Code] = `GetBalance("AccountCode=\\"${a.Code}\\"", "${today}")`;
	}
	const balances = await apiEvalBatch(balanceExprs, token);
	const bankAccounts = bankRecords.map((a) => ({
		code: a.Code, description: a.Description ?? '',
		balance: parseNum(balances[a.Code] || '0')
	}));

	return { debtors, bankAccounts };
};
