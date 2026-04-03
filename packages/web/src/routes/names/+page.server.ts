import { apiGet } from '$lib/api/client';
import { NAME_FILTERS, type NameFilterKey } from '$lib/api/filters';
import type { ApiResponse, NameRecord, NameListItem } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const filterKey = (url.searchParams.get('filter') || 'all') as NameFilterKey;
	const filterDef = NAME_FILTERS[filterKey] ?? NAME_FILTERS.all;

	const find = url.searchParams.get('find') || '';
	let composedFilter = filterDef.filter;
	if (find) composedFilter = composedFilter ? `${composedFilter} AND ${find}` : find;

	const response = await apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
		token: locals.token,
		filter: composedFilter,
		format: 'full',
		limit: 500
	});

	const names: NameListItem[] = response.data.map((n) => ({
		code: n.Code,
		name: n.Name,
		phone: n.Phone,
		category: n.Category1,
		colour: n.Colour,
		customerType: n.CustomerType,
		supplierType: n.SupplierType,
		hold: n.Hold,
		dBalance: n.DCurrent + n.D30Plus + n.D60Plus + n.D90Plus,
		cBalance: n.CCurrent
	}));

	return {
		names,
		currentFilter: filterKey,
		filters: Object.entries(NAME_FILTERS).map(([key, val]) => ({
			key,
			label: val.label
		})),
		count: response.metadata.count
	};
};
