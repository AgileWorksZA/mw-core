<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Column {
		key: string;
		label: string;
		align?: 'left' | 'right' | 'center';
		width?: string;
		format?: (value: any, row: Record<string, any>) => string;
		class?: string | ((value: any, row: Record<string, any>) => string);
		mono?: boolean;
		sortable?: boolean;
	}

	let {
		columns,
		rows,
		onRowClick,
		rowHref,
		rowClass,
		emptyMessage = 'No records found',
		stickyHeader = true,
		sortable = false,
		cell,
		footer
	}: {
		columns: Column[];
		rows: Record<string, any>[];
		onRowClick?: (row: Record<string, any>) => void;
		rowHref?: (row: Record<string, any>) => string;
		rowClass?: (row: Record<string, any>) => string;
		emptyMessage?: string;
		stickyHeader?: boolean;
		sortable?: boolean;
		cell?: Snippet<[{ column: Column; row: Record<string, any>; value: any }]>;
		footer?: Snippet;
	} = $props();

	// ── Sorting ──
	let sortKey = $state('');
	let sortDir = $state<'asc' | 'desc'>('asc');

	function toggleSort(key: string) {
		if (sortKey === key) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDir = 'asc';
		}
	}

	const sortedRows = $derived(() => {
		if (!sortable || !sortKey) return rows;
		const dir = sortDir === 'asc' ? 1 : -1;
		return [...rows].sort((a, b) => {
			const av = a[sortKey] ?? '';
			const bv = b[sortKey] ?? '';
			if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
			return String(av).localeCompare(String(bv)) * dir;
		});
	});

	function getCellClass(col: Column, row: Record<string, any>): string {
		if (!col.class) return '';
		if (typeof col.class === 'function') return col.class(row[col.key], row);
		return col.class;
	}

	function formatValue(col: Column, row: Record<string, any>): string {
		const val = row[col.key];
		if (col.format) return col.format(val, row);
		return val ?? '';
	}

	function isColumnSortable(col: Column): boolean {
		if (!sortable) return false;
		if (col.sortable === false) return false;
		return !!col.label; // Don't sort empty-label columns (like status dots)
	}
</script>

<div class="overflow-auto rounded-xl bg-surface-container-lowest">
	<table class="w-full text-sm">
		<thead class={stickyHeader ? 'sticky top-0' : ''}>
			<tr class="bg-surface-container-low">
				{#each columns as col}
					<th
						class="px-3 py-2.5 text-left font-medium text-muted-foreground
							{isColumnSortable(col) ? 'cursor-pointer select-none hover:text-foreground transition-colors' : ''}"
						class:text-right={col.align === 'right'}
						class:text-center={col.align === 'center'}
						style={col.width ? `width: ${col.width}` : ''}
						onclick={() => isColumnSortable(col) && toggleSort(col.key)}
					>
						{col.label}
						{#if sortable && sortKey === col.key}
							<span class="ml-1 text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if sortedRows().length === 0}
				<tr>
					<td colspan={columns.length} class="px-3 py-8 text-center text-muted-foreground">
						{emptyMessage}
					</td>
				</tr>
			{:else}
				{#each sortedRows() as row}
					{@const href = rowHref?.(row)}
					{@const extraClass = rowClass?.(row) ?? ''}
					<tr
						class="transition-colors hover:bg-surface-container-low
							{href || onRowClick ? 'cursor-pointer' : ''} {extraClass}"
						onclick={() => onRowClick?.(row)}
					>
						{#each columns as col}
							{@const value = row[col.key]}
							<td
								class="px-3 py-2 {getCellClass(col, row)}"
								class:text-right={col.align === 'right'}
								class:text-center={col.align === 'center'}
								class:font-mono={col.mono}
								class:text-xs={col.mono}
							>
								{#if cell}
									{@render cell({ column: col, row, value })}
								{:else if href && col === columns[0]}
									<a href={href} class="text-primary hover:underline">{formatValue(col, row)}</a>
								{:else}
									{formatValue(col, row)}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
		{#if footer}
			<tfoot>
				{@render footer()}
			</tfoot>
		{/if}
	</table>
</div>
