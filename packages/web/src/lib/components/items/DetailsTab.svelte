<script lang="ts">
	import type { ItemScreenData } from '$lib/api/types';

	let {
		header,
		flags,
		controlAccounts
	}: {
		header: ItemScreenData['item']['header'];
		flags: ItemScreenData['item']['flags'];
		controlAccounts: ItemScreenData['item']['controlAccounts'];
	} = $props();
</script>

<div class="grid grid-cols-2 gap-6">
	<!-- Flags -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Flags</h3>
		<div class="space-y-2 text-sm">
			<div class="flex items-center gap-2">
				<span class="inline-block h-2 w-2 rounded-full {flags.weBuy ? 'bg-positive' : 'bg-muted'}"></span>
				<span class:text-muted-foreground={!flags.weBuy}>We Buy This</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-2 w-2 rounded-full {flags.weSell ? 'bg-positive' : 'bg-muted'}"></span>
				<span class:text-muted-foreground={!flags.weSell}>We Sell It</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-2 w-2 rounded-full {flags.weCount ? 'bg-positive' : 'bg-muted'}"></span>
				<span class:text-muted-foreground={!flags.weCount}>We Count It</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-2 w-2 rounded-full {flags.weStock ? 'bg-positive' : 'bg-muted'}"></span>
				<span class:text-muted-foreground={!flags.weStock}>We Stock It</span>
			</div>
		</div>
	</div>

	<!-- Control Accounts -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Control Accounts</h3>
		<div class="space-y-2 text-sm">
			<div class="flex gap-2">
				<span class="w-20 shrink-0 text-muted-foreground">Sales</span>
				<span class="font-mono">{controlAccounts.salesAcct}</span>
				{#if controlAccounts.salesAcctDesc}
					<span class="text-muted-foreground">{controlAccounts.salesAcctDesc}</span>
				{/if}
			</div>
			<div class="flex gap-2">
				<span class="w-20 shrink-0 text-muted-foreground">COGS</span>
				<span class="font-mono">{controlAccounts.cogsAcct}</span>
				{#if controlAccounts.cogsAcctDesc}
					<span class="text-muted-foreground">{controlAccounts.cogsAcctDesc}</span>
				{/if}
			</div>
			<div class="flex gap-2">
				<span class="w-20 shrink-0 text-muted-foreground">Stock</span>
				<span class="font-mono">{controlAccounts.stockAcct}</span>
				{#if controlAccounts.stockAcctDesc}
					<span class="text-muted-foreground">{controlAccounts.stockAcctDesc}</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Categories -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
		<div class="space-y-2 text-sm">
			{#if header.category1}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Material</span><span>{header.category1}</span></div>{/if}
			{#if header.category2}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Size</span><span>{header.category2}</span></div>{/if}
			{#if header.category3}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Style</span><span>{header.category3}</span></div>{/if}
			{#if header.category4}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Category 4</span><span>{header.category4}</span></div>{/if}
			{#if !header.category1 && !header.category2 && !header.category3 && !header.category4}
				<p class="text-muted-foreground italic">No categories set</p>
			{/if}
		</div>
	</div>

	<!-- Other -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Other</h3>
		<div class="space-y-2 text-sm">
			{#if header.barcode}
				<div class="flex gap-2"><span class="w-16 text-muted-foreground">Barcode</span><span class="font-mono">{header.barcode}</span></div>
			{/if}
			{#if header.comment}
				<div><span class="text-muted-foreground">Comment</span><p class="mt-1 whitespace-pre-wrap">{header.comment}</p></div>
			{/if}
			{#if !header.barcode && !header.comment}
				<p class="text-muted-foreground italic">No additional details</p>
			{/if}
		</div>
	</div>
</div>
