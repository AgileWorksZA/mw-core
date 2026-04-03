<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import type { EntityConfig, ColumnDef } from '$lib/config/entity-columns';
	import { showToast } from '$lib/stores/toast';
	import DataTable from './DataTable.svelte';
	import ColumnPicker from './ColumnPicker.svelte';
	import AdvancedFind from './AdvancedFind.svelte';

	let {
		config,
		rows,
		title,
		subtitle = '',
		filters,
		currentFilter = 'all',
		filterGroups,
		onFilterChange,
		/** Base path for URL-based advanced find (e.g. '/customers') */
		basePath,
		/** Current server-side find expression (from URL) */
		activeFind = '',
		cell,
		headerActions,
		/** Snippet rendered above the table (e.g. SummaryCards) */
		aboveTable,
		/** Snippet for DataTable tfoot */
		footer,
	}: {
		config: EntityConfig;
		rows: Record<string, any>[];
		title?: string;
		subtitle?: string;
		filters?: Array<{ key: string; label: string }>;
		currentFilter?: string;
		/** Multiple filter groups (e.g. Type + Status for transactions) */
		filterGroups?: Array<{ label: string; active?: string; filters: Array<{ key: string; label: string }> }>;
		onFilterChange?: (filterKey: string) => void;
		basePath?: string;
		activeFind?: string;
		cell?: Snippet<[{ column: ColumnDef; row: Record<string, any>; value: any }]>;
		headerActions?: Snippet;
		aboveTable?: Snippet;
		footer?: Snippet;
	} = $props();

	// ── Column visibility (persisted per entity) ──
	let visibleKeys = $state<string[]>(loadColumns());

	function loadColumns(): string[] {
		try {
			const stored = localStorage.getItem(`dlv-cols-${config.table}`);
			if (stored) return JSON.parse(stored);
		} catch { /* ignore */ }
		return [...config.defaultVisible];
	}

	// Column order follows visibleKeys order (supports drag reordering)
	const activeColumns = $derived(
		visibleKeys
			.map(key => config.columns.find(c => c.key === key))
			.filter(Boolean) as typeof config.columns
	);

	// ── Search ──
	let search = $state('');
	let advancedFilter = $state(activeFind);
	let showAdvancedFind = $state(false);

	const filteredRows = $derived(() => {
		let result = rows;
		// Client-side text search
		if (search) {
			const q = search.toLowerCase();
			result = result.filter(row =>
				config.searchFields.some(field => {
					const val = row[field];
					return val != null && String(val).toLowerCase().includes(q);
				})
			);
		}
		// Advanced find (client-side field matching)
		if (advancedFilter) {
			// Advanced filter is a display string; actual filtering done server-side via URL
			// For client-side, we do basic field matching from the criteria
		}
		return result;
	});

	// ── Export CSV ──
	function exportCsv() {
		const data = filteredRows();
		if (data.length === 0) {
			showToast('No data to export', 'info');
			return;
		}
		const headers = activeColumns.map(c => c.label);
		const csvRows = [headers.join(',')];
		for (const row of data) {
			const vals = activeColumns.map(c => {
				const v = row[c.key] ?? '';
				const s = String(v).replace(/"/g, '""');
				return `"${s}"`;
			});
			csvRows.push(vals.join(','));
		}
		const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${config.table}-export.csv`;
		a.click();
		URL.revokeObjectURL(url);
		showToast(`Exported ${data.length} rows`, 'success');
	}

	// ── Row navigation ──
	function rowHref(row: Record<string, any>): string {
		if (!config.detailHref || !config.codeField) return '';
		return config.detailHref.replace('{code}', encodeURIComponent(row[config.codeField] ?? ''))
			.replace('{id}', encodeURIComponent(row.id ?? row.sequenceNumber ?? ''));
	}

	// ── Keyboard shortcuts ──
	function handleKeydown(e: KeyboardEvent) {
		// Cmd/Ctrl+F → focus search
		if (e.key === 'f' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
			e.preventDefault();
			const input = document.querySelector<HTMLInputElement>('.dlv-search-input');
			input?.focus();
		}
		// Cmd/Ctrl+Shift+F → advanced find
		if (e.key === 'f' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
			e.preventDefault();
			showAdvancedFind = true;
		}
		// Cmd/Ctrl+E → export
		if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			exportCsv();
		}
		// Escape → clear search
		if (e.key === 'Escape' && search) {
			search = '';
		}
	}

	function handleAdvancedApply(filter: string) {
		advancedFilter = filter;
		// Navigate with find= URL param for server-side filtering
		if (basePath) {
			const url = new URL(window.location.href);
			if (filter) {
				url.searchParams.set('find', filter);
			} else {
				url.searchParams.delete('find');
			}
			goto(url.pathname + url.search, { invalidateAll: true });
		}
	}

	const displayTitle = $derived(title ?? config.label);
	const displaySubtitle = $derived(subtitle || `${filteredRows().length} records`);
	const hasFilters = $derived(!!(filters?.length || filterGroups?.length));
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex h-full">
	<!-- ── Filter sidebar ── -->
	{#if hasFilters}
		<div class="w-48 shrink-0 bg-surface-container-low p-3 overflow-auto">
			{#if filterGroups}
				{#each filterGroups as group}
					<h3 class="font-headline mb-2 mt-3 first:mt-0 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						{group.label}
					</h3>
					{#each group.filters as filter}
						<button
							class="mb-0.5 w-full rounded-xl px-2 py-1.5 text-left text-sm transition-colors
								{(group.active ?? currentFilter) === filter.key
									? 'bg-primary text-primary-foreground font-medium'
									: 'text-foreground hover:bg-surface-container-low'}"
							onclick={() => onFilterChange?.(filter.key)}
						>
							{filter.label}
						</button>
					{/each}
				{/each}
			{:else if filters}
				<h3 class="font-headline mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filter</h3>
				{#each filters as filter}
					<button
						class="mb-0.5 w-full rounded-xl px-2 py-1.5 text-left text-sm transition-colors
							{currentFilter === filter.key
								? 'bg-primary text-primary-foreground font-medium'
								: 'text-foreground hover:bg-surface-container-low'}"
						onclick={() => onFilterChange?.(filter.key)}
					>
						{filter.label}
					</button>
				{/each}
			{/if}
		</div>
	{/if}

	<!-- ── Main content ── -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Header bar -->
		<div class="flex items-center justify-between px-4 py-3 gap-3">
			<div class="shrink-0">
				<h2 class="font-headline text-lg font-semibold">{displayTitle}</h2>
				<p class="text-sm text-muted-foreground">{displaySubtitle}</p>
			</div>

			<div class="flex items-center gap-2 flex-wrap justify-end">
				{#if headerActions}
					{@render headerActions()}
				{/if}

				<!-- Search input -->
				<div class="relative">
					<svg class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input
						type="search"
						placeholder="Search... (⌘F)"
						bind:value={search}
						class="dlv-search-input w-52 rounded-xl bg-surface-container-low pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>

				<!-- Advanced Find -->
				<button
					class="flex items-center gap-1.5 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-container-low/80 transition-colors"
					onclick={() => (showAdvancedFind = true)}
					title="Advanced Find (⌘⇧F)"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
					</svg>
					Find
				</button>

				<!-- Column Picker -->
				<ColumnPicker
					allColumns={config.columns}
					bind:visibleKeys
					entityKey={config.table}
				/>

				<!-- Export -->
				<button
					class="flex items-center gap-1.5 rounded-xl bg-surface-container-low px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-container-low/80 transition-colors"
					onclick={exportCsv}
					title="Export CSV (⌘E)"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Export
				</button>
			</div>
		</div>

		<!-- Active filter indicator -->
		{#if advancedFilter}
			<div class="px-4 pb-2">
				<div class="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-xs text-primary">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
					</svg>
					Advanced filter active
					<button class="hover:text-destructive" onclick={() => { advancedFilter = ''; }}>
						<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
		{/if}

		<!-- Above table (e.g. summary cards) -->
		{#if aboveTable}
			<div class="px-4">
				{@render aboveTable()}
			</div>
		{/if}

		<!-- Table -->
		<div class="flex-1 overflow-auto px-4 pb-4">
			<DataTable
				columns={activeColumns}
				rows={filteredRows()}
				rowHref={config.detailHref ? rowHref : undefined}
				emptyMessage="No {config.label.toLowerCase()} found"
				sortable={true}
				{cell}
				{footer}
			/>
		</div>
	</div>
</div>

<!-- Advanced Find Modal -->
<AdvancedFind
	columns={config.columns}
	bind:open={showAdvancedFind}
	onApply={handleAdvancedApply}
/>
