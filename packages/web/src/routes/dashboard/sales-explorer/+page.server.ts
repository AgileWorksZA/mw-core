import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: 'left(Type,2)="DI" AND Status="P"', limit: 5000
		});
	} catch {
		return { topProducts: [], topCustomers: [] };
	}

	const all = txRes.data ?? [];

	// Aggregate by customer
	const customerMap = new Map<string, number>();
	for (const t of all) {
		const name = t.Tofrom ?? t.Namecode ?? 'Unknown';
		customerMap.set(name, (customerMap.get(name) ?? 0) + (t.Gross ?? 0));
	}
	const topCustomers = Array.from(customerMap.entries())
		.map(([name, revenue]) => ({ name, revenue }))
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, 10);

	// Aggregate by description (proxy for product — Detail table would be better)
	const productMap = new Map<string, number>();
	for (const t of all) {
		const desc = t.Description ?? 'Other';
		if (desc) productMap.set(desc, (productMap.get(desc) ?? 0) + (t.Gross ?? 0));
	}
	const topProducts = Array.from(productMap.entries())
		.map(([name, revenue]) => ({ name, revenue }))
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, 10);

	return { topProducts, topCustomers };
};
