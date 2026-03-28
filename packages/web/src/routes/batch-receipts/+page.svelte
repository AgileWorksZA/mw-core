<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const totalOwed = $derived(data.debtors.reduce((s, d) => s + d.owed, 0));

	// Track selection and amounts
	let selected = $state<Set<string>>(new Set());
	let amounts = $state<Record<string, number>>({});
	let bankAccount = $state('');
	let receiptDate = $state(new Date().toISOString().split('T')[0]);
	let submitting = $state(false);

	const selectedTotal = $derived(
		data.debtors
			.filter((d) => selected.has(d.code))
			.reduce((s, d) => s + (amounts[d.code] || 0), 0)
	);
	const hasSelection = $derived(selected.size > 0 && selectedTotal > 0);

	function toggleAll() {
		if (selected.size === data.debtors.length) {
			selected = new Set();
		} else {
			selected = new Set(data.debtors.map((d) => d.code));
			for (const d of data.debtors) {
				if (!amounts[d.code]) amounts[d.code] = d.owed;
			}
		}
	}

	function toggleRow(code: string, owed: number) {
		const next = new Set(selected);
		if (next.has(code)) {
			next.delete(code);
		} else {
			next.add(code);
			if (!amounts[code]) amounts[code] = owed;
		}
		selected = next;
	}

	async function handleSubmit() {
		if (!hasSelection || submitting) return;
		submitting = true;
		try {
			const receipts = data.debtors
				.filter((d) => selected.has(d.code) && (amounts[d.code] || 0) > 0)
				.map((d) => ({ code: d.code, name: d.name, amount: amounts[d.code] || 0 }));

			const res = await fetch('/batch-receipts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ receipts, bankAccount, receiptDate })
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Batch receipt failed');
				return;
			}
			showToast(`${result.count} receipts processed successfully`, 'success');
			selected = new Set();
			amounts = {};
			await invalidateAll();
		} catch (err: any) {
			showError(err.message || 'Batch receipt failed');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Batch Receipts" subtitle="{data.debtors.length} debtors with outstanding balances" />

	<div class="flex-1 overflow-auto p-6">
		{#if data.debtors.length > 0}
			<!-- Controls bar -->
			<div class="mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
				<div class="flex items-center gap-4 text-sm">
					<span class="text-muted-foreground">Total outstanding: <span class="font-semibold text-foreground"><CurrencyDisplay amount={totalOwed} /></span></span>
					{#if selected.size > 0}
						<span class="text-muted-foreground">Selected: <span class="font-semibold text-foreground">{selected.size}</span> = <span class="font-semibold text-green-600"><CurrencyDisplay amount={selectedTotal} /></span></span>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<input type="date" bind:value={receiptDate} class="rounded border border-input bg-background px-2 py-1 text-sm" />
					<button
						onclick={handleSubmit}
						disabled={!hasSelection || submitting}
						class="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{submitting ? 'Processing...' : `Process ${selected.size} Receipts`}
					</button>
				</div>
			</div>

			<div class="overflow-auto rounded-md border border-border">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="border-b border-border bg-muted/50">
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-10">
								<input type="checkbox" checked={selected.size === data.debtors.length} onchange={toggleAll} class="h-4 w-4 rounded border-gray-300" />
							</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Customer</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount to Receive</th>
						</tr>
					</thead>
					<tbody>
						{#each data.debtors as d}
							<tr class="border-b border-border last:border-0 hover:bg-muted/50 {selected.has(d.code) ? 'bg-blue-50 dark:bg-blue-950/20' : ''}">
								<td class="px-3 py-2 text-center">
									<input type="checkbox" checked={selected.has(d.code)} onchange={() => toggleRow(d.code, d.owed)} class="h-4 w-4 rounded border-gray-300" />
								</td>
								<td class="px-3 py-2 font-mono text-xs">{d.code}</td>
								<td class="px-3 py-2 font-medium">{d.name}</td>
								<td class="px-3 py-2 text-right text-destructive font-semibold"><CurrencyDisplay amount={d.owed} /></td>
								<td class="px-3 py-2 text-right">
									<input
										type="number"
										step="0.01"
										min="0"
										max={d.owed}
										value={amounts[d.code] || ''}
										oninput={(e) => { amounts[d.code] = parseFloat(e.currentTarget.value) || 0; }}
										disabled={!selected.has(d.code)}
										class="w-28 rounded border border-input bg-background px-2 py-1 text-right text-sm disabled:opacity-40"
										placeholder="0.00"
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No debtors with outstanding balances</div>
		{/if}
	</div>
</div>
