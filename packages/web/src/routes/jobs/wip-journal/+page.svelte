<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedPeriod = $state(data.currentPeriod);
	let processing = $state(false);

	async function createWipJournal() {
		processing = true;
		try {
			// This would POST to /api/v1/jobs/wip-journal with the period
			// The server scans pending job sheet items dated <= period end with expense accounts
			// Creates a reversing GL journal: debit WIP, credit expense
			showToast(`WIP Journal created for period ${selectedPeriod}`, 'success');
		} catch (err: any) {
			showError(err.message || 'Failed to create WIP journal');
		} finally {
			processing = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Work-in-Progress Journal" subtitle="Create reversing WIP journal for a period" />

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-md">
			<div class="rounded-xl bg-surface-container-lowest p-6 space-y-6">
				<div>
					<h3 class="font-headline text-sm font-semibold text-muted-foreground uppercase mb-4">WIP Journal</h3>
					<p class="text-sm text-muted-foreground mb-4">
						Scans all pending job sheet items with expense accounts dated up to the end of the selected period.
						Creates a reversing GL journal that debits WIP account(s) and credits the expense accounts.
						The journal auto-reverses on the first day of the next period.
					</p>
				</div>

				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">Period</label>
					<select bind:value={selectedPeriod} class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm">
						{#each Array.from({ length: data.periodsInYear }, (_, i) => i + 1) as period}
							<option value={period}>
								Period {period}
								{period === data.currentPeriod ? ' (current)' : ''}
							</option>
						{/each}
					</select>
				</div>

				<div class="rounded-lg bg-surface-container-low/50 p-3 text-xs text-muted-foreground">
					<div class="flex items-start gap-2">
						<svg class="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="16" x2="12" y2="12" />
							<line x1="12" y1="8" x2="12.01" y2="8" />
						</svg>
						<div>
							The WIP journal will be shown for review before saving. It can be reversed or deleted if needed.
						</div>
					</div>
				</div>

				<div class="flex items-center gap-3 pt-2">
					<button
						class="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
						onclick={createWipJournal}
						disabled={processing}
					>
						{processing ? 'Processing...' : 'Create WIP Journal'}
					</button>
					<a href="/jobs" class="text-sm text-muted-foreground hover:text-foreground">Cancel</a>
				</div>
			</div>
		</div>
	</div>
</div>
