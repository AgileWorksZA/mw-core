<script lang="ts">
	import TabStrip from '$lib/components/TabStrip.svelte';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import DetailsTab from '$lib/components/items/DetailsTab.svelte';
	import BuyingTab from '$lib/components/items/BuyingTab.svelte';
	import SellingTab from '$lib/components/items/SellingTab.svelte';
	import InventoryTab from '$lib/components/items/InventoryTab.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const tabs = [
		{ id: 'details', label: 'Details' },
		{ id: 'buying', label: 'Buying' },
		{ id: 'selling', label: 'Selling' },
		{ id: 'inventory', label: 'Inventory' }
	];

	let activeTab = $state('details');

	const { header, flags, controlAccounts, buying, selling, inventory } = data.item;

	const typeLabels: Record<string, string> = {
		P: 'Product', S: 'Resource', T: 'Time', A: 'Ship Method', O: 'Other'
	};
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<div class="flex items-center gap-3">
			<a href="/items" class="text-muted-foreground hover:text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<ColourBadge colour={header.colour} />
			<div>
				<div class="flex items-center gap-2">
					<h1 class="font-headline text-xl font-bold">{header.description || header.code}</h1>
					<span class="rounded bg-surface-container-low px-2 py-0.5 text-xs font-mono text-muted-foreground">
						{header.code}
					</span>
				</div>
				<div class="mt-0.5 flex gap-1.5">
					<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
						{typeLabels[header.type] ?? header.type}
					</span>
					{#if flags.weBuy}<span class="rounded-full bg-surface-container-low px-2 py-0.5 text-xs text-muted-foreground">Buy</span>{/if}
					{#if flags.weSell}<span class="rounded-full bg-surface-container-low px-2 py-0.5 text-xs text-muted-foreground">Sell</span>{/if}
					{#if flags.weStock}<span class="rounded-full bg-surface-container-low px-2 py-0.5 text-xs text-muted-foreground">Stock</span>{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="bg-surface-container-lowest px-6">
		<TabStrip {tabs} bind:activeTab />
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if activeTab === 'details'}
			<DetailsTab {header} {flags} {controlAccounts} />
		{:else if activeTab === 'buying'}
			<BuyingTab {buying} />
		{:else if activeTab === 'selling'}
			<SellingTab {selling} lookups={data.lookups} />
		{:else if activeTab === 'inventory'}
			<InventoryTab {inventory} />
		{/if}
	</div>
</div>
