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
	let dragIndex = $state(-1);
	let dragOverIndex = $state(-1);

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

	// ── Drag and drop reorder (visible columns only) ──
	function handleDragStart(index: number) {
		dragIndex = index;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		dragOverIndex = index;
	}

	function handleDrop(index: number) {
		if (dragIndex < 0 || dragIndex === index) {
			dragIndex = -1;
			dragOverIndex = -1;
			return;
		}
		// Only reorder within visible keys
		const key = visibleKeys[dragIndex];
		if (!key) return;
		const newKeys = [...visibleKeys];
		newKeys.splice(dragIndex, 1);
		newKeys.splice(index, 0, key);
		visibleKeys = newKeys;
		persist();
		dragIndex = -1;
		dragOverIndex = -1;
	}

	function handleDragEnd() {
		dragIndex = -1;
		dragOverIndex = -1;
	}

	function moveUp(index: number) {
		if (index <= 0) return;
		const newKeys = [...visibleKeys];
		[newKeys[index - 1], newKeys[index]] = [newKeys[index], newKeys[index - 1]];
		visibleKeys = newKeys;
		persist();
	}

	function moveDown(index: number) {
		if (index >= visibleKeys.length - 1) return;
		const newKeys = [...visibleKeys];
		[newKeys[index], newKeys[index + 1]] = [newKeys[index + 1], newKeys[index]];
		visibleKeys = newKeys;
		persist();
	}

	const hiddenCols = $derived(allColumns.filter(c => !visibleKeys.includes(c.key)));

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
		title="Show/hide & reorder columns"
	>
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 4h6m-6 4h6m-6 4h6m-6 4h6M4 4v16m16-16v16" />
		</svg>
		Columns
	</button>

	{#if open}
		<div class="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl bg-surface-container-lowest border border-border shadow-lg p-2 max-h-80 overflow-auto">
			<div class="flex items-center justify-between px-2 pb-2 border-b border-border/30 mb-1">
				<span class="text-xs font-semibold text-muted-foreground uppercase">Columns</span>
				<div class="flex gap-1">
					<button class="text-xs text-primary hover:underline" onclick={selectAll}>All</button>
					<span class="text-xs text-muted-foreground">|</span>
					<button class="text-xs text-primary hover:underline" onclick={resetDefaults}>Reset</button>
				</div>
			</div>

			<!-- Visible columns (draggable) -->
			{#if visibleKeys.length > 0}
				<div class="text-[10px] px-2 pt-1 pb-0.5 text-muted-foreground/50 uppercase font-semibold">Visible (drag to reorder)</div>
			{/if}
			{#each visibleKeys as key, i}
				{@const col = allColumns.find(c => c.key === key)}
				{#if col}
					<div
						class="flex items-center gap-1 px-1 py-1 rounded-lg text-sm transition-colors
							{dragOverIndex === i && dragIndex !== i ? 'bg-primary/10 border-t-2 border-primary' : 'hover:bg-surface-container-low'}
							{dragIndex === i ? 'opacity-40' : ''}"
						draggable="true"
						ondragstart={() => handleDragStart(i)}
						ondragover={(e) => handleDragOver(e, i)}
						ondrop={() => handleDrop(i)}
						ondragend={handleDragEnd}
					>
						<!-- Drag handle -->
						<span class="cursor-grab text-muted-foreground/40 hover:text-muted-foreground px-0.5" title="Drag to reorder">
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
							</svg>
						</span>
						<label class="flex-1 flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={true}
								onchange={() => toggle(key)}
								class="rounded"
							/>
							{col.label}
						</label>
						<!-- Arrow buttons -->
						<button
							class="p-0.5 text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
							onclick={() => moveUp(i)}
							disabled={i === 0}
							title="Move up"
						>
							<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
							</svg>
						</button>
						<button
							class="p-0.5 text-muted-foreground/40 hover:text-foreground disabled:opacity-20"
							onclick={() => moveDown(i)}
							disabled={i === visibleKeys.length - 1}
							title="Move down"
						>
							<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
					</div>
				{/if}
			{/each}

			<!-- Hidden columns -->
			{#if hiddenCols.length > 0}
				<div class="text-[10px] px-2 pt-2 pb-0.5 text-muted-foreground/50 uppercase font-semibold border-t border-border/20 mt-1">Hidden</div>
				{#each hiddenCols as col}
					<label class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface-container-low cursor-pointer text-sm text-muted-foreground">
						<input
							type="checkbox"
							checked={false}
							onchange={() => toggle(col.key)}
							class="rounded"
						/>
						{col.label}
					</label>
				{/each}
			{/if}
		</div>
	{/if}
</div>
