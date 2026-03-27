import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number {
	const n = parseFloat(s);
	return isNaN(n) ? 0 : n;
}

function balanceExpr(code: string): string {
	return `GetBalance("AccountCode=\\"${code}\\"", Today())`;
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let accountsRes: ApiResponse<AccountRecord[]>;
	try {
		accountsRes = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 });
	} catch {
		return { bankAccounts: [] };
	}

	const accounts = accountsRes.data ?? [];
	const bankRecords = accounts.filter((a) => a.System === 'BK' || a.System === 'CC');

	const balanceExprs: Record<string, string> = {};
	for (const a of bankRecords) {
		balanceExprs[a.Code] = balanceExpr(a.Code);
	}
	const balances = await apiEvalBatch(balanceExprs, token);

	const bankAccounts = bankRecords.map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.System ?? '',
		balance: parseNum(balances[a.Code] || '0')
	}));

	return { bankAccounts };
};
