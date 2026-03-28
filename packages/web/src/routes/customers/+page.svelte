<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'code', label: 'Code', mono: true },
		{ key: 'name', label: 'Name', class: 'font-medium' },
		{ key: 'phone', label: 'Phone', class: 'text-muted-foreground' },
		{ key: 'category', label: 'Category', class: 'text-muted-foreground' },
		{ key: 'isDebtor', label: 'Debtor', align: 'center' as const },
		{ key: 'owed', label: 'Owed', align: 'right' as const }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Customers" subtitle="{data.summary.total} customers — {data.summary.debtors} debtors">
		<span class="text-sm text-muted-foreground">Total owed: <span class="font-semibold"><CurrencyDisplay amount={data.summary.totalOwed} /></span></span>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.customers} rowHref={(row) => `/names/${row.code}`} emptyMessage="No customers found">
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
		</DataTable>
	</div>
</div>
