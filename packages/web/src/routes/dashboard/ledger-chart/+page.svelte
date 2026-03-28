<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const tp = data.tradingProfit;
	const bs = data.balanceSheet;

	const totalAssets = $derived(bs.currentAssets + bs.fixedAssets);
	const totalLiabEquity = $derived(bs.currentLiabilities + bs.equity);
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Ledger Chart</h1>
		<p class="text-sm text-muted-foreground">Trading profit and balance sheet overview</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		<!-- Trading Profit -->
		<div>
			<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trading Profit</h2>
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<tbody>
						<tr class="border-b border-border">
							<td class="px-4 py-2.5 font-medium">Income</td>
							<td class="px-4 py-2.5 text-right text-green-600 font-semibold"><CurrencyDisplay amount={tp.income} /></td>
						</tr>
						<tr class="border-b border-border">
							<td class="px-4 py-2.5 text-muted-foreground">Less: Cost of Sales</td>
							<td class="px-4 py-2.5 text-right text-red-500"><CurrencyDisplay amount={tp.costOfSales} /></td>
						</tr>
						<tr class="border-b border-border bg-muted/30">
							<td class="px-4 py-2.5 font-semibold">Gross Profit</td>
							<td class="px-4 py-2.5 text-right font-bold"><CurrencyDisplay amount={tp.grossProfit} /></td>
						</tr>
						<tr class="border-b border-border">
							<td class="px-4 py-2.5 text-muted-foreground">Add: Other Income</td>
							<td class="px-4 py-2.5 text-right"><CurrencyDisplay amount={tp.otherIncome} /></td>
						</tr>
						<tr class="border-b border-border">
							<td class="px-4 py-2.5 text-muted-foreground">Less: Expenses</td>
							<td class="px-4 py-2.5 text-right text-red-500"><CurrencyDisplay amount={tp.expenses} /></td>
						</tr>
						<tr class="bg-muted/30">
							<td class="px-4 py-2.5 font-bold text-lg">Net Profit</td>
							<td class="px-4 py-2.5 text-right font-bold text-lg" class:text-green-600={tp.netProfit >= 0} class:text-destructive={tp.netProfit < 0}>
								<CurrencyDisplay amount={tp.netProfit} />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Balance Sheet -->
		<div>
			<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Balance Sheet</h2>
			<div class="grid grid-cols-2 gap-6">
				<div class="rounded-md border border-border overflow-auto">
					<table class="w-full text-sm">
						<thead><tr class="border-b border-border bg-muted/50"><th class="px-4 py-2.5 text-left font-medium text-muted-foreground" colspan="2">Assets</th></tr></thead>
						<tbody>
							<tr class="border-b border-border">
								<td class="px-4 py-2.5">Current Assets</td>
								<td class="px-4 py-2.5 text-right font-semibold"><CurrencyDisplay amount={bs.currentAssets} /></td>
							</tr>
							<tr class="border-b border-border">
								<td class="px-4 py-2.5">Fixed Assets</td>
								<td class="px-4 py-2.5 text-right font-semibold"><CurrencyDisplay amount={bs.fixedAssets} /></td>
							</tr>
							<tr class="bg-muted/30">
								<td class="px-4 py-2.5 font-bold">Total Assets</td>
								<td class="px-4 py-2.5 text-right font-bold"><CurrencyDisplay amount={totalAssets} /></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="rounded-md border border-border overflow-auto">
					<table class="w-full text-sm">
						<thead><tr class="border-b border-border bg-muted/50"><th class="px-4 py-2.5 text-left font-medium text-muted-foreground" colspan="2">Liabilities & Equity</th></tr></thead>
						<tbody>
							<tr class="border-b border-border">
								<td class="px-4 py-2.5">Current Liabilities</td>
								<td class="px-4 py-2.5 text-right font-semibold"><CurrencyDisplay amount={bs.currentLiabilities} /></td>
							</tr>
							<tr class="border-b border-border">
								<td class="px-4 py-2.5">Equity</td>
								<td class="px-4 py-2.5 text-right font-semibold"><CurrencyDisplay amount={bs.equity} /></td>
							</tr>
							<tr class="bg-muted/30">
								<td class="px-4 py-2.5 font-bold">Total</td>
								<td class="px-4 py-2.5 text-right font-bold"><CurrencyDisplay amount={totalLiabEquity} /></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
