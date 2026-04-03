<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { nameConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Override config for customer-specific view
	const config = {
		...nameConfig,
		label: 'Customers',
		defaultVisible: ['code', 'name', 'phone', 'category', 'isDebtor', 'owed'],
		columns: [
			...nameConfig.columns,
			{ key: 'isDebtor', label: 'Debtor', align: 'center' as const },
			{ key: 'owed', label: 'Owed', align: 'right' as const, mono: true },
		]
	};
</script>

<DataListView
	{config}
	rows={data.customers}
	title="Customers"
	subtitle="{data.summary.total} customers — {data.summary.debtors} debtors"
	basePath="/customers"
>
	{#snippet headerActions()}
		<span class="text-sm text-muted-foreground">
			Total owed: <span class="font-semibold"><CurrencyDisplay amount={data.summary.totalOwed} /></span>
		</span>
	{/snippet}

	{#snippet cell({ column, row, value })}
		{#if column.key === 'isDebtor'}
			{#if value}<span class="text-xs font-medium text-blue-500">Credit</span>{:else}<span class="text-xs text-muted-foreground">Cash</span>{/if}
		{:else if column.key === 'owed'}
			{#if value > 0.01}<span class="font-semibold text-destructive"><CurrencyDisplay amount={value} /></span>{/if}
		{:else if column.key === 'code'}
			<a href="/names/{value}" class="hover:underline">{value}</a>
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</DataListView>
