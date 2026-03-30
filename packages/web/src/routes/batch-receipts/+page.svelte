<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Header state
	let lookupMode = $state<'debtor' | 'invoice'>('debtor');
	let lookupCode = $state('');
	let receiptAmount = $state(0);
	let receiptDate = $state(new Date().toISOString().split('T')[0]);
	let receiptNo = $state(1);
	let bankAccount = $state('');
	let distributionMode = $state<'smart' | 'strict' | 'ignore'>('smart');
	let autoDistribute = $state(false);
	let paymentMethod = $state(0);
	let entering = $state(false);
	let confirmAcceptOpen = $state(false);

	// Selected debtor + outstanding invoices
	let selectedDebtor = $state<{ code: string; name: string; address: string; owed: number } | null>(null);
	let invoices = $state<Array<{
		seq: number; invoice: string; order: string; description: string;
		date: string; gross: number; outstanding: number; pay: number; writeOff: boolean;
	}>>([]);
	let loadingInvoices = $state(false);

	// Processed receipts in this batch session
	let processedReceipts = $state<Array<{
		no: number; code: string; name: string; amount: number; date: string;
	}>>([]);

	// Derived
	const allocationTotal = $derived(invoices.reduce((s, inv) => s + (inv.pay || 0), 0));
	const processedTotal = $derived(processedReceipts.reduce((s, r) => s + r.amount, 0));
	const canEnter = $derived(selectedDebtor !== null && receiptAmount > 0 && bankAccount !== '');

	async function selectDebtor(code: string) {
		const debtor = data.debtors.find((d) => d.code === code);
		if (!debtor) return;
		selectedDebtor = debtor;
		lookupCode = code;
		receiptAmount = debtor.owed;

		// Fetch outstanding invoices
		loadingInvoices = true;
		try {
			const res = await fetch(`/api/outstanding-invoices?nameCode=${encodeURIComponent(code)}&type=customer`);
			const result = await res.json();
			if (res.ok) {
				invoices = (result.invoices ?? []).map((inv: any) => ({ ...inv, pay: 0, writeOff: false }));
				if (autoDistribute) distribute();
			}
		} catch { /* ignore */ }
		finally { loadingInvoices = false; }
	}

	function distribute() {
		if (receiptAmount <= 0) return;
		let remaining = receiptAmount;

		// Sort based on distribution mode
		const sorted = [...invoices];
		if (distributionMode === 'strict') {
			sorted.sort((a, b) => a.date.localeCompare(b.date)); // oldest first
		}

		for (let i = 0; i < sorted.length; i++) {
			if (remaining <= 0) { sorted[i].pay = 0; continue; }
			const toPay = Math.min(remaining, sorted[i].outstanding);
			sorted[i].pay = Math.round(toPay * 100) / 100;
			remaining = Math.round((remaining - toPay) * 100) / 100;
		}
		invoices = [...sorted];
	}

	async function handleEnter() {
		if (!canEnter || entering) return;
		entering = true;
		try {
			const allocations = invoices.filter((inv) => inv.pay > 0).map((inv) => ({
				invoice: inv.invoice, amount: inv.pay
			}));

			const res = await fetch('/batch-receipts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'enter',
					nameCode: selectedDebtor!.code,
					amount: receiptAmount,
					bankAccount,
					receiptDate,
					description: allocations.length > 0 ? allocations.map((a) => a.invoice).join(', ') : `Receipt from ${selectedDebtor!.name}`,
					allocations
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Receipt failed');
				return;
			}

			// Add to processed list
			processedReceipts = [...processedReceipts, {
				no: receiptNo, code: selectedDebtor!.code,
				name: selectedDebtor!.name, amount: receiptAmount, date: receiptDate
			}];
			receiptNo++;

			showToast(`Receipt entered for ${selectedDebtor!.name}`, 'success');

			// Reset for next entry
			selectedDebtor = null;
			lookupCode = '';
			receiptAmount = 0;
			invoices = [];
		} catch (err: any) {
			showError(err.message || 'Receipt failed');
		} finally {
			entering = false;
		}
	}

	async function handleAccept() {
		confirmAcceptOpen = false;
		showToast(`Batch accepted: ${processedReceipts.length} receipts totalling $${processedTotal.toFixed(2)}`, 'success');
		processedReceipts = [];
		receiptNo = 1;
		await invalidateAll();
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Debtor Receipts" subtitle="Batch receipt entry">
		<span class="text-sm text-muted-foreground">{data.debtors.length} debtors outstanding</span>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="space-y-4">
			<!-- Header controls -->
			<div class="rounded-xl bg-surface-container-lowest p-4">
				<div class="flex flex-wrap items-end gap-3">
					<!-- Lookup mode -->
					<div class="space-y-1.5">
						<div class="text-xs font-medium text-muted-foreground uppercase">Lookup</div>
						<div class="flex rounded-xl bg-surface-container-low p-0.5">
							<button onclick={() => { lookupMode = 'debtor'; }} class="rounded-lg px-3 py-1 text-sm {lookupMode === 'debtor' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}">Debtor</button>
							<button onclick={() => { lookupMode = 'invoice'; }} class="rounded-lg px-3 py-1 text-sm {lookupMode === 'invoice' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}">Invoice</button>
						</div>
					</div>

					<!-- Code/Number -->
					<div class="space-y-1.5">
						<label class="text-xs font-medium text-muted-foreground uppercase">{lookupMode === 'debtor' ? 'Code' : 'Invoice #'}</label>
						{#if lookupMode === 'debtor'}
							<select bind:value={lookupCode} onchange={() => selectDebtor(lookupCode)} class="rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
								<option value="">Select debtor...</option>
								{#each data.debtors as d}
									<option value={d.code}>{d.code}: {d.name}</option>
								{/each}
							</select>
						{:else}
							<input type="text" bind:value={lookupCode} placeholder="Invoice number" class="rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
						{/if}
					</div>

					<!-- Amount -->
					<div class="space-y-1.5">
						<label class="text-xs font-medium text-muted-foreground uppercase">Amount</label>
						<input type="number" bind:value={receiptAmount} step="0.01" min="0" class="w-28 rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring font-semibold" />
					</div>

					<!-- Date -->
					<div class="space-y-1.5">
						<label class="text-xs font-medium text-muted-foreground uppercase">Date</label>
						<input type="date" bind:value={receiptDate} class="rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<!-- Receipt No -->
					<div class="space-y-1.5">
						<label class="text-xs font-medium text-muted-foreground uppercase">Receipt No.</label>
						<input type="number" bind:value={receiptNo} class="w-20 rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<!-- Bank -->
					<div class="space-y-1.5">
						<label class="text-xs font-medium text-muted-foreground uppercase">Bank</label>
						<select bind:value={bankAccount} class="rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value="">Select...</option>
							{#each data.bankAccounts as b}
								<option value={b.code}>{b.code}: {b.description}</option>
							{/each}
						</select>
					</div>

					<!-- Enter button -->
					<button onclick={handleEnter} disabled={!canEnter || entering}
						class="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
						{entering ? 'Entering...' : 'Enter'}
					</button>
				</div>

				<!-- Distribution controls -->
				<div class="mt-3 flex items-center gap-4 border-t border-outline-variant/15 pt-3">
					<button onclick={distribute} disabled={invoices.length === 0 || receiptAmount <= 0}
						class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm font-medium hover:bg-surface transition-colors disabled:opacity-40">
						Distribute
					</button>
					<select bind:value={distributionMode} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
						<option value="smart">Smart</option>
						<option value="strict">Strict top-down</option>
						<option value="ignore">Ignore credits</option>
					</select>
					<label class="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
						<input type="checkbox" bind:checked={autoDistribute} class="h-4 w-4 rounded accent-primary" />
						Auto
					</label>
					<select bind:value={paymentMethod} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
						<option value={0}>Payment Method: None</option>
						<option value={1}>Cash</option>
						<option value={2}>Cheque</option>
						<option value={3}>Credit Card</option>
						<option value={4}>Direct Debit</option>
					</select>
				</div>
			</div>

			{#if selectedDebtor}
				<!-- Customer info -->
				<div class="rounded-xl bg-surface-container-lowest px-4 py-3 text-sm">
					<span class="font-semibold">{selectedDebtor.name}</span>
					{#if selectedDebtor.address}
						<span class="text-muted-foreground ml-2">{selectedDebtor.address}</span>
					{/if}
					<span class="ml-2 text-muted-foreground">Owing: <span class="font-semibold text-destructive"><CurrencyDisplay amount={selectedDebtor.owed} /></span></span>
				</div>
			{/if}

			<!-- Outstanding invoices panel -->
			<div class="rounded-xl bg-surface-container-lowest">
				<div class="border-b border-outline-variant/15 px-5 py-3 flex items-center justify-between">
					<h3 class="text-sm font-semibold font-headline">Outstanding Invoices</h3>
					{#if invoices.length > 0}
						<div class="flex gap-4 text-xs text-muted-foreground">
							<span>Gross: <span class="font-semibold"><CurrencyDisplay amount={invoices.reduce((s, i) => s + i.gross, 0)} /></span></span>
							<span>Outstanding: <span class="font-semibold text-destructive"><CurrencyDisplay amount={invoices.reduce((s, i) => s + i.outstanding, 0)} /></span></span>
							<span>Pay: <span class="font-semibold text-positive"><CurrencyDisplay amount={allocationTotal} /></span></span>
						</div>
					{/if}
				</div>
				<div class="max-h-64 overflow-auto">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2 text-left font-medium text-muted-foreground">Invoice</th>
								<th class="px-3 py-2 text-left font-medium text-muted-foreground">Order</th>
								<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2 text-left font-medium text-muted-foreground">Inv Date</th>
								<th class="px-3 py-2 text-right font-medium text-muted-foreground">Gross</th>
								<th class="px-3 py-2 text-right font-medium text-muted-foreground">Outstanding</th>
								<th class="px-3 py-2 text-right font-medium text-muted-foreground">Pay</th>
								<th class="px-3 py-2 text-center font-medium text-muted-foreground w-10">W/O</th>
							</tr>
						</thead>
						<tbody>
							{#if loadingInvoices}
								<tr><td colspan="8" class="px-3 py-6 text-center text-muted-foreground">Loading invoices...</td></tr>
							{:else if invoices.length === 0}
								<tr><td colspan="8" class="px-3 py-6 text-center text-muted-foreground">{selectedDebtor ? 'No outstanding invoices' : 'Select a debtor to see invoices'}</td></tr>
							{:else}
								{#each invoices as inv}
									<tr class="hover:bg-surface-container-low transition-colors {inv.pay > 0 ? 'bg-green-50 dark:bg-green-950/20' : ''}">
										<td class="px-3 py-1.5 font-mono text-xs">{inv.invoice}</td>
										<td class="px-3 py-1.5 font-mono text-xs text-muted-foreground">{inv.order || '-'}</td>
										<td class="px-3 py-1.5 text-muted-foreground max-w-xs truncate">{inv.description}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{inv.date}</td>
										<td class="px-3 py-1.5 text-right tabular-nums"><CurrencyDisplay amount={inv.gross} /></td>
										<td class="px-3 py-1.5 text-right tabular-nums font-semibold text-destructive"><CurrencyDisplay amount={inv.outstanding} /></td>
										<td class="px-2 py-1.5">
											<input type="number" step="0.01" min="0" max={inv.outstanding}
												bind:value={inv.pay}
												class="w-24 rounded-xl bg-surface-container-low px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="0.00" />
										</td>
										<td class="px-3 py-1.5 text-center">
											<input type="checkbox" bind:checked={inv.writeOff} class="h-4 w-4 rounded accent-primary" />
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Processed receipts panel -->
			<div class="rounded-xl bg-surface-container-lowest">
				<div class="border-b border-outline-variant/15 px-5 py-3 flex items-center justify-between">
					<h3 class="text-sm font-semibold font-headline">Processed Receipts ({processedReceipts.length})</h3>
					{#if processedReceipts.length > 0}
						<span class="text-sm text-muted-foreground">Total: <span class="font-semibold text-positive"><CurrencyDisplay amount={processedTotal} /></span></span>
					{/if}
				</div>
				<div class="max-h-40 overflow-auto">
					<table class="w-full text-sm">
						<thead class="sticky top-0">
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2 text-left font-medium text-muted-foreground w-16">#</th>
								<th class="px-3 py-2 text-left font-medium text-muted-foreground">Code</th>
								<th class="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
								<th class="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
								<th class="px-3 py-2 text-right font-medium text-muted-foreground">Amount</th>
							</tr>
						</thead>
						<tbody>
							{#if processedReceipts.length === 0}
								<tr><td colspan="5" class="px-3 py-4 text-center text-muted-foreground">No receipts entered yet</td></tr>
							{:else}
								{#each processedReceipts as r}
									<tr class="bg-positive/5">
										<td class="px-3 py-1.5 font-mono text-xs">{r.no}</td>
										<td class="px-3 py-1.5 font-mono text-xs">{r.code}</td>
										<td class="px-3 py-1.5">{r.name}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{r.date}</td>
										<td class="px-3 py-1.5 text-right tabular-nums font-semibold text-positive"><CurrencyDisplay amount={r.amount} /></td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4">
				<div class="text-sm text-muted-foreground">
					Total of receipts processed: <span class="font-semibold text-foreground"><CurrencyDisplay amount={processedTotal} /></span>
				</div>
				<div class="flex gap-2">
					<button onclick={() => { confirmAcceptOpen = true; }}
						disabled={processedReceipts.length === 0}
						class="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
						Accept ({processedReceipts.length})
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmAcceptOpen} title="Accept Batch Receipts" confirmLabel="Accept" onConfirm={handleAccept}>
	Finalize {processedReceipts.length} receipts totalling <strong><CurrencyDisplay amount={processedTotal} /></strong>?
</ConfirmDialog>
