<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let jobCode = $state(data.selectedJob);
	let itemiseBy = $state('S');
	let itemiseInDesc = $state(false);
	let miscAccount = $state('');
	let finalInvoice = $state(false);

	// Selected items (all selected by default)
	let selectedIds = $state<Set<number>>(new Set(data.pendingItems.map((i: any) => i.id)));

	function toggleItem(id: number) {
		const next = new Set(selectedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedIds = next;
	}

	function selectAll() {
		selectedIds = new Set(data.pendingItems.map((i: any) => i.id));
	}

	function selectNone() {
		selectedIds = new Set();
	}

	const selectedItems = $derived(data.pendingItems.filter((i: any) => selectedIds.has(i.id)));
	const totalCharge = $derived(selectedItems.reduce((s: number, i: any) => s + i.charge, 0));

	let invoiceAmount = $state(0);
	$effect(() => { invoiceAmount = totalCharge; });

	let balanceBy = $state<'prorata' | 'misc' | 'carry'>('prorata');

	const itemiseLabels: Record<string, string> = {
		S: 'Simple',
		D: 'Date and Resource',
		R: 'Resource',
		A: 'Account',
		C: 'Cost Centre'
	};

	function loadJob() {
		if (jobCode) {
			goto(`/jobs/bill?job=${jobCode}`, { invalidateAll: true });
		}
	}

	async function makeInvoice() {
		if (selectedItems.length === 0) {
			showError('No items selected');
			return;
		}
		showToast(`Invoice created for job ${jobCode} — ${selectedItems.length} items`, 'success');
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Bill Job" subtitle="Generate invoice from unbilled job costs" />

	<div class="flex-1 overflow-auto p-6 space-y-6">
		<!-- Job selector -->
		<div class="flex items-end gap-4">
			<div class="flex-1">
				<label class="text-xs font-medium text-muted-foreground uppercase">Job</label>
				<select bind:value={jobCode} class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm">
					<option value="">Select job...</option>
					{#each data.jobs as job}
						<option value={job.code}>{job.code} — {job.name} ({job.client})</option>
					{/each}
				</select>
			</div>
			<button
				class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				onclick={loadJob}
				disabled={!jobCode}
			>
				Load Items
			</button>
		</div>

		{#if data.pendingItems.length > 0}
			<!-- Items table -->
			<div>
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm text-muted-foreground">{selectedIds.size} of {data.pendingItems.length} items selected</span>
					<div class="flex gap-2">
						<button class="text-xs text-primary hover:underline" onclick={selectAll}>Select All</button>
						<button class="text-xs text-primary hover:underline" onclick={selectNone}>Select None</button>
					</div>
				</div>
				<div class="overflow-auto rounded-xl bg-surface-container-lowest">
					<table class="w-full text-sm">
						<thead>
							<tr class="bg-surface-container-low">
								<th class="w-8 px-2 py-2.5"></th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Resource</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Qty</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Cost</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Charge</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Memo</th>
							</tr>
						</thead>
						<tbody>
							{#each data.pendingItems as item}
								<tr
									class="cursor-pointer transition-colors {selectedIds.has(item.id) ? 'bg-primary/5' : 'hover:bg-surface-container-low'}"
									onclick={() => toggleItem(item.id)}
								>
									<td class="px-2 py-2 text-center">
										<input type="checkbox" checked={selectedIds.has(item.id)} class="rounded" />
									</td>
									<td class="px-3 py-2 text-muted-foreground font-mono text-xs">{item.date}</td>
									<td class="px-3 py-2 font-mono text-xs">{item.resource}</td>
									<td class="px-3 py-2 text-right font-mono text-xs">{item.qty}</td>
									<td class="px-3 py-2 text-right"><CurrencyDisplay amount={item.cost} /></td>
									<td class="px-3 py-2 text-right font-semibold"><CurrencyDisplay amount={item.charge} /></td>
									<td class="px-3 py-2 text-muted-foreground max-w-xs truncate">{item.memo}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Invoice options -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="rounded-xl bg-surface-container-lowest p-4 space-y-3">
					<h3 class="font-headline text-sm font-semibold text-muted-foreground uppercase">Invoice Options</h3>
					<div>
						<label class="text-xs text-muted-foreground">Itemise by</label>
						<select bind:value={itemiseBy} class="mt-1 block w-full rounded-lg bg-surface-container-low px-2 py-1.5 text-sm">
							{#each Object.entries(itemiseLabels) as [key, label]}
								<option value={key}>{label}</option>
							{/each}
						</select>
					</div>
					<label class="flex items-center gap-2 text-sm">
						<input type="checkbox" bind:checked={itemiseInDesc} class="rounded" />
						Itemise in Description
					</label>
					<label class="flex items-center gap-2 text-sm">
						<input type="checkbox" bind:checked={finalInvoice} class="rounded" />
						Final Invoice (mark job Completed)
					</label>
				</div>

				<div class="rounded-xl bg-surface-container-lowest p-4 space-y-3">
					<h3 class="font-headline text-sm font-semibold text-muted-foreground uppercase">Invoice Amount</h3>
					<div class="flex justify-between text-sm">
						<span class="text-muted-foreground">Selected items total</span>
						<span class="font-mono font-semibold"><CurrencyDisplay amount={totalCharge} /></span>
					</div>
					<div>
						<label class="text-xs text-muted-foreground">This Invoice Amount</label>
						<input type="number" bind:value={invoiceAmount} step="0.01" class="mt-1 block w-full rounded-lg bg-surface-container-low px-2 py-1.5 text-sm font-mono text-right" />
					</div>
					{#if invoiceAmount !== totalCharge}
						<div>
							<label class="text-xs text-muted-foreground">Balance by</label>
							<select bind:value={balanceBy} class="mt-1 block w-full rounded-lg bg-surface-container-low px-2 py-1.5 text-sm">
								<option value="prorata">Pro Rata Detail Lines</option>
								<option value="misc">Add Miscellaneous Items Line</option>
								<option value="carry">Carry Difference Forward</option>
							</select>
						</div>
					{/if}
				</div>
			</div>

			<!-- Action -->
			<div class="flex items-center gap-3 border-t border-border/30 pt-4">
				<button
					class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
					onclick={makeInvoice}
					disabled={selectedItems.length === 0}
				>
					Make Invoice
				</button>
				<a href="/jobs" class="text-sm text-muted-foreground hover:text-foreground">Cancel</a>
			</div>
		{:else if jobCode}
			<div class="flex h-32 items-center justify-center text-muted-foreground">No pending items for this job</div>
		{:else}
			<div class="flex h-32 items-center justify-center text-muted-foreground">Select a job to load its pending items</div>
		{/if}
	</div>
</div>
