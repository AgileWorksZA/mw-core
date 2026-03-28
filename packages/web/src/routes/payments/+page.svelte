<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'status', label: 'St', width: '2rem' },
		{ key: 'ref', label: 'Ref', mono: true },
		{ key: 'bank', label: 'Bank', mono: true, class: 'text-muted-foreground' },
		{ key: 'name', label: 'To' },
		{ key: 'description', label: 'Description', class: 'text-muted-foreground max-w-xs truncate' },
		{ key: 'date', label: 'Date', class: 'text-muted-foreground' },
		{ key: 'period', label: 'Period', align: 'center' as const, class: 'text-muted-foreground' },
		{ key: 'gross', label: 'Amount', align: 'right' as const }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Payments" subtitle="{data.summary.total} payments">
		<span class="text-sm text-muted-foreground">Total: <span class="font-semibold"><CurrencyDisplay amount={data.summary.totalGross} /></span></span>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.payments} rowHref={(row) => `/transactions/${row.seq}`} emptyMessage="No payments found">
			{#snippet cell({ column, row, value })}
				{#if column.key === 'status'}
					<span class="inline-block h-2 w-2 rounded-full {value === 'P' ? 'bg-positive' : 'bg-amber-500'}"></span>
				{:else if column.key === 'ref'}
					<a href="/transactions/{row.seq}" class="hover:underline">{value}</a>
				{:else if column.key === 'gross'}
					<span class="font-semibold text-red-500"><CurrencyDisplay amount={value} /></span>
				{:else}
					{value ?? ''}
				{/if}
			{/snippet}
		</DataTable>
	</div>
</div>
