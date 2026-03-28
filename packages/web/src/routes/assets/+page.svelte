<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const cards = $derived([
		{ label: 'Total Cost', value: data.totals.cost, isCurrency: true },
		{ label: 'Accumulated Depreciation', value: data.totals.depreciation, isCurrency: true, color: 'amber' as const },
		{ label: 'Net Book Value', value: data.totals.bookValue, isCurrency: true, color: 'green' as const }
	]);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Fixed Assets" subtitle="Asset register — {data.assets.length} assets" />

	<div class="flex-1 overflow-auto p-6 space-y-6">
		<SummaryCards {cards} />

		{#if data.assets.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Cost</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Depreciation</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Book Value</th>
						</tr>
					</thead>
					<tbody>
						{#each data.assets as asset}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2 font-mono text-xs">
									<a href="/accounts/{asset.code}" class="hover:underline">{asset.code}</a>
								</td>
								<td class="px-3 py-2">{asset.description}</td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={asset.cost} /></td>
								<td class="px-3 py-2 text-right text-amber-500"><CurrencyDisplay amount={asset.depreciation} /></td>
								<td class="px-3 py-2 text-right font-semibold" class:text-green-600={asset.bookValue > 0} class:text-destructive={asset.bookValue <= 0}>
									<CurrencyDisplay amount={asset.bookValue} />
								</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="bg-muted/30 font-semibold">
							<td class="px-3 py-2" colspan="2">Total</td>
							<td class="px-3 py-2 text-right"><CurrencyDisplay amount={data.totals.cost} /></td>
							<td class="px-3 py-2 text-right text-amber-500"><CurrencyDisplay amount={data.totals.depreciation} /></td>
							<td class="px-3 py-2 text-right text-green-600"><CurrencyDisplay amount={data.totals.bookValue} /></td>
						</tr>
					</tfoot>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No fixed assets found</div>
		{/if}
	</div>
</div>
