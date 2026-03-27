import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, TransactionRecord, AccountRecord } from '$lib/api/types';
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

	// Get bank accounts + unbanked holding accounts
	let accountsRes: ApiResponse<AccountRecord[]>;
	try {
		accountsRes = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 });
	} catch {
		return { bankAccounts: [], totalBalance: 0, recentReceipts: [], recentPayments: [] };
	}

	const accounts = accountsRes.data ?? [];
	const bankRecords = accounts.filter((a) => a.System === 'BK' || a.System === 'CC');

	// Get balances for all bank accounts
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

	const totalBalance = bankAccounts.reduce((s, b) => s + b.balance, 0);

	// Recent activity — last 20 receipts + payments
	let receiptsRes: any, paymentsRes: any;
	try {
		[receiptsRes, paymentsRes] = await Promise.all([
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: 'left(Type,2)="CR" AND Status="P"', limit: 20, orderBy: '-Transdate'
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: 'left(Type,2)="CP" AND Status="P"', limit: 20, orderBy: '-Transdate'
			}).catch(() => ({ data: [] }))
		]);
	} catch {
		receiptsRes = { data: [] };
		paymentsRes = { data: [] };
	}

	const recentReceipts = (receiptsRes.data ?? []).slice(0, 10).map((t: TransactionRecord) => ({
		ref: t.Ourref ?? '', name: t.Tofrom ?? '', date: t.Transdate ?? '',
		amount: t.Gross ?? 0, bank: t.Contra ?? ''
	}));

	const recentPayments = (paymentsRes.data ?? []).slice(0, 10).map((t: TransactionRecord) => ({
		ref: t.Ourref ?? '', name: t.Tofrom ?? '', date: t.Transdate ?? '',
		amount: t.Gross ?? 0, bank: t.Contra ?? ''
	}));

	return { bankAccounts, totalBalance, recentReceipts, recentPayments };
};
