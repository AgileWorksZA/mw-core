<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { periods, balances } = data;
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Daily Summary</h1>
		<p class="text-sm text-muted-foreground">Daily Dashboard for {data.date}</p>
	</div>

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
			<div class="grid grid-cols-3 gap-4">
				<div class="rounded-lg border border-border p-5">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
							<svg class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<rect x="2" y="5" width="20" height="14" rx="2" />
								<line x1="2" y1="10" x2="22" y2="10" />
							</svg>
						</div>
						<div>
							<div class="text-xs font-medium text-muted-foreground uppercase">Bank Balances</div>
							<div class="text-2xl font-bold"><CurrencyDisplay amount={balances.bank} /></div>
						</div>
					</div>
				</div>
				<div class="rounded-lg border border-border p-5">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
							<svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
							</svg>
						</div>
						<div>
							<div class="text-xs font-medium text-muted-foreground uppercase">Receivables</div>
							<div class="text-2xl font-bold"><CurrencyDisplay amount={balances.receivables} /></div>
						</div>
					</div>
				</div>
				<div class="rounded-lg border border-border p-5">
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
							<svg class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
							</svg>
						</div>
						<div>
							<div class="text-xs font-medium text-muted-foreground uppercase">Payables</div>
							<div class="text-2xl font-bold"><CurrencyDisplay amount={balances.payables} /></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
