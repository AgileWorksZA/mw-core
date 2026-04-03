<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { itemConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const config = {
		...itemConfig,
		defaultVisible: ['code', 'description', 'type', 'sellPrice', 'unit', 'stockOnHand', 'category1', 'colour'],
	};

	const typeLabels: Record<string, string> = {
		P: 'Product', S: 'Resource', T: 'Time', A: 'Ship Method', O: 'Other'
	};

	function handleFilterChange(key: string) {
		goto(`/items?filter=${key}`, { invalidateAll: true });
	}
</script>

<DataListView
	{config}
	rows={data.items}
	title="Items"
	subtitle="{data.count} records"
	filters={data.filters}
	currentFilter={data.currentFilter}
	onFilterChange={handleFilterChange}
	basePath="/items"
>
	{#snippet cell({ column, row, value })}
		{#if column.key === 'code'}
			<a href="/items/{value}" class="font-medium text-primary hover:underline">{value}</a>
		{:else if column.key === 'colour'}
			<ColourBadge colour={value} />
		{:else if column.key === 'sellPrice'}
			<CurrencyDisplay amount={value} />
		{:else if column.key === 'type'}
			{typeLabels[value] ?? value}
		{:else if column.key === 'stockOnHand'}
			<span class:text-destructive={value < 0}>{value}</span>
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</DataListView>
