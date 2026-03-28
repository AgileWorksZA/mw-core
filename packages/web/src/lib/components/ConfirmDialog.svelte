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
		<div class="relative z-50 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
			<h2 class="text-lg font-semibold">{title}</h2>
			<div class="mt-2 text-sm text-muted-foreground">
				{@render children()}
			</div>
			<div class="mt-4 flex justify-end gap-2">
				<button onclick={() => { open = false; }} class="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted">{cancelLabel}</button>
				<button onclick={onConfirm} class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{confirmLabel}</button>
			</div>
		</div>
	</div>
{/if}
