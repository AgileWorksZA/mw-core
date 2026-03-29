<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function setStatus(s: string) {
		goto(`/invoices/purchases?status=${s}`, { invalidateAll: true });
	}

	const cards = $derived([
		{ label: 'Invoices', value: data.summary.total },
		{ label: 'Posted', value: data.summary.posted, color: 'green' as const },
		{ label: 'Unposted', value: data.summary.unposted, color: 'amber' as const },
		{ label: 'Total Gross', value: data.summary.totalGross, isCurrency: true },
		{ label: 'Outstanding', value: data.summary.totalOutstanding, isCurrency: true, color: data.summary.totalOutstanding > 0 ? 'red' as const : 'default' as const }
	]);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Purchase Invoices" subtitle="{data.summary.total} invoices — {data.today}">
		<div class="flex items-center gap-3">
			<div class="flex gap-1">
				{#each [['all', 'All'], ['posted', 'Posted'], ['unposted', 'Unposted']] as [key, label]}
					<button
						onclick={() => setStatus(key)}
						class="rounded-md px-3 py-1.5 text-sm transition-colors {data.status === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
					>{label}</button>
				{/each}
			</div>
			<a href="/invoices/purchases/new" class="rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">New Invoice</a>
		</div>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<SummaryCards {cards} />

		{#if data.invoices.length > 0}
			<div class="overflow-auto rounded-xl bg-surface-container-lowest">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="bg-surface-container-low">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-8">St</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Invoice</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Supplier</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Due</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Paid</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
						</tr>
					</thead>
					<tbody>
						{#each data.invoices as inv}
							<tr class="hover:bg-surface-container-low transition-colors" class:text-destructive={inv.overdue}>
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {inv.status === 'P' ? 'bg-positive' : 'bg-amber-500'}"></span>
								</td>
								<td class="px-3 py-2 font-mono text-xs"><a href="/transactions/{inv.seq}" class="hover:underline">{inv.ref}</a></td>
								<td class="px-3 py-2">{inv.name}</td>
								<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{inv.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
								<td class="px-3 py-2" class:font-semibold={inv.overdue}>{inv.dueDate}</td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.gross} /></td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.paid} /></td>
								<td class="px-3 py-2 text-right font-semibold">
									{#if inv.outstanding > 0.01}<CurrencyDisplay amount={inv.outstanding} />{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No purchase invoices found</div>
		{/if}
	</div>
</div>
