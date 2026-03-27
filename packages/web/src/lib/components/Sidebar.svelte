<script lang="ts">
	let { company, pathname }: { company: string; pathname: string } = $props();

	const navItems = [
		{ href: '/transactions', label: 'Transactions', icon: 'file-text' },
		{ href: '/names', label: 'Names', icon: 'users' },
		{ href: '/items', label: 'Items', icon: 'box' },
	];

	function isActive(href: string): boolean {
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
	<nav class="flex-1 px-2 py-3">
		{#each navItems as item}
			<a
				href={item.href}
				class="mb-0.5 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors
					{isActive(item.href)
						? 'bg-sidebar-accent text-sidebar-foreground font-medium'
						: 'text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground'}"
			>
				{#if item.icon === 'file-text'}
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
				{/if}
				{item.label}
			</a>
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
