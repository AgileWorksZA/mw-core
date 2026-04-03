import { apiGet } from '$lib/api/client';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const find = url.searchParams.get('find') || '';

	let response: ApiResponse<any[]>;
	try {
		response = await apiGet<ApiResponse<any[]>>('/tables/assetcategory', {
			token,
			filter: find || undefined,
			format: 'full',
			limit: 100
		});
	} catch {
		response = { data: [], metadata: { count: 0 } } as any;
	}

	const typeLabels: Record<string, string> = { SL: 'Straight Line', DV: 'Diminishing Value' };

	const categories = (response.data ?? []).map((c: any) => ({
		code: c.Code ?? '',
		description: c.Description ?? '',
		group: c.Group ?? '',
		depreciationType: c.DepreciationType ?? c.Type ?? '',
		depreciationTypeLabel: typeLabels[c.DepreciationType ?? c.Type ?? ''] ?? '',
		depreciationRate: c.DepreciationRate ?? c.Rate ?? 0,
		lastDepreciated: c.LastDepreciated ?? '',
		assetAccount: c.AssetAccount ?? '',
		accumDepreciationAccount: c.AccumDepreciationAccount ?? '',
		depreciationAccount: c.DepreciationExpenseAccount ?? c.DepreciationAccount ?? '',
		personalUseEnabled: !!(c.PersonalUseEnabled),
		calculateDailyBasis: !!(c.CalculateDailyBasis),
	}));

	return { categories, count: response.metadata?.count ?? categories.length };
};
