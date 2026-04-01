import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, AccountRecord, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

function parseNum(s: string | undefined): number {
	if (s === undefined || s === null || s === '') return 0;
	const n = parseFloat(String(s));
	return isNaN(n) ? 0 : n;
}

function formatMWDate(d: Date): string {
	return d.toISOString().split('T')[0].replace(/-/g, '');
}

/** Returns the last day of a given year-month (1-based) */
function lastDayOfMonth(year: number, month: number): Date {
	return new Date(year, month, 0); // day 0 = last day of prior month
}

/** Build period labels and date ranges for last 24 months */
function buildPeriods(now: Date): Array<{ label: string; start: string; end: string }> {
	const periods: Array<{ label: string; start: string; end: string }> = [];
	for (let i = 23; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const year = d.getFullYear();
		const month = d.getMonth(); // 0-based
		const start = new Date(year, month, 1);
		const end = lastDayOfMonth(year, month + 1);
		const label = start.toLocaleString('en', { month: 'short', year: '2-digit' });
		periods.push({
			label,
			start: formatMWDate(start),
			end: formatMWDate(end)
		});
	}
	return periods;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const accountCode = url.searchParams.get('account') || '';

	// Always load the account list for the dropdown
	const accountsRes = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', {
		token,
		limit: 500
	}).catch(() => ({ data: [] as AccountRecord[] }));

	const accounts = (accountsRes.data ?? []).map((a) => ({
		code: a.Code,
		description: a.Description ?? '',
		system: a.System ?? '',
		type: a.Type ?? ''
	}));

	if (!accountCode) {
		return { accounts, accountCode: '', account: null, periods: [], movements: [] };
	}

	const now = new Date();
	const periods = buildPeriods(now);

	// Fetch account details and movements in parallel
	const [acctRes, txRes] = await Promise.all([
		apiGet<ApiResponse<AccountRecord[]>>('/tables/account', {
			token,
			filter: `Code="${accountCode}"`
		}).catch(() => ({ data: [] as AccountRecord[] })),
		apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token,
			filter: `Contra="${accountCode}"`,
			limit: 500
		}).catch(() => ({ data: [] as TransactionRecord[] }))
	]);

	const acct = acctRes.data?.[0];
	if (!acct) {
		return { accounts, accountCode, account: null, periods: [], movements: [] };
	}

	// Build balance expressions for each period (opening and closing)
	const evalExprs: Record<string, string> = {};
	for (const p of periods) {
		evalExprs[`open_${p.start}`] = `GetBalance("AccountCode=\\"${accountCode}\\"", "${p.start}")`;
		evalExprs[`close_${p.end}`] = `GetBalance("AccountCode=\\"${accountCode}\\"", "${p.end}")`;
	}

	const balanceResults = await apiEvalBatch(evalExprs, token);

	const periodData = periods.map((p) => {
		const opening = parseNum(balanceResults[`open_${p.start}`]);
		const closing = parseNum(balanceResults[`close_${p.end}`]);
		const movement = closing - opening;
		return {
			label: p.label,
			opening,
			movement,
			closing
		};
	});

	const movements = (txRes.data ?? []).map((t) => ({
		date: t.Transdate ?? '',
		ref: t.Ourref ?? '',
		type: (t.Type ?? '').substring(0, 2),
		status: t.Status ?? '',
		period: t.Period ?? '',
		description: t.Description ?? '',
		nameCode: t.Namecode ?? '',
		gross: t.Gross ?? 0
	}));

	return {
		accounts,
		accountCode,
		account: {
			code: acct.Code,
			description: acct.Description ?? '',
			type: acct.Type ?? '',
			system: acct.System ?? ''
		},
		periods: periodData,
		movements
	};
};
