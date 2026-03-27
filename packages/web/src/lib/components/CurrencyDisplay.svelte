<script lang="ts">
	let { amount, currency = '' }: { amount: number; currency?: string } = $props();

	const formatted = $derived(
		new Intl.NumberFormat('en-NZ', {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(amount)
	);
</script>

<span class="tabular-nums" class:text-destructive={amount < 0}>
	{#if currency}{currency} {/if}{formatted}
</span>
