<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Payments</h1>
		<p class="text-sm text-muted-foreground">{data.summary.total} payments — Total <CurrencyDisplay amount={data.summary.totalGross} /></p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.payments.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-8">St</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Bank</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">To</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground">Period</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each data.payments as p}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {p.status === 'P' ? 'bg-green-500' : 'bg-amber-500'}"></span>
								</td>
								<td class="px-3 py-2 font-mono text-xs">
									<a href="/transactions/{p.seq}" class="hover:underline">{p.ref}</a>
								</td>
								<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{p.bank}</td>
								<td class="px-3 py-2">{p.name}</td>
								<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{p.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{p.date}</td>
								<td class="px-3 py-2 text-center text-muted-foreground">{p.period}</td>
								<td class="px-3 py-2 text-right font-semibold text-red-500"><CurrencyDisplay amount={p.gross} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No payments found</div>
		{/if}
	</div>
</div>
