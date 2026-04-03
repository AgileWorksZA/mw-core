<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import type { EntityConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const config: EntityConfig = {
		label: 'Fixed Assets',
		table: 'asset',
		columns: [
			{ key: 'code', label: 'Code', mono: true, width: '100px' },
			{ key: 'description', label: 'Description', class: 'font-medium' },
			{ key: 'cost', label: 'Cost', align: 'right', mono: true },
			{ key: 'depreciation', label: 'Depreciation', align: 'right', mono: true },
			{ key: 'bookValue', label: 'Book Value', align: 'right', mono: true },
			{ key: 'depreciationAccount', label: 'Depr. Account', mono: true, class: 'text-muted-foreground' },
		],
		defaultVisible: ['code', 'description', 'cost', 'depreciation', 'bookValue'],
		searchFields: ['code', 'description'],
		detailHref: '/accounts/{code}',
		codeField: 'code',
	};

	const cards = $derived([
		{ label: 'Total Cost', value: data.totals.cost, isCurrency: true },
		{ label: 'Accumulated Depreciation', value: data.totals.depreciation, isCurrency: true, color: 'amber' as const },
		{ label: 'Net Book Value', value: data.totals.bookValue, isCurrency: true, color: 'green' as const }
	]);
</script>

<DataListView
	{config}
	rows={data.assets}
	title="Fixed Assets"
	subtitle="Asset register — {data.assets.length} assets"
	basePath="/assets"
>
	{#snippet aboveTable()}
		<SummaryCards {cards} />
	{/snippet}

	{#snippet cell({ column, row, value })}
		{#if column.key === 'code'}
			<a href="/accounts/{value}" class="hover:underline">{value}</a>
		{:else if column.key === 'cost'}
			<CurrencyDisplay amount={value} />
		{:else if column.key === 'depreciation'}
			<span class="text-amber-500"><CurrencyDisplay amount={value} /></span>
		{:else if column.key === 'bookValue'}
			<span class="font-semibold" class:text-positive={value > 0} class:text-destructive={value <= 0}>
				<CurrencyDisplay amount={value} />
			</span>
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}

	{#snippet footer()}
		<tr class="bg-surface-container-low font-semibold">
			<td class="px-3 py-2" colspan="2">Total</td>
			<td class="px-3 py-2 text-right"><CurrencyDisplay amount={data.totals.cost} /></td>
			<td class="px-3 py-2 text-right text-amber-500"><CurrencyDisplay amount={data.totals.depreciation} /></td>
			<td class="px-3 py-2 text-right text-positive"><CurrencyDisplay amount={data.totals.bookValue} /></td>
		</tr>
	{/snippet}
</DataListView>
