import { apiGet } from '$lib/api/client';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const jobCode = url.searchParams.get('job') || '';

	let jobsRes: any;
	let sheetItemsRes: any;

	try {
		[jobsRes, sheetItemsRes] = await Promise.all([
			apiGet<ApiResponse<any[]>>('/tables/job', {
				token,
				filter: 'Status="A"',
				limit: 500
			}).catch(() => ({ data: [] })),
			jobCode
				? apiGet<ApiResponse<any[]>>('/tables/jobsheetitem', {
					token,
					filter: `Job="${jobCode}" AND Status="P"`,
					limit: 500
				}).catch(() => ({ data: [] }))
				: Promise.resolve({ data: [] })
		]);
	} catch {
		return { jobs: [], pendingItems: [], selectedJob: jobCode };
	}

	const jobs = (jobsRes.data ?? []).map((j: any) => ({
		code: j.Code ?? '',
		name: j.Name || j.Description || '',
		client: j.Client ?? '',
		billing: j.Billing ?? '',
		markup: j.Markup ?? 0,
		quotedAmount: j.QuotedAmount ?? 0,
	}));

	const pendingItems = (sheetItemsRes.data ?? []).map((item: any) => ({
		id: item.SequenceNumber ?? item.Sequencenumber ?? 0,
		date: item.Date ?? '',
		resource: item.Resource ?? item.Stockcode ?? '',
		qty: item.Qty ?? item.Quantity ?? 0,
		cost: item.Cost ?? 0,
		charge: item.Charge ?? 0,
		memo: item.Memo ?? item.Description ?? '',
		account: item.Account ?? '',
	}));

	return { jobs, pendingItems, selectedJob: jobCode };
};
