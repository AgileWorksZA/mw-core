import { apiGet } from '$lib/api/client';
import {
	TRANSACTION_TYPE_FILTERS,
	TRANSACTION_STATUS_FILTERS,
	type TransactionTypeFilterKey,
	type TransactionStatusFilterKey
} from '$lib/api/filters';
import type { ApiResponse, TransactionRecord, TransactionListItem } from '$lib/api/types';
import { TX_TYPE_LABELS } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const typeKey = (url.searchParams.get('type') || 'all') as TransactionTypeFilterKey;
	const statusKey = (url.searchParams.get('status') || 'all') as TransactionStatusFilterKey;

	const typeDef = TRANSACTION_TYPE_FILTERS[typeKey] ?? TRANSACTION_TYPE_FILTERS.all;
	const statusDef = TRANSACTION_STATUS_FILTERS[statusKey] ?? TRANSACTION_STATUS_FILTERS.all;

	const filters: string[] = [];
	if (typeDef.filter) filters.push(typeDef.filter);
	if (statusDef.filter) filters.push(statusDef.filter);
	const combined = filters.length > 0 ? filters.join(' AND ') : undefined;

	let response: ApiResponse<TransactionRecord[]>;
	try {
		response = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token: locals.token,
			filter: combined,
			format: 'full',
			limit: 200
		});
	} catch {
		response = { data: [], metadata: { count: 0 } } as any;
	}

	const transactions: TransactionListItem[] = response.data.map((t) => {
		const baseType = (t.Type ?? '').substring(0, 2);
		return {
			id: t.Sequencenumber,
			type: baseType,
			typeLabel: TX_TYPE_LABELS[baseType] ?? t.Type,
			status: t.Status ?? '',
			ourRef: t.Ourref ?? '',
			theirRef: t.Theirref ?? '',
			nameCode: t.Namecode ?? '',
			description: t.Description ?? '',
			date: t.Transdate ?? '',
			dueDate: t.Duedate ?? '',
			period: t.Period ?? 0,
			gross: t.Gross ?? 0,
			amtPaid: t.Amtpaid ?? 0,
			outstanding: (t.Gross ?? 0) - (t.Amtpaid ?? 0),
			colour: t.Colour ?? 0,
			hold: t.Hold ?? false
		};
	});

	return {
		transactions,
		currentType: typeKey,
		currentStatus: statusKey,
		typeFilters: Object.entries(TRANSACTION_TYPE_FILTERS).map(([key, val]) => ({
			key,
			label: val.label
		})),
		statusFilters: Object.entries(TRANSACTION_STATUS_FILTERS).map(([key, val]) => ({
			key,
			label: val.label
		})),
		count: response.metadata.count
	};
};
