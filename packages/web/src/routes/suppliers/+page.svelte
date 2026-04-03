<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import DataListView from '$lib/components/DataListView.svelte';
	import { nameConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const config = {
		...nameConfig,
		label: 'Suppliers',
		defaultVisible: ['code', 'name', 'phone', 'category', 'isCreditor', 'owed'],
		columns: [
			...nameConfig.columns,
			{ key: 'isCreditor', label: 'Creditor', align: 'center' as const },
			{ key: 'owed', label: 'We Owe', align: 'right' as const, mono: true },
		]
	};
</script>

<DataListView
	{config}
	rows={data.suppliers}
	title="Suppliers"
	subtitle="{data.summary.total} suppliers — {data.summary.creditors} creditors"
>
	{#snippet headerActions()}
		<span class="text-sm text-muted-foreground">
			We owe: <span class="font-semibold"><CurrencyDisplay amount={data.summary.totalOwed} /></span>
		</span>
	{/snippet}

	{#snippet cell({ column, row, value })}
		{#if column.key === 'isCreditor'}
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
