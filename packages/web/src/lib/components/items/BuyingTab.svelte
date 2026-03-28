<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { ItemScreenData } from '$lib/api/types';

	let { buying }: { buying: ItemScreenData['item']['buying'] } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Supplier</h3>
		<div class="space-y-2 text-sm">
			<div class="flex gap-2">
				<span class="w-28 shrink-0 text-muted-foreground">Supplier</span>
				<span>{buying.supplier || '—'}</span>
			</div>
			<div class="flex gap-2">
				<span class="w-28 shrink-0 text-muted-foreground">Supplier Code</span>
				<span class="font-mono">{buying.supplierCode || '—'}</span>
			</div>
		</div>
	</div>

	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pricing</h3>
		<div class="space-y-2 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Buy Price</span>
				<CurrencyDisplay amount={buying.buyPrice} />
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Buy Unit</span>
				<span>{buying.buyUnit || '—'}</span>
			</div>
			{#if buying.buyTaxCode}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Buy Tax Code</span>
					<span>{buying.buyTaxCode}</span>
				</div>
			{/if}
			{#if buying.plussage}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Plussage</span>
					<span>{buying.plussage}%</span>
				</div>
			{/if}
			{#if buying.conversionFactor && buying.conversionFactor !== 1}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Conversion Factor</span>
					<span>{buying.conversionFactor}</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reorder</h3>
		<div class="space-y-2 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Reorder Level</span>
				<span>{buying.reorderLevel}</span>
			</div>
			{#if buying.leadTimeDays}
				<div class="flex justify-between">
					<span class="text-muted-foreground">Lead Time</span>
					<span>{buying.leadTimeDays} days</span>
				</div>
			{/if}
		</div>
	</div>
</div>
