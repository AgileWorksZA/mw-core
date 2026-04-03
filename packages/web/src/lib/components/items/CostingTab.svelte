<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';

	let { costing }: {
		costing: {
			costPrice: number;
			stockValue: number;
			stockOnHand: number;
			avgCost: number;
			buyPrice: number;
			sellPrice: number;
			margin: number;
			marginPercent: number;
		};
	} = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
	<!-- Cost Analysis -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Cost Analysis</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Cost Price (Last)</span>
				<span class="font-mono"><CurrencyDisplay amount={costing.costPrice} /></span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Average Cost</span>
				<span class="font-mono"><CurrencyDisplay amount={costing.avgCost} /></span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Buy Price</span>
				<span class="font-mono"><CurrencyDisplay amount={costing.buyPrice} /></span>
			</div>
		</div>
	</div>

	<!-- Margin Analysis -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Margin Analysis</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Sell Price</span>
				<span class="font-mono"><CurrencyDisplay amount={costing.sellPrice} /></span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Margin</span>
				<span class="font-mono" class:text-positive={costing.margin > 0} class:text-destructive={costing.margin < 0}>
					<CurrencyDisplay amount={costing.margin} />
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Margin %</span>
				<span class="font-mono font-semibold" class:text-positive={costing.marginPercent > 0} class:text-destructive={costing.marginPercent < 0}>
					{costing.marginPercent.toFixed(1)}%
				</span>
			</div>
		</div>
	</div>

	<!-- Stock Valuation -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stock Valuation</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Stock on Hand</span>
				<span class="font-mono font-bold" class:text-destructive={costing.stockOnHand < 0}>
					{costing.stockOnHand}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Stock Value</span>
				<span class="font-mono"><CurrencyDisplay amount={costing.stockValue} /></span>
			</div>
			<div class="flex justify-between border-t border-border/30 pt-3 mt-3">
				<span class="text-muted-foreground font-medium">Value at Sell Price</span>
				<span class="font-mono font-semibold">
					<CurrencyDisplay amount={costing.stockOnHand * costing.sellPrice} />
				</span>
			</div>
		</div>
	</div>
</div>
