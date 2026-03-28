<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let search = $state('');

	const filtered = $derived(
		search
			? data.transactions.filter(
					(t) =>
						t.ourRef?.toLowerCase().includes(search.toLowerCase()) ||
						t.nameCode?.toLowerCase().includes(search.toLowerCase()) ||
						t.description?.toLowerCase().includes(search.toLowerCase())
				)
			: data.transactions
	);

	function setFilter(type: string, status: string) {
		goto(`/transactions?type=${type}&status=${status}`, { invalidateAll: true });
	}

	function statusDot(status: string): string {
		return status === 'P' ? 'bg-positive' : 'bg-amber-500';
	}
</script>

<div class="flex h-full">
	<!-- Filter sidebar -->
	<div class="w-48 shrink-0 bg-surface-container-low p-3">
		<h3 class="font-headline mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			Type
		</h3>
		{#each data.typeFilters as filter}
			<button
				class="mb-0.5 w-full rounded-xl px-2 py-1.5 text-left text-sm transition-colors
					{data.currentType === filter.key
						? 'bg-primary text-primary-foreground font-medium'
						: 'text-foreground hover:bg-surface-container-low'}"
				onclick={() => setFilter(filter.key, data.currentStatus)}
			>
				{filter.label}
			</button>
		{/each}

		<h3 class="font-headline mb-2 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			Status
		</h3>
		{#each data.statusFilters as filter}
			<button
				class="mb-0.5 w-full rounded-xl px-2 py-1.5 text-left text-sm transition-colors
					{data.currentStatus === filter.key
						? 'bg-primary text-primary-foreground font-medium'
						: 'text-foreground hover:bg-surface-container-low'}"
				onclick={() => setFilter(data.currentType, filter.key)}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Main content -->
	<div class="flex flex-1 flex-col p-4">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="font-headline text-lg font-semibold">Transactions</h2>
				<p class="text-sm text-muted-foreground">{data.count} records</p>
			</div>
			<input
				type="search"
				placeholder="Search transactions..."
				bind:value={search}
				class="w-64 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
		</div>

		<div class="flex-1 overflow-auto rounded-xl bg-surface-container-lowest">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="bg-surface-container-lowest">
						<th class="w-8 px-3 py-2.5"></th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Our Ref</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Name</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as tx}
						<tr
							class="cursor-pointer transition-colors hover:bg-surface-container-low"
							onclick={() => goto(`/transactions/${tx.id}`)}
						>
							<td class="px-3 py-2 text-center">
								<span class="inline-block h-2 w-2 rounded-full {statusDot(tx.status)}"></span>
							</td>
							<td class="px-3 py-2">
								<span class="rounded bg-surface-container-low px-1.5 py-0.5 text-xs font-mono">
									{tx.type}
								</span>
								<span class="ml-1 text-xs text-muted-foreground">{tx.typeLabel}</span>
							</td>
							<td class="px-3 py-2">
								<a href="/transactions/{tx.id}" class="font-medium text-primary hover:underline">
									{tx.ourRef}
								</a>
							</td>
							<td class="px-3 py-2">
								<div class="flex items-center gap-1.5">
									<ColourBadge colour={tx.colour} />
									{tx.nameCode}
									{#if tx.hold}
										<span class="rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">HOLD</span>
									{/if}
								</div>
							</td>
							<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{tx.description}</td>
							<td class="px-3 py-2 text-muted-foreground">{tx.date}</td>
							<td class="px-3 py-2 text-right">
								<CurrencyDisplay amount={tx.gross} />
							</td>
							<td class="px-3 py-2 text-right">
								{#if tx.outstanding > 0.01}
									<CurrencyDisplay amount={tx.outstanding} />
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
