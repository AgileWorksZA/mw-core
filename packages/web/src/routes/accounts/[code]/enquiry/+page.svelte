<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { account, movements, totals } = data;

	const txTypeLabels: Record<string, string> = {
		DI: 'Invoice', CI: 'Bill', CR: 'Receipt', CP: 'Payment', JN: 'Journal', SO: 'Order', PO: 'PO', QU: 'Quote'
	};
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-b border-border bg-card px-6 py-4">
		<div class="flex items-center gap-3">
			<a href="/accounts/{account.code}" class="text-muted-foreground hover:text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<div>
				<h1 class="text-xl font-bold">Account Enquiry</h1>
				<div class="flex items-center gap-2 text-sm text-muted-foreground">
					<span class="font-mono">{account.code}</span>
					<span>{account.description}</span>
					<span class="rounded bg-muted px-1.5 py-0.5 text-xs">{account.type} {account.typeLabel}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-auto p-6">
		<!-- Summary cards -->
		<div class="mb-6 grid grid-cols-4 gap-4">
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Movements</div>
				<div class="mt-1 text-2xl font-bold">{totals.count}</div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Debits</div>
				<div class="mt-1 text-xl font-bold"><CurrencyDisplay amount={totals.debits} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Credits</div>
				<div class="mt-1 text-xl font-bold"><CurrencyDisplay amount={totals.credits} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Net</div>
				<div class="mt-1 text-xl font-bold"><CurrencyDisplay amount={totals.net} /></div>
			</div>
		</div>

		<!-- Movements table -->
		<div class="overflow-auto rounded-md border border-border">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="border-b border-border bg-muted/50">
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
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2 text-muted-foreground">{m.date}</td>
								<td class="px-3 py-2">
									<span class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{m.type}</span>
									<span class="ml-1 text-xs text-muted-foreground">{txTypeLabels[m.type] ?? ''}</span>
								</td>
								<td class="px-3 py-2 font-mono text-xs">{m.ref}</td>
								<td class="px-3 py-2">{m.nameCode}</td>
								<td class="px-3 py-2 max-w-xs truncate">{m.description}</td>
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {m.status === 'P' ? 'bg-green-500' : 'bg-amber-500'}"></span>
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
