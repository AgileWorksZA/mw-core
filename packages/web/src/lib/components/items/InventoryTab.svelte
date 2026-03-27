<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { ItemScreenData } from '$lib/api/types';

	let { inventory }: { inventory: ItemScreenData['item']['inventory'] } = $props();

	const avgCost = $derived(
		inventory.stockOnHand > 0 ? inventory.stockValue / inventory.stockOnHand : 0
	);
</script>

<div class="grid grid-cols-2 gap-6">
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stock</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Stock on Hand</span>
				<span class="text-lg font-bold tabular-nums" class:text-destructive={inventory.stockOnHand < 0}>
					{inventory.stockOnHand}
				</span>
			</div>
		</div>
	</div>

	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Valuation</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Stock Value</span>
				<CurrencyDisplay amount={inventory.stockValue} />
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Cost Price</span>
				<CurrencyDisplay amount={inventory.costPrice} />
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Avg Cost</span>
				<CurrencyDisplay amount={avgCost} />
			</div>
		</div>
	</div>
</div>
