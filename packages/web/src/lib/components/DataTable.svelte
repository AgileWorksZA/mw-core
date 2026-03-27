<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Column {
		key: string;
		label: string;
		align?: 'left' | 'right' | 'center';
		width?: string;
	}

	let {
		columns,
		rows,
		onRowClick,
		rowHref,
		emptyMessage = 'No records found'
	}: {
		columns: Column[];
		rows: Record<string, any>[];
		onRowClick?: (row: Record<string, any>) => void;
		rowHref?: (row: Record<string, any>) => string;
		emptyMessage?: string;
	} = $props();
</script>

<div class="overflow-auto rounded-md border border-border">
	<table class="w-full text-sm">
		<thead>
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
					<tr
						class="border-b border-border transition-colors last:border-0 hover:bg-muted/50
							{href || onRowClick ? 'cursor-pointer' : ''}"
						onclick={() => onRowClick?.(row)}
					>
						{#each columns as col}
							<td
								class="px-3 py-2"
								class:text-right={col.align === 'right'}
								class:text-center={col.align === 'center'}
							>
								{#if href && col === columns[0]}
									<a href={href} class="text-primary hover:underline">{row[col.key] ?? ''}</a>
								{:else}
									{row[col.key] ?? ''}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
