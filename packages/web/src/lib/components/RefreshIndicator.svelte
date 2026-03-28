<script lang="ts">
	let {
		enabled,
		refreshing,
		onToggle,
		onRefresh
	}: {
		enabled: boolean;
		refreshing: boolean;
		onToggle: () => void;
		onRefresh: () => void;
	} = $props();
</script>

<div class="flex items-center gap-2 text-xs text-muted-foreground">
	<button
		onclick={onRefresh}
		disabled={refreshing}
		class="rounded-xl p-1 hover:bg-surface-container-low transition-colors disabled:opacity-50"
		title="Refresh now"
		aria-label="Refresh now"
	>
		<svg class="h-4 w-4 {refreshing ? 'animate-spin' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
		</svg>
	</button>
	<button
		onclick={onToggle}
		class="rounded-xl px-1.5 py-0.5 transition-colors {enabled ? 'bg-positive/10 text-positive' : 'bg-surface-container-low text-muted-foreground'}"
		title="{enabled ? 'Auto-refresh ON (30s)' : 'Auto-refresh OFF'}"
	>
		{enabled ? 'Live' : 'Paused'}
	</button>
</div>
