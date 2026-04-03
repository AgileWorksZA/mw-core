<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { accountConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const config = {
		...accountConfig,
		defaultVisible: ['code', 'description', 'type', 'group', 'taxCode', 'system', 'colour'],
		columns: [
			...accountConfig.columns,
			{ key: 'group', label: 'Group', class: 'text-muted-foreground' },
			{ key: 'taxCode', label: 'Tax Code', mono: true },
			{ key: 'typeLabel', label: 'Type Name', class: 'text-muted-foreground' },
			{ key: 'colour', label: 'Colour', align: 'center' as const },
		]
	};

	function handleFilterChange(key: string) {
		goto(`/accounts?filter=${key}`, { invalidateAll: true });
	}
</script>

<DataListView
	{config}
	rows={data.accounts}
	title="Chart of Accounts"
	subtitle="{data.count} accounts"
	filters={data.filters}
	currentFilter={data.currentFilter}
	onFilterChange={handleFilterChange}
	basePath="/accounts"
>
	{#snippet cell({ column, row, value })}
		{#if column.key === 'code'}
			<a href="/accounts/{value}" class="font-medium font-mono text-primary hover:underline">{value}</a>
		{:else if column.key === 'colour'}
			<ColourBadge colour={value} />
		{:else if column.key === 'type'}
			<span class="rounded bg-surface-container-low px-1.5 py-0.5 text-xs">{value}</span>
			{#if row.typeLabel}
				<span class="ml-1 text-xs text-muted-foreground">{row.typeLabel}</span>
			{/if}
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</DataListView>
