import { apiGet } from '$lib/api/client';
import type { ApiResponse, NameRecord, AccountRecord, ProductRecord, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

interface SearchResult {
	type: 'name' | 'account' | 'item' | 'transaction';
	label: string;
	subtitle: string;
	href: string;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams.get('q') || '';
	const token = locals.token;

	if (!query.trim()) {
		return { query, results: [], counts: { names: 0, accounts: 0, items: 0, transactions: 0 } };
	}

	const q = query.trim();
	const results: SearchResult[] = [];

	// MWScript uses left(field, N)="value" for prefix search
	const len = q.length;
	let namesRes: any, accountsRes: any, itemsRes: any, txRes: any;
	try {
		[namesRes, accountsRes, itemsRes, txRes] = await Promise.all([
			apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
				token, filter: `left(Name,${len})="${q}" OR left(Code,${len})="${q}"`, limit: 20
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', {
				token, filter: `left(Description,${len})="${q}" OR left(Code,${len})="${q}"`, limit: 20
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<ProductRecord[]>>('/tables/product', {
				token, filter: `left(Description,${len})="${q}" OR left(Code,${len})="${q}"`, limit: 20
			}).catch(() => ({ data: [] })),
			apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
				token, filter: `left(Description,${len})="${q}" OR left(Ourref,${len})="${q}" OR left(Namecode,${len})="${q}"`, limit: 20
			}).catch(() => ({ data: [] }))
		]);
	} catch {
		return { query, results: [], counts: { names: 0, accounts: 0, items: 0, transactions: 0 } };
	}

	const names = namesRes.data ?? [];
	const accounts = accountsRes.data ?? [];
	const items = itemsRes.data ?? [];
	const transactions = txRes.data ?? [];

	for (const n of names) {
		results.push({
			type: 'name', label: n.Name ?? n.Code ?? '',
			subtitle: `${n.Code} — ${n.Phone ?? ''}`,
			href: `/names/${n.Code}`
		});
	}
	for (const a of accounts) {
		results.push({
			type: 'account', label: `${a.Code}: ${a.Description ?? ''}`,
			subtitle: `Type: ${a.Type ?? ''}`,
			href: `/accounts/${a.Code}`
		});
	}
	for (const p of items) {
		results.push({
			type: 'item', label: p.Description ?? p.Code ?? '',
			subtitle: `${p.Code} — ${p.Type ?? ''}`,
			href: `/items/${p.Code}`
		});
	}
	for (const t of transactions) {
		results.push({
			type: 'transaction', label: `${t.Ourref ?? ''}: ${t.Description ?? ''}`,
			subtitle: `${t.Transdate ?? ''} — ${t.Tofrom ?? t.Namecode ?? ''}`,
			href: `/transactions/${t.Sequencenumber}`
		});
	}

	return {
		query, results,
		counts: {
			names: names.length, accounts: accounts.length,
			items: items.length, transactions: transactions.length
		}
	};
};
