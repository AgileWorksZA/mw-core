<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'ref', label: 'Quote #', mono: true },
		{ key: 'name', label: 'Customer' },
		{ key: 'description', label: 'Description', class: 'text-muted-foreground max-w-xs truncate' },
		{ key: 'date', label: 'Date', class: 'text-muted-foreground' },
		{ key: 'expires', label: 'Expires' },
		{ key: 'gross', label: 'Gross', align: 'right' as const }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Quotes" subtitle="{data.summary.total} quotes">
		{#if data.summary.expired > 0}
			<span class="rounded-full bg-amber-500 px-3 py-1 text-sm font-medium text-white">{data.summary.expired} expired</span>
		{/if}
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.quotes} rowHref={(row) => `/transactions/${row.seq}`}
			rowClass={(row) => row.expired ? 'text-amber-600 dark:text-amber-400' : ''} emptyMessage="No quotes found">
			{#snippet cell({ column, row, value })}
				{#if column.key === 'ref'}
					<a href="/transactions/{row.seq}" class="hover:underline">{value}</a>
				{:else if column.key === 'gross'}
					<span class="font-semibold"><CurrencyDisplay amount={value} /></span>
				{:else if column.key === 'expires'}
					<span class:font-semibold={row.expired}>{value}</span>
				{:else}
					{value ?? ''}
				{/if}
			{/snippet}
		</DataTable>
	</div>
</div>
