<script lang="ts">
	import type { ColumnDef } from '$lib/config/entity-columns';

	let {
		allColumns,
		visibleKeys = $bindable(),
		entityKey
	}: {
		allColumns: ColumnDef[];
		visibleKeys: string[];
		entityKey: string;
	} = $props();

	let open = $state(false);

	function toggle(key: string) {
		if (visibleKeys.includes(key)) {
			if (visibleKeys.length > 1) {
				visibleKeys = visibleKeys.filter(k => k !== key);
			}
		} else {
			visibleKeys = [...visibleKeys, key];
		}
		persist();
	}

	function selectAll() {
		visibleKeys = allColumns.map(c => c.key);
		persist();
	}

	function resetDefaults() {
		visibleKeys = [...defaultKeys];
		persist();
	}

	function persist() {
		try {
			localStorage.setItem(`dlv-cols-${entityKey}`, JSON.stringify(visibleKeys));
		} catch { /* ignore */ }
	}

	// Capture initial defaults for reset
	const defaultKeys = [...visibleKeys];
</script>

<svelte:window onclick={(e) => {
	if (open && !(e.target as HTMLElement)?.closest('.column-picker')) open = false;
}} />

<div class="relative column-picker">
	<button
		class="flex items-center gap-1.5 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-container-low/80 transition-colors"
		onclick={() => (open = !open)}
		title="Show/hide columns"
	>
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 4h6m-6 4h6m-6 4h6m-6 4h6M4 4v16m16-16v16" />
		</svg>
		Columns
	</button>

	{#if open}
		<div class="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl bg-surface-container-lowest border border-border shadow-lg p-2">
			<div class="flex items-center justify-between px-2 pb-2 border-b border-border/30 mb-1">
				<span class="text-xs font-semibold text-muted-foreground uppercase">Columns</span>
				<div class="flex gap-1">
					<button class="text-xs text-primary hover:underline" onclick={selectAll}>All</button>
					<span class="text-xs text-muted-foreground">|</span>
					<button class="text-xs text-primary hover:underline" onclick={resetDefaults}>Reset</button>
				</div>
			</div>
			{#each allColumns as col}
				<label class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface-container-low cursor-pointer text-sm">
					<input
						type="checkbox"
						checked={visibleKeys.includes(col.key)}
						onchange={() => toggle(col.key)}
						class="rounded"
					/>
					{col.label}
				</label>
			{/each}
		</div>
	{/if}
</div>
