<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const c = data.company;
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Housekeeping</h1>
		<p class="text-sm text-muted-foreground">System administration and file statistics</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		<div class="grid grid-cols-2 gap-8">
			<!-- Company -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Company</h2>
				{#if c}
					<div class="rounded-lg border border-border p-4">
						<div class="text-xl font-bold">{c.name}</div>
						<div class="mt-1 text-sm text-muted-foreground">{c.address?.line1} {c.address?.line2}</div>
						<div class="mt-3 text-xs text-muted-foreground">MoneyWorks {c.system?.version} — {c.system?.platform}</div>
					</div>
				{/if}
				<div class="mt-4 grid grid-cols-2 gap-2">
					<a href="/preferences" class="rounded-lg border border-border p-3 text-center text-sm hover:bg-muted/50">Preferences</a>
					<a href="/reports" class="rounded-lg border border-border p-3 text-center text-sm hover:bg-muted/50">Reports</a>
					<a href="/import-export" class="rounded-lg border border-border p-3 text-center text-sm hover:bg-muted/50">Import / Export</a>
					<a href="/tax-rates" class="rounded-lg border border-border p-3 text-center text-sm hover:bg-muted/50">Tax Rates</a>
				</div>
			</div>

			<!-- File Stats -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">File Statistics</h2>
				<div class="space-y-2">
					{#each [
						['Transactions', data.stats.transactions, '/transactions'],
						['Names', data.stats.names, '/names'],
						['Accounts', data.stats.accounts, '/accounts'],
						['Products', data.stats.products, '/items']
					] as [label, count, href]}
						<a {href} class="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50">
							<span class="text-sm font-medium">{label}</span>
							<span class="text-lg font-bold font-mono">{count}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
