<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { TransactionScreenData } from '$lib/api/types';

	let {
		lineItems,
		totals,
		lookups
	}: {
		lineItems: TransactionScreenData['transaction']['lineItems'];
		totals: TransactionScreenData['transaction']['totals'];
		lookups: TransactionScreenData['lookups'];
	} = $props();

	let viewMode = $state<'account' | 'item'>('account');

	// Determine if any lines have stock items
	const hasItems = $derived(lineItems.some((l) => l.stockCode));
</script>

<div class="space-y-4">
	<!-- View mode toggle -->
	{#if hasItems}
		<div class="flex gap-1 rounded-md bg-muted p-1 w-fit">
			<button
				class="rounded px-3 py-1 text-sm transition-colors
					{viewMode === 'account' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (viewMode = 'account')}
			>
				By Account
			</button>
			<button
				class="rounded px-3 py-1 text-sm transition-colors
					{viewMode === 'item' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (viewMode = 'item')}
			>
				By Item
			</button>
		</div>
	{/if}

	<!-- Line items grid -->
	<div class="overflow-auto rounded-md border border-border">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border bg-muted/50">
					{#if viewMode === 'account'}
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Account</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Account Name</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Tax Code</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Net</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Tax</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Gross</th>
					{:else}
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Item</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Qty</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Unit Price</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">Unit</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Disc%</th>
						<th class="px-3 py-2 text-left font-medium text-muted-foreground">TC</th>
						<th class="px-3 py-2 text-right font-medium text-muted-foreground">Extension</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#if lineItems.length === 0}
					<tr>
						<td colspan="7" class="px-3 py-6 text-center text-muted-foreground">
							No line items
						</td>
					</tr>
				{:else}
					{#each lineItems as line}
						<tr class="border-b border-border last:border-0 hover:bg-muted/30">
							{#if viewMode === 'account'}
								<td class="px-3 py-2 font-mono text-xs">{line.account}</td>
								<td class="px-3 py-2 text-muted-foreground">{line.accountDescription}</td>
								<td class="px-3 py-2">{line.description}</td>
								<td class="px-3 py-2 font-mono text-xs">{line.taxCode}</td>
								<td class="px-3 py-2 text-right">
									<CurrencyDisplay amount={line.gross - line.tax} />
								</td>
								<td class="px-3 py-2 text-right">
									<CurrencyDisplay amount={line.tax} />
								</td>
								<td class="px-3 py-2 text-right font-medium">
									<CurrencyDisplay amount={line.gross} />
								</td>
							{:else}
								<td class="px-3 py-2 font-mono text-xs">{line.stockCode || line.account}</td>
								<td class="px-3 py-2 text-right tabular-nums">
									{#if line.stockQty}{line.stockQty}{/if}
								</td>
								<td class="px-3 py-2">{line.description}</td>
								<td class="px-3 py-2 text-right">
									{#if line.unitPrice}
										<CurrencyDisplay amount={line.unitPrice} />
									{/if}
								</td>
								<td class="px-3 py-2 text-muted-foreground">{line.unit}</td>
								<td class="px-3 py-2 text-right tabular-nums">
									{#if line.discount}{line.discount}%{/if}
								</td>
								<td class="px-3 py-2 font-mono text-xs">{line.taxCode}</td>
								<td class="px-3 py-2 text-right font-medium">
									<CurrencyDisplay amount={line.gross} />
								</td>
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Totals footer -->
	<div class="flex justify-end">
		<div class="w-72 space-y-1 rounded-lg border border-border p-4">
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">Subtotal ({totals.lineCount} lines)</span>
				<CurrencyDisplay amount={totals.subtotal} />
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">Tax</span>
				<CurrencyDisplay amount={totals.tax} />
			</div>
			<div class="flex justify-between border-t border-border pt-1 font-semibold">
				<span>Total</span>
				<CurrencyDisplay amount={totals.gross} />
			</div>
			{#if totals.amtPaid > 0}
				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Paid</span>
					<CurrencyDisplay amount={totals.amtPaid} />
				</div>
				<div class="flex justify-between border-t border-border pt-1 font-semibold text-destructive">
					<span>Outstanding</span>
					<CurrencyDisplay amount={totals.outstanding} />
				</div>
			{/if}
		</div>
	</div>
</div>
