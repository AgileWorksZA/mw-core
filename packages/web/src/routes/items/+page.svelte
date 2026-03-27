<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let search = $state('');

	const filtered = $derived(
		search
			? data.items.filter(
					(i) =>
						i.code.toLowerCase().includes(search.toLowerCase()) ||
						i.description.toLowerCase().includes(search.toLowerCase())
				)
			: data.items
	);

	const typeLabels: Record<string, string> = {
		P: 'Product',
		S: 'Resource',
		T: 'Time',
		A: 'Ship Method',
		O: 'Other'
	};
</script>

<div class="flex h-full">
	<!-- Filter sidebar -->
	<div class="w-48 shrink-0 border-r border-border bg-muted/30 p-3">
		<h3 class="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filter</h3>
		{#each data.filters as filter}
			<button
				class="mb-0.5 w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors
					{data.currentFilter === filter.key
						? 'bg-primary text-primary-foreground font-medium'
						: 'text-foreground hover:bg-muted'}"
				onclick={() => goto(`/items?filter=${filter.key}`, { invalidateAll: true })}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Main content -->
	<div class="flex flex-1 flex-col p-4">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold">Items</h2>
				<p class="text-sm text-muted-foreground">{data.count} records</p>
			</div>
			<input
				type="search"
				placeholder="Search items..."
				bind:value={search}
				class="w-64 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
		</div>

		<div class="flex-1 overflow-auto rounded-md border border-border">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="border-b border-border bg-muted/50">
						<th class="w-8 px-3 py-2.5"></th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Sell Price</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Unit</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Stock on Hand</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Category</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as item}
						<tr
							class="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/50"
							onclick={() => goto(`/items/${item.code}`)}
						>
							<td class="px-3 py-2 text-center">
								<ColourBadge colour={item.colour} />
							</td>
							<td class="px-3 py-2">
								<a href="/items/{item.code}" class="font-medium text-primary hover:underline">
									{item.code}
								</a>
							</td>
							<td class="px-3 py-2">{item.description}</td>
							<td class="px-3 py-2 text-muted-foreground">{typeLabels[item.type] ?? item.type}</td>
							<td class="px-3 py-2 text-right">
								<CurrencyDisplay amount={item.sellPrice} />
							</td>
							<td class="px-3 py-2 text-muted-foreground">{item.unit}</td>
							<td class="px-3 py-2 text-right tabular-nums"
								class:text-destructive={item.stockOnHand < 0}
							>
								{item.stockOnHand}
							</td>
							<td class="px-3 py-2 text-muted-foreground">{item.category1}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
