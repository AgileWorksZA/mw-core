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
		return { assets: [], depreciationAccounts: [], totals: { cost: 0, depreciation: 0, bookValue: 0 } };
	}

	const accounts = accountsRes.data ?? [];

	// Fixed asset accounts (Type=FA) and their depreciation contra accounts
	const faAccounts = accounts.filter((a) => a.Type === 'FA');

	// Get balances for all FA accounts
	const balanceExprs: Record<string, string> = {};
	for (const a of faAccounts) {
		balanceExprs[a.Code] = balanceExpr(a.Code);
	}
	const balances = await apiEvalBatch(balanceExprs, token);

	// Build asset list — pair asset accounts with their depreciation contra
	// Convention: depreciation accounts often have descriptions containing "Accum" or "Deprec"
	const depreciationCodes = new Set(
		faAccounts
			.filter((a) => (a.Description ?? '').toLowerCase().includes('deprec'))
			.map((a) => a.Code)
	);

	const assetAccounts = faAccounts.filter((a) => !depreciationCodes.has(a.Code));
	const depreciationAccounts = faAccounts.filter((a) => depreciationCodes.has(a.Code));

	const assets = assetAccounts.map((a) => {
		const cost = parseNum(balances[a.Code] || '0');
		// Find matching depreciation account (often the next sequential code)
		const depAcct = depreciationAccounts.find((d) =>
			(d.Description ?? '').toLowerCase().includes((a.Description ?? '').toLowerCase().split(' ')[0])
		);
		const depreciation = depAcct ? Math.abs(parseNum(balances[depAcct.Code] || '0')) : 0;
		return {
			code: a.Code,
			description: a.Description ?? '',
			cost,
			depreciation,
			bookValue: cost - depreciation,
			depreciationAccount: depAcct?.Code ?? ''
		};
	});

	const totalCost = assets.reduce((s, a) => s + a.cost, 0);
	const totalDepreciation = assets.reduce((s, a) => s + a.depreciation, 0);

	return {
		assets,
		depreciationAccounts: depreciationAccounts.map((a) => ({
			code: a.Code, description: a.Description ?? '', balance: Math.abs(parseNum(balances[a.Code] || '0'))
		})),
		totals: { cost: totalCost, depreciation: totalDepreciation, bookValue: totalCost - totalDepreciation }
	};
};
