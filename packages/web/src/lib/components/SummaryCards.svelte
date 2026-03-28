<script lang="ts">
	import CurrencyDisplay from './CurrencyDisplay.svelte';

	interface Card {
		label: string;
		value: number | string;
		isCurrency?: boolean;
		color?: 'default' | 'green' | 'red' | 'amber';
	}

	let { cards }: { cards: Card[] } = $props();

	function colorClass(color?: string): string {
		if (color === 'green') return 'text-positive';
		if (color === 'red') return 'text-destructive';
		if (color === 'amber') return 'text-amber-500';
		return '';
	}
</script>

<div class="mb-6 grid gap-4" style="grid-template-columns: repeat({cards.length}, minmax(0, 1fr))">
	{#each cards as card}
		<div class="rounded-xl bg-surface-container-lowest p-5 text-center">
			<div class="text-xs font-medium text-muted-foreground uppercase">{card.label}</div>
			<div class="mt-1 text-xl font-bold font-headline tabular-nums {colorClass(card.color)}">
				{#if card.isCurrency}
					<CurrencyDisplay amount={typeof card.value === 'number' ? card.value : 0} />
				{:else}
					{card.value}
				{/if}
			</div>
		</div>
	{/each}
</div>
