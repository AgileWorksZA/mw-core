<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { assetConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statusColors: Record<string, string> = {
		NEW: 'bg-blue-500',
		ACT: 'bg-positive',
		NDP: 'bg-muted-foreground',
		OTH: 'bg-amber-500',
		DSP: 'bg-destructive'
	};

	const cards = $derived([
		{ label: 'Total Cost', value: data.totals.cost, isCurrency: true },
		{ label: 'Accumulated Depreciation', value: data.totals.depreciation, isCurrency: true, color: 'amber' as const },
		{ label: 'Net Book Value', value: data.totals.bookValue, isCurrency: true, color: 'green' as const }
	]);

	function handleFilterChange(key: string) {
		goto(`/assets?filter=${key}`, { invalidateAll: true });
	}
</script>

<DataListView
	config={assetConfig}
	rows={data.assets}
	title="Fixed Assets"
	subtitle="{data.count} assets"
	filters={data.filters}
	currentFilter={data.currentFilter}
	onFilterChange={handleFilterChange}
	basePath="/assets"
>
	{#snippet aboveTable()}
		<SummaryCards {cards} />
	{/snippet}

	{#snippet cell({ column, row, value })}
		{#if column.key === 'code'}
			<a href="/assets/{value}" class="font-medium text-primary hover:underline">{value}</a>
		{:else if column.key === 'colour'}
			<ColourBadge colour={value} />
		{:else if column.key === 'status'}
			<div class="flex items-center gap-1.5">
				<span class="inline-block h-2 w-2 rounded-full {statusColors[value] ?? 'bg-muted-foreground'}"></span>
				<span class="text-xs">{row.statusLabel}</span>
			</div>
		{:else if column.key === 'cost' || column.key === 'accumDepreciation'}
			{#if value > 0}<CurrencyDisplay amount={value} />{/if}
		{:else if column.key === 'bookValue'}
			<span class="font-semibold" class:text-positive={value > 0} class:text-destructive={value <= 0}>
				<CurrencyDisplay amount={value} />
			</span>
		{:else if column.key === 'rate'}
			{value > 0 ? `${value}%` : ''}
		{:else if column.key === 'type'}
			{row.typeLabel || value || ''}
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}

	{#snippet footer()}
		<tr class="bg-surface-container-low font-semibold">
			<td class="px-3 py-2" colspan="4">Total</td>
			<td class="px-3 py-2 text-right"><CurrencyDisplay amount={data.totals.cost} /></td>
			<td class="px-3 py-2 text-right text-amber-500"><CurrencyDisplay amount={data.totals.depreciation} /></td>
			<td class="px-3 py-2 text-right text-positive"><CurrencyDisplay amount={data.totals.bookValue} /></td>
			<td colspan="3"></td>
		</tr>
	{/snippet}
</DataListView>
