import { error } from '@sveltejs/kit';
import { apiGet, ApiError } from '$lib/api/client';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { code } = params;
	const token = locals.token;

	let jobRes: any;
	let sheetItemsRes: any;
	let namesRes: any;
	let accountsRes: any;

	try {
		[jobRes, sheetItemsRes, namesRes, accountsRes] = await Promise.all([
			apiGet<ApiResponse<any[]>>('/tables/job', {
				token,
				filter: `Code="${code}"`
			}),
			// Job sheet items for this job (may not exist yet)
			apiGet<ApiResponse<any[]>>('/tables/jobsheetitem', {
				token,
				filter: `Job="${code}"`,
				limit: 500
			}).catch(() => ({ data: [], metadata: { count: 0 } })),
			// Names for client lookup
			apiGet<ApiResponse<any[]>>('/tables/name', {
				token,
				filter: 'CustomerType>="1"',
				limit: 500
			}).catch(() => ({ data: [] })),
			// Accounts for WIP account lookup
			apiGet<ApiResponse<any[]>>('/tables/account', {
				token,
				limit: 500
			}).catch(() => ({ data: [] }))
		]);
	} catch (err) {
		if (err instanceof ApiError) {
			throw error(err.status === 401 ? 401 : 502, `API error: ${err.message}`);
		}
		throw error(500, `Failed to load job: ${err}`);
	}

	const j = jobRes.data?.[0];
	if (!j) {
		throw error(404, `Job "${code}" not found`);
	}

	const statusLabels: Record<string, string> = { A: 'Active', C: 'Completed', H: 'On Hold' };
	const billingLabels: Record<string, string> = { Q: 'Quote', C: 'Cost Plus' };

	const job = {
		code: j.Code ?? '',
		name: j.Name || j.Description || '',
		description: j.Description ?? '',
		client: j.Client ?? '',
		status: j.Status ?? 'A',
		statusLabel: statusLabels[j.Status] ?? j.Status ?? '',
		project: j.Project ?? '',
		manager: j.Manager ?? '',
		wipAccount: j.WIPAccount ?? '',
		billing: j.Billing ?? '',
		billingLabel: billingLabels[j.Billing] ?? j.Billing ?? '',
		quotedAmount: j.QuotedAmount ?? 0,
		markup: j.Markup ?? 0,
		billedToDate: j.BilledToDate ?? 0,
		percentComplete: j.PercentComplete ?? 0,
		budget: j.Budget ?? 0,
		startDate: j.StartDate ?? '',
		targetDate: j.TargetDate ?? '',
		finishDate: j.FinishDate ?? '',
		customerOrderNo: j.CustomerOrderNo ?? '',
		contactPerson: j.ContactPerson ?? '',
		phone: j.Phone ?? '',
		category: j.Category ?? '',
		comments: j.Comments ?? '',
		notes: j.Notes ?? '',
		custom1: j.Custom1 ?? '',
		custom2: j.Custom2 ?? '',
		custom3: j.Custom3 ?? '',
		custom4: j.Custom4 ?? '',
		colour: j.Colour ?? 0,
	};

	// Parse job sheet items into pending/processed/budget
	const allItems = (sheetItemsRes.data ?? []).map((item: any) => ({
		id: item.SequenceNumber ?? item.Sequencenumber ?? 0,
		date: item.Date ?? '',
		resource: item.Resource ?? item.Stockcode ?? '',
		qty: item.Qty ?? item.Quantity ?? 0,
		unit: item.Unit ?? '',
		cost: item.Cost ?? 0,
		charge: item.Charge ?? 0,
		account: item.Account ?? '',
		memo: item.Memo ?? item.Description ?? '',
		analysis: item.Analysis ?? '',
		costCentre: item.CostCentre ?? '',
		status: item.Status ?? 'P',
		locked: !!(item.Locked),
	}));

	const pending = allItems.filter((i: any) => i.status === 'P');
	const processed = allItems.filter((i: any) => i.status === 'X');
	const budget = allItems.filter((i: any) => i.status === 'B');

	return {
		job,
		sheetItems: { pending, processed, budget },
		lookups: {
			clients: (namesRes.data ?? []).map((n: any) => ({ code: n.Code, name: n.Name })),
			accounts: (accountsRes.data ?? []).map((a: any) => ({
				code: a.Code,
				description: a.Description,
				type: a.Type
			})),
			currentAssetAccounts: (accountsRes.data ?? [])
				.filter((a: any) => a.Type === 'CA')
				.map((a: any) => ({ code: a.Code, description: a.Description }))
		}
	};
};
