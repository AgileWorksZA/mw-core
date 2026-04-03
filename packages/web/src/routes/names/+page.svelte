<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { nameConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const config = {
		...nameConfig,
		defaultVisible: ['code', 'name', 'type', 'category', 'phone', 'dBalance', 'cBalance', 'colour'],
		columns: [
			...nameConfig.columns,
			{ key: 'type', label: 'Type', class: 'text-muted-foreground' },
			{ key: 'dBalance', label: 'They Owe', align: 'right' as const, mono: true },
			{ key: 'cBalance', label: 'We Owe', align: 'right' as const, mono: true },
		]
	};

	function typeLabel(n: Record<string, any>): string {
		const parts: string[] = [];
		if (n.customerType === 2) parts.push('Debtor');
		else if (n.customerType === 1) parts.push('Customer');
		if (n.supplierType === 2) parts.push('Creditor');
		else if (n.supplierType === 1) parts.push('Supplier');
		return parts.join(', ') || 'Other';
	}

	function handleFilterChange(key: string) {
		goto(`/names?filter=${key}`, { invalidateAll: true });
	}
</script>

<DataListView
	{config}
	rows={data.names}
	title="Names"
	subtitle="{data.count} records"
	filters={data.filters}
	currentFilter={data.currentFilter}
	onFilterChange={handleFilterChange}
>
	{#snippet cell({ column, row, value })}
		{#if column.key === 'code'}
			<a href="/names/{value}" class="font-medium text-primary hover:underline">{value}</a>
		{:else if column.key === 'colour'}
			<ColourBadge colour={value} />
		{:else if column.key === 'name'}
			{value}
			{#if row.hold}
				<span class="ml-1.5 rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">HOLD</span>
			{/if}
		{:else if column.key === 'type'}
			{typeLabel(row)}
		{:else if column.key === 'dBalance'}
			{#if value > 0}<CurrencyDisplay amount={value} />{/if}
		{:else if column.key === 'cBalance'}
			{#if value > 0}<CurrencyDisplay amount={value} />{/if}
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</DataListView>
