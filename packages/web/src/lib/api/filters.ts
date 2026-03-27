/** MWScript filter expressions for the Names list */
export const NAME_FILTERS: Record<string, { label: string; filter?: string }> = {
	all: { label: 'All' },
	customers: { label: 'Customers', filter: 'CustomerType>="1"' },
	'cash-customers': { label: 'Cash-only Customers', filter: 'CustomerType="1"' },
	debtors: { label: 'Debtors', filter: 'CustomerType="2"' },
	suppliers: { label: 'Suppliers', filter: 'SupplierType>="1"' },
	'cash-suppliers': { label: 'Cash-only Suppliers', filter: 'SupplierType="1"' },
	creditors: { label: 'Creditors', filter: 'SupplierType="2"' },
	others: { label: 'Others', filter: 'CustomerType="0" AND SupplierType="0"' }
};

export type NameFilterKey = keyof typeof NAME_FILTERS;

/** MWScript filter expressions for the Transactions list.
 * MoneyWorks uses 3-char type codes (DIC, DII, etc.) — use left() to match base type. */
export const TRANSACTION_TYPE_FILTERS: Record<string, { label: string; filter?: string }> = {
	all: { label: 'All' },
	'sales-invoices': { label: 'Sales Invoices', filter: 'left(Type,2)="DI"' },
	'purchase-invoices': { label: 'Purchase Invoices', filter: 'left(Type,2)="CI"' },
	receipts: { label: 'Receipts', filter: 'left(Type,2)="CR"' },
	payments: { label: 'Payments', filter: 'left(Type,2)="CP"' },
	'sales-orders': { label: 'Sales Orders', filter: 'left(Type,2)="SO"' },
	'purchase-orders': { label: 'Purchase Orders', filter: 'left(Type,2)="PO"' },
	quotes: { label: 'Quotes', filter: 'Type="QU"' },
	journals: { label: 'Journals', filter: 'left(Type,2)="JN"' }
};

export const TRANSACTION_STATUS_FILTERS: Record<string, { label: string; filter?: string }> = {
	all: { label: 'All' },
	posted: { label: 'Posted', filter: 'Status="P"' },
	unposted: { label: 'Unposted', filter: 'Status="U"' }
};

export type TransactionTypeFilterKey = keyof typeof TRANSACTION_TYPE_FILTERS;
export type TransactionStatusFilterKey = keyof typeof TRANSACTION_STATUS_FILTERS;
