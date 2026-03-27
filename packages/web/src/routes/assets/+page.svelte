<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Fixed Assets</h1>
		<p class="text-sm text-muted-foreground">Asset register — {data.assets.length} assets</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-6">
		<!-- Summary -->
		<div class="grid grid-cols-3 gap-4">
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Cost</div>
				<div class="mt-1 text-xl font-bold"><CurrencyDisplay amount={data.totals.cost} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Accumulated Depreciation</div>
				<div class="mt-1 text-xl font-bold text-amber-500"><CurrencyDisplay amount={data.totals.depreciation} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Net Book Value</div>
				<div class="mt-1 text-xl font-bold text-green-600"><CurrencyDisplay amount={data.totals.bookValue} /></div>
			</div>
		</div>

		<!-- Asset table -->
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
