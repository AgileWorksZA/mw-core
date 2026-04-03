/**
 * Per-entity column definitions for DataListView.
 * Each entity declares all available columns, default visible set, and search fields.
 */

export interface ColumnDef {
	key: string;
	label: string;
	align?: 'left' | 'right' | 'center';
	width?: string;
	mono?: boolean;
	/** Format function for display */
	format?: (value: any, row: Record<string, any>) => string;
	/** CSS class or function returning class */
	class?: string | ((value: any, row: Record<string, any>) => string);
}

export interface EntityConfig {
	/** Display name of the entity */
	label: string;
	/** API table name */
	table: string;
	/** All available columns */
	columns: ColumnDef[];
	/** Keys of columns shown by default */
	defaultVisible: string[];
	/** Fields to search across (client-side) */
	searchFields: string[];
	/** URL path for detail view, with {code} placeholder */
	detailHref?: string;
	/** Field to use as the row identifier */
	codeField?: string;
}

// ─── Names (Customers / Suppliers) ───────────────────────────────────

export const nameColumns: ColumnDef[] = [
	{ key: 'code', label: 'Code', mono: true, width: '120px' },
	{ key: 'name', label: 'Name', class: 'font-medium' },
	{ key: 'phone', label: 'Phone', class: 'text-muted-foreground' },
	{ key: 'email', label: 'Email', class: 'text-muted-foreground' },
	{ key: 'contact', label: 'Contact', class: 'text-muted-foreground' },
	{ key: 'address', label: 'Address', class: 'text-muted-foreground' },
	{ key: 'city', label: 'City', class: 'text-muted-foreground' },
	{ key: 'postCode', label: 'Post Code', mono: true },
	{ key: 'category', label: 'Category', class: 'text-muted-foreground' },
	{ key: 'customerType', label: 'Cust. Type', align: 'center' },
	{ key: 'supplierType', label: 'Supp. Type', align: 'center' },
	{ key: 'balance', label: 'Balance', align: 'right', mono: true },
	{ key: 'creditLimit', label: 'Credit Limit', align: 'right', mono: true },
	{ key: 'currency', label: 'Currency', mono: true },
	{ key: 'hold', label: 'Hold', align: 'center' },
];

export const nameConfig: EntityConfig = {
	label: 'Names',
	table: 'name',
	columns: nameColumns,
	defaultVisible: ['code', 'name', 'phone', 'email', 'category', 'balance'],
	searchFields: ['code', 'name', 'phone', 'email', 'contact'],
	detailHref: '/names/{code}',
	codeField: 'code',
};

// ─── Items / Products ────────────────────────────────────────────────

export const itemColumns: ColumnDef[] = [
	{ key: 'code', label: 'Code', mono: true, width: '120px' },
	{ key: 'description', label: 'Description', class: 'font-medium' },
	{ key: 'type', label: 'Type', class: 'text-muted-foreground' },
	{ key: 'sellPrice', label: 'Sell Price', align: 'right', mono: true },
	{ key: 'buyPrice', label: 'Buy Price', align: 'right', mono: true },
	{ key: 'unit', label: 'Unit', class: 'text-muted-foreground' },
	{ key: 'stockOnHand', label: 'Stock', align: 'right', mono: true },
	{ key: 'reorderLevel', label: 'Reorder Lvl', align: 'right', mono: true },
	{ key: 'category1', label: 'Category 1', class: 'text-muted-foreground' },
	{ key: 'category2', label: 'Category 2', class: 'text-muted-foreground' },
	{ key: 'colour', label: 'Colour', align: 'center' },
	{ key: 'taxCode', label: 'Tax Code', mono: true },
	{ key: 'account', label: 'Account', mono: true },
	{ key: 'barcode', label: 'Barcode', mono: true },
];

export const itemConfig: EntityConfig = {
	label: 'Items',
	table: 'product',
	columns: itemColumns,
	defaultVisible: ['code', 'description', 'type', 'sellPrice', 'unit', 'stockOnHand', 'category1'],
	searchFields: ['code', 'description', 'barcode'],
	detailHref: '/items/{code}',
	codeField: 'code',
};

