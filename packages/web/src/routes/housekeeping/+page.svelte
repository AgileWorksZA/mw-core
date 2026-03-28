<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const c = data.company;
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="font-headline text-xl font-bold">Housekeeping</h1>
		<p class="text-sm text-muted-foreground">System administration and file statistics</p>
	</div>

	<div class="flex-1 overflow-auto p-3 md:p-6 space-y-4 md:space-y-8">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
			<!-- Company -->
			<div>
				<h2 class="font-headline mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Company</h2>
				{#if c}
					<div class="rounded-xl bg-surface-container-lowest p-4">
						<div class="text-xl font-bold">{c.name}</div>
						<div class="mt-1 text-sm text-muted-foreground">{c.address?.line1} {c.address?.line2}</div>
						<div class="mt-3 text-xs text-muted-foreground">MoneyWorks {c.system?.version} — {c.system?.platform}</div>
					</div>
				{/if}
				<div class="mt-4 grid grid-cols-2 gap-2"><!-- OK at cols-2 — small buttons -->
					<a href="/preferences" class="rounded-xl bg-surface-container-lowest p-3 text-center text-sm hover:bg-surface-container-low">Preferences</a>
					<a href="/reports" class="rounded-xl bg-surface-container-lowest p-3 text-center text-sm hover:bg-surface-container-low">Reports</a>
					<a href="/import-export" class="rounded-xl bg-surface-container-lowest p-3 text-center text-sm hover:bg-surface-container-low">Import / Export</a>
					<a href="/tax-rates" class="rounded-xl bg-surface-container-lowest p-3 text-center text-sm hover:bg-surface-container-low">Tax Rates</a>
				</div>
			</div>

			<!-- File Stats -->
			<div>
				<h2 class="font-headline mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">File Statistics</h2>
				<div class="space-y-2">
					{#each [
						['Transactions', data.stats.transactions, '/transactions'],
						['Names', data.stats.names, '/names'],
						['Accounts', data.stats.accounts, '/accounts'],
						['Products', data.stats.products, '/items']
					] as [label, count, href]}
						<a {href} class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-3 hover:bg-surface-container-low">
							<span class="text-sm font-medium">{label}</span>
							<span class="text-lg font-bold font-mono">{count}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
