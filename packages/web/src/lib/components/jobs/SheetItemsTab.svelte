<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';

	let { items, title, emptyMessage = 'No items' }: {
		items: Array<{
			id: number;
			date: string;
			resource: string;
			qty: number;
			unit: string;
			cost: number;
			charge: number;
			account: string;
			memo: string;
			analysis: string;
			costCentre: string;
			locked: boolean;
		}>;
		title: string;
		emptyMessage?: string;
	} = $props();

	const totalCost = $derived(items.reduce((s, i) => s + i.cost, 0));
	const totalCharge = $derived(items.reduce((s, i) => s + i.charge, 0));
</script>

<div class="space-y-4">
	{#if items.length > 0}
		<!-- Summary -->
		<div class="grid grid-cols-3 gap-3">
			<div class="rounded-xl bg-surface-container-lowest p-3 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">{title}</div>
				<div class="mt-1 text-lg font-bold font-headline">{items.length}</div>
			</div>
			<div class="rounded-xl bg-surface-container-lowest p-3 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Cost</div>
				<div class="mt-1 text-lg font-bold font-headline"><CurrencyDisplay amount={totalCost} /></div>
			</div>
			<div class="rounded-xl bg-surface-container-lowest p-3 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Charge</div>
				<div class="mt-1 text-lg font-bold font-headline"><CurrencyDisplay amount={totalCharge} /></div>
			</div>
		</div>

		<!-- Table -->
		<div class="overflow-auto rounded-xl bg-surface-container-lowest">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="bg-surface-container-low">
						<th class="w-6 px-2 py-2.5"></th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Resource</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Qty</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Unit</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Cost</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Charge</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Memo</th>
					</tr>
				</thead>
				<tbody>
					{#each items as item}
						<tr class="hover:bg-surface-container-low transition-colors">
							<td class="px-2 py-2 text-center">
								{#if item.locked}
									<svg class="h-3.5 w-3.5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<rect x="3" y="11" width="18" height="11" rx="2" />
										<path d="M7 11V7a5 5 0 0110 0v4" />
									</svg>
								{/if}
							</td>
							<td class="px-3 py-2 text-muted-foreground font-mono text-xs">{item.date}</td>
							<td class="px-3 py-2">
								{#if item.resource}
									<a href="/items/{item.resource}" class="text-primary hover:underline font-mono text-xs">{item.resource}</a>
								{/if}
							</td>
							<td class="px-3 py-2 text-right font-mono text-xs">{item.qty}</td>
							<td class="px-3 py-2 text-muted-foreground">{item.unit}</td>
							<td class="px-3 py-2 text-right"><CurrencyDisplay amount={item.cost} /></td>
							<td class="px-3 py-2 text-right"><CurrencyDisplay amount={item.charge} /></td>
							<td class="px-3 py-2 text-muted-foreground max-w-xs truncate">{item.memo}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr class="bg-surface-container-low font-semibold">
						<td class="px-3 py-2" colspan="5">Total</td>
						<td class="px-3 py-2 text-right"><CurrencyDisplay amount={totalCost} /></td>
						<td class="px-3 py-2 text-right"><CurrencyDisplay amount={totalCharge} /></td>
						<td></td>
					</tr>
				</tfoot>
			</table>
		</div>
	{:else}
		<div class="flex h-32 items-center justify-center text-muted-foreground">{emptyMessage}</div>
	{/if}
</div>
