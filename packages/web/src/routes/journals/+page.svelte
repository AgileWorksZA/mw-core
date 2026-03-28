<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'status', label: 'St', width: '2rem' },
		{ key: 'ref', label: 'Ref', mono: true },
		{ key: 'description', label: 'Description' },
		{ key: 'date', label: 'Date', class: 'text-muted-foreground' },
		{ key: 'period', label: 'Period', align: 'center' as const, class: 'text-muted-foreground' },
		{ key: 'gross', label: 'Amount', align: 'right' as const },
		{ key: 'recurring', label: 'Rec', align: 'center' as const, width: '3rem' }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Journals" subtitle="{data.summary.total} entries — {data.summary.posted} posted" />

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.journals} rowHref={(row) => `/transactions/${row.seq}`} emptyMessage="No journal entries found">
			{#snippet cell({ column, value })}
				{#if column.key === 'status'}
					<span class="inline-block h-2 w-2 rounded-full {value === 'P' ? 'bg-green-500' : 'bg-amber-500'}"></span>
				{:else if column.key === 'ref'}
					<a href="/transactions/{value}" class="hover:underline">{value}</a>
				{:else if column.key === 'gross'}
					<span class="font-semibold"><CurrencyDisplay amount={value} /></span>
				{:else if column.key === 'recurring'}
					{#if value}<span class="text-blue-500 text-xs font-medium">REC</span>{/if}
				{:else}
					{value ?? ''}
				{/if}
			{/snippet}
		</DataTable>
	</div>
</div>
