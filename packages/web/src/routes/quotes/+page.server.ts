import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;
	const today = new Date().toISOString().split('T')[0];

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'Type="QU"', limit: 500
		});
	} catch {
		return { today, quotes: [], summary: { total: 0, totalGross: 0, expired: 0 } };
	}

	const all = txRes.data ?? [];
	const quotes = all.map((t) => {
		const dueDate = t.Duedate ?? '';
		return {
			seq: t.Sequencenumber ?? 0, ref: t.Ourref ?? '',
			nameCode: t.Namecode ?? '', name: t.Tofrom ?? t.Namecode ?? '',
			description: t.Description ?? '', date: t.Transdate ?? '', expires: dueDate,
			gross: t.Gross ?? 0,
			expired: dueDate !== '' && dueDate < today,
			colour: t.Colour ?? 0
		};
	});

	return {
		today, quotes,
		summary: {
			total: quotes.length,
			totalGross: quotes.reduce((s, q) => s + q.gross, 0),
			expired: quotes.filter((q) => q.expired).length
		}
	};
};
