<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Sales Orders</h1>
		<p class="text-sm text-muted-foreground">{data.summary.total} orders — Total <CurrencyDisplay amount={data.summary.totalGross} /></p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.orders.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Order #</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Customer Ref</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Customer</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Due</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-12">Hold</th>
						</tr>
					</thead>
					<tbody>
						{#each data.orders as o}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2 font-mono text-xs"><a href="/transactions/{o.seq}" class="hover:underline">{o.ref}</a></td>
								<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{o.orderRef}</td>
								<td class="px-3 py-2">{o.name}</td>
								<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{o.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{o.date}</td>
								<td class="px-3 py-2 text-muted-foreground">{o.dueDate}</td>
								<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={o.gross} /></td>
								<td class="px-3 py-2 text-center">
									{#if o.hold}<span class="text-amber-500 text-xs font-medium">HOLD</span>{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No sales orders found</div>
		{/if}
	</div>
</div>
