import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string): number { const n = parseFloat(s); return isNaN(n) ? 0 : n; }

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let invoicesRes: ApiResponse<TransactionRecord[]>;
	let accountsRes: ApiResponse<AccountRecord[]>;

	try {
		[invoicesRes, accountsRes] = await Promise.all([
			// Outstanding purchase invoices
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: 'left(Type,2)="CI" AND Status="P"', limit: 500
			}),
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', { token, limit: 500 })
		]);
	} catch {
		return { payableInvoices: [], bankAccounts: [] };
	}

	const payableInvoices = (invoicesRes.data ?? [])
		.map((t) => {
			const outstanding = (t.Gross ?? 0) - (t.Amtpaid ?? 0) - (t.Amtwrittenoff ?? 0);
			return {
				seq: t.Sequencenumber ?? 0,
				creditor: t.Namecode ?? '',
				name: t.Tofrom ?? t.Namecode ?? '',
				dueDate: t.Duedate ?? '',
				orderNo: t.Theirref ?? '',
				invoiceNo: t.Ourref ?? '',
				description: t.Description ?? '',
				gross: t.Gross ?? 0,
				outstanding: Math.round(outstanding * 100) / 100,
				payAmount: 0,
				payStatus: 'none' as 'none' | 'full' | 'partial'
			};
		})
		.filter((i) => i.outstanding > 0.005)
		.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

	// Bank accounts
	const allAccounts = accountsRes.data ?? [];
	const bankRecords = allAccounts.filter((a) => a.System === 'BK' || a.System === 'CC');
	const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const balanceExprs: Record<string, string> = {};
	for (const a of bankRecords) {
		balanceExprs[a.Code] = `GetBalance("AccountCode=\\"${a.Code}\\"", "${today}")`;
	}
	const balances = await apiEvalBatch(balanceExprs, token);
	const bankAccounts = bankRecords.map((a) => ({
		code: a.Code, description: a.Description ?? '',
		balance: parseNum(balances[a.Code] || '0')
	}));

	return { payableInvoices, bankAccounts };
};
