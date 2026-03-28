<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const totalOwed = $derived(data.creditors.reduce((s, c) => s + c.owed, 0));
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Batch Payments</h1>
		<p class="text-sm text-muted-foreground">{data.creditors.length} creditors with outstanding balances — Total <CurrencyDisplay amount={totalOwed} /></p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.creditors.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-10">Sel</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Supplier</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount to Pay</th>
						</tr>
					</thead>
					<tbody>
						{#each data.creditors as c}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2 text-center"><input type="checkbox" class="h-4 w-4 rounded border-gray-300" /></td>
								<td class="px-3 py-2 font-mono text-xs">{c.code}</td>
								<td class="px-3 py-2 font-medium">{c.name}</td>
								<td class="px-3 py-2 text-right text-destructive font-semibold"><CurrencyDisplay amount={c.owed} /></td>
								<td class="px-3 py-2 text-right">
									<input type="number" step="0.01" min="0" class="w-28 rounded border border-input bg-background px-2 py-1 text-right text-sm" placeholder="0.00" />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="mt-3 text-xs text-center text-muted-foreground">Batch payment processing coming soon</p>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No creditors with outstanding balances</div>
		{/if}
	</div>
</div>
