<script lang="ts">
	import DataListView from '$lib/components/DataListView.svelte';
	import { assetCategoryConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<DataListView
	config={assetCategoryConfig}
	rows={data.categories}
	title="Asset Categories"
	subtitle="{data.count} categories"
	basePath="/asset-categories"
>
	{#snippet cell({ column, row, value })}
		{#if column.key === 'depreciationType'}
			{row.depreciationTypeLabel || value || '—'}
		{:else if column.key === 'depreciationRate'}
			{value > 0 ? `${value}%` : '—'}
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</DataListView>
