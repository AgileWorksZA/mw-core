<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<div class="flex items-center justify-between">
			<h1 class="text-xl font-bold font-headline">Calendar</h1>
			<div class="flex items-center gap-4">
				<a href="/dashboard/calendar{data.prevLink}" class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm hover:bg-surface-container-low/80">&larr;</a>
				<span class="text-lg font-semibold">{data.monthName} {data.year}</span>
				<a href="/dashboard/calendar{data.nextLink}" class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm hover:bg-surface-container-low/80">&rarr;</a>
			</div>
		</div>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<div class="rounded-xl bg-surface-container-lowest overflow-hidden">
			<!-- Weekday headers -->
			<div class="grid grid-cols-7 bg-surface-container-low">
				{#each data.weekdays as wd}
					<div class="px-2 py-2 text-center text-xs font-semibold text-muted-foreground">{wd}</div>
				{/each}
			</div>
			<!-- Calendar grid -->
			<div class="grid grid-cols-7">
				{#each data.cells as cell, i}
					<div
						class="px-2 py-2 min-h-[80px]
							{cell.inMonth ? '' : 'bg-surface-container-low/20'}
							{cell.isToday ? 'ring-2 ring-inset ring-primary' : ''}"
					>
						<div class="text-sm {cell.inMonth ? 'font-medium' : 'text-muted-foreground/40'}">
							{cell.day}
						</div>
						{#if cell.count > 0}
							<div class="mt-1">
								<span class="inline-block rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
									{cell.count} tx
								</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
