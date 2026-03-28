<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const columns = [
		{ key: 'code', label: 'Code', mono: true },
		{ key: 'description', label: 'Description' },
		{ key: 'rate', label: 'Rate %', align: 'right' as const, format: (v: number) => `${v}%`, class: 'font-mono' },
		{ key: 'receivedAccount', label: 'Received Account', mono: true, class: 'text-muted-foreground' },
		{ key: 'paidAccount', label: 'Paid Account', mono: true, class: 'text-muted-foreground' }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Tax Rates" subtitle="{data.taxRates.length} tax codes configured" />

	<div class="flex-1 overflow-auto p-6">
		<DataTable {columns} rows={data.taxRates} emptyMessage="No tax rates configured" />
	</div>
</div>
