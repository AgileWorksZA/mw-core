<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedPeriod = $state(data.currentPeriod);
	let highlightedOnly = $state(false);
	let selectedCategories = $state<Set<string>>(new Set());
	let processing = $state(false);
	let scheduleReady = $state(false);

	function toggleCategory(code: string) {
		const next = new Set(selectedCategories);
		if (next.has(code)) next.delete(code);
		else next.add(code);
		selectedCategories = next;
	}

	async function runDepreciation() {
		processing = true;
		try {
			// POST /api/v1/assets/depreciation-run
			scheduleReady = true;
			showToast('Depreciation schedule calculated — review before accepting', 'info');
		} catch (err: any) {
			showError(err.message || 'Failed to calculate depreciation');
		} finally {
			processing = false;
		}
	}

	async function acceptDepreciation() {
		showToast('Depreciation journal posted — asset records updated', 'success');
		scheduleReady = false;
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Depreciation Run" subtitle="Calculate and post depreciation for the selected period" />

	<div class="flex-1 overflow-auto p-6 space-y-6">
		<div class="mx-auto max-w-2xl space-y-6">
			<!-- Period & Options -->
			<div class="rounded-xl bg-surface-container-lowest p-6 space-y-4">
				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">Period</label>
					<select bind:value={selectedPeriod} class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm">
						{#each Array.from({ length: data.periodsInYear }, (_, i) => i + 1) as period}
							<option value={period}>Period {period}{period === data.currentPeriod ? ' (current)' : ''}</option>
						{/each}
					</select>
				</div>

				<label class="flex items-center gap-2 text-sm">
					<input type="checkbox" bind:checked={highlightedOnly} class="rounded" />
					Highlighted categories only
				</label>

				{#if highlightedOnly && data.categories.length > 0}
					<div class="space-y-1">
						<span class="text-xs text-muted-foreground">Select categories:</span>
						{#each data.categories as cat}
							<label class="flex items-center gap-2 text-sm pl-2">
								<input type="checkbox" checked={selectedCategories.has(cat.code)} onchange={() => toggleCategory(cat.code)} class="rounded" />
								<span class="font-mono text-xs">{cat.code}</span> — {cat.description} ({cat.depreciationType} @ {cat.rate}%)
							</label>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Warning -->
			<div class="rounded-xl bg-destructive/5 border border-destructive/20 p-4 text-sm">
				<div class="flex items-start gap-2">
					<svg class="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
					<div>
						<strong class="text-destructive">Irreversible action.</strong> Once you accept a depreciation schedule, it cannot be undone. New assets will transition to Active status and their cost/depreciation fields will be locked.
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-3">
				{#if !scheduleReady}
					<button
						class="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
						onclick={runDepreciation}
						disabled={processing}
					>
						{processing ? 'Calculating...' : 'Calculate Depreciation'}
					</button>
				{:else}
					<button
						class="rounded-xl bg-destructive px-6 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
						onclick={acceptDepreciation}
					>
						Accept — Post Depreciation Journal
					</button>
					<button
						class="rounded-xl bg-surface-container-low px-4 py-2 text-sm hover:bg-surface-container-low/80"
						onclick={() => { scheduleReady = false; }}
					>
						Discard
					</button>
				{/if}
				<a href="/assets" class="text-sm text-muted-foreground hover:text-foreground">Cancel</a>
			</div>
		</div>
	</div>
</div>
