<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const typeColors: Record<string, string> = {
		name: 'bg-blue-500/10 text-blue-600',
		account: 'bg-positive/10 text-positive',
		item: 'bg-purple-500/10 text-purple-600',
		transaction: 'bg-orange-500/10 text-orange-600'
	};

	const typeLabels: Record<string, string> = {
		name: 'Name', account: 'Account', item: 'Item', transaction: 'Transaction'
	};
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="font-headline text-xl font-bold">Search Results</h1>
		<p class="text-sm text-muted-foreground">
			{data.results.length} results for "{data.query}"
			— {data.counts.names} names, {data.counts.accounts} accounts, {data.counts.items} items, {data.counts.transactions} transactions
		</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.results.length > 0}
			<div class="space-y-2">
				{#each data.results as result}
					<a href={result.href} class="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container-low">
						<span class="rounded px-2 py-0.5 text-[10px] font-semibold {typeColors[result.type] || 'bg-muted text-muted-foreground'}">
							{typeLabels[result.type] || result.type}
						</span>
						<div class="flex-1 min-w-0">
							<div class="text-sm font-medium truncate">{result.label}</div>
							<div class="text-xs text-muted-foreground truncate">{result.subtitle}</div>
						</div>
						<svg class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<polyline points="9,18 15,12 9,6" />
						</svg>
					</a>
				{/each}
			</div>
		{:else if data.query}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No results for "{data.query}"</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">Enter a search term</div>
		{/if}
	</div>
</div>
