<script lang="ts">
	import TabStrip from '$lib/components/TabStrip.svelte';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { asset, history, categories } = data;

	const tabs = [
		{ id: 'details', label: 'Details' },
		{ id: 'comments', label: 'Comments' },
		{ id: 'history', label: `History (${history.length})` },
	];
	let activeTab = $state('details');

	const statusColors: Record<string, string> = {
		NEW: 'bg-blue-500/10 text-blue-500',
		ACT: 'bg-positive/10 text-positive',
		NDP: 'bg-muted text-muted-foreground',
		OTH: 'bg-amber-500/10 text-amber-500',
		DSP: 'bg-destructive/10 text-destructive'
	};

	const categoryInfo = $derived(categories.find((c: any) => c.code === asset.category));
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="bg-surface-container-lowest px-6 py-4">
		<div class="flex items-center gap-3">
			<a href="/assets" class="text-muted-foreground hover:text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<ColourBadge colour={asset.colour} />
			<div>
				<div class="flex items-center gap-2">
					<h1 class="font-headline text-xl font-bold">{asset.description || asset.code}</h1>
					<span class="rounded bg-surface-container-low px-2 py-0.5 text-xs font-mono text-muted-foreground">{asset.code}</span>
					<span class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[asset.status] ?? ''}">{asset.statusLabel}</span>
				</div>
				<div class="mt-0.5 flex gap-2 text-xs text-muted-foreground">
					{#if asset.category}<span>Category: {asset.category}</span>{/if}
					{#if asset.typeLabel}<span>{asset.typeLabel} @ {asset.rate}%</span>{/if}
					{#if asset.isLocked}<span class="text-amber-500">Fields locked (depreciated)</span>{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="bg-surface-container-lowest px-6">
		<TabStrip {tabs} bind:activeTab />
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if activeTab === 'details'}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
				<!-- Cost & Value -->
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Cost & Book Value</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between"><span class="text-muted-foreground">Cost per Unit</span><span class="font-mono"><CurrencyDisplay amount={asset.costPerUnit} /></span></div>
						<div class="flex justify-between"><span class="text-muted-foreground">Quantity</span><span class="font-mono">{asset.qty}</span></div>
						<div class="flex justify-between"><span class="text-muted-foreground">Total Cost</span><span class="font-mono font-semibold"><CurrencyDisplay amount={asset.totalCost} /></span></div>
						<div class="flex justify-between"><span class="text-muted-foreground">Accum. Depreciation</span><span class="font-mono text-amber-500"><CurrencyDisplay amount={asset.accumDepreciation} /></span></div>
						<div class="flex justify-between border-t border-border/30 pt-2">
							<span class="text-muted-foreground font-medium">Book Value</span>
							<span class="font-mono font-bold text-lg" class:text-positive={asset.bookValue > 0} class:text-destructive={asset.bookValue <= 0}>
								<CurrencyDisplay amount={asset.bookValue} />
							</span>
						</div>
					</div>
				</div>

				<!-- Depreciation -->
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Depreciation</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between"><span class="text-muted-foreground">Method</span><span>{asset.typeLabel || '—'}</span></div>
						<div class="flex justify-between"><span class="text-muted-foreground">Rate</span><span class="font-mono">{asset.rate > 0 ? `${asset.rate}%` : '—'}</span></div>
						<div class="flex justify-between"><span class="text-muted-foreground">Expected Life</span><span>{asset.expectedLife > 0 ? `${asset.expectedLife} years` : '—'}</span></div>
						<div class="flex justify-between"><span class="text-muted-foreground">Residual Value</span><span class="font-mono"><CurrencyDisplay amount={asset.residualValue} /></span></div>
						{#if asset.privateUsePercent > 0}
							<div class="flex justify-between"><span class="text-muted-foreground">Private Use</span><span class="font-mono">{asset.privateUsePercent}%</span></div>
						{/if}
						<div class="flex justify-between"><span class="text-muted-foreground">Last Depreciated</span><span class="font-mono">{asset.lastDepreciated || '—'}</span></div>
					</div>
				</div>

				<!-- Identification -->
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Identification</h3>
					<div class="space-y-2 text-sm">
						{#if asset.serialNum}<div class="flex justify-between"><span class="text-muted-foreground">Serial Number</span><span class="font-mono">{asset.serialNum}</span></div>{/if}
						{#if asset.location}<div class="flex justify-between"><span class="text-muted-foreground">Location</span><span>{asset.location}</span></div>{/if}
						{#if asset.department}<div class="flex justify-between"><span class="text-muted-foreground">Department</span><span>{asset.department}</span></div>{/if}
						{#if categoryInfo}
							<div class="flex justify-between"><span class="text-muted-foreground">Category</span><span>{asset.category} — {categoryInfo.description}</span></div>
						{/if}
					</div>
				</div>

				<!-- Dates & Links -->
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dates</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between"><span class="text-muted-foreground">Acquired</span><span class="font-mono">{asset.acquiredDate || '—'}</span></div>
						{#if asset.lastDisposed}
							<div class="flex justify-between"><span class="text-muted-foreground">Disposed</span><span class="font-mono">{asset.lastDisposed}</span></div>
						{/if}
						{#if asset.linkedTransaction}
							<div class="flex justify-between">
								<span class="text-muted-foreground">Linked Invoice</span>
								<a href="/transactions/{asset.linkedTransaction}" class="text-primary hover:underline font-mono">#{asset.linkedTransaction}</a>
							</div>
						{/if}
						{#if asset.custom1}<div class="flex justify-between"><span class="text-muted-foreground">Custom 1</span><span>{asset.custom1}</span></div>{/if}
						{#if asset.custom2}<div class="flex justify-between"><span class="text-muted-foreground">Custom 2</span><span>{asset.custom2}</span></div>{/if}
						{#if asset.custom3}<div class="flex justify-between"><span class="text-muted-foreground">Custom 3</span><span>{asset.custom3}</span></div>{/if}
						{#if asset.custom4}<div class="flex justify-between"><span class="text-muted-foreground">Custom 4</span><span>{asset.custom4}</span></div>{/if}
					</div>
				</div>
			</div>

		{:else if activeTab === 'comments'}
			<div class="rounded-xl bg-surface-container-lowest p-4">
				<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Comments</h3>
				{#if asset.comments}
					<div class="text-sm whitespace-pre-line">{asset.comments}</div>
				{:else}
					<div class="text-sm text-muted-foreground italic">No comments</div>
				{/if}
			</div>

		{:else if activeTab === 'history'}
			{#if history.length > 0}
				<div class="overflow-auto rounded-xl bg-surface-container-lowest">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Action</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Transaction</th>
							</tr>
						</thead>
						<tbody>
							{#each history as entry}
								<tr class="hover:bg-surface-container-low transition-colors">
									<td class="px-3 py-2 font-mono text-xs">{entry.date}</td>
									<td class="px-3 py-2">
										<span class="rounded bg-surface-container-low px-1.5 py-0.5 text-xs font-mono">{entry.action}</span>
										<span class="ml-1 text-xs text-muted-foreground">{entry.actionLabel}</span>
									</td>
									<td class="px-3 py-2 text-right"><CurrencyDisplay amount={entry.amount} /></td>
									<td class="px-3 py-2 text-muted-foreground">{entry.description}</td>
									<td class="px-3 py-2">
										{#if entry.transactionSeqNum > 0}
											<a href="/transactions/{entry.transactionSeqNum}" class="text-primary hover:underline font-mono text-xs">#{entry.transactionSeqNum}</a>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="flex h-32 items-center justify-center text-muted-foreground">No history entries</div>
			{/if}
		{/if}
	</div>
</div>
