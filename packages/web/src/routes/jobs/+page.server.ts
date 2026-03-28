import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Jobs are tracked via Analysis/Job codes on transactions
	// Since there's no Job table in the API yet, aggregate from transactions
	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'Status="P"', limit: 2000
		});
	} catch {
		return { jobs: [] };
	}

	// Group by analysis/job code (using the Description field that often contains job refs)
	// In MoneyWorks, the Analysis field holds job codes — map from available fields
	const all = txRes.data ?? [];

	// Since Job table is "upcoming", show a placeholder with transaction-based summary
	return {
		jobs: [],
		message: 'Job table support coming soon. Jobs will be tracked via the Analysis field on transactions.'
	};
};
