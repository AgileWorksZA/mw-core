<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Receive Goods</h1>
		<p class="text-sm text-muted-foreground">Select a purchase order to receive against</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.orders.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">PO #</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Supplier</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Expected</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Value</th>
						</tr>
					</thead>
					<tbody>
						{#each data.orders as o}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer">
								<td class="px-3 py-2 font-mono text-xs">{o.ref}</td>
								<td class="px-3 py-2 font-medium">{o.name}</td>
								<td class="px-3 py-2 text-muted-foreground">{o.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{o.date}</td>
								<td class="px-3 py-2 text-muted-foreground">{o.dueDate}</td>
								<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={o.gross} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No open purchase orders</div>
		{/if}
	</div>
</div>
