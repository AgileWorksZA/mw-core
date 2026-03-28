<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import AgingBar from '$lib/components/AgingBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { summary } = data;

	const cards = $derived([
		{ label: 'Outstanding', value: summary.totalOutstanding, isCurrency: true },
		{ label: 'Invoices', value: summary.invoiceCount },
		{ label: 'Overdue', value: summary.overdueCount, color: 'red' as const },
		{ label: 'Overdue Amount', value: summary.overdueAmount, isCurrency: true, color: 'red' as const }
	]);

	const agingBuckets = $derived([
		{ label: 'Current', value: summary.aging.current, color: 'bg-green-500' },
		{ label: '30+ days', value: summary.aging.thirtyPlus, color: 'bg-amber-400' },
		{ label: '60+ days', value: summary.aging.sixtyPlus, color: 'bg-orange-500' },
		{ label: '90+ days', value: summary.aging.ninetyPlus, color: 'bg-red-500' }
	]);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Receivables" subtitle="Outstanding sales invoices — {data.today}">
		{#if summary.overdueCount > 0}
			<span class="rounded-full bg-destructive px-3 py-1 text-sm font-medium text-white">
				{summary.overdueCount} overdue
			</span>
		{/if}
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<SummaryCards {cards} />
		<AgingBar buckets={agingBuckets} />

		{#if data.invoices.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Invoice</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Customer</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Due Date</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Paid</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
						</tr>
					</thead>
					<tbody>
						{#each data.invoices as inv}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50" class:text-destructive={inv.overdue}>
								<td class="px-3 py-2 font-mono text-xs">{inv.ref}</td>
								<td class="px-3 py-2">{inv.name}</td>
								<td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
								<td class="px-3 py-2" class:font-semibold={inv.overdue}>{inv.dueDate}</td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.gross} /></td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.paid} /></td>
								<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={inv.outstanding} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No outstanding receivables</div>
		{/if}
	</div>
</div>
