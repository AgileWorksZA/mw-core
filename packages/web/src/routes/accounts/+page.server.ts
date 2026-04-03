import { apiGet } from '$lib/api/client';
import { ACCOUNT_FILTERS, type AccountFilterKey } from '$lib/api/filters';
import type { ApiResponse, AccountRecord, AccountListItem } from '$lib/api/types';
import { ACCOUNT_TYPE_LABELS } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const filterKey = (url.searchParams.get('filter') || 'all') as AccountFilterKey;
	const filterDef = ACCOUNT_FILTERS[filterKey] ?? ACCOUNT_FILTERS.all;

	let response: ApiResponse<AccountRecord[]>;
	try {
		const find = url.searchParams.get('find') || '';
		let composedFilter = filterDef.filter;
		if (find) composedFilter = composedFilter ? `${composedFilter} AND ${find}` : find;

		response = await apiGet<ApiResponse<AccountRecord[]>>('/tables/account', {
			token: locals.token,
			filter: composedFilter,
			format: 'full',
			limit: 500
		});
	} catch {
		response = { data: [], metadata: { count: 0 } } as any;
	}

	const accounts: AccountListItem[] = response.data.map((a) => ({
		code: a.Code ?? '',
		description: a.Description ?? '',
		type: a.Type ?? '',
		typeLabel: ACCOUNT_TYPE_LABELS[a.Type ?? ''] ?? a.Type ?? '',
		group: a.Group ?? '',
		category: a.Category ?? '',
		taxCode: a.TaxCode ?? '',
		colour: a.Colour ?? 0,
		system: a.System ?? '',
		bankAccountNumber: a.BankAccountNumber ?? ''
	}));

	return {
		accounts,
		currentFilter: filterKey,
		filters: Object.entries(ACCOUNT_FILTERS).map(([key, val]) => ({
			key,
			label: val.label
		})),
		count: response.metadata.count
	};
};
