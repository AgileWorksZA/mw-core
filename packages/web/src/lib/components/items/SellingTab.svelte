<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { ItemScreenData } from '$lib/api/types';

	let {
		selling,
		lookups
	}: {
		selling: ItemScreenData['item']['selling'];
		lookups: ItemScreenData['lookups'];
	} = $props();

	const priceTiers = [
		{ label: 'Price A (Default)', value: selling.sellPrice },
		{ label: 'Price B', value: selling.priceB },
		{ label: 'Price C', value: selling.priceC },
		{ label: 'Price D', value: selling.priceD },
		{ label: 'Price E', value: selling.priceE },
		{ label: 'Price F', value: selling.priceF }
	];
</script>

<div class="grid grid-cols-2 gap-6">
	<!-- Pricing -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Selling Price</h3>
		<div class="space-y-2 text-sm">
			{#if selling.useMultiplePrices}
				{#each priceTiers as tier}
					{#if tier.value > 0}
						<div class="flex justify-between">
							<span class="text-muted-foreground">{tier.label}</span>
							<CurrencyDisplay amount={tier.value} />
						</div>
					{/if}
				{/each}
			{:else}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Sell Price</span>
					<CurrencyDisplay amount={selling.sellPrice} />
				</div>
			{/if}
			<div class="flex justify-between">
				<span class="text-muted-foreground">Sell Unit</span>
				<span>{selling.sellUnit || '—'}</span>
			</div>
		</div>
	</div>

	<!-- Tax & Discount -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tax & Discount</h3>
		<div class="space-y-2 text-sm">
			{#if selling.sellTaxCode}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Sell Tax Code</span>
					<span>{selling.sellTaxCode}</span>
				</div>
			{/if}
			{#if selling.discount}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Default Discount</span>
					<span>{selling.discount}%</span>
				</div>
			{/if}
			{#if selling.marginWarning}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Margin Warning</span>
					<span>{selling.marginWarning}%</span>
				</div>
			{/if}
			{#if selling.sellWeight}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Weight</span>
					<span>{selling.sellWeight}</span>
				</div>
			{/if}
		</div>
	</div>
</div>
