import { error } from '@sveltejs/kit';
import { apiGet, ApiError } from '$lib/api/client';
import type { ApiResponse } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { code } = params;
	const token = locals.token;

	let assetRes: any;
	let categoriesRes: any;
	let logRes: any;

	try {
		[assetRes, categoriesRes, logRes] = await Promise.all([
			apiGet<ApiResponse<any[]>>('/tables/asset', { token, filter: `Code="${code}"` }),
			apiGet<ApiResponse<any[]>>('/tables/assetcategory', { token, limit: 100 })
				.catch(() => ({ data: [] })),
			apiGet<ApiResponse<any[]>>('/tables/assetlog', { token, filter: `AssetCode="${code}"`, limit: 500 })
				.catch(() => ({ data: [] })),
		]);
	} catch (err) {
		if (err instanceof ApiError) {
			throw error(err.status === 401 ? 401 : 502, `API error: ${err.message}`);
		}
		throw error(500, `Failed to load asset: ${err}`);
	}

	const a = assetRes.data?.[0];
	if (!a) {
		throw error(404, `Asset "${code}" not found`);
	}

	const statusLabels: Record<string, string> = {
		NEW: 'New', ACT: 'Active', NDP: 'Non-Depr.', OTH: 'Other', DSP: 'Disposed'
	};
	const typeLabels: Record<string, string> = { SL: 'Straight Line', DV: 'Diminishing Value' };
	const actionLabels: Record<string, string> = {
		AA: 'Acquisition', AD: 'Disposal', AP: 'Part Disposal',
		DS: 'Depreciation (SL)', DD: 'Depreciation (DV)', ME: 'Memo', RV: 'Revaluation'
	};

	const costPerUnit = a.CostPerUnit ?? a.Costperunit ?? 0;
	const qty = a.Qty ?? 1;
	const accumDepr = a.AccumDepreciation ?? a.Accumdepreciation ?? 0;
	const isLocked = (a.Status === 'ACT' || a.Status === 'DSP');

	const asset = {
		code: a.Code ?? '',
		description: a.Description ?? '',
		category: a.Category ?? '',
		serialNum: a.SerialNum ?? a.Serialnum ?? '',
		qty,
		expectedLife: a.ExpectedLife ?? a.Expectedlife ?? 0,
		residualValue: a.ResidualValue ?? a.Residualvalue ?? 0,
		costPerUnit,
		totalCost: costPerUnit * qty,
		accumDepreciation: accumDepr,
		bookValue: costPerUnit * qty - accumDepr,
		status: a.Status ?? 'NEW',
		statusLabel: statusLabels[a.Status] ?? a.Status ?? '',
		type: a.Type ?? '',
		typeLabel: typeLabels[a.Type] ?? a.Type ?? '',
		rate: a.Rate ?? 0,
		acquiredDate: a.AcquiredDate ?? a.Acquireddate ?? '',
		lastDepreciated: a.LastDepreciated ?? a.Lastdepreciated ?? '',
		lastDisposed: a.LastDisposed ?? a.Lastdisposed ?? '',
		privateUsePercent: a.PrivateUsePercent ?? a.Privateusepercent ?? 0,
		location: a.Location ?? '',
		department: a.Department ?? '',
		linkedTransaction: a.LinkedTransaction ?? a.Linkedtransaction ?? 0,
		custom1: a.Custom1 ?? '',
		custom2: a.Custom2 ?? '',
		custom3: a.Custom3 ?? '',
		custom4: a.Custom4 ?? '',
		comments: a.Comments ?? '',
		colour: a.Colour ?? 0,
		isLocked,
	};

	const history = (logRes.data ?? []).map((l: any) => ({
		date: l.Date ?? '',
		action: l.Action ?? '',
		actionLabel: actionLabels[l.Action] ?? l.Action ?? '',
		amount: l.Amount ?? 0,
		description: l.Description ?? '',
		transactionSeqNum: l.TransactionSeqNum ?? l.Transactionseqnum ?? 0,
	}));

	const categories = (categoriesRes.data ?? []).map((c: any) => ({
		code: c.Code ?? '',
		description: c.Description ?? '',
		depreciationType: c.DepreciationType ?? c.Type ?? '',
		depreciationRate: c.DepreciationRate ?? c.Rate ?? 0,
	}));

	return { asset, history, categories };
};
