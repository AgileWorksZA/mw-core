<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'status', label: 'St', width: '2rem' },
		{ key: 'ref', label: 'Reference', mono: true },
		{ key: 'bank', label: 'Bank', mono: true, class: 'text-muted-foreground' },
		{ key: 'nameCode', label: 'Name', mono: true, class: 'text-xs' },
		{ key: 'name', label: 'From' },
		{ key: 'description', label: 'Description', class: 'text-muted-foreground max-w-xs truncate' },
		{ key: 'period', label: 'Period', align: 'center' as const, class: 'text-muted-foreground' },
		{ key: 'date', label: 'Date', class: 'text-muted-foreground' },
		{ key: 'gross', label: 'Gross', align: 'right' as const }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Receipts" subtitle="{data.summary.total} receipts">
		<div class="flex items-center gap-3">
			<span class="text-sm text-muted-foreground">Total: <span class="font-semibold"><CurrencyDisplay amount={data.summary.totalGross} /></span></span>
			<a href="/receipts/new" class="rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">New Receipt</a>
		</div>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.receipts} rowHref={(row) => `/transactions/${row.seq}`} emptyMessage="No receipts found">
			{#snippet cell({ column, row, value })}
				{#if column.key === 'status'}
					<span class="inline-block h-2 w-2 rounded-full {value === 'P' ? 'bg-positive' : 'bg-amber-500'}"></span>
				{:else if column.key === 'ref'}
					<a href="/transactions/{row.seq}" class="hover:underline">{value}</a>
				{:else if column.key === 'gross'}
					<span class="font-semibold text-positive"><CurrencyDisplay amount={value} /></span>
				{:else}
					{value ?? ''}
				{/if}
			{/snippet}
		</DataTable>
	</div>
</div>