// ─── Accounts (Chart of Accounts) ───────────────────────────────────

export const accountColumns: ColumnDef[] = [
	{ key: 'code', label: 'Code', mono: true, width: '100px' },
	{ key: 'description', label: 'Description', class: 'font-medium' },
	{ key: 'type', label: 'Type', class: 'text-muted-foreground' },
	{ key: 'category', label: 'Category', class: 'text-muted-foreground' },
	{ key: 'balance', label: 'Balance', align: 'right', mono: true },
	{ key: 'department', label: 'Department', class: 'text-muted-foreground' },
	{ key: 'system', label: 'System', mono: true },
	{ key: 'watchAccount', label: 'Watch', align: 'center' },
	{ key: 'notes', label: 'Notes', class: 'text-muted-foreground' },
];

export const accountConfig: EntityConfig = {
	label: 'Accounts',
	table: 'account',
	columns: accountColumns,
	defaultVisible: ['code', 'description', 'type', 'category', 'balance'],
	searchFields: ['code', 'description', 'category'],
	detailHref: '/accounts/{code}',
	codeField: 'code',
};

// ─── Transactions ────────────────────────────────────────────────────

export const transactionColumns: ColumnDef[] = [
	{ key: 'ourRef', label: 'Reference', mono: true, width: '120px' },
	{ key: 'type', label: 'Type', mono: true, width: '60px' },
	{ key: 'date', label: 'Date', mono: true },
	{ key: 'status', label: 'Status', align: 'center', width: '60px' },
	{ key: 'period', label: 'Period', mono: true },
	{ key: 'nameCode', label: 'Name', class: 'text-muted-foreground' },
	{ key: 'description', label: 'Description' },
	{ key: 'gross', label: 'Gross', align: 'right', mono: true },
	{ key: 'tax', label: 'Tax', align: 'right', mono: true },
	{ key: 'net', label: 'Net', align: 'right', mono: true },
	{ key: 'outstanding', label: 'Outstanding', align: 'right', mono: true },
	{ key: 'dueDate', label: 'Due Date', mono: true },
	{ key: 'colour', label: 'Colour', align: 'center' },
];

export const transactionConfig: EntityConfig = {
	label: 'Transactions',
	table: 'transaction',
	columns: transactionColumns,
	defaultVisible: ['ourRef', 'type', 'date', 'status', 'nameCode', 'description', 'gross', 'outstanding'],
	searchFields: ['ourRef', 'nameCode', 'description'],
	detailHref: '/transactions/{id}',
	codeField: 'id',
};

// ─── Tax Rates ───────────────────────────────────────────────────────

export const taxRateColumns: ColumnDef[] = [
	{ key: 'code', label: 'Code', mono: true, width: '80px' },
	{ key: 'description', label: 'Description', class: 'font-medium' },
	{ key: 'rate', label: 'Rate %', align: 'right', mono: true },
	{ key: 'taxPaidAccount', label: 'Tax Paid Acct', mono: true },
	{ key: 'taxRecAccount', label: 'Tax Rec Acct', mono: true },
];

export const taxRateConfig: EntityConfig = {
	label: 'Tax Rates',
	table: 'taxrate',
	columns: taxRateColumns,
	defaultVisible: ['code', 'description', 'rate'],
	searchFields: ['code', 'description'],
};

// ─── Jobs ────────────────────────────────────────────────────────────

export const jobColumns: ColumnDef[] = [
	{ key: 'code', label: 'Code', mono: true, width: '100px' },
	{ key: 'name', label: 'Name', class: 'font-medium' },
	{ key: 'client', label: 'Client', class: 'text-muted-foreground' },
	{ key: 'status', label: 'Status', width: '80px' },
	{ key: 'billing', label: 'Billing', class: 'text-muted-foreground' },
	{ key: 'quotedAmount', label: 'Quoted', align: 'right', mono: true },
	{ key: 'billedToDate', label: 'Billed', align: 'right', mono: true },
	{ key: 'budget', label: 'Budget', align: 'right', mono: true },
	{ key: 'percentComplete', label: '% Complete', align: 'right', mono: true },
	{ key: 'startDate', label: 'Start', mono: true },
	{ key: 'targetDate', label: 'Target', mono: true },
	{ key: 'manager', label: 'Manager', class: 'text-muted-foreground' },
	{ key: 'description', label: 'Description' },
	{ key: 'category', label: 'Category', class: 'text-muted-foreground' },
	{ key: 'project', label: 'Project', mono: true },
	{ key: 'colour', label: 'Colour', align: 'center' },
];

