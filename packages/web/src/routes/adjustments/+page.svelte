<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeTab = $state('cancel');
	let confirmOpen = $state(false);
	let confirmTitle = $state('');
	let confirmMessage = $state('');
	let pendingAction = $state<(() => Promise<void>) | null>(null);
	let processing = $state(false);

	// Selection state
	let selectedCancelSeq = $state<number | null>(null);
	let selectedWriteOffSeq = $state<number | null>(null);
	let selectedDebtorCode = $state('');
	let selectedCreditorCode = $state('');
	let refundAmount = $state(0);

	const tabs = [
		{ id: 'cancel', label: 'Cancel Transaction' },
		{ id: 'contra', label: 'Contra Invoices' },
		{ id: 'writeoff', label: 'Write Off' },
		{ id: 'refund-debtor', label: 'Refund Debtor' },
		{ id: 'refund-creditor', label: 'Refund Creditor' }
	];

	// Helpers
	const selectedCancel = $derived(data.postedTransactions.find((t) => t.seq === selectedCancelSeq));
	const selectedWriteOff = $derived(data.outstandingInvoices.find((t) => t.seq === selectedWriteOffSeq));
	const selectedDebtor = $derived(data.debtors.find((d) => d.code === selectedDebtorCode));
	const selectedCreditor = $derived(data.creditors.find((c) => c.code === selectedCreditorCode));

	function formatType(type: string): string {
		const labels: Record<string, string> = {
			CR: 'Receipt', CP: 'Payment', DI: 'Invoice', CI: 'Purchase', JN: 'Journal', SO: 'Order', QU: 'Quote'
		};
		return labels[type.substring(0, 2)] || type;
	}

	function confirm(title: string, message: string, action: () => Promise<void>) {
		confirmTitle = title;
		confirmMessage = message;
		pendingAction = action;
		confirmOpen = true;
	}

	async function executeConfirmed() {
		confirmOpen = false;
		if (!pendingAction || processing) return;
		processing = true;
		try {
			await pendingAction();
		} finally {
			processing = false;
			pendingAction = null;
		}
	}

	async function postAction(body: Record<string, any>, successMsg: string) {
		const res = await fetch('/adjustments', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		const result = await res.json();
		if (!res.ok) {
			showError(result.error || 'Action failed');
			return;
		}
		showToast(successMsg, 'success');
		await invalidateAll();
	}

	function handleCancel() {
		if (!selectedCancel) return;
		const tx = selectedCancel;
		confirm('Cancel Transaction', `Create a reversal for ${formatType(tx.type)} ${tx.ref} (${tx.gross.toFixed(2)})?`,
			() => postAction({
				action: 'cancel', seq: tx.seq, type: tx.type, gross: tx.gross,
				contra: '', nameCode: '', description: tx.description, date: tx.date
			}, `Transaction ${tx.ref} cancelled`)
		);
	}

	function handleWriteOff() {
		if (!selectedWriteOff) return;
		const inv = selectedWriteOff;
		confirm('Write Off Bad Debt', `Write off ${inv.outstanding.toFixed(2)} for invoice ${inv.ref} (${inv.name})?`,
			() => postAction({
				action: 'writeoff', seq: inv.seq, ref: inv.ref,
				nameCode: inv.nameCode, outstanding: inv.outstanding
			}, `Invoice ${inv.ref} written off`)
		);
	}

	function handleRefundDebtor() {
		if (!selectedDebtor || refundAmount <= 0) return;
		const d = selectedDebtor;
		confirm('Send Refund to Debtor', `Send refund of ${refundAmount.toFixed(2)} to ${d.name} (${d.code})?`,
			() => postAction({
				action: 'refund-debtor', nameCode: d.code, amount: refundAmount, bankAccount: '1000'
			}, `Refund sent to ${d.name}`)
		);
	}

	function handleRefundCreditor() {
		if (!selectedCreditor || refundAmount <= 0) return;
		const c = selectedCreditor;
		confirm('Receive Refund from Creditor', `Receive refund of ${refundAmount.toFixed(2)} from ${c.name} (${c.code})?`,
			() => postAction({
				action: 'refund-creditor', nameCode: c.code, amount: refundAmount, bankAccount: '1000'
			}, `Refund received from ${c.name}`)
		);
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Adjustments" subtitle="Transaction adjustments and corrections" />

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-5xl space-y-4">
			<!-- Tab bar -->
			<div class="flex gap-1 overflow-x-auto rounded-xl bg-surface-container-lowest p-1">
				{#each tabs as tab}
					<button
						class="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors
							{activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface-container-low'}"
						onclick={() => { activeTab = tab.id; }}
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Tab content -->
			{#if activeTab === 'cancel'}
				<div class="rounded-xl bg-surface-container-lowest p-5">
					<p class="mb-4 text-sm text-muted-foreground">Select a posted transaction to cancel. This creates a reversal entry.</p>
					<div class="max-h-96 overflow-auto">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 w-8"></th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground w-20">Type</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Reference</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Period</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Gross</th>
								</tr>
							</thead>
							<tbody>
								{#each data.postedTransactions as tx}
									<tr
										class="cursor-pointer transition-colors {selectedCancelSeq === tx.seq ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-surface-container-low'}"
										onclick={() => { selectedCancelSeq = tx.seq; }}
									>
										<td class="px-3 py-1.5"><input type="radio" checked={selectedCancelSeq === tx.seq} class="accent-primary" /></td>
										<td class="px-3 py-1.5 text-xs">{formatType(tx.type)}</td>
										<td class="px-3 py-1.5 font-mono text-xs">{tx.ref}</td>
										<td class="px-3 py-1.5 text-muted-foreground max-w-xs truncate">{tx.description}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{tx.period}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{tx.date}</td>
										<td class="px-3 py-1.5 text-right tabular-nums font-semibold"><CurrencyDisplay amount={tx.gross} /></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="mt-4 flex justify-end">
						<button onclick={handleCancel} disabled={!selectedCancel || processing}
							class="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
							{processing ? 'Cancelling...' : 'Cancel Transaction'}
						</button>
					</div>
				</div>

			{:else if activeTab === 'contra'}
				<div class="rounded-xl bg-surface-container-lowest p-5">
					<p class="mb-4 text-sm text-muted-foreground">Offset a credit note against an outstanding invoice. Select the credit note to apply, then the invoice to offset against.</p>
					<div class="flex h-40 items-center justify-center text-muted-foreground text-sm">
						No credit notes found in the current data. Credit notes appear when a sales invoice is reversed or a credit note is created.
					</div>
				</div>

			{:else if activeTab === 'writeoff'}
				<div class="rounded-xl bg-surface-container-lowest p-5">
					<p class="mb-4 text-sm text-muted-foreground">Select an outstanding invoice to write off as a bad debt.</p>
					<div class="max-h-96 overflow-auto">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 w-8"></th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Ref</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Period</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Outstanding</th>
								</tr>
							</thead>
							<tbody>
								{#each data.outstandingInvoices as inv}
									<tr
										class="cursor-pointer transition-colors {selectedWriteOffSeq === inv.seq ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-surface-container-low'}"
										onclick={() => { selectedWriteOffSeq = inv.seq; }}
									>
										<td class="px-3 py-1.5"><input type="radio" checked={selectedWriteOffSeq === inv.seq} class="accent-primary" /></td>
										<td class="px-3 py-1.5 font-mono text-xs">{inv.ref}</td>
										<td class="px-3 py-1.5">{inv.name}</td>
										<td class="px-3 py-1.5 text-muted-foreground max-w-xs truncate">{inv.description}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{inv.period}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{inv.date}</td>
										<td class="px-3 py-1.5 text-right tabular-nums font-semibold text-destructive"><CurrencyDisplay amount={inv.outstanding} /></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="mt-4 flex justify-end">
						<button onclick={handleWriteOff} disabled={!selectedWriteOff || processing}
							class="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
							{processing ? 'Writing off...' : 'Write Off'}
						</button>
					</div>
				</div>

			{:else if activeTab === 'refund-debtor'}
				<div class="rounded-xl bg-surface-container-lowest p-5">
					<p class="mb-4 text-sm text-muted-foreground">Select the debtor to whom you wish to refund any overpayment or clearing of a credit note. Then click Continue.</p>
					<div class="max-h-72 overflow-auto">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 w-8"></th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Code</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Category</th>
									<th class="px-3 py-2 text-center font-medium text-muted-foreground">Hold</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Phone</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Owing</th>
								</tr>
							</thead>
							<tbody>
								{#each data.debtors as d}
									<tr
										class="cursor-pointer transition-colors {selectedDebtorCode === d.code ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-surface-container-low'}"
										onclick={() => { selectedDebtorCode = d.code; refundAmount = Math.abs(d.owing); }}
									>
										<td class="px-3 py-1.5"><input type="radio" checked={selectedDebtorCode === d.code} class="accent-primary" /></td>
										<td class="px-3 py-1.5 font-mono text-xs">{d.code}</td>
										<td class="px-3 py-1.5 font-medium">{d.name}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{d.category}</td>
										<td class="px-3 py-1.5 text-center">{#if d.hold}<span class="text-amber-500 text-xs">HOLD</span>{/if}</td>
										<td class="px-3 py-1.5 text-muted-foreground">{d.phone}</td>
										<td class="px-3 py-1.5 text-right tabular-nums font-semibold"><CurrencyDisplay amount={d.owing} /></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					{#if selectedDebtor}
						<div class="mt-4 flex items-center justify-between rounded-xl bg-surface-container-low p-4">
							<div class="space-y-1.5">
								<label class="text-sm font-medium">Refund Amount</label>
								<input type="number" bind:value={refundAmount} step="0.01" min="0"
									class="w-32 rounded-xl bg-surface-container-lowest px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
							</div>
							<button onclick={handleRefundDebtor} disabled={refundAmount <= 0 || processing}
								class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
								{processing ? 'Processing...' : 'Send Refund'}
							</button>
						</div>
					{/if}
				</div>

			{:else if activeTab === 'refund-creditor'}
				<div class="rounded-xl bg-surface-container-lowest p-5">
					<p class="mb-4 text-sm text-muted-foreground">Select the creditor from whom you have received reimbursement of an overpayment. You should already have entered a credit note for the creditor to match the receipt.</p>
					<div class="max-h-72 overflow-auto">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 w-8"></th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Code</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Category</th>
									<th class="px-3 py-2 text-center font-medium text-muted-foreground">Hold</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Phone</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Owed</th>
								</tr>
							</thead>
							<tbody>
								{#if data.creditors.length === 0}
									<tr><td colspan="7" class="px-3 py-8 text-center text-muted-foreground">No creditors with credit balances</td></tr>
								{:else}
									{#each data.creditors as c}
										<tr
											class="cursor-pointer transition-colors {selectedCreditorCode === c.code ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-surface-container-low'}"
											onclick={() => { selectedCreditorCode = c.code; refundAmount = Math.abs(c.owed); }}
										>
											<td class="px-3 py-1.5"><input type="radio" checked={selectedCreditorCode === c.code} class="accent-primary" /></td>
											<td class="px-3 py-1.5 font-mono text-xs">{c.code}</td>
											<td class="px-3 py-1.5 font-medium">{c.name}</td>
											<td class="px-3 py-1.5 text-muted-foreground">{c.category}</td>
											<td class="px-3 py-1.5 text-center">{#if c.hold}<span class="text-amber-500 text-xs">HOLD</span>{/if}</td>
											<td class="px-3 py-1.5 text-muted-foreground">{c.phone}</td>
											<td class="px-3 py-1.5 text-right tabular-nums font-semibold"><CurrencyDisplay amount={c.owed} /></td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
					{#if selectedCreditor}
						<div class="mt-4 flex items-center justify-between rounded-xl bg-surface-container-low p-4">
							<div class="space-y-1.5">
								<label class="text-sm font-medium">Refund Amount</label>
								<input type="number" bind:value={refundAmount} step="0.01" min="0"
									class="w-32 rounded-xl bg-surface-container-lowest px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
							</div>
							<button onclick={handleRefundCreditor} disabled={refundAmount <= 0 || processing}
								class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
								{processing ? 'Processing...' : 'Receive Refund'}
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title={confirmTitle} confirmLabel="Confirm" onConfirm={executeConfirmed}>
	{confirmMessage}
</ConfirmDialog>
