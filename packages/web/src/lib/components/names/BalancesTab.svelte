<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { NameScreenData } from '$lib/api/types';

	let {
		balances,
		transactions
	}: {
		balances: NameScreenData['name']['balances'];
		transactions: NameScreenData['transactionHistory'];
	} = $props();

	const txTypeLabels: Record<string, string> = {
		DI: 'Sales Invoice',
		CI: 'Purchase Invoice',
		CR: 'Receipt',
		CP: 'Payment',
		JN: 'Journal',
		SO: 'Sales Order',
		PO: 'Purchase Order',
		QU: 'Quote'
	};
</script>

<div class="space-y-6">
	<!-- Aging Grid -->
	<div class="grid grid-cols-2 gap-6">
		<!-- Debtor -->
		<div class="rounded-lg border border-border p-4">
			<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Debtor Aging</h3>
			<div class="space-y-2">
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">3 or more cycles</span>
					<CurrencyDisplay amount={balances.debtor.threeOrMore} />
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">2 cycles</span>
					<CurrencyDisplay amount={balances.debtor.twoCycles} />
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">1 cycle</span>
					<CurrencyDisplay amount={balances.debtor.oneCycle} />
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Current</span>
					<CurrencyDisplay amount={balances.debtor.current} />
				</div>
				<div class="flex justify-between border-t border-border pt-2 text-sm font-semibold">
					<span>THEY OWE</span>
					<CurrencyDisplay amount={balances.debtor.theyOwe} />
				</div>
			</div>
		</div>

		<!-- Creditor -->
		<div class="rounded-lg border border-border p-4">
			<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Creditor</h3>
			<div class="space-y-2">
				<div class="flex justify-between border-t border-border pt-2 text-sm font-semibold">
					<span>WE OWE</span>
					<CurrencyDisplay amount={balances.creditor.weOwe} />
				</div>
			</div>
			{#if balances.dateOfLastSale}
				<div class="mt-4 text-sm text-muted-foreground">
					Date of Last Sale: <span class="text-foreground">{balances.dateOfLastSale}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Transaction History -->
	<div>
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Transaction History
		</h3>
		<div class="overflow-auto rounded-md border border-border">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-muted/50">
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Type</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Our Ref</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Gross</th>
					</tr>
				</thead>
				<tbody>
					{#if transactions.length === 0}
						<tr>
							<td colspan="6" class="px-3 py-6 text-center text-muted-foreground">
								No transactions found
							</td>
						</tr>
					{:else}
						{#each transactions as tx}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2">
									<span
										class="inline-block h-2 w-2 rounded-full
											{tx.status === 'P' ? 'bg-green-500' : 'bg-amber-500'}"
									></span>
								</td>
								<td class="px-3 py-2 text-muted-foreground">
									{txTypeLabels[tx.type] ?? tx.type}
								</td>
								<td class="px-3 py-2 font-mono text-xs">{tx.ourRef}</td>
								<td class="px-3 py-2">{tx.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{tx.date}</td>
								<td class="px-3 py-2 text-right">
									<CurrencyDisplay amount={tx.gross} />
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
