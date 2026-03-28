<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { periods, balances } = data;

	const balanceCards = $derived([
		{ label: 'Bank Balances', value: balances.bank, isCurrency: true },
		{ label: 'Receivables', value: balances.receivables, isCurrency: true },
		{ label: 'Payables', value: balances.payables, isCurrency: true }
	]);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Daily Summary" subtitle="Daily Dashboard for {data.date}" />

	<div class="flex-1 overflow-auto p-6 space-y-8">
		<!-- Section 1: Transactions Entered -->
		<div>
			<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
				Value of Transactions Entered
			</h2>
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-border bg-muted/50">
							<th class="px-4 py-3 text-left font-medium text-muted-foreground"></th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Today</th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Previous 7 Days</th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Previous 30 Days</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-border">
							<td class="px-4 py-2 font-medium">Sales</td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.today.sales} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.sevenDay.sales} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.thirtyDay.sales} /></td>
						</tr>
						<tr class="border-b border-border">
							<td class="px-4 py-2 text-muted-foreground">Less: Cost of Sales</td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.today.cogs} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.sevenDay.cogs} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.thirtyDay.cogs} /></td>
						</tr>
						<tr class="border-b border-border bg-muted/30">
							<td class="px-4 py-2 font-semibold">Gross Margin</td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.today.grossMargin} /></td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.sevenDay.grossMargin} /></td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.thirtyDay.grossMargin} /></td>
						</tr>
						<tr class="border-b border-border">
							<td class="px-4 py-2 text-muted-foreground">Gross Margin %</td>
							<td class="px-4 py-2 text-right">{periods.today.marginPct.toFixed(1)}%</td>
							<td class="px-4 py-2 text-right">{periods.sevenDay.marginPct.toFixed(1)}%</td>
							<td class="px-4 py-2 text-right">{periods.thirtyDay.marginPct.toFixed(1)}%</td>
						</tr>
						<tr>
							<td class="px-4 py-2 text-muted-foreground">Orders Booked</td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.today.ordersBooked} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.sevenDay.ordersBooked} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.thirtyDay.ordersBooked} /></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Section 2: Balances -->
		<div>
			<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
				Balances
			</h2>
			<SummaryCards cards={balanceCards} />
		</div>
	</div>
</div>
