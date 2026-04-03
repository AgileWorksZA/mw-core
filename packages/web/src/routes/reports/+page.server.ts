import type { PageServerLoad } from './$types';

interface ReportDef {
	id: string;
	name: string;
	description: string;
	category: string;
}

const REPORTS: ReportDef[] = [
	// Financial
	{ id: 'profit-month', name: 'Profit This Month', description: 'P&L for current month', category: 'Financial' },
	{ id: 'profit-year', name: 'Profit This Year', description: 'Year-to-date P&L', category: 'Financial' },
	{ id: 'profit-comparison', name: 'Profit Comparison', description: 'Period-over-period comparison', category: 'Financial' },
	{ id: 'balance-sheet', name: 'Balance Sheet', description: 'Assets, liabilities, equity', category: 'Financial' },
	{ id: 'account-movements', name: 'Account Movements', description: 'Account activity detail', category: 'Financial' },
	{ id: 'accounts-list', name: 'Accounts List', description: 'Full chart of accounts', category: 'Financial' },

	// Audit
	{ id: 'trial-balance', name: 'Trial Balance', description: 'Debit/credit balance per account', category: 'Audit' },
	{ id: 'ledger-report', name: 'Ledger Report', description: 'Detailed ledger transactions', category: 'Audit' },
	{ id: 'transaction-posting', name: 'Transaction Posting', description: 'Posting detail/journal entries', category: 'Audit' },

	// Budget
	{ id: 'budget-year', name: 'Financial Year', description: 'Budget vs actual for fiscal year', category: 'Budget' },
	{ id: 'forecast', name: 'Forecast', description: 'Forward-looking projections', category: 'Budget' },

	// Customer/Supplier
	{ id: 'aged-receivables', name: 'Aged Receivables', description: 'Customer aging by due date', category: 'Customer / Supplier' },
	{ id: 'aged-payables', name: 'Aged Payables', description: 'Supplier aging', category: 'Customer / Supplier' },
	{ id: 'customer-sales-month', name: 'Customer Sales by Month', description: 'Monthly sales per customer', category: 'Customer / Supplier' },
	{ id: 'customer-sales-summary', name: 'Customer Sales Summary', description: 'Summary per customer', category: 'Customer / Supplier' },
	{ id: 'customer-sales-item', name: 'Customer Sales by Item', description: 'Sales breakdown by item', category: 'Customer / Supplier' },
	{ id: 'address-list', name: 'Address List', description: 'Name/address directory', category: 'Customer / Supplier' },
	{ id: 'purchases-over-time', name: 'Purchases over Time', description: 'Purchase trends', category: 'Customer / Supplier' },

	// Item
	{ id: 'item-sales', name: 'Item Sales', description: 'Sales by item', category: 'Item' },
	{ id: 'backorders-product', name: 'Backorders by Product', description: 'Outstanding product orders', category: 'Item' },
	{ id: 'backorders-customer', name: 'Backorders by Customer', description: 'Outstanding orders by customer', category: 'Item' },

	// Job Costing
	{ id: 'job-active-list', name: 'Active Job List', description: 'Summary of all active jobs', category: 'Job Costing' },
	{ id: 'job-detailed', name: 'Job Detailed', description: 'Full job history with subtotals', category: 'Job Costing' },
	{ id: 'job-pl', name: 'Job P&L', description: 'Income vs expenditure per job', category: 'Job Costing' },
	{ id: 'job-pl-summary', name: 'Job P&L Summary', description: 'Totals only per job', category: 'Job Costing' },
	{ id: 'job-resource-summary', name: 'Job Resource Summary', description: 'Resource quantities and costs', category: 'Job Costing' },
	{ id: 'job-costcentre-summary', name: 'Job Cost Centre Summary', description: 'Outgoings by cost centre', category: 'Job Costing' },
	{ id: 'job-account-summary', name: 'Job Account Summary', description: 'Outgoings by GL account', category: 'Job Costing' },
];

export const load: PageServerLoad = async () => {
	// Group reports by category
	const categories: { name: string; reports: ReportDef[] }[] = [];
	for (const report of REPORTS) {
		let cat = categories.find((c) => c.name === report.category);
		if (!cat) {
			cat = { name: report.category, reports: [] };
			categories.push(cat);
		}
		cat.reports.push(report);
	}

	return { categories, totalReports: REPORTS.length };
};
