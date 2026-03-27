<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { summary } = data;
	const totalAging = $derived(summary.aging.current + summary.aging.thirtyPlus + summary.aging.sixtyPlus + summary.aging.ninetyPlus);
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-bold">Payables</h1>
				<p class="text-sm text-muted-foreground">Outstanding purchase invoices — {data.today}</p>
			</div>
			{#if summary.overdueCount > 0}
				<span class="rounded-full bg-destructive px-3 py-1 text-sm font-medium text-white">
					{summary.overdueCount} overdue
				</span>
			{/if}
		</div>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<!-- Summary cards -->
		<div class="mb-6 grid grid-cols-4 gap-4">
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Outstanding</div>
				<div class="mt-1 text-xl font-bold"><CurrencyDisplay amount={summary.totalOutstanding} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Invoices</div>
				<div class="mt-1 text-2xl font-bold">{summary.invoiceCount}</div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Overdue</div>
				<div class="mt-1 text-xl font-bold text-destructive">{summary.overdueCount}</div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Overdue Amount</div>
				<div class="mt-1 text-xl font-bold text-destructive"><CurrencyDisplay amount={summary.overdueAmount} /></div>
			</div>
		</div>

		<!-- Aging bar -->
		{#if totalAging > 0}
			<div class="mb-6">
				<h3 class="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Aging</h3>
				<div class="flex h-8 overflow-hidden rounded">
					<div class="bg-green-500" style="width: {(summary.aging.current / totalAging) * 100}%"></div>
					<div class="bg-amber-400" style="width: {(summary.aging.thirtyPlus / totalAging) * 100}%"></div>
					<div class="bg-orange-500" style="width: {(summary.aging.sixtyPlus / totalAging) * 100}%"></div>
					<div class="bg-red-500" style="width: {(summary.aging.ninetyPlus / totalAging) * 100}%"></div>
				</div>
				<div class="mt-2 grid grid-cols-4 gap-2 text-xs">
					<div class="flex items-center gap-1">
						<span class="h-2 w-2 rounded bg-green-500"></span>
						<span class="text-muted-foreground">Current</span>
						<span class="ml-auto font-medium"><CurrencyDisplay amount={summary.aging.current} /></span>
					</div>
					<div class="flex items-center gap-1">
						<span class="h-2 w-2 rounded bg-amber-400"></span>
						<span class="text-muted-foreground">30+ days</span>
						<span class="ml-auto font-medium"><CurrencyDisplay amount={summary.aging.thirtyPlus} /></span>
					</div>
					<div class="flex items-center gap-1">
						<span class="h-2 w-2 rounded bg-orange-500"></span>
						<span class="text-muted-foreground">60+ days</span>
						<span class="ml-auto font-medium"><CurrencyDisplay amount={summary.aging.sixtyPlus} /></span>
					</div>
					<div class="flex items-center gap-1">
						<span class="h-2 w-2 rounded bg-red-500"></span>
						<span class="text-muted-foreground">90+ days</span>
						<span class="ml-auto font-medium"><CurrencyDisplay amount={summary.aging.ninetyPlus} /></span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Invoice table -->
		{#if data.invoices.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Invoice</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Supplier</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Due Date</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Paid</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
						</tr>
					</thead>
					<tbody>
						{#each data.invoices as inv}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50" class:text-destructive={inv.overdue}>
								<td class="px-3 py-2 font-mono text-xs">{inv.ref}</td>
								<td class="px-3 py-2">{inv.name}</td>
								<td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
								<td class="px-3 py-2" class:font-semibold={inv.overdue}>{inv.dueDate}</td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.gross} /></td>
								<td class="px-3 py-2 text-right"><CurrencyDisplay amount={inv.paid} /></td>
								<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={inv.outstanding} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No outstanding payables</div>
		{/if}
	</div>
</div>
