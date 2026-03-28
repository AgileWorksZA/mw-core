<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { account, movements, totals } = data;

	const txTypeLabels: Record<string, string> = {
		DI: 'Invoice', CI: 'Bill', CR: 'Receipt', CP: 'Payment', JN: 'Journal', SO: 'Order', PO: 'PO', QU: 'Quote'
	};

	const cards = $derived([
		{ label: 'Movements', value: totals.count },
		{ label: 'Total Debits', value: totals.debits, isCurrency: true },
		{ label: 'Total Credits', value: totals.credits, isCurrency: true },
		{ label: 'Net', value: totals.net, isCurrency: true }
	]);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Account Enquiry" subtitle="{account.code} — {account.description} ({account.type} {account.typeLabel})">
		<a href="/accounts/{account.code}" class="text-muted-foreground hover:text-foreground">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<SummaryCards {cards} />

		<div class="overflow-auto rounded-xl bg-surface-container-lowest">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="bg-surface-container-low">
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Name</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
					</tr>
				</thead>
				<tbody>
					{#if movements.length === 0}
						<tr><td colspan="7" class="px-3 py-8 text-center text-muted-foreground">No movements found</td></tr>
					{:else}
						{#each movements as m}
							<tr class="hover:bg-surface-container-low transition-colors">
								<td class="px-3 py-2 text-muted-foreground">{m.date}</td>
								<td class="px-3 py-2">
									<span class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{m.type}</span>
									<span class="ml-1 text-xs text-muted-foreground">{txTypeLabels[m.type] ?? ''}</span>
								</td>
								<td class="px-3 py-2 font-mono text-xs">{m.ref}</td>
								<td class="px-3 py-2">{m.nameCode}</td>
								<td class="px-3 py-2 max-w-xs truncate">{m.description}</td>
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {m.status === 'P' ? 'bg-positive' : 'bg-amber-500'}"></span>
								</td>
								<td class="px-3 py-2 text-right">
									<CurrencyDisplay amount={m.gross} />
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
