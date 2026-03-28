<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Suppliers</h1>
		<p class="text-sm text-muted-foreground">{data.summary.total} suppliers — {data.summary.creditors} creditors — We owe <CurrencyDisplay amount={data.summary.totalOwed} /></p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.suppliers.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Name</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Phone</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Category</th>
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground">Creditor</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">We Owe</th>
						</tr>
					</thead>
					<tbody>
						{#each data.suppliers as s}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2 font-mono text-xs"><a href="/names/{s.code}" class="hover:underline">{s.code}</a></td>
								<td class="px-3 py-2 font-medium">{s.name}</td>
								<td class="px-3 py-2 text-muted-foreground">{s.phone}</td>
								<td class="px-3 py-2 text-muted-foreground">{s.category}</td>
								<td class="px-3 py-2 text-center">
									{#if s.isCreditor}<span class="text-xs font-medium text-blue-500">Credit</span>{:else}<span class="text-xs text-muted-foreground">Cash</span>{/if}
								</td>
								<td class="px-3 py-2 text-right" class:font-semibold={s.owed > 0} class:text-destructive={s.owed > 0}>
									{#if s.owed > 0.01}<CurrencyDisplay amount={s.owed} />{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No suppliers found</div>
		{/if}
	</div>
</div>
