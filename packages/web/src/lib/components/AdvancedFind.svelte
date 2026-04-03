<script lang="ts">
	import type { ColumnDef } from '$lib/config/entity-columns';

	let {
		columns,
		open = $bindable(false),
		onApply
	}: {
		columns: ColumnDef[];
		open: boolean;
		onApply: (filter: string) => void;
	} = $props();

	interface Criterion {
		field: string;
		operator: string;
		value: string;
	}

	const operators = [
		{ key: 'contains', label: 'contains', expr: (f: string, v: string) => `${f} like "%${v}%"` },
		{ key: 'equals', label: 'equals', expr: (f: string, v: string) => `${f}="${v}"` },
		{ key: 'starts', label: 'starts with', expr: (f: string, v: string) => `left(${f},${v.length})="${v}"` },
		{ key: 'gt', label: '>', expr: (f: string, v: string) => `${f}>"${v}"` },
		{ key: 'lt', label: '<', expr: (f: string, v: string) => `${f}<"${v}"` },
		{ key: 'gte', label: '>=', expr: (f: string, v: string) => `${f}>="${v}"` },
		{ key: 'lte', label: '<=', expr: (f: string, v: string) => `${f}<="${v}"` },
		{ key: 'ne', label: '!=', expr: (f: string, v: string) => `${f}<>"${v}"` },
		{ key: 'empty', label: 'is empty', expr: (f: string) => `${f}=""` },
		{ key: 'notempty', label: 'is not empty', expr: (f: string) => `${f}<>""` },
	];

	let criteria = $state<Criterion[]>([
		{ field: columns[0]?.key ?? '', operator: 'contains', value: '' }
	]);

	let combineMode = $state<'AND' | 'OR'>('AND');

	function addCriterion() {
		criteria = [...criteria, { field: columns[0]?.key ?? '', operator: 'contains', value: '' }];
	}

	function removeCriterion(index: number) {
		if (criteria.length > 1) {
			criteria = criteria.filter((_, i) => i !== index);
		}
	}

	function apply() {
		const parts: string[] = [];
		for (const c of criteria) {
			if (!c.field) continue;
			const op = operators.find(o => o.key === c.operator);
			if (!op) continue;
			if (['empty', 'notempty'].includes(c.operator)) {
				parts.push(op.expr(c.field, ''));
			} else if (c.value.trim()) {
				parts.push(op.expr(c.field, c.value.trim()));
			}
		}
		if (parts.length > 0) {
			onApply(parts.join(` ${combineMode} `));
		}
		open = false;
	}

	function clear() {
		criteria = [{ field: columns[0]?.key ?? '', operator: 'contains', value: '' }];
		onApply('');
		open = false;
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-40 bg-black/50" onclick={() => (open = false)}></div>

	<!-- Modal -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div class="w-full max-w-lg rounded-xl bg-surface-container-lowest shadow-xl" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between px-5 py-4 border-b border-border/30">
				<h2 class="font-headline text-lg font-semibold">Advanced Find</h2>
				<button class="text-muted-foreground hover:text-foreground" onclick={() => (open = false)}>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="p-5 space-y-3">
				<!-- Combine mode -->
				<div class="flex items-center gap-2 text-sm">
					<span class="text-muted-foreground">Match</span>
					<select
						bind:value={combineMode}
						class="rounded-lg bg-surface-container-low px-2 py-1 text-sm"
					>
						<option value="AND">all criteria</option>
						<option value="OR">any criterion</option>
					</select>
				</div>

				<!-- Criteria rows -->
				{#each criteria as criterion, i}
					<div class="flex items-center gap-2">
						<select
							bind:value={criterion.field}
							class="flex-1 rounded-lg bg-surface-container-low px-2 py-1.5 text-sm"
						>
							{#each columns as col}
								<option value={col.key}>{col.label}</option>
							{/each}
						</select>

						<select
							bind:value={criterion.operator}
							class="w-32 rounded-lg bg-surface-container-low px-2 py-1.5 text-sm"
						>
							{#each operators as op}
								<option value={op.key}>{op.label}</option>
							{/each}
						</select>

						{#if !['empty', 'notempty'].includes(criterion.operator)}
							<input
								type="text"
								bind:value={criterion.value}
								placeholder="Value..."
								class="flex-1 rounded-lg bg-surface-container-low px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							/>
						{:else}
							<div class="flex-1"></div>
						{/if}

						<button
							class="rounded-lg p-1 text-muted-foreground hover:text-destructive hover:bg-surface-container-low"
							onclick={() => removeCriterion(i)}
							disabled={criteria.length <= 1}
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{/each}

				<button
					class="text-sm text-primary hover:underline"
					onclick={addCriterion}
				>
					+ Add criterion
				</button>
			</div>

			<div class="flex items-center justify-between px-5 py-4 border-t border-border/30">
				<button
					class="text-sm text-muted-foreground hover:text-foreground"
					onclick={clear}
				>
					Clear filter
				</button>
				<div class="flex gap-2">
					<button
						class="rounded-xl bg-surface-container-low px-4 py-2 text-sm hover:bg-surface-container-low/80"
						onclick={() => (open = false)}
					>
						Cancel
					</button>
					<button
						class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						onclick={apply}
					>
						Find
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
