<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'ref', label: 'Order #', mono: true },
		{ key: 'orderRef', label: 'Customer Ref', mono: true, class: 'text-muted-foreground' },
		{ key: 'name', label: 'Customer' },
		{ key: 'description', label: 'Description', class: 'text-muted-foreground max-w-xs truncate' },
		{ key: 'date', label: 'Date', class: 'text-muted-foreground' },
		{ key: 'dueDate', label: 'Due', class: 'text-muted-foreground' },
		{ key: 'gross', label: 'Gross', align: 'right' as const },
		{ key: 'hold', label: 'Hold', align: 'center' as const, width: '3rem' }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Sales Orders" subtitle="{data.summary.total} orders">
		<div class="flex items-center gap-3">
			<span class="text-sm text-muted-foreground">Total: <span class="font-semibold"><CurrencyDisplay amount={data.summary.totalGross} /></span></span>
			<a href="/orders/sales/new" class="rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">New Order</a>
		</div>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.orders} rowHref={(row) => `/transactions/${row.seq}`} emptyMessage="No sales orders found">
			{#snippet cell({ column, row, value })}
				{#if column.key === 'ref'}
					<a href="/transactions/{row.seq}" class="hover:underline">{value}</a>
				{:else if column.key === 'gross'}
					<span class="font-semibold"><CurrencyDisplay amount={value} /></span>
				{:else if column.key === 'hold'}
					{#if value}<span class="text-amber-500 text-xs font-medium">HOLD</span>{/if}
				{:else}
					{value ?? ''}
				{/if}
			{/snippet}
		</DataTable>
	</div>
</div>
