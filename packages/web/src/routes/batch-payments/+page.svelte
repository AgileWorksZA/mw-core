<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const totalOwed = $derived(data.creditors.reduce((s, c) => s + c.owed, 0));
	let confirmOpen = $state(false);

	let selected = $state<Set<string>>(new Set());
	let amounts = $state<Record<string, number>>({});
	let bankAccount = $state('');
	let paymentDate = $state(new Date().toISOString().split('T')[0]);
	let submitting = $state(false);

	const selectedTotal = $derived(
		data.creditors
			.filter((c) => selected.has(c.code))
			.reduce((s, c) => s + (amounts[c.code] || 0), 0)
	);
	const hasSelection = $derived(selected.size > 0 && selectedTotal > 0);

	function toggleAll() {
		if (selected.size === data.creditors.length) {
			selected = new Set();
		} else {
			selected = new Set(data.creditors.map((c) => c.code));
			for (const c of data.creditors) {
				if (!amounts[c.code]) amounts[c.code] = c.owed;
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
			const payments = data.creditors
				.filter((c) => selected.has(c.code) && (amounts[c.code] || 0) > 0)
				.map((c) => ({ code: c.code, name: c.name, amount: amounts[c.code] || 0 }));

			const res = await fetch('/batch-payments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ payments, bankAccount, paymentDate })
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Batch payment failed');
				return;
			}
			showToast(`${result.count} payments processed successfully`, 'success');
			selected = new Set();
			amounts = {};
			await invalidateAll();
		} catch (err: any) {
			showError(err.message || 'Batch payment failed');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Batch Payments" subtitle="{data.creditors.length} creditors with outstanding balances" />

	<div class="flex-1 overflow-auto p-6">
		{#if data.creditors.length > 0}
			<!-- Controls bar -->
			<div class="mb-4 flex items-center justify-between rounded-xl bg-surface-container-low p-3">
				<div class="flex items-center gap-4 text-sm">
					<span class="text-muted-foreground">Total outstanding: <span class="font-semibold text-foreground"><CurrencyDisplay amount={totalOwed} /></span></span>
					{#if selected.size > 0}
						<span class="text-muted-foreground">Selected: <span class="font-semibold text-foreground">{selected.size}</span> = <span class="font-semibold text-destructive"><CurrencyDisplay amount={selectedTotal} /></span></span>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<input type="date" bind:value={paymentDate} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border-none" />
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!hasSelection || submitting}
						class="rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Processing...' : `Process ${selected.size} Payments`}
					</button>
				</div>
			</div>

			<div class="overflow-auto rounded-xl bg-surface-container-lowest">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="bg-surface-container-low">
							<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-10">
								<input type="checkbox" checked={selected.size === data.creditors.length} onchange={toggleAll} class="h-4 w-4 rounded accent-primary" />
							</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Supplier</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount to Pay</th>
						</tr>
					</thead>
					<tbody>
						{#each data.creditors as c}
							<tr class="hover:bg-surface-container-low transition-colors {selected.has(c.code) ? 'bg-blue-50 dark:bg-blue-950/20' : ''}">
								<td class="px-3 py-2 text-center">
									<input type="checkbox" checked={selected.has(c.code)} onchange={() => toggleRow(c.code, c.owed)} class="h-4 w-4 rounded accent-primary" />
								</td>
								<td class="px-3 py-2 font-mono text-xs">{c.code}</td>
								<td class="px-3 py-2 font-medium">{c.name}</td>
								<td class="px-3 py-2 text-right text-destructive font-semibold"><CurrencyDisplay amount={c.owed} /></td>
								<td class="px-3 py-2 text-right">
									<input
										type="number"
										step="0.01"
										min="0"
										max={c.owed}
										value={amounts[c.code] || ''}
										oninput={(e) => { amounts[c.code] = parseFloat(e.currentTarget.value) || 0; }}
										disabled={!selected.has(c.code)}
										class="w-28 rounded-xl bg-surface-container-low px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40"
										placeholder="0.00"
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No creditors with outstanding balances</div>
		{/if}
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Confirm Batch Payments" confirmLabel="Process Payments" onConfirm={handleSubmit}>
	Process {selected.size} payments totalling <strong><CurrencyDisplay amount={selectedTotal} /></strong>?
	This will create payment transactions in MoneyWorks.
</ConfirmDialog>
