<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';

	let { transactions }: {
		transactions: Array<{
			id: number;
			type: string;
			ourRef: string;
			date: string;
			nameCode: string;
			description: string;
			quantity: number;
			unitPrice: number;
			gross: number;
		}>;
	} = $props();

	const purchases = $derived(transactions.filter(t => ['CI', 'CP', 'PO'].includes(t.type)));
	const sales = $derived(transactions.filter(t => ['DI', 'CR', 'SO', 'QU'].includes(t.type)));
</script>

<div class="space-y-6">
	<!-- Summary -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
		<div class="rounded-xl bg-surface-container-lowest p-4 text-center">
			<div class="text-xs font-medium text-muted-foreground uppercase">Total Transactions</div>
			<div class="mt-1 text-xl font-bold font-headline">{transactions.length}</div>
		</div>
		<div class="rounded-xl bg-surface-container-lowest p-4 text-center">
			<div class="text-xs font-medium text-muted-foreground uppercase">Sales</div>
			<div class="mt-1 text-xl font-bold font-headline text-positive">{sales.length}</div>
		</div>
		<div class="rounded-xl bg-surface-container-lowest p-4 text-center">
			<div class="text-xs font-medium text-muted-foreground uppercase">Purchases</div>
			<div class="mt-1 text-xl font-bold font-headline text-blue-500">{purchases.length}</div>
		</div>
		<div class="rounded-xl bg-surface-container-lowest p-4 text-center">
			<div class="text-xs font-medium text-muted-foreground uppercase">Other</div>
			<div class="mt-1 text-xl font-bold font-headline">{transactions.length - sales.length - purchases.length}</div>
		</div>
	</div>

	<!-- Transaction list -->
	{#if transactions.length > 0}
		<div class="overflow-auto rounded-xl bg-surface-container-lowest">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="bg-surface-container-low">
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Reference</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Name</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Qty</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Unit Price</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
					</tr>
				</thead>
				<tbody>
					{#each transactions as tx}
						<tr class="hover:bg-surface-container-low transition-colors cursor-pointer">
							<td class="px-3 py-2">
								<span class="rounded bg-surface-container-low px-1.5 py-0.5 text-xs font-mono">{tx.type}</span>
							</td>
							<td class="px-3 py-2">
								<a href="/transactions/{tx.id}" class="text-primary hover:underline font-medium">{tx.ourRef}</a>
							</td>
							<td class="px-3 py-2 text-muted-foreground">{tx.date}</td>
							<td class="px-3 py-2 text-muted-foreground">{tx.nameCode}</td>
							<td class="px-3 py-2 text-muted-foreground max-w-xs truncate">{tx.description}</td>
							<td class="px-3 py-2 text-right font-mono text-xs">{tx.quantity}</td>
							<td class="px-3 py-2 text-right"><CurrencyDisplay amount={tx.unitPrice} /></td>
							<td class="px-3 py-2 text-right"><CurrencyDisplay amount={tx.gross} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="flex h-32 items-center justify-center text-muted-foreground">No transaction history for this item</div>
	{/if}
</div>
