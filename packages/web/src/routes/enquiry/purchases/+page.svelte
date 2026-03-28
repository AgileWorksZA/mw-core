<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let nameInput = $state(data.nameCode);

	function search() {
		if (nameInput.trim()) {
			goto(`/enquiry/purchases?name=${encodeURIComponent(nameInput.trim())}`, { invalidateAll: true });
		}
	}

	const totalPurchases = $derived(data.invoices.reduce((sum, i) => sum + i.gross, 0));
	const totalOutstanding = $derived(data.invoices.reduce((sum, i) => sum + i.outstanding, 0));

	const summaryCards = $derived([
		{ label: 'Total Purchases', value: totalPurchases, isCurrency: true },
		{ label: 'Invoices', value: data.invoices.length },
		{ label: 'Outstanding', value: totalOutstanding, isCurrency: true, color: (totalOutstanding > 0 ? 'red' : 'default') as 'red' | 'default' }
	]);
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<PageHeader title="Purchase Enquiry" subtitle={data.supplier ? `${data.supplier.name} (${data.supplier.code})` : ''}>
		<form onsubmit={(e) => { e.preventDefault(); search(); }} class="flex gap-2">
			<input
				type="text"
				placeholder="Supplier code..."
				bind:value={nameInput}
				class="w-48 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
			<button type="submit" class="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
				Search
			</button>
		</form>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		{#if !data.supplier}
			<div class="flex h-full items-center justify-center text-muted-foreground">
				Enter a supplier code to view purchase history
			</div>
		{:else}
			<!-- Summary -->
			<SummaryCards cards={summaryCards} />

			<!-- Monthly breakdown -->
			{#if data.monthly.length > 0}
				<div class="mb-6">
					<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Monthly Purchases</h3>
					<div class="grid grid-cols-6 gap-2">
						{#each data.monthly as m}
							<div class="rounded-lg border border-border p-3 text-center">
								<div class="text-xs text-muted-foreground">Period {m.period}</div>
								<div class="mt-1 font-semibold"><CurrencyDisplay amount={m.value} /></div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Invoice list -->
			<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Invoices</h3>
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Paid</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
						</tr>
					</thead>
					<tbody>
						{#each data.invoices as inv}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {inv.status === 'P' ? 'bg-green-500' : 'bg-amber-500'}"></span>
								</td>
								<td class="px-3 py-2 font-mono text-xs">{inv.ref}</td>
								<td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
								<td class="px-3 py-2 max-w-xs truncate">{inv.description}</td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.gross} /></td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.amtPaid} /></td>
								<td class="px-3 py-2 text-right" class:text-destructive={inv.outstanding > 0.01}>
									{#if inv.outstanding > 0.01}
										<CurrencyDisplay amount={inv.outstanding} />
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
