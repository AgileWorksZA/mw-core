<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-bold">Quotes</h1>
			{#if data.summary.expired > 0}
				<span class="rounded-full bg-amber-500 px-3 py-1 text-sm font-medium text-white">{data.summary.expired} expired</span>
			{/if}
		</div>
		<p class="text-sm text-muted-foreground">{data.summary.total} quotes — Total <CurrencyDisplay amount={data.summary.totalGross} /></p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.quotes.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Quote #</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Customer</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Expires</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
						</tr>
					</thead>
					<tbody>
						{#each data.quotes as q}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50" class:text-amber-600={q.expired}>
								<td class="px-3 py-2 font-mono text-xs"><a href="/transactions/{q.seq}" class="hover:underline">{q.ref}</a></td>
								<td class="px-3 py-2">{q.name}</td>
								<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{q.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{q.date}</td>
								<td class="px-3 py-2" class:font-semibold={q.expired}>{q.expires}</td>
								<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={q.gross} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No quotes found</div>
		{/if}
	</div>
</div>
