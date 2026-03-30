<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Wizard step
	let step = $state(1);
	let submitting = $state(false);
	let confirmOpen = $state(false);
	let partialDialogOpen = $state(false);
	let partialAmount = $state(0);
	let partialTarget = $state<number | null>(null);
	let electronicPayments = $state(false);
	let bankAccount = $state('');
	let paymentDate = $state(new Date().toISOString().split('T')[0]);

	// Invoice marking state
	let invoices = $state(data.payableInvoices.map((i) => ({ ...i })));
	let selectedSeqs = $state<Set<number>>(new Set());

	// Derived
	const paymentTotal = $derived(invoices.reduce((s, i) => s + i.payAmount, 0));
	const markedCount = $derived(invoices.filter((i) => i.payAmount > 0).length);

	function selectRow(seq: number) {
		const next = new Set(selectedSeqs);
		if (next.has(seq)) next.delete(seq); else next.add(seq);
		selectedSeqs = next;
	}

	function selectAll() {
		if (selectedSeqs.size === invoices.length) {
			selectedSeqs = new Set();
		} else {
			selectedSeqs = new Set(invoices.map((i) => i.seq));
		}
	}

	function markFull() {
		for (let i = 0; i < invoices.length; i++) {
			if (selectedSeqs.has(invoices[i].seq)) {
				invoices[i].payAmount = invoices[i].outstanding;
				invoices[i].payStatus = 'full';
			}
		}
		invoices = [...invoices];
	}

	function markDontPay() {
		for (let i = 0; i < invoices.length; i++) {
			if (selectedSeqs.has(invoices[i].seq)) {
				invoices[i].payAmount = 0;
				invoices[i].payStatus = 'none';
			}
		}
		invoices = [...invoices];
	}

	function openPartial() {
		if (selectedSeqs.size !== 1) return;
		const seq = Array.from(selectedSeqs)[0];
		const inv = invoices.find((i) => i.seq === seq);
		if (!inv) return;
		partialTarget = seq;
		partialAmount = inv.outstanding;
		partialDialogOpen = true;
	}

	function applyPartial() {
		partialDialogOpen = false;
		if (partialTarget === null) return;
		for (let i = 0; i < invoices.length; i++) {
			if (invoices[i].seq === partialTarget) {
				invoices[i].payAmount = Math.min(partialAmount, invoices[i].outstanding);
				invoices[i].payStatus = 'partial';
				break;
			}
		}
		invoices = [...invoices];
		partialTarget = null;
	}

	async function handleProcess() {
		confirmOpen = false;
		if (markedCount === 0 || !bankAccount || submitting) return;
		submitting = true;
		try {
			const payments = invoices
				.filter((i) => i.payAmount > 0)
				.map((i) => ({
					creditor: i.creditor, name: i.name,
					amount: i.payAmount, invoiceNo: i.invoiceNo
				}));

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
			step = 1;
			selectedSeqs = new Set();
			await invalidateAll();
			invoices = data.payableInvoices.map((i) => ({ ...i }));
		} catch (err: any) {
			showError(err.message || 'Batch payment failed');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Pay Creditors" subtitle="Step {step} of 2 — {step === 1 ? 'Mark Invoices for Payment' : 'Confirm and Process'}">
		{#if step === 2}
			<button onclick={() => { step = 1; }} class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Step 1</button>
		{/if}
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		{#if step === 1}
			<!-- Step 1: Mark invoices -->
			<div class="space-y-4">
				<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-3">
					<div class="flex items-center gap-2 text-sm">
						<span class="text-muted-foreground">{invoices.length} invoices</span>
						<span class="text-muted-foreground mx-1">&middot;</span>
						<span class="text-muted-foreground">{selectedSeqs.size} selected</span>
					</div>
					<div class="flex items-center gap-2">
						<button onclick={markFull} disabled={selectedSeqs.size === 0}
							class="rounded-xl bg-positive/10 px-3 py-1.5 text-sm font-medium text-positive hover:bg-positive/20 disabled:opacity-40">Full</button>
						<button onclick={openPartial} disabled={selectedSeqs.size !== 1}
							class="rounded-xl bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-500/20 disabled:opacity-40">Partial</button>
						<button onclick={markDontPay} disabled={selectedSeqs.size === 0}
							class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-surface disabled:opacity-40">Don't Pay</button>
					</div>
				</div>

				<p class="text-sm text-muted-foreground">Highlight invoices and click Full, Partial, or Don't Pay to mark them for this payment run.</p>

				<div class="overflow-auto rounded-xl bg-surface-container-lowest">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-10">
									<input type="checkbox" checked={selectedSeqs.size === invoices.length} onchange={selectAll} class="h-4 w-4 rounded accent-primary" />
								</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Creditor</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Due Date</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Invoice No.</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Pay Amount</th>
							</tr>
						</thead>
						<tbody>
							{#each invoices as inv}
								<tr
									class="cursor-pointer transition-colors
										{selectedSeqs.has(inv.seq) ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-surface-container-low'}
										{inv.payAmount > 0 ? 'ring-1 ring-inset ring-positive/30' : ''}"
									onclick={() => selectRow(inv.seq)}
								>
									<td class="px-3 py-2 text-center" onclick={(e) => e.stopPropagation()}>
										<input type="checkbox" checked={selectedSeqs.has(inv.seq)} onchange={() => selectRow(inv.seq)} class="h-4 w-4 rounded accent-primary" />
									</td>
									<td class="px-3 py-2 font-mono text-xs">{inv.creditor}</td>
									<td class="px-3 py-2 text-muted-foreground">{inv.dueDate}</td>
									<td class="px-3 py-2 font-mono text-xs">{inv.invoiceNo}</td>
									<td class="px-3 py-2 text-muted-foreground max-w-xs truncate">{inv.name} — {inv.description}</td>
									<td class="px-3 py-2 text-right tabular-nums"><CurrencyDisplay amount={inv.gross} /></td>
									<td class="px-3 py-2 text-right tabular-nums font-semibold text-destructive"><CurrencyDisplay amount={inv.outstanding} /></td>
									<td class="px-3 py-2 text-right tabular-nums font-semibold {inv.payAmount > 0 ? 'text-positive' : 'text-muted-foreground'}">
										{inv.payAmount > 0 ? inv.payAmount.toFixed(2) : '-'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Footer -->
				<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4">
					<div class="flex items-center gap-4">
						<span class="text-sm text-muted-foreground">
							Total of payments to make: <span class="font-bold text-foreground"><CurrencyDisplay amount={paymentTotal} /></span>
							({markedCount} invoice{markedCount !== 1 ? 's' : ''})
						</span>
						<label class="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
							<input type="checkbox" bind:checked={electronicPayments} class="h-4 w-4 rounded accent-primary" />
							Electronic Payments Export
						</label>
					</div>
					<button onclick={() => { step = 2; }} disabled={markedCount === 0}
						class="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
						Next &rarr;
					</button>
				</div>
			</div>

		{:else}
			<!-- Step 2: Confirm -->
			<div class="mx-auto max-w-lg space-y-6">
				<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
					<h2 class="text-lg font-semibold font-headline">Payment Summary</h2>

					<div class="space-y-2 text-sm">
						<div class="flex justify-between"><span class="text-muted-foreground">Invoices to pay</span><span class="font-semibold">{markedCount}</span></div>
						<div class="flex justify-between"><span class="text-muted-foreground">Total amount</span><span class="font-bold text-lg"><CurrencyDisplay amount={paymentTotal} /></span></div>
						{#if electronicPayments}
							<div class="flex justify-between"><span class="text-muted-foreground">Electronic export</span><span class="text-positive font-medium">Yes</span></div>
						{/if}
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Bank Account</label>
						<select bind:value={bankAccount} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value="">Select bank...</option>
							{#each data.bankAccounts as b}
								<option value={b.code}>{b.code}: {b.description} (<CurrencyDisplay amount={b.balance} />)</option>
							{/each}
						</select>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label class="text-sm font-medium">Payment Date</label>
							<input type="date" bind:value={paymentDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
						</div>
					</div>

					<div class="flex gap-2 pt-2">
						<button onclick={() => { step = 1; }} class="flex-1 rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Back</button>
						<button onclick={() => { confirmOpen = true; }} disabled={!bankAccount || submitting}
							class="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
							{submitting ? 'Processing...' : 'Process Payments'}
						</button>
					</div>
				</div>

				<!-- Payment breakdown -->
				<div class="rounded-xl bg-surface-container-lowest p-5">
					<h3 class="text-sm font-semibold font-headline mb-3">Payments to Create</h3>
					<div class="space-y-1">
						{#each invoices.filter((i) => i.payAmount > 0) as inv}
							<div class="flex items-center justify-between text-sm py-1">
								<span><span class="font-mono text-xs">{inv.creditor}</span> — {inv.name}</span>
								<span class="font-semibold tabular-nums"><CurrencyDisplay amount={inv.payAmount} /></span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Partial payment dialog -->
{#if partialDialogOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<div class="fixed inset-0 bg-black/50" onclick={() => { partialDialogOpen = false; }}></div>
		<div class="relative z-50 w-full max-w-sm rounded-xl bg-surface-container-lowest p-6 ring-1 ring-outline-variant/15">
			<h2 class="text-lg font-semibold font-headline">Partial Payment</h2>
			<div class="mt-3 space-y-1.5">
				<label class="text-sm font-medium">Amount to pay</label>
				<input type="number" bind:value={partialAmount} step="0.01" min="0"
					class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<div class="mt-4 flex justify-end gap-2">
				<button onclick={() => { partialDialogOpen = false; }} class="bg-surface-container-low rounded-xl px-4 py-2 text-sm hover:bg-surface">Cancel</button>
				<button onclick={applyPartial} class="bg-primary rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Apply</button>
			</div>
		</div>
	</div>
{/if}

<ConfirmDialog bind:open={confirmOpen} title="Process Payments" confirmLabel="Process" onConfirm={handleProcess}>
	Process {markedCount} payments totalling <strong><CurrencyDisplay amount={paymentTotal} /></strong> from <strong>{data.bankAccounts.find((b) => b.code === bankAccount)?.description || bankAccount}</strong>?
</ConfirmDialog>
