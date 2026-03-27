<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { periods, balances, debtors } = data;
	const totalDebtors = $derived(debtors.current + debtors.oneCycle + debtors.twoCycles + debtors.threeOrMore);
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Dashboard</h1>
		<p class="text-sm text-muted-foreground">Daily Summary — {data.date}</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<!-- Transactions Entered -->
		<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Value of Transactions Entered
		</h2>
		<div class="mb-8 overflow-auto rounded-md border border-border">
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
						<td class="px-4 py-2 font-medium">Cost of Sales</td>
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
						<td class="px-4 py-2 text-muted-foreground">Invoices</td>
						<td class="px-4 py-2 text-right">{periods.today.invoiceCount}</td>
						<td class="px-4 py-2 text-right">{periods.sevenDay.invoiceCount}</td>
						<td class="px-4 py-2 text-right">{periods.thirtyDay.invoiceCount}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="grid grid-cols-2 gap-6">
			<!-- Balances -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
					Balances
				</h2>
				<div class="space-y-3">
					<div class="rounded-lg border border-border p-4">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Receivables</span>
							<span class="text-lg font-bold"><CurrencyDisplay amount={balances.receivables} /></span>
						</div>
					</div>
					<div class="rounded-lg border border-border p-4">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Payables</span>
							<span class="text-lg font-bold"><CurrencyDisplay amount={balances.payables} /></span>
						</div>
					</div>
					{#each balances.bankAccounts as bank}
						<div class="rounded-lg border border-border p-4">
							<div class="flex justify-between">
								<span class="text-muted-foreground">{bank.description} ({bank.code})</span>
								<span class="text-xs text-muted-foreground">{bank.type === 'CC' ? 'Credit Card' : 'Bank'}</span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Debtors Aging -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
					Debtors Aging
				</h2>
				<div class="rounded-lg border border-border p-4">
					<div class="space-y-3">
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Current</span>
							<CurrencyDisplay amount={debtors.current} />
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">1 cycle (30+ days)</span>
							<CurrencyDisplay amount={debtors.oneCycle} />
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">2 cycles (60+ days)</span>
							<CurrencyDisplay amount={debtors.twoCycles} />
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">3+ cycles (90+ days)</span>
							<CurrencyDisplay amount={debtors.threeOrMore} />
						</div>
						<div class="flex justify-between border-t border-border pt-2 font-semibold">
							<span>Total Debtors</span>
							<CurrencyDisplay amount={totalDebtors} />
						</div>
					</div>

					<!-- Simple bar chart -->
					{#if totalDebtors > 0}
						<div class="mt-4 flex h-8 overflow-hidden rounded">
							{@const max = Math.max(debtors.current, debtors.oneCycle, debtors.twoCycles, debtors.threeOrMore, 1)}
							<div class="bg-green-500" style="width: {(debtors.current / totalDebtors) * 100}%" title="Current"></div>
							<div class="bg-amber-400" style="width: {(debtors.oneCycle / totalDebtors) * 100}%" title="30+"></div>
							<div class="bg-orange-500" style="width: {(debtors.twoCycles / totalDebtors) * 100}%" title="60+"></div>
							<div class="bg-red-500" style="width: {(debtors.threeOrMore / totalDebtors) * 100}%" title="90+"></div>
						</div>
						<div class="mt-1 flex justify-between text-xs text-muted-foreground">
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-green-500"></span>Current</span>
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-amber-400"></span>30+</span>
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-orange-500"></span>60+</span>
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded bg-red-500"></span>90+</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
