<script lang="ts">
	let { company, pathname }: { company: string; pathname: string } = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Overview', icon: 'dashboard', group: 'Dashboards' },
		{ href: '/dashboard/daily-summary', label: 'Daily Summary', icon: 'calendar', group: 'Dashboards' },
		{ href: '/dashboard/income-expenses', label: 'Income & Expenses', icon: 'trending', group: 'Dashboards' },
		{ href: '/dashboard/yoy-income', label: 'YoY Income', icon: 'trending', group: 'Dashboards' },
		{ href: '/dashboard/ledger-chart', label: 'Ledger Chart', icon: 'trending', group: 'Dashboards' },
		{ href: '/dashboard/sales-explorer', label: 'Sales Explorer', icon: 'search', group: 'Dashboards' },
		{ href: '/dashboard/calendar', label: 'Calendar', icon: 'calendar', group: 'Dashboards' },
		{ href: '/quotes', label: 'Quotes', icon: 'file-text', group: 'Sales' },
		{ href: '/orders/sales', label: 'Sales Orders', icon: 'file-text', group: 'Sales' },
		{ href: '/invoices/sales', label: 'Sales Invoices', icon: 'file-text', group: 'Sales' },
		{ href: '/receivables', label: 'Receivables', icon: 'arrow-down', group: 'Sales' },
		{ href: '/customers', label: 'Customers', icon: 'users', group: 'Sales' },
		{ href: '/orders/purchases', label: 'Purchase Orders', icon: 'file-text', group: 'Purchases' },
		{ href: '/invoices/purchases', label: 'Purchase Invoices', icon: 'file-text', group: 'Purchases' },
		{ href: '/payables', label: 'Payables', icon: 'arrow-up', group: 'Purchases' },
		{ href: '/suppliers', label: 'Suppliers', icon: 'users', group: 'Purchases' },
		{ href: '/banking', label: 'Banking', icon: 'ledger', group: 'Cash & Banking' },
		{ href: '/receipts', label: 'Receipts', icon: 'arrow-down', group: 'Cash & Banking' },
		{ href: '/payments', label: 'Payments', icon: 'arrow-up', group: 'Cash & Banking' },
		{ href: '/journals', label: 'Journals', icon: 'file-text', group: 'Cash & Banking' },
		{ href: '/funds-transfer', label: 'Funds Transfer', icon: 'trending', group: 'Cash & Banking' },
		{ href: '/bank-reconciliation', label: 'Bank Rec', icon: 'ledger', group: 'Cash & Banking' },
		{ href: '/transactions', label: 'All Transactions', icon: 'file-text', group: 'Cash & Banking' },
		{ href: '/names', label: 'Names', icon: 'users', group: 'Master Data' },
		{ href: '/items', label: 'Items', icon: 'box', group: 'Master Data' },
		{ href: '/accounts', label: 'Accounts', icon: 'ledger', group: 'Master Data' },
		{ href: '/assets', label: 'Fixed Assets', icon: 'box', group: 'Master Data' },
		{ href: '/enquiry/sales', label: 'Sales Enquiry', icon: 'search', group: 'Enquiries' },
		{ href: '/enquiry/purchases', label: 'Purchase Enquiry', icon: 'cart', group: 'Enquiries' },
		{ href: '/reports', label: 'Reports', icon: 'file-text', group: 'Reports & Tools' },
		{ href: '/todo', label: 'To Do', icon: 'dashboard', group: 'Reports & Tools' },
		{ href: '/import-export', label: 'Import / Export', icon: 'trending', group: 'Reports & Tools' },
		{ href: '/preferences', label: 'Preferences', icon: 'dashboard', group: 'Reports & Tools' },
	];

	// Group items for section headers
	const groups = $derived((() => {
		const result: { label: string; items: typeof navItems }[] = [];
		let currentGroup = '';
		for (const item of navItems) {
			if (item.group !== currentGroup) {
				currentGroup = item.group;
				result.push({ label: currentGroup, items: [] });
			}
			result[result.length - 1].items.push(item);
		}
		return result;
	})());

	function isActive(href: string): boolean {
		if (href === '/dashboard') return pathname === '/dashboard';
		return pathname.startsWith(href);
	}
</script>

<aside class="flex h-full w-60 flex-col bg-sidebar text-sidebar-foreground">
	<!-- Brand -->
	<div class="border-b border-sidebar-muted px-4 py-4">
		<h1 class="text-lg font-bold">MoneyWorks</h1>
		{#if company}
			<p class="mt-0.5 truncate text-xs text-sidebar-foreground/60">{company}</p>
		{/if}
	</div>

	<!-- Navigation -->
	<nav class="flex-1 overflow-auto px-2 py-3">
		{#each groups as group}
			<div class="mb-1 px-3 pt-3 pb-1 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest first:pt-0">{group.label}</div>
			{#each group.items as item}
				<a
					href={item.href}
					class="mb-0.5 flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors
						{isActive(item.href)
							? 'bg-sidebar-accent text-sidebar-foreground font-medium'
							: 'text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground'}"
				>
				{#if item.icon === 'dashboard'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<rect x="3" y="3" width="7" height="7" rx="1" />
					<rect x="14" y="3" width="7" height="7" rx="1" />
					<rect x="3" y="14" width="7" height="7" rx="1" />
					<rect x="14" y="14" width="7" height="7" rx="1" />
				</svg>
			{:else if item.icon === 'search'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			{:else if item.icon === 'file-text'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
					<polyline points="14,2 14,8 20,8" />
					<line x1="16" y1="13" x2="8" y2="13" />
					<line x1="16" y1="17" x2="8" y2="17" />
				</svg>
			{:else if item.icon === 'users'}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
			{:else if item.icon === 'box'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
					<polyline points="3.27,6.96 12,12.01 20.73,6.96" />
					<line x1="12" y1="22.08" x2="12" y2="12" />
				</svg>
			{:else if item.icon === 'ledger'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
				</svg>
			{:else if item.icon === 'cart'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<circle cx="9" cy="21" r="1" />
					<circle cx="20" cy="21" r="1" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
				</svg>
			{:else if item.icon === 'calendar'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<rect x="3" y="4" width="18" height="18" rx="2" />
					<line x1="16" y1="2" x2="16" y2="6" />
					<line x1="8" y1="2" x2="8" y2="6" />
					<line x1="3" y1="10" x2="21" y2="10" />
				</svg>
			{:else if item.icon === 'trending'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
					<polyline points="17,6 23,6 23,12" />
				</svg>
			{:else if item.icon === 'arrow-down'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" />
				</svg>
			{:else if item.icon === 'arrow-up'}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
				</svg>
				{/if}
				{item.label}
				</a>
			{/each}
		{/each}
	</nav>

	<!-- Logout -->
	<div class="border-t border-sidebar-muted px-2 py-3">
		<form method="POST" action="/logout">
			<button
				type="submit"
				class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-muted hover:text-sidebar-foreground"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
					<polyline points="16,17 21,12 16,7" />
					<line x1="21" y1="12" x2="9" y2="12" />
				</svg>
				Logout
			</button>
		</form>
	</div>
</aside>
