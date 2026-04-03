<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let timesheetBy = $state<'job' | 'resource' | 'date' | 'costcentre'>('job');
	let forValue = $state('');

	interface TimesheetLine {
		resource: string;
		qty: number;
		description: string;
	}

	let lines = $state<TimesheetLine[]>([
		{ resource: '', qty: 0, description: '' }
	]);

	function addLine() {
		lines = [...lines, { resource: '', qty: 0, description: '' }];
	}

	function removeLine(index: number) {
		if (lines.length > 1) {
			lines = lines.filter((_, i) => i !== index);
		}
	}

	function getResourceInfo(code: string) {
		return data.resources.find((r: any) => r.code === code);
	}

	const validLines = $derived(lines.filter(l => l.resource && l.qty > 0));

	async function saveAsActuals() {
		if (validLines.length === 0) {
			showError('No valid entries to save');
			return;
		}
		showToast(`Saved ${validLines.length} timesheet entries as actuals`, 'success');
	}

	async function saveAsBudgets() {
		if (validLines.length === 0) {
			showError('No valid entries to save');
			return;
		}
		showToast(`Saved ${validLines.length} timesheet entries as budgets`, 'success');
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Job Timesheet" subtitle="Batch time entry against jobs" />

	<div class="flex-1 overflow-auto p-6 space-y-6">
		<!-- Controls -->
		<div class="flex items-end gap-4">
			<div>
				<label class="text-xs font-medium text-muted-foreground uppercase">Timesheet by</label>
				<select bind:value={timesheetBy} class="mt-1 block rounded-xl bg-surface-container-low px-3 py-2 text-sm">
					<option value="job">Job</option>
					<option value="resource">Resource</option>
					<option value="date">Date</option>
					<option value="costcentre">Cost Centre</option>
				</select>
			</div>
			<div class="flex-1">
				<label class="text-xs font-medium text-muted-foreground uppercase">
					{timesheetBy === 'job' ? 'Job Code' : timesheetBy === 'resource' ? 'Resource Code' : timesheetBy === 'date' ? 'Date' : 'Cost Centre'}
				</label>
				{#if timesheetBy === 'job'}
					<select bind:value={forValue} class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm">
						<option value="">Select job...</option>
						{#each data.jobs as job}
							<option value={job.code}>{job.code} — {job.name}</option>
						{/each}
					</select>
				{:else if timesheetBy === 'resource'}
					<select bind:value={forValue} class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm">
						<option value="">Select resource...</option>
						{#each data.resources as r}
							<option value={r.code}>{r.code} — {r.description}</option>
						{/each}
					</select>
				{:else}
					<input type="text" bind:value={forValue} placeholder="Enter value..." class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
				{/if}
			</div>
		</div>

		<!-- Entry grid -->
		<div class="overflow-auto rounded-xl bg-surface-container-lowest">
			<table class="w-full text-sm">
				<thead>
					<tr class="bg-surface-container-low">
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">
							{timesheetBy === 'resource' ? 'Job' : 'Resource'}
						</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Qty</th>
						<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Rate</th>
						<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Amount</th>
						<th class="w-10"></th>
					</tr>
				</thead>
				<tbody>
					{#each lines as line, i}
						{@const info = getResourceInfo(line.resource)}
						<tr>
							<td class="px-3 py-2">
								{#if timesheetBy === 'resource'}
									<select bind:value={line.resource} class="w-full rounded-lg bg-surface-container-low px-2 py-1.5 text-sm">
										<option value="">Select job...</option>
										{#each data.jobs as job}
											<option value={job.code}>{job.code}</option>
										{/each}
									</select>
								{:else}
									<select bind:value={line.resource} class="w-full rounded-lg bg-surface-container-low px-2 py-1.5 text-sm">
										<option value="">Select resource...</option>
										{#each data.resources as r}
											<option value={r.code}>{r.code} — {r.description}</option>
										{/each}
									</select>
								{/if}
							</td>
							<td class="px-3 py-2">
								<input type="number" bind:value={line.qty} step="0.25" min="0" class="w-full text-right rounded-lg bg-surface-container-low px-2 py-1.5 text-sm font-mono" />
							</td>
							<td class="px-3 py-2">
								<input type="text" bind:value={line.description} class="w-full rounded-lg bg-surface-container-low px-2 py-1.5 text-sm" />
							</td>
							<td class="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
								{#if info}<CurrencyDisplay amount={info.sellPrice} />{/if}
							</td>
							<td class="px-3 py-2 text-right font-mono text-xs">
								{#if info && line.qty > 0}<CurrencyDisplay amount={info.sellPrice * line.qty} />{/if}
							</td>
							<td class="px-1 py-2">
								<button
									class="rounded p-1 text-muted-foreground hover:text-destructive"
									onclick={() => removeLine(i)}
									disabled={lines.length <= 1}
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<button class="text-sm text-primary hover:underline" onclick={addLine}>+ Add line</button>

		<!-- Actions -->
		<div class="flex items-center gap-3 border-t border-border/30 pt-4">
			<button
				class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
				onclick={saveAsActuals}
				disabled={validLines.length === 0}
			>
				Save as Actuals ({validLines.length})
			</button>
			<button
				class="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-medium hover:bg-surface-container-low/80 disabled:opacity-50"
				onclick={saveAsBudgets}
				disabled={validLines.length === 0}
			>
				Save as Budgets
			</button>
			<a href="/jobs" class="text-sm text-muted-foreground hover:text-foreground">Discard</a>
		</div>
	</div>
</div>
