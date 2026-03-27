<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Receipts</h1>
		<p class="text-sm text-muted-foreground">{data.summary.total} receipts — Total <CurrencyDisplay amount={data.summary.totalGross} /></p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.receipts.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-8">St</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Bank</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">From</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground">Period</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each data.receipts as r}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {r.status === 'P' ? 'bg-green-500' : 'bg-amber-500'}"></span>
								</td>
								<td class="px-3 py-2 font-mono text-xs">
									<a href="/transactions/{r.seq}" class="hover:underline">{r.ref}</a>
								</td>
								<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{r.bank}</td>
								<td class="px-3 py-2">{r.name}</td>
								<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{r.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{r.date}</td>
								<td class="px-3 py-2 text-center text-muted-foreground">{r.period}</td>
								<td class="px-3 py-2 text-right font-semibold text-green-600"><CurrencyDisplay amount={r.gross} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No receipts found</div>
		{/if}
	</div>
</div>
