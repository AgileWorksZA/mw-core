<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		children
	}: {
		title: string;
		subtitle?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="bg-surface-container-lowest px-6 py-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-xl font-bold font-headline">{title}</h1>
			{#if subtitle}
				<p class="text-sm text-muted-foreground">{subtitle}</p>
			{/if}
		</div>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
