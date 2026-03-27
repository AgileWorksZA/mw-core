import { apiGet } from '$lib/api/client';
import { ITEM_FILTERS, type ItemFilterKey } from '$lib/api/filters';
import type { ApiResponse, ProductRecord, ItemListItem } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const filterKey = (url.searchParams.get('filter') || 'all') as ItemFilterKey;
	const filterDef = ITEM_FILTERS[filterKey] ?? ITEM_FILTERS.all;

	let response: ApiResponse<ProductRecord[]>;
	try {
		response = await apiGet<ApiResponse<ProductRecord[]>>('/tables/product', {
			token: locals.token,
			filter: filterDef.filter,
			format: 'full',
			limit: 500
		});
	} catch {
		response = { data: [], metadata: { count: 0 } } as any;
	}

	const items: ItemListItem[] = response.data.map((p) => ({
		code: p.Code,
		description: p.Description,
		sellPrice: p.Sellprice ?? 0,
		unit: p.Sellunit ?? '',
		stockOnHand: p.Stockonhand ?? 0,
		colour: p.Colour ?? 0,
		type: p.Type ?? '',
		supplier: p.Supplier ?? '',
		category1: p.Category1 ?? ''
	}));

	return {
		items,
		currentFilter: filterKey,
		filters: Object.entries(ITEM_FILTERS).map(([key, val]) => ({
			key,
			label: val.label
		})),
		count: response.metadata.count
	};
};
