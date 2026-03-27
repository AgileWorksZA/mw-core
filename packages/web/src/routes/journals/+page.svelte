<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Journals</h1>
		<p class="text-sm text-muted-foreground">{data.summary.total} entries — {data.summary.posted} posted</p>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.journals.length > 0}
			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-8">St</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground">Period</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-12">Rec</th>
						</tr>
					</thead>
					<tbody>
						{#each data.journals as j}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50">
								<td class="px-3 py-2">
									<span class="inline-block h-2 w-2 rounded-full {j.status === 'P' ? 'bg-green-500' : 'bg-amber-500'}"></span>
								</td>
								<td class="px-3 py-2 font-mono text-xs">
									<a href="/transactions/{j.seq}" class="hover:underline">{j.ref}</a>
								</td>
								<td class="px-3 py-2">{j.description}</td>
								<td class="px-3 py-2 text-muted-foreground">{j.date}</td>
								<td class="px-3 py-2 text-center text-muted-foreground">{j.period}</td>
								<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={j.gross} /></td>
								<td class="px-3 py-2 text-center">
									{#if j.recurring}<span class="text-blue-500 text-xs font-medium">REC</span>{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No journal entries found</div>
		{/if}
	</div>
</div>
