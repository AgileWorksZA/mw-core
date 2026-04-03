import { apiGet } from '$lib/api/client';
import type { PageServerLoad } from './$types';

interface ImportExportItem {
	id: string;
	name: string;
	description: string;
	type: 'import' | 'export';
	enabled: boolean;
}

const ITEMS: ImportExportItem[] = [
	{ id: 'import-names', name: 'Names', description: 'Import customer/supplier records from CSV', type: 'import', enabled: false },
	{ id: 'import-items', name: 'Items', description: 'Import product/item records', type: 'import', enabled: false },
	{ id: 'import-accounts', name: 'Accounts', description: 'Import chart of accounts', type: 'import', enabled: false },
	{ id: 'import-transactions', name: 'Transactions', description: 'Import transactions from text file', type: 'import', enabled: false },
	{ id: 'import-bank', name: 'Bank Statement', description: 'Import OFX/QIF/CSV bank statement', type: 'import', enabled: false },
	{ id: 'export-accounts', name: 'Chart of Accounts', description: 'Download all accounts as CSV', type: 'export', enabled: true },
	{ id: 'export-names', name: 'Names / Contacts', description: 'Download all customer & supplier records', type: 'export', enabled: true },
	{ id: 'export-items', name: 'Products / Items', description: 'Download all product records', type: 'export', enabled: true },
	{ id: 'export-transactions', name: 'Transactions', description: 'Download all transactions', type: 'export', enabled: true },
	{ id: 'export-trial-balance', name: 'Trial Balance', description: 'Export trial balance report', type: 'export', enabled: true },
];

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Fetch available tables for export
	let tables: string[] = [];
	if (token) {
		try {
			const res = await apiGet<{ data: Array<{ name: string }> }>('/tables', { token });
			tables = (res.data ?? []).map((t) => t.name);
		} catch {
			// ignore
		}
	}

	const imports = ITEMS.filter((i) => i.type === 'import');
	const exports = ITEMS.filter((i) => i.type === 'export');
	return { imports, exports, tables };
};
