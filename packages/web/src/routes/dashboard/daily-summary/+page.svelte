<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import RefreshIndicator from '$lib/components/RefreshIndicator.svelte';
	import { createAutoRefresh } from '$lib/stores/autoRefresh.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { periods, balances } = data;

	const refresh = createAutoRefresh(30_000);
	onMount(() => refresh.start());
	onDestroy(() => refresh.stop());

	const balanceCards = $derived([
		{ label: 'Bank Balances', value: balances.bank, isCurrency: true },
		{ label: 'Receivables', value: balances.receivables, isCurrency: true },
		{ label: 'Payables', value: balances.payables, isCurrency: true }
	]);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Daily Summary" subtitle="Daily Dashboard for {data.date}">
		<RefreshIndicator enabled={refresh.enabled} refreshing={refresh.refreshing} onToggle={refresh.toggle} onRefresh={refresh.refreshNow} />
	</PageHeader>

	<div class="flex-1 overflow-auto p-6 space-y-12">
		<!-- Section 1: Transactions Entered -->
		<div>
			<h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">
				Value of Transactions Entered
			</h2>
			<div class="overflow-auto rounded-xl bg-surface-container-lowest">
				<table class="w-full text-sm tabular-nums">
					<thead>
						<tr class="bg-surface-container-low">
							<th class="px-4 py-3 text-left font-medium text-muted-foreground"></th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Today</th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Previous 7 Days</th>
							<th class="px-4 py-3 text-right font-medium text-muted-foreground">Previous 30 Days</th>
						</tr>
					</thead>
					<tbody>
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-4 py-2 font-medium">Sales</td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.today.sales} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.sevenDay.sales} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.thirtyDay.sales} /></td>
						</tr>
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-4 py-2 text-muted-foreground">Less: Cost of Sales</td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.today.cogs} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.sevenDay.cogs} /></td>
							<td class="px-4 py-2 text-right"><CurrencyDisplay amount={periods.thirtyDay.cogs} /></td>
						</tr>
						<tr class="bg-surface-container-low">
							<td class="px-4 py-2 font-semibold">Gross Margin</td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.today.grossMargin} /></td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.sevenDay.grossMargin} /></td>
							<td class="px-4 py-2 text-right font-semibold"><CurrencyDisplay amount={periods.thirtyDay.grossMargin} /></td>
						</tr>
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-4 py-2 text-muted-foreground">Gross Margin %</td>
							<td class="px-4 py-2 text-right">{periods.today.marginPct.toFixed(1)}%</td>
							<td class="px-4 py-2 text-right">{periods.sevenDay.marginPct.toFixed(1)}%</td>
							<td class="px-4 py-2 text-right">{periods.thirtyDay.marginPct.toFixed(1)}%</td>
						</tr>
						<tr class="hover:bg-surface-container-low transition-colors">
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
			<h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">
				Balances
			</h2>
			<SummaryCards cards={balanceCards} />
		</div>
	</div>
</div>
