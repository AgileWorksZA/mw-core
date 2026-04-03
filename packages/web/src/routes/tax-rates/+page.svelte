<script lang="ts">
	import DataListView from '$lib/components/DataListView.svelte';
	import { taxRateConfig } from '$lib/config/entity-columns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const config = {
		...taxRateConfig,
		defaultVisible: ['code', 'description', 'rate', 'receivedAccount', 'paidAccount'],
		columns: [
			{ key: 'code', label: 'Code', mono: true },
			{ key: 'description', label: 'Description' },
			{ key: 'rate', label: 'Rate %', align: 'right' as const, mono: true,
				format: (v: number) => `${v}%` },
			{ key: 'receivedAccount', label: 'Received Account', mono: true, class: 'text-muted-foreground' },
			{ key: 'paidAccount', label: 'Paid Account', mono: true, class: 'text-muted-foreground' }
		]
	};
</script>

<DataListView
	{config}
	rows={data.taxRates}
	title="Tax Rates"
	subtitle="{data.taxRates.length} tax codes configured"
	basePath="/tax-rates"
/>
