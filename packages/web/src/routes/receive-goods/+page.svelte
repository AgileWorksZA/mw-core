<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'ref', label: 'PO #', mono: true },
		{ key: 'name', label: 'Supplier', class: 'font-medium' },
		{ key: 'description', label: 'Description', class: 'text-muted-foreground' },
		{ key: 'date', label: 'Date', class: 'text-muted-foreground' },
		{ key: 'dueDate', label: 'Expected', class: 'text-muted-foreground' },
		{ key: 'gross', label: 'Value', align: 'right' as const }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Receive Goods" subtitle="Select a purchase order to receive against" />

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.orders} emptyMessage="No open purchase orders">
			{#snippet cell({ column, value })}
				{#if column.key === 'gross'}
					<span class="font-semibold"><CurrencyDisplay amount={value} /></span>
				{:else}
					{value ?? ''}
				{/if}
			{/snippet}
		</DataTable>
	</div>
</div>
