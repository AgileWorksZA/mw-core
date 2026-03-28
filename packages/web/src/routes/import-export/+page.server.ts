import type { PageServerLoad } from './$types';

interface ImportExportItem {
	id: string;
	name: string;
	description: string;
	type: 'import' | 'export';
}

const ITEMS: ImportExportItem[] = [
	{ id: 'import-names', name: 'Names', description: 'Import customer/supplier records from CSV', type: 'import' },
	{ id: 'import-items', name: 'Items', description: 'Import product/item records', type: 'import' },
	{ id: 'import-accounts', name: 'Accounts', description: 'Import chart of accounts', type: 'import' },
	{ id: 'import-transactions', name: 'Transactions', description: 'Import transactions from text file', type: 'import' },
	{ id: 'import-bank', name: 'Bank Statement', description: 'Import OFX/QIF/CSV bank statement', type: 'import' },
	{ id: 'import-budgets', name: 'Budgets', description: 'Import budget figures', type: 'import' },
	{ id: 'import-assets', name: 'Assets', description: 'Import fixed asset records', type: 'import' },
	{ id: 'import-taxcodes', name: 'Tax Codes', description: 'Import tax code definitions', type: 'import' },
	{ id: 'export-selection', name: 'Export Selection', description: 'Export current filtered records as CSV/TSV', type: 'export' },
	{ id: 'export-accountant', name: "Accountant's Export", description: 'Comprehensive export package for accountant review', type: 'export' },
	{ id: 'export-xml', name: 'XML Export', description: 'Export in MoneyWorks XML format', type: 'export' },
];

export const load: PageServerLoad = async () => {
	const imports = ITEMS.filter((i) => i.type === 'import');
	const exports = ITEMS.filter((i) => i.type === 'export');
	return { imports, exports };
};