export const jobConfig: EntityConfig = {
	label: 'Jobs',
	table: 'job',
	columns: jobColumns,
	defaultVisible: ['code', 'name', 'client', 'status', 'billing', 'quotedAmount', 'billedToDate', 'percentComplete', 'startDate'],
	searchFields: ['code', 'name', 'client', 'description', 'manager'],
	detailHref: '/jobs/{code}',
	codeField: 'code',
};

// ─── Assets ──────────────────────────────────────────────────────────

export const assetColumns: ColumnDef[] = [
	{ key: 'code', label: 'Code', mono: true, width: '120px' },
	{ key: 'description', label: 'Description', class: 'font-medium' },
	{ key: 'category', label: 'Category', class: 'text-muted-foreground' },
	{ key: 'status', label: 'Status', width: '80px' },
	{ key: 'cost', label: 'Cost', align: 'right', mono: true },
	{ key: 'accumDepreciation', label: 'Accum Depr.', align: 'right', mono: true },
	{ key: 'bookValue', label: 'Book Value', align: 'right', mono: true },
	{ key: 'rate', label: 'Rate %', align: 'right', mono: true },
	{ key: 'type', label: 'Depr. Type', class: 'text-muted-foreground' },
	{ key: 'acquiredDate', label: 'Acquired', mono: true },
	{ key: 'location', label: 'Location', class: 'text-muted-foreground' },
	{ key: 'department', label: 'Department', class: 'text-muted-foreground' },
	{ key: 'serialNum', label: 'Serial #', mono: true },
	{ key: 'qty', label: 'Qty', align: 'right', mono: true },
	{ key: 'colour', label: 'Colour', align: 'center' },
];

export const assetConfig: EntityConfig = {
	label: 'Fixed Assets',
	table: 'asset',
	columns: assetColumns,
	defaultVisible: ['code', 'description', 'category', 'status', 'cost', 'accumDepreciation', 'bookValue', 'rate', 'type', 'acquiredDate'],
	searchFields: ['code', 'description', 'category', 'location', 'serialNum'],
	detailHref: '/assets/{code}',
	codeField: 'code',
};

// ─── Asset Categories ────────────────────────────────────────────────

export const assetCategoryColumns: ColumnDef[] = [
	{ key: 'code', label: 'Code', mono: true, width: '100px' },
	{ key: 'description', label: 'Description', class: 'font-medium' },
	{ key: 'group', label: 'Group', class: 'text-muted-foreground' },
	{ key: 'depreciationType', label: 'Type', class: 'text-muted-foreground' },
	{ key: 'depreciationRate', label: 'Rate %', align: 'right', mono: true },
	{ key: 'lastDepreciated', label: 'Last Deprecated', mono: true },
	{ key: 'assetAccount', label: 'Asset Acct', mono: true },
	{ key: 'depreciationAccount', label: 'Depr. Acct', mono: true },
];

export const assetCategoryConfig: EntityConfig = {
	label: 'Asset Categories',
	table: 'assetcategory',
	columns: assetCategoryColumns,
	defaultVisible: ['code', 'description', 'group', 'depreciationType', 'depreciationRate', 'lastDepreciated'],
	searchFields: ['code', 'description', 'group'],
};

// ─── Registry ────────────────────────────────────────────────────────

export const ENTITY_CONFIGS: Record<string, EntityConfig> = {
	name: nameConfig,
	product: itemConfig,
	account: accountConfig,
	transaction: transactionConfig,
	taxrate: taxRateConfig,
	job: jobConfig,
	asset: assetConfig,
	assetcategory: assetCategoryConfig,
};
