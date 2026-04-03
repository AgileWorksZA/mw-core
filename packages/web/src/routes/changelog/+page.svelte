<script lang="ts">
	interface ChangelogEntry {
		date: string;
		version: string;
		title: string;
		items: Array<{
			type: 'new' | 'improved' | 'fix';
			text: string;
			href?: string;
		}>;
	}

	const changelog: ChangelogEntry[] = [
		{
			date: '2026-04-03',
			version: '0.9.0',
			title: 'Jobs & Project Costing',
			items: [
				{ type: 'new', text: 'Jobs list with status filters (Active / Completed / On Hold)', href: '/jobs' },
				{ type: 'new', text: 'Job detail view with 5 tabs (Details, Comments, Pending, Processed, Budget)', href: '/jobs' },
				{ type: 'new', text: 'Job Timesheet — batch time entry against jobs', href: '/jobs/timesheet' },
				{ type: 'new', text: 'Bill Job — generate invoice from unbilled job costs', href: '/jobs/bill' },
				{ type: 'new', text: 'WIP Journal — create reversing work-in-progress journals', href: '/jobs/wip-journal' },
				{ type: 'new', text: 'Items: History tab — transaction history per product', href: '/items' },
				{ type: 'new', text: 'Items: Costing tab — cost analysis, margins, stock valuation', href: '/items' },
				{ type: 'new', text: 'Items: BOM tab — bill of materials components', href: '/items' },
			]
		},
		{
			date: '2026-04-02',
			version: '0.8.0',
			title: 'DataListView & Settings',
			items: [
				{ type: 'new', text: 'Settings & Preferences — 7-tab page (Company, Tax, Sequences, Terms, Data Entry, Locale, System)', href: '/preferences' },
				{ type: 'new', text: 'DataListView — reusable list component with search, column picker, export, advanced find', href: '/customers' },
				{ type: 'new', text: 'Column Picker — show/hide and drag-reorder columns, persisted per entity', href: '/items' },
				{ type: 'new', text: 'Advanced Find — modal with field/operator/value criteria builder', href: '/names' },
				{ type: 'new', text: 'Sortable column headers — click to sort asc/desc on any column', href: '/accounts' },
				{ type: 'new', text: 'Server-side advanced find (?find= URL param) on all list pages', href: '/transactions' },
				{ type: 'new', text: 'CSV Export from any list view', href: '/suppliers' },
				{ type: 'improved', text: 'Customers list — migrated to DataListView with search & export', href: '/customers' },
				{ type: 'improved', text: 'Suppliers list — migrated to DataListView', href: '/suppliers' },
				{ type: 'improved', text: 'Items list — migrated with sidebar filters', href: '/items' },
				{ type: 'improved', text: 'Names list — migrated with type filters', href: '/names' },
				{ type: 'improved', text: 'Accounts list — migrated with account type filters', href: '/accounts' },
				{ type: 'improved', text: 'Transactions list — migrated with dual Type+Status filters', href: '/transactions' },
				{ type: 'improved', text: 'Tax Rates list — migrated to DataListView', href: '/tax-rates' },
				{ type: 'improved', text: 'Assets list — migrated with summary cards and footer totals', href: '/assets' },
			]
		},
		{
			date: '2026-03-30',
			version: '0.7.0',
			title: 'Import/Export & Transaction Forms',
			items: [
				{ type: 'new', text: 'CSV Import with file upload, preview, and table selection', href: '/import-export' },
				{ type: 'new', text: 'CSV Export for Import/Export page', href: '/import-export' },
				{ type: 'new', text: 'New Sales Invoice form with item lines and tax calculation', href: '/invoices/sales/new' },
				{ type: 'new', text: 'New Purchase Order form', href: '/orders/purchases/new' },
				{ type: 'new', text: 'New Journal Entry form', href: '/journals/new' },
				{ type: 'fix', text: 'Journal entry detail format — Gross/Net/Tax per line' },
				{ type: 'fix', text: 'MW import format fixes + shared error handling' },
			]
		},
		{
			date: '2026-03-28',
			version: '0.6.0',
			title: 'Enquiries & Receive Goods',
			items: [
				{ type: 'new', text: 'Purchase Enquiry — 4-tab upgrade with supplier analysis', href: '/enquiry/purchases' },
				{ type: 'new', text: 'Receive Goods — PO drill-down for goods receipt', href: '/receive-goods' },
				{ type: 'new', text: 'Account Enquiry — balances, graph, movements', href: '/enquiry/account' },
				{ type: 'new', text: 'Sales Enquiry — customer sales analysis', href: '/enquiry/sales' },
			]
		},
		{
			date: '2026-03-25',
			version: '0.5.0',
			title: 'Core List Views & Detail Pages',
			items: [
				{ type: 'new', text: 'Dashboard Overview with profit, current ratio, bank balances', href: '/dashboard' },
				{ type: 'new', text: 'Customers & Suppliers lists', href: '/customers' },
				{ type: 'new', text: 'Names detail with 5 tabs (Balances, Details, Pricing, Bank, Contacts)', href: '/names' },
				{ type: 'new', text: 'Items detail with 4 tabs (Details, Buying, Selling, Inventory)', href: '/items' },
				{ type: 'new', text: 'Chart of Accounts with type filters', href: '/accounts' },
				{ type: 'new', text: 'Transactions list with type and status filters', href: '/transactions' },
				{ type: 'new', text: 'Receipts & Payments entry forms', href: '/receipts' },
				{ type: 'new', text: 'Bank Reconciliation', href: '/bank-reconciliation' },
				{ type: 'new', text: 'Fixed Assets register', href: '/assets' },
			]
		}
	];

	const typeBadge: Record<string, { label: string; class: string }> = {
		new: { label: 'New', class: 'bg-positive/10 text-positive' },
		improved: { label: 'Improved', class: 'bg-blue-500/10 text-blue-500' },
		fix: { label: 'Fix', class: 'bg-amber-500/10 text-amber-500' },
	};
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-6">
		<h1 class="font-headline text-xl font-bold">Changelog</h1>
		<p class="text-sm text-muted-foreground">Recently added features and improvements</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-3xl space-y-8">
			{#each changelog as entry}
				<div>
					<!-- Version header -->
					<div class="flex items-center gap-3 mb-4">
						<span class="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{entry.version}</span>
						<h2 class="font-headline text-lg font-semibold">{entry.title}</h2>
						<span class="text-xs text-muted-foreground">{entry.date}</span>
					</div>

					<!-- Items -->
					<div class="space-y-1.5 ml-1">
						{#each entry.items as item}
							<div class="flex items-start gap-2 text-sm">
								<span class="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold {typeBadge[item.type].class}">
									{typeBadge[item.type].label}
								</span>
								{#if item.href}
									<a href={item.href} class="hover:text-primary hover:underline">{item.text}</a>
								{:else}
									<span class="text-muted-foreground">{item.text}</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
