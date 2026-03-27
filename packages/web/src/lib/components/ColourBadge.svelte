<script lang="ts">
	/** MoneyWorks colour index 0-7 */
	let { colour }: { colour: number } = $props();

	const colourClasses: Record<number, string> = {
		0: 'bg-mw-0',
		1: 'bg-mw-1',
		2: 'bg-mw-2',
		3: 'bg-mw-3',
		4: 'bg-mw-4',
		5: 'bg-mw-5',
		6: 'bg-mw-6',
		7: 'bg-mw-7'
	};
</script>

{#if colour > 0}
	<span class="inline-block h-2.5 w-2.5 rounded-full {colourClasses[colour] ?? ''}"></span>
{/if}
