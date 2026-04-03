<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { transactionConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const config = {
		...transactionConfig,
		defaultVisible: ['status', 'type', 'ourRef', 'nameCode', 'description', 'date', 'gross', 'outstanding'],
		columns: [
			{ key: 'status', label: '', width: '32px', align: 'center' as const },
			...transactionConfig.columns,
		]
	};

	// Dual filter groups for transactions
	const filterGroups = [
		{ label: 'Type', active: data.currentType, filters: data.typeFilters },
		{ label: 'Status', active: data.currentStatus, filters: data.statusFilters }
	];

	function handleFilterChange(key: string) {
		// Determine if this is a type or status filter
		const isType = data.typeFilters.some((f: any) => f.key === key);
		const isStatus = data.statusFilters.some((f: any) => f.key === key);
		const type = isType ? key : data.currentType;
		const status = isStatus ? key : data.currentStatus;
		goto(`/transactions?type=${type}&status=${status}`, { invalidateAll: true });
	}

	function statusDot(status: string): string {
		return status === 'P' ? 'bg-positive' : 'bg-amber-500';
	}
</script>

<DataListView
	{config}
	rows={data.transactions}
	title="Transactions"
	subtitle="{data.count} records"
	{filterGroups}
	currentFilter={data.currentType}
	onFilterChange={handleFilterChange}
>
	{#snippet cell({ column, row, value })}
		{#if column.key === 'status'}
			<span class="inline-block h-2 w-2 rounded-full {statusDot(value)}"></span>
		{:else if column.key === 'type'}
			<span class="rounded bg-surface-container-low px-1.5 py-0.5 text-xs font-mono">{value}</span>
			{#if row.typeLabel}
				<span class="ml-1 text-xs text-muted-foreground">{row.typeLabel}</span>
			{/if}
		{:else if column.key === 'ourRef'}
			<a href="/transactions/{row.id}" class="font-medium text-primary hover:underline">{value}</a>
		{:else if column.key === 'nameCode'}
			<div class="flex items-center gap-1.5">
				<ColourBadge colour={row.colour} />
				{value}
				{#if row.hold}
					<span class="rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">HOLD</span>
				{/if}
			</div>
		{:else if column.key === 'description'}
			<span class="max-w-xs truncate text-muted-foreground">{value}</span>
		{:else if column.key === 'date'}
			<span class="text-muted-foreground">{value}</span>
		{:else if column.key === 'gross'}
			<CurrencyDisplay amount={value} />
		{:else if column.key === 'outstanding'}
			{#if value > 0.01}<CurrencyDisplay amount={value} />{/if}
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</DataListView>
