<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const customerMax = $derived(data.topCustomers.length > 0 ? data.topCustomers[0].revenue : 1);
	const productMax = $derived(data.topProducts.length > 0 ? data.topProducts[0].revenue : 1);

	const barColors = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899', '#84cc16', '#6366f1'];
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="text-xl font-bold font-headline">Sales Explorer</h1>
		<p class="text-sm text-muted-foreground">Top customers and products by revenue</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<div class="grid grid-cols-2 gap-8">
			<!-- Top Customers -->
			<div>
				<h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">Top Customers</h2>
				<div class="space-y-2">
					{#each data.topCustomers as cust, i}
						<div class="rounded-xl bg-surface-container-lowest p-3 hover:bg-surface-container-low transition-colors">
							<div class="mb-1 flex justify-between text-sm">
								<span class="truncate font-medium">{cust.name}</span>
								<span class="ml-2 whitespace-nowrap font-semibold tabular-nums"><CurrencyDisplay amount={cust.revenue} /></span>
							</div>
							<div class="h-2 overflow-hidden rounded bg-surface-container-low">
								<div class="h-full rounded" style="width: {(cust.revenue / customerMax) * 100}%; background: {barColors[i % barColors.length]}"></div>
							</div>
						</div>
					{/each}
					{#if data.topCustomers.length === 0}
						<div class="text-sm text-muted-foreground">No sales data</div>
					{/if}
				</div>
			</div>

			<!-- Top Products -->
			<div>
				<h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">Top Products / Categories</h2>
				<div class="space-y-2">
					{#each data.topProducts as prod, i}
						<div class="rounded-xl bg-surface-container-lowest p-3 hover:bg-surface-container-low transition-colors">
							<div class="mb-1 flex justify-between text-sm">
								<span class="truncate font-medium">{prod.name}</span>
								<span class="ml-2 whitespace-nowrap font-semibold tabular-nums"><CurrencyDisplay amount={prod.revenue} /></span>
							</div>
							<div class="h-2 overflow-hidden rounded bg-surface-container-low">
								<div class="h-full rounded" style="width: {(prod.revenue / productMax) * 100}%; background: {barColors[i % barColors.length]}"></div>
							</div>
						</div>
					{/each}
					{#if data.topProducts.length === 0}
						<div class="text-sm text-muted-foreground">No sales data</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
