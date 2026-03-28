<script lang="ts">
	import TabStrip from '$lib/components/TabStrip.svelte';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import LinesTab from '$lib/components/transactions/LinesTab.svelte';
	import DetailsTab from '$lib/components/transactions/DetailsTab.svelte';
	import HistoryTab from '$lib/components/transactions/HistoryTab.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const tabs = [
		{ id: 'lines', label: 'Lines' },
		{ id: 'details', label: 'Details' },
		{ id: 'history', label: 'History' }
	];

	let activeTab = $state('lines');

	const { header, name, lineItems, totals } = data.transaction;
</script>

<div class="flex h-full flex-col">
	<!-- Header bar -->
	<div class="bg-surface-container-lowest px-6 py-4">
		<div class="flex items-center gap-3">
			<a href="/transactions" class="text-muted-foreground hover:text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<ColourBadge colour={header.colour} />
			<div class="flex-1">
				<div class="flex items-center gap-2">
					<span class="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
						{header.type}
					</span>
					<h1 class="font-headline text-xl font-bold">{header.typeLabel}</h1>
					<span class="rounded bg-surface-container-low px-2 py-0.5 text-xs font-mono text-muted-foreground">
						{header.ourRef}
					</span>
					{#if header.status === 'P'}
						<span class="rounded-full bg-positive/10 px-2 py-0.5 text-xs font-medium text-positive">
							Posted
						</span>
					{:else}
						<span class="rounded-full bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
							Unposted
						</span>
					{/if}
					{#if header.hold}
						<span class="rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">HOLD</span>
					{/if}
				</div>
				<div class="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
					{#if name.code}
						<a href="/names/{name.code}" class="text-primary hover:underline">
							{name.name || name.code}
						</a>
					{/if}
					<span>{header.date}</span>
					{#if header.dueDate}
						<span>Due: {header.dueDate}</span>
					{/if}
					<span>Period: {header.period}</span>
				</div>
			</div>
			<!-- Gross amount -->
			<div class="text-right">
				<div class="text-2xl font-bold tabular-nums">
					{new Intl.NumberFormat('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totals.gross)}
				</div>
				{#if totals.outstanding > 0.01}
					<div class="text-sm text-destructive">
						Outstanding: {new Intl.NumberFormat('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totals.outstanding)}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="bg-surface-container-lowest px-6">
		<TabStrip {tabs} bind:activeTab />
	</div>

	<!-- Tab content -->
	<div class="flex-1 overflow-auto p-6">
		{#if activeTab === 'lines'}
			<LinesTab {lineItems} {totals} lookups={data.lookups} />
		{:else if activeTab === 'details'}
			<DetailsTab {header} />
		{:else if activeTab === 'history'}
			<HistoryTab {header} />
		{/if}
	</div>
</div>
