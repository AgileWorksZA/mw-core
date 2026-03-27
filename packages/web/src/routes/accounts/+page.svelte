<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let search = $state('');

	const filtered = $derived(
		search
			? data.accounts.filter(
					(a) =>
						a.code.toLowerCase().includes(search.toLowerCase()) ||
						a.description.toLowerCase().includes(search.toLowerCase())
				)
			: data.accounts
	);
</script>

<div class="flex h-full">
	<!-- Filter sidebar -->
	<div class="w-48 shrink-0 border-r border-border bg-muted/30 p-3">
		<h3 class="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</h3>
		{#each data.filters as filter}
			<button
				class="mb-0.5 w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors
					{data.currentFilter === filter.key
						? 'bg-primary text-primary-foreground font-medium'
						: 'text-foreground hover:bg-muted'}"
				onclick={() => goto(`/accounts?filter=${filter.key}`, { invalidateAll: true })}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Main content -->
	<div class="flex flex-1 flex-col p-4">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold">Chart of Accounts</h2>
				<p class="text-sm text-muted-foreground">{data.count} accounts</p>
			</div>
			<input
				type="search"
				placeholder="Search accounts..."
				bind:value={search}
				class="w-64 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
		</div>

		<div class="flex-1 overflow-auto rounded-md border border-border">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="border-b border-border bg-muted/50">
						<th class="w-8 px-3 py-2.5"></th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Group</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Tax Code</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">System</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as acct}
						<tr
							class="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/50"
							onclick={() => goto(`/accounts/${acct.code}`)}
						>
							<td class="px-3 py-2 text-center">
								<ColourBadge colour={acct.colour} />
							</td>
							<td class="px-3 py-2">
								<a href="/accounts/{acct.code}" class="font-medium font-mono text-primary hover:underline">
									{acct.code}
								</a>
							</td>
							<td class="px-3 py-2">{acct.description}</td>
							<td class="px-3 py-2">
								<span class="rounded bg-muted px-1.5 py-0.5 text-xs">{acct.type}</span>
								<span class="ml-1 text-xs text-muted-foreground">{acct.typeLabel}</span>
							</td>
							<td class="px-3 py-2 text-muted-foreground">{acct.group}</td>
							<td class="px-3 py-2 font-mono text-xs">{acct.taxCode}</td>
							<td class="px-3 py-2 text-muted-foreground">{acct.system}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
