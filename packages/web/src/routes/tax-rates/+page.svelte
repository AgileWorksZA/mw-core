<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Tax Rates</h1>
		<p class="text-sm text-muted-foreground">{data.taxRates.length} tax codes configured</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.taxRates.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Rate %</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Received Account</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Paid Account</th>
						</tr>
					</thead>
					<tbody>
						{#each data.taxRates as tax}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2 font-mono text-xs font-semibold">{tax.code}</td>
								<td class="px-3 py-2">{tax.description}</td>
								<td class="px-3 py-2 text-right font-mono">{tax.rate}%</td>
								<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{tax.receivedAccount}</td>
								<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{tax.paidAccount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No tax rates configured</div>
		{/if}
	</div>
</div>
