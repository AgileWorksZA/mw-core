<script lang="ts">
	import CurrencyDisplay from './CurrencyDisplay.svelte';

	interface AgingBucket {
		label: string;
		value: number;
		color: string;
	}

	let { buckets }: { buckets: AgingBucket[] } = $props();

	const total = $derived(buckets.reduce((s, b) => s + Math.abs(b.value), 0));
</script>

{#if total > 0}
	<div class="mb-6">
		<h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">Aging</h3>
		<div class="flex h-8 overflow-hidden rounded-xl">
			{#each buckets as bucket}
				{@const pct = (Math.abs(bucket.value) / total) * 100}
				{#if pct > 0}
					<div class="{bucket.color}" style="width: {pct}%"></div>
				{/if}
			{/each}
		</div>
		<div class="mt-2 grid gap-2 text-xs" style="grid-template-columns: repeat({buckets.length}, minmax(0, 1fr))">
			{#each buckets as bucket}
				<div class="flex items-center gap-1">
					<span class="h-2 w-2 rounded {bucket.color}"></span>
					<span class="text-muted-foreground">{bucket.label}</span>
					<span class="ml-auto font-medium tabular-nums"><CurrencyDisplay amount={bucket.value} /></span>
				</div>
			{/each}
		</div>
	</div>
{/if}
