import { apiGet } from '$lib/api/client';
import { ASSET_FILTERS, type AssetFilterKey } from '$lib/api/filters';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const filterKey = (url.searchParams.get('filter') || 'all') as AssetFilterKey;
	const filterDef = ASSET_FILTERS[filterKey] ?? ASSET_FILTERS.all;
	const find = url.searchParams.get('find') || '';

	let composedFilter = filterDef.filter;
	if (find) composedFilter = composedFilter ? `${composedFilter} AND ${find}` : find;

	let response: ApiResponse<any[]>;
	try {
		response = await apiGet<ApiResponse<any[]>>('/tables/asset', {
			token,
			filter: composedFilter,
			format: 'full',
			limit: 500
		});
	} catch {
		response = { data: [], metadata: { count: 0 } } as any;
	}

	const statusLabels: Record<string, string> = {
		NEW: 'New', ACT: 'Active', NDP: 'Non-Depr.', OTH: 'Other', DSP: 'Disposed'
	};
	const typeLabels: Record<string, string> = { SL: 'Straight Line', DV: 'Diminishing Value' };

	const assets = (response.data ?? []).map((a: any) => {
		const costPerUnit = a.CostPerUnit ?? a.Costperunit ?? 0;
		const qty = a.Qty ?? 1;
		const cost = costPerUnit * qty;
		const accumDepr = a.AccumDepreciation ?? a.Accumdepreciation ?? 0;
		return {
			code: a.Code ?? '',
			description: a.Description ?? '',
			category: a.Category ?? '',
			status: a.Status ?? '',
			statusLabel: statusLabels[a.Status] ?? a.Status ?? '',
			cost,
			accumDepreciation: accumDepr,
			bookValue: cost - accumDepr,
			rate: a.Rate ?? 0,
			type: a.Type ?? '',
			typeLabel: typeLabels[a.Type] ?? a.Type ?? '',
			acquiredDate: a.AcquiredDate ?? a.Acquireddate ?? '',
			lastDepreciated: a.LastDepreciated ?? a.Lastdepreciated ?? '',
			location: a.Location ?? '',
			department: a.Department ?? '',
			serialNum: a.SerialNum ?? a.Serialnum ?? '',
			qty,
			colour: a.Colour ?? 0,
			expectedLife: a.ExpectedLife ?? a.Expectedlife ?? 0,
			residualValue: a.ResidualValue ?? a.Residualvalue ?? 0,
			privateUsePercent: a.PrivateUsePercent ?? a.Privateusepercent ?? 0,
			custom1: a.Custom1 ?? '',
			custom2: a.Custom2 ?? '',
			custom3: a.Custom3 ?? '',
			custom4: a.Custom4 ?? '',
			comments: a.Comments ?? '',
			linkedTransaction: a.LinkedTransaction ?? a.Linkedtransaction ?? 0,
		};
	});

	const totalCost = assets.reduce((s, a) => s + a.cost, 0);
	const totalDepr = assets.reduce((s, a) => s + a.accumDepreciation, 0);

	return {
		assets,
		currentFilter: filterKey,
		filters: Object.entries(ASSET_FILTERS).map(([key, val]) => ({ key, label: val.label })),
		count: response.metadata?.count ?? assets.length,
		totals: { cost: totalCost, depreciation: totalDepr, bookValue: totalCost - totalDepr }
	};
};
