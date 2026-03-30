<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface RecurringConfig {
		mode: 'regular' | 'once';
		// Regular mode
		dayNumber: number;
		dayType: string;
		monthInterval: number;
		useLast: boolean;
		startDate: string;
		avoidWeekends: boolean;
		endCondition: 'date' | 'count' | 'never';
		endDate: string;
		endCount: number;
		// Once only mode
		onceDate: string;
		onceReverse: boolean;
	}

	let {
		open = $bindable(false),
		config = $bindable<RecurringConfig>({
			mode: 'regular',
			dayNumber: 1, dayType: 'Day', monthInterval: 1,
			useLast: false, startDate: new Date().toISOString().split('T')[0],
			avoidWeekends: false, endCondition: 'never',
			endDate: '', endCount: 12,
			onceDate: new Date().toISOString().split('T')[0],
			onceReverse: false
		}),
		onSave,
		onCancel
	}: {
		open: boolean;
		config: RecurringConfig;
		onSave: (config: RecurringConfig) => void;
		onCancel: () => void;
	} = $props();

	const dayTypes = ['Day', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	// Preview: compute next N recurrence dates
	let showPreview = $state(false);
	const previewDates = $derived(computePreview());

	function computePreview(): string[] {
		if (config.mode === 'once') return [config.onceDate];

		const dates: string[] = [];
		const start = new Date(config.startDate || new Date().toISOString().split('T')[0]);
		let current = new Date(start);

		for (let i = 0; i < 10 && dates.length < 10; i++) {
			if (config.useLast) {
				// Last day of month
				current = new Date(current.getFullYear(), current.getMonth() + (i > 0 ? config.monthInterval : 0) + 1, 0);
			} else {
				if (i > 0) current.setMonth(current.getMonth() + config.monthInterval);
				current.setDate(Math.min(config.dayNumber, new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate()));
			}

			let d = new Date(current);
			if (config.avoidWeekends) {
				while (d.getDay() === 0 || d.getDay() === 6) {
					d.setDate(d.getDate() + 1);
				}
			}

			dates.push(d.toISOString().split('T')[0]);

			if (config.endCondition === 'count' && dates.length >= config.endCount) break;
			if (config.endCondition === 'date' && d.toISOString().split('T')[0] >= config.endDate) break;
		}
		return dates;
	}

	function handleSave() {
		onSave(config);
		open = false;
	}

	function handleCancel() {
		onCancel();
		open = false;
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="fixed inset-0 bg-black/50" onclick={handleCancel}></div>
		<div class="relative z-50 w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 ring-1 ring-outline-variant/15 max-h-[90vh] overflow-auto">
			<h2 class="text-lg font-semibold font-headline">Recurring Setup</h2>
			<p class="mt-1 text-sm text-muted-foreground">Define Recurring Transaction</p>

			<!-- Mode toggle -->
			<div class="mt-4 flex rounded-xl bg-surface-container-low p-0.5">
				<button onclick={() => { config.mode = 'regular'; }} class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors {config.mode === 'regular' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}">Regular</button>
				<button onclick={() => { config.mode = 'once'; }} class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors {config.mode === 'once' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}">Once Only</button>
			</div>

			{#if config.mode === 'regular'}
				<div class="mt-4 space-y-4">
					<!-- Every N day/daytype -->
					<div class="flex items-center gap-2 text-sm">
						<span class="text-muted-foreground">Every</span>
						<input type="number" bind:value={config.dayNumber} min="1" max="31" disabled={config.useLast}
							class="w-14 rounded-xl bg-surface-container-low px-2 py-1.5 text-center text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
						<select bind:value={config.dayType} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							{#each dayTypes as dt}
								<option value={dt}>{dt}</option>
							{/each}
						</select>
						<span class="text-muted-foreground">of every</span>
						<input type="number" bind:value={config.monthInterval} min="1" max="12"
							class="w-14 rounded-xl bg-surface-container-low px-2 py-1.5 text-center text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
						<span class="text-muted-foreground">month(s)</span>
					</div>

					<!-- Last day toggle -->
					<label class="flex items-center gap-2 text-sm cursor-pointer">
						<input type="checkbox" bind:checked={config.useLast} class="h-4 w-4 rounded accent-primary" />
						Use last day of month
					</label>

					<!-- Starting on -->
					<div class="flex items-center gap-2 text-sm">
						<span class="text-muted-foreground w-24">Starting on</span>
						<input type="date" bind:value={config.startDate} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<!-- Avoid weekends -->
					<label class="flex items-center gap-2 text-sm cursor-pointer">
						<input type="checkbox" bind:checked={config.avoidWeekends} class="h-4 w-4 rounded accent-primary" />
						Avoid weekends
					</label>

					<!-- End condition -->
					<div class="space-y-2 border-t border-outline-variant/15 pt-3">
						<div class="text-xs font-medium text-muted-foreground uppercase">End Condition</div>

						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input type="radio" bind:group={config.endCondition} value="date" class="accent-primary" />
							<span>Finishing on</span>
							<input type="date" bind:value={config.endDate} disabled={config.endCondition !== 'date'}
								class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40" />
						</label>

						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input type="radio" bind:group={config.endCondition} value="count" class="accent-primary" />
							<span>Recurring</span>
							<input type="number" bind:value={config.endCount} min="1" max="999" disabled={config.endCondition !== 'count'}
								class="w-16 rounded-xl bg-surface-container-low px-2 py-1.5 text-center text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40" />
							<span>more times</span>
						</label>

						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input type="radio" bind:group={config.endCondition} value="never" class="accent-primary" />
							<span class="font-medium">Never finish</span>
						</label>
					</div>
				</div>

			{:else}
				<!-- Once Only mode -->
				<div class="mt-4 space-y-4">
					<div class="flex items-center gap-2 text-sm">
						<span class="text-muted-foreground w-24">On or after</span>
						<input type="date" bind:value={config.onceDate} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<label class="flex items-center gap-2 text-sm cursor-pointer">
						<input type="checkbox" bind:checked={config.onceReverse} class="h-4 w-4 rounded accent-primary" />
						Create reversal entry
					</label>
				</div>
			{/if}

			<!-- Preview -->
			{#if showPreview}
				<div class="mt-4 rounded-xl bg-surface-container-low p-3">
					<div class="text-xs font-medium text-muted-foreground uppercase mb-2">Upcoming Dates</div>
					<div class="flex flex-wrap gap-2">
						{#each previewDates as d}
							<span class="rounded-lg bg-surface-container-lowest px-2 py-1 text-xs font-mono">{d}</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Buttons -->
			<div class="mt-6 flex items-center justify-between">
				<button onclick={() => { showPreview = !showPreview; }}
					class="text-sm text-primary hover:underline">
					{showPreview ? 'Hide Preview' : 'Preview'}
				</button>
				<div class="flex gap-2">
					<button onclick={handleCancel} class="bg-surface-container-low rounded-xl px-4 py-2 text-sm hover:bg-surface">Cancel</button>
					<button onclick={handleSave} class="bg-primary rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">OK</button>
				</div>
			</div>
		</div>
	</div>
{/if}
