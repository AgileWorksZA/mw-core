<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		onConfirm,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		children
	}: {
		open: boolean;
		title: string;
		onConfirm: () => void;
		confirmLabel?: string;
		cancelLabel?: string;
		children: Snippet;
	} = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="fixed inset-0 bg-black/50" onclick={() => { open = false; }}></div>
		<div class="relative z-50 w-full max-w-md rounded-xl bg-surface-container-lowest p-6 shadow-md">
			<h2 class="text-lg font-semibold font-headline">{title}</h2>
			<div class="mt-2 text-sm text-muted-foreground">
				{@render children()}
			</div>
			<div class="mt-4 flex justify-end gap-2">
				<button onclick={() => { open = false; }} class="bg-surface-container-low rounded-xl px-4 py-2 text-sm hover:bg-surface">{cancelLabel}</button>
				<button onclick={onConfirm} class="bg-primary rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{confirmLabel}</button>
			</div>
		</div>
	</div>
{/if}
