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

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const bankCode = url.searchParams.get('bank') || '';

	// Get all bank accounts for the selector
	let accountsRes: ApiResponse<AccountRecord[]>;
	try {
		accountsRes = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 });
	} catch {
		return { bankAccounts: [], selectedBank: null, transactions: [], bankCode };
	}

	const accounts = accountsRes.data ?? [];
	const bankAccountRecords = accounts.filter((a) => a.System === 'BK' || a.System === 'CC');

	// Get balances for all bank accounts
	const balanceExprs: Record<string, string> = {};
	for (const a of bankAccountRecords) {
		balanceExprs[a.Code] = balanceExpr(a.Code);
	}
	const balances = await apiEvalBatch(balanceExprs, token);

	const bankAccounts = bankAccountRecords.map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		type: a.System ?? '',
		balance: parseNum(balances[a.Code] || '0')
	}));

	// If no bank selected, return just the account list
	if (!bankCode) {
		return { bankAccounts, selectedBank: null, transactions: [], bankCode };
	}

	const selectedBank = bankAccounts.find((b) => b.code === bankCode) || null;

	// Fetch all transactions for this bank account (receipts + payments via Contra)
	let receiptsRes: ApiResponse<TransactionRecord[]>;
	let paymentsRes: ApiResponse<TransactionRecord[]>;
	try {
		[receiptsRes, paymentsRes] = await Promise.all([
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Type,2)="CR" AND Contra="${bankCode}" AND Status="P"`, limit: 1000
			}).catch(() => ({ data: [] }) as any),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Type,2)="CP" AND Contra="${bankCode}" AND Status="P"`, limit: 1000
			}).catch(() => ({ data: [] }) as any)
		]);
	} catch {
		return { bankAccounts, selectedBank, transactions: [], bankCode };
	}

	const receipts = (receiptsRes.data ?? []).map((t) => ({
		seq: t.Sequencenumber ?? 0, ref: t.Ourref ?? '',
		type: 'Receipt' as const,
		name: t.Tofrom ?? t.Namecode ?? '',
		description: t.Description ?? '', date: t.Transdate ?? '',
		deposit: t.Gross ?? 0, withdrawal: 0
	}));

	const payments = (paymentsRes.data ?? []).map((t) => ({
		seq: t.Sequencenumber ?? 0, ref: t.Ourref ?? '',
		type: 'Payment' as const,
		name: t.Tofrom ?? t.Namecode ?? '',
		description: t.Description ?? '', date: t.Transdate ?? '',
		deposit: 0, withdrawal: t.Gross ?? 0
	}));

	const transactions = [...receipts, ...payments].sort((a, b) => a.date.localeCompare(b.date));

	return { bankAccounts, selectedBank, transactions, bankCode };
};
