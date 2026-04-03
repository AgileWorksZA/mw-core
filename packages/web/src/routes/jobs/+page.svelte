<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { jobConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statusColors: Record<string, string> = {
		A: 'bg-positive',
		C: 'bg-blue-500',
		H: 'bg-amber-500'
	};

	function handleFilterChange(key: string) {
		goto(`/jobs?filter=${key}`, { invalidateAll: true });
	}
</script>

<DataListView
	config={jobConfig}
	rows={data.jobs}
	title="Jobs"
	subtitle="{data.count} jobs"
	filters={data.filters}
	currentFilter={data.currentFilter}
	onFilterChange={handleFilterChange}
	basePath="/jobs"
>
	{#snippet cell({ column, row, value })}
		{#if column.key === 'code'}
			<a href="/jobs/{value}" class="font-medium text-primary hover:underline">{value}</a>
		{:else if column.key === 'colour'}
			<ColourBadge colour={value} />
		{:else if column.key === 'status'}
			<div class="flex items-center gap-1.5">
				<span class="inline-block h-2 w-2 rounded-full {statusColors[value] ?? 'bg-muted-foreground'}"></span>
				<span class="text-xs">{row.statusLabel}</span>
			</div>
		{:else if column.key === 'billing'}
			{row.billingLabel || '—'}
		{:else if column.key === 'quotedAmount' || column.key === 'billedToDate' || column.key === 'budget'}
			{#if value > 0}<CurrencyDisplay amount={value} />{/if}
		{:else if column.key === 'percentComplete'}
			{#if value > 0}
				<div class="flex items-center gap-1.5">
					<div class="h-1.5 w-16 rounded-full bg-surface-container-low overflow-hidden">
						<div class="h-full rounded-full bg-primary" style="width: {Math.min(value, 100)}%"></div>
					</div>
					<span class="text-xs">{value}%</span>
				</div>
			{/if}
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</DataListView>
