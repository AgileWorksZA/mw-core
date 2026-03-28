<script lang="ts">
	import { goto } from '$app/navigation';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let search = $state('');

	const filteredNames = $derived(
		search
			? data.names.filter(
					(n) =>
						n.code.toLowerCase().includes(search.toLowerCase()) ||
						n.name.toLowerCase().includes(search.toLowerCase())
				)
			: data.names
	);

	function setFilter(key: string) {
		goto(`/names?filter=${key}`, { invalidateAll: true });
	}

	function typeLabel(n: { customerType: number; supplierType: number }): string {
		const parts: string[] = [];
		if (n.customerType === 2) parts.push('Debtor');
		else if (n.customerType === 1) parts.push('Customer');
		if (n.supplierType === 2) parts.push('Creditor');
		else if (n.supplierType === 1) parts.push('Supplier');
		return parts.join(', ') || 'Other';
	}
</script>

<div class="flex h-full">
	<!-- Filter sidebar -->
	<div class="w-48 shrink-0 bg-surface-container-low p-3">
		<h3 class="font-headline mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			Filter
		</h3>
		{#each data.filters as filter}
			<button
				class="mb-0.5 w-full rounded-xl px-2 py-1.5 text-left text-sm transition-colors
					{data.currentFilter === filter.key
						? 'bg-primary text-primary-foreground font-medium'
						: 'text-foreground hover:bg-surface-container-low'}"
				onclick={() => setFilter(filter.key)}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Main content -->
	<div class="flex flex-1 flex-col p-4">
		<!-- Header -->
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="font-headline text-lg font-semibold">Names</h2>
				<p class="text-sm text-muted-foreground">{data.count} records</p>
			</div>
			<input
				type="search"
				placeholder="Search names..."
				bind:value={search}
				class="w-64 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			/>
		</div>

		<!-- Table -->
		<div class="flex-1 overflow-auto rounded-xl bg-surface-container-lowest">
			<table class="w-full text-sm">
				<thead class="sticky top-0">
					<tr class="bg-surface-container-lowest">
						<th class="w-8 px-3 py-2.5"></th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Name</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Category</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Phone</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">They Owe</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">We Owe</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredNames as name}
						<tr
							class="cursor-pointer transition-colors hover:bg-surface-container-low"
							onclick={() => goto(`/names/${name.code}`)}
						>
							<td class="px-3 py-2 text-center">
								<ColourBadge colour={name.colour} />
							</td>
							<td class="px-3 py-2">
								<a href="/names/{name.code}" class="font-medium text-primary hover:underline">
									{name.code}
								</a>
							</td>
							<td class="px-3 py-2">
								{name.name}
								{#if name.hold}
									<span class="ml-1.5 rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">HOLD</span>
								{/if}
							</td>
							<td class="px-3 py-2 text-muted-foreground">{typeLabel(name)}</td>
							<td class="px-3 py-2 text-muted-foreground">{name.category}</td>
							<td class="px-3 py-2 text-muted-foreground">{name.phone}</td>
							<td class="px-3 py-2 text-right">
								{#if name.dBalance > 0}
									<CurrencyDisplay amount={name.dBalance} />
								{/if}
							</td>
							<td class="px-3 py-2 text-right">
								{#if name.cBalance > 0}
									<CurrencyDisplay amount={name.cBalance} />
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
