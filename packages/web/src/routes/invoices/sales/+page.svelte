<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function setStatus(s: string) {
		goto(`/invoices/sales?status=${s}`, { invalidateAll: true });
	}
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-bold">Sales Invoices</h1>
				<p class="text-sm text-muted-foreground">{data.summary.total} invoices — {data.today}</p>
			</div>
			<div class="flex gap-1">
				{#each [['all', 'All'], ['posted', 'Posted'], ['unposted', 'Unposted']] as [key, label]}
					<button
						onclick={() => setStatus(key)}
						class="rounded-md px-3 py-1.5 text-sm transition-colors {data.status === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
					>{label}</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<!-- Summary -->
		<div class="mb-6 grid grid-cols-5 gap-4">
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Invoices</div>
				<div class="mt-1 text-2xl font-bold">{data.summary.total}</div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Posted</div>
				<div class="mt-1 text-2xl font-bold text-green-600">{data.summary.posted}</div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Unposted</div>
				<div class="mt-1 text-2xl font-bold text-amber-500">{data.summary.unposted}</div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Gross</div>
				<div class="mt-1 text-xl font-bold"><CurrencyDisplay amount={data.summary.totalGross} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Outstanding</div>
				<div class="mt-1 text-xl font-bold" class:text-destructive={data.summary.totalOutstanding > 0}>
					<CurrencyDisplay amount={data.summary.totalOutstanding} />
				</div>
			</div>
		</div>

		<!-- Table -->
		{#if data.invoices.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-8">St</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Invoice</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Customer</th>
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
							<tr class="border-b border-border last:border-0 hover:bg-muted/50" class:text-destructive={inv.overdue}>
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {inv.status === 'P' ? 'bg-green-500' : 'bg-amber-500'}"></span>
								</td>
								<td class="px-3 py-2 font-mono text-xs">
									<a href="/transactions/{inv.seq}" class="hover:underline">{inv.ref}</a>
								</td>
								<td class="px-3 py-2">{inv.name}</td>
								<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{inv.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
								<td class="px-3 py-2" class:font-semibold={inv.overdue}>{inv.dueDate}</td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.gross} /></td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.paid} /></td>
								<td class="px-3 py-2 text-right font-semibold">
									{#if inv.outstanding > 0.01}
										<CurrencyDisplay amount={inv.outstanding} />
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No sales invoices found</div>
		{/if}
	</div>
</div>
