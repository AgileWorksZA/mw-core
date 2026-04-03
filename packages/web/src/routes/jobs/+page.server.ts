import { apiGet } from '$lib/api/client';
import { JOB_FILTERS, type JobFilterKey } from '$lib/api/filters';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

interface JobRecord {
	Code: string;
	Description: string;
	Name: string;
	Client: string;
	Status: string;
	Project: string;
	Manager: string;
	WIPAccount: string;
	Billing: string;
	QuotedAmount: number;
	Markup: number;
	BilledToDate: number;
	PercentComplete: number;
	Budget: number;
	StartDate: string;
	TargetDate: string;
	FinishDate: string;
	CustomerOrderNo: string;
	ContactPerson: string;
	Phone: string;
	Contact: string;
	Category: string;
	Comments: string;
	Notes: string;
	Custom1: string;
	Custom2: string;
	Custom3: string;
	Custom4: string;
	UserNum: number;
	UserText: string;
	Colour: number;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const filterKey = (url.searchParams.get('filter') || 'all') as JobFilterKey;
	const filterDef = JOB_FILTERS[filterKey] ?? JOB_FILTERS.all;
	const find = url.searchParams.get('find') || '';

	let composedFilter = filterDef.filter;
	if (find) composedFilter = composedFilter ? `${composedFilter} AND ${find}` : find;

	let response: ApiResponse<JobRecord[]>;
	try {
		response = await apiGet<ApiResponse<JobRecord[]>>('/tables/job', {
			token,
			filter: composedFilter,
			format: 'full',
			limit: 500
		});
	} catch {
		response = { data: [], metadata: { count: 0 } } as any;
	}

	const statusLabels: Record<string, string> = { A: 'Active', C: 'Completed', H: 'On Hold' };
	const billingLabels: Record<string, string> = { Q: 'Quote', C: 'Cost Plus' };

	const jobs = (response.data ?? []).map((j) => ({
		code: j.Code ?? '',
		name: j.Name || j.Description || '',
		client: j.Client ?? '',
		status: j.Status ?? 'A',
		statusLabel: statusLabels[j.Status] ?? j.Status ?? '',
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
		manager: j.Manager ?? '',
		project: j.Project ?? '',
		category: j.Category ?? '',
		description: j.Description ?? '',
		colour: j.Colour ?? 0,
		customerOrderNo: j.CustomerOrderNo ?? '',
		contactPerson: j.ContactPerson ?? '',
		phone: j.Phone ?? '',
		comments: j.Comments ?? '',
		notes: j.Notes ?? '',
		custom1: j.Custom1 ?? '',
		custom2: j.Custom2 ?? '',
		custom3: j.Custom3 ?? '',
		custom4: j.Custom4 ?? '',
		wipAccount: j.WIPAccount ?? '',
	}));

	return {
		jobs,
		currentFilter: filterKey,
		filters: Object.entries(JOB_FILTERS).map(([key, val]) => ({
			key,
			label: val.label
		})),
		count: response.metadata?.count ?? jobs.length
	};
};
