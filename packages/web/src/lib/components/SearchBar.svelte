<script lang="ts">
	import { goto } from '$app/navigation';

	let query = $state('');
	let isOpen = $state(false);

	function search() {
		if (query.trim()) {
			goto(`/search?q=${encodeURIComponent(query.trim())}`, { invalidateAll: true });
			isOpen = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			isOpen = true;
		}
		if (e.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Trigger button -->
<button
	onclick={() => isOpen = true}
	class="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface"
>
	<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
	<span>Search...</span>
	<kbd class="ml-2 bg-surface-container-low rounded px-1.5 py-0.5 text-[10px] font-mono">&#8984;K</kbd>
</button>

<!-- Search modal -->
{#if isOpen}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-50 bg-black/50" onclick={() => isOpen = false}></div>

	<!-- Dialog -->
	<div class="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 bg-surface-container-lowest rounded-xl shadow-md">
		<form onsubmit={(e) => { e.preventDefault(); search(); }} class="flex items-center gap-2 p-3">
			<svg class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
			<input
				type="text"
				bind:value={query}
				placeholder="Search names, accounts, items, transactions..."
				class="flex-1 bg-transparent text-sm focus:outline-none"
				autofocus
			/>
			<button type="submit" class="rounded-xl bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Go</button>
		</form>
		<div class="px-3 py-2 text-xs text-muted-foreground">
			Press Enter to search, Esc to close
		</div>
	</div>
{/if}
