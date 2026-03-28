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
	}

	let {
		columns,
		rows,
		onRowClick,
		rowHref,
		rowClass,
		emptyMessage = 'No records found',
		stickyHeader = true,
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
		cell?: Snippet<[{ column: Column; row: Record<string, any>; value: any }]>;
		footer?: Snippet;
	} = $props();

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
</script>

<div class="overflow-auto rounded-md border border-border">
	<table class="w-full text-sm">
		<thead class={stickyHeader ? 'sticky top-0' : ''}>
			<tr class="border-b border-border bg-muted/50">
				{#each columns as col}
					<th
						class="px-3 py-2.5 text-left font-medium text-muted-foreground"
						class:text-right={col.align === 'right'}
						class:text-center={col.align === 'center'}
						style={col.width ? `width: ${col.width}` : ''}
					>
						{col.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if rows.length === 0}
				<tr>
					<td colspan={columns.length} class="px-3 py-8 text-center text-muted-foreground">
						{emptyMessage}
					</td>
				</tr>
			{:else}
				{#each rows as row}
					{@const href = rowHref?.(row)}
					{@const extraClass = rowClass?.(row) ?? ''}
					<tr
						class="border-b border-border transition-colors last:border-0 hover:bg-muted/50
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
