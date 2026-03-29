<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TabStrip from '$lib/components/TabStrip.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Header fields
	let isSupplierMode = $state(false);
	let nameCode = $state('');
	let bankAccount = $state('');
	let toName = $state('');
	let description = $state('');
	let transDate = $state(new Date().toISOString().split('T')[0]);
	let amount = $state(0);
	let paidBy = $state(0);
	let colour = $state(0);
	let chequeRef = $state('');
	let submitting = $state(false);
	let confirmOpen = $state(false);

	// Tab state
	let activeTab = $state('by-account');
	const baseTabs = [
		{ id: 'by-account', label: 'By Account' },
		{ id: 'by-item', label: 'By Item' }
	];
	const allTabs = $derived(
		isSupplierMode
			? [...baseTabs, { id: 'payment-on-invoice', label: 'Payment on Invoice' }]
			: baseTabs
	);

	// By Account detail lines
	let detailLines = $state<Array<{ account: string; description: string; net: number; taxCode: string; tax: number; gross: number }>>([
		{ account: '', description: '', net: 0, taxCode: '', tax: 0, gross: 0 }
	]);

	// Outstanding invoices
	let outstandingInvoices = $state<Array<{
		seq: number; invoice: string; order: string; description: string;
		date: string; gross: number; outstanding: number; pay: number;
	}>>([]);
	let loadingInvoices = $state(false);

	// Derived
	const selectedBank = $derived(data.bankAccounts.find((b) => b.code === bankAccount));
	const allocationTotal = $derived(outstandingInvoices.reduce((s, inv) => s + (inv.pay || 0), 0));
	const detailTotal = $derived(detailLines.reduce((s, l) => s + (l.gross || 0), 0));
	const allocationError = $derived(allocationTotal > amount && amount > 0 ? 'Allocation total exceeds the payment amount' : '');
	const isValid = $derived(
		bankAccount !== '' &&
		amount > 0 &&
		(isSupplierMode ? nameCode !== '' && allocationTotal > 0 && !allocationError : detailTotal > 0)
	);

	$effect(() => {
		if (!isSupplierMode && activeTab === 'payment-on-invoice') {
			activeTab = 'by-account';
		}
	});

	$effect(() => {
		if (isSupplierMode && nameCode) {
			const sup = data.suppliers.find((s) => s.code === nameCode);
			if (sup) toName = sup.name;
		}
	});

	async function fetchOutstandingInvoices() {
		if (!nameCode) return;
		loadingInvoices = true;
		try {
			const res = await fetch(`/api/outstanding-invoices?nameCode=${encodeURIComponent(nameCode)}&type=supplier`);
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to fetch invoices');
				return;
			}
			outstandingInvoices = (result.invoices ?? []).map((inv: any) => ({ ...inv, pay: 0 }));
			if (outstandingInvoices.length > 0) {
				activeTab = 'payment-on-invoice';
			}
		} catch (err: any) {
			showError(err.message || 'Failed to fetch invoices');
		} finally {
			loadingInvoices = false;
		}
	}

	function handleSupplierSelect() {
		if (isSupplierMode && nameCode) {
			fetchOutstandingInvoices();
		}
	}

	function addDetailLine() {
		detailLines = [...detailLines, { account: '', description: '', net: 0, taxCode: '', tax: 0, gross: 0 }];
	}

	function removeDetailLine(index: number) {
		detailLines = detailLines.filter((_, i) => i !== index);
	}

	function updateLineTax(index: number) {
		const line = detailLines[index];
		const tc = data.taxCodes.find((t) => t.code === line.taxCode);
		if (tc) {
			line.tax = Math.round(line.net * tc.rate) / 100;
			line.gross = Math.round((line.net + line.tax) * 100) / 100;
		} else {
			line.tax = 0;
			line.gross = line.net;
		}
		detailLines = [...detailLines];
	}

	function autoDistribute() {
		let remaining = amount;
		for (let i = 0; i < outstandingInvoices.length; i++) {
			if (remaining <= 0) {
				outstandingInvoices[i].pay = 0;
			} else {
				const toPay = Math.min(remaining, outstandingInvoices[i].outstanding);
				outstandingInvoices[i].pay = Math.round(toPay * 100) / 100;
				remaining = Math.round((remaining - toPay) * 100) / 100;
			}
		}
		outstandingInvoices = [...outstandingInvoices];
	}

	async function handleSubmit() {
		confirmOpen = false;
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const allocations = isSupplierMode
				? outstandingInvoices.filter((inv) => inv.pay > 0).map((inv) => ({
					invoice: inv.invoice, amount: inv.pay, seq: inv.seq
				}))
				: [];

			const lines = !isSupplierMode
				? detailLines.filter((l) => l.account && l.gross > 0)
				: [];

			const res = await fetch('/payments/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nameCode: isSupplierMode ? nameCode : '',
					bankAccount, amount, transDate, description, paidBy, colour,
					isSupplierMode,
					allocations,
					detailLines: lines
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to create payment');
				return;
			}
			showToast('Payment created successfully', 'success');
			await goto('/payments');
		} catch (err: any) {
			showError(err.message || 'Failed to create payment');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="New Payment" subtitle="Supplier Payment / Cash Payment">
		<a href="/payments" class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Payments</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-4xl space-y-6">
			<!-- Header Fields -->
			<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
				<div class="flex items-center gap-4">
					<label class="flex items-center gap-2 text-sm font-medium cursor-pointer">
						<input type="checkbox" bind:checked={isSupplierMode} class="h-4 w-4 rounded accent-primary" />
						Supplier
					</label>
					{#if isSupplierMode}
						<div class="flex-1">
							<select
								bind:value={nameCode}
								onchange={handleSupplierSelect}
								class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="">Select supplier...</option>
								{#each data.suppliers as sup}
									<option value={sup.code}>{sup.code}: {sup.name}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Bank</label>
						<select bind:value={bankAccount} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value="">Select bank...</option>
							{#each data.bankAccounts as bank}
								<option value={bank.code}>{bank.code}: {bank.description}</option>
							{/each}
						</select>
						{#if selectedBank}
							<div class="text-xs text-muted-foreground">Balance: <span class="font-semibold"><CurrencyDisplay amount={selectedBank.balance} /></span></div>
						{/if}
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">To</label>
						<input type="text" bind:value={toName} placeholder="Pay to..." class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Amount</label>
						<input type="number" bind:value={amount} step="0.01" min="0" placeholder="0.00" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring font-semibold" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Date</label>
						<input type="date" bind:value={transDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Cheque #</label>
						<input type="text" bind:value={chequeRef} placeholder="Reference number" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Description</label>
						<input type="text" bind:value={description} placeholder={isSupplierMode ? 'Auto-populated from invoices' : 'Description'} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Paid By</label>
						<select bind:value={paidBy} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value={0}>None</option>
							<option value={1}>Cash</option>
							<option value={2}>Cheque</option>
							<option value={3}>Credit Card</option>
							<option value={4}>Direct Debit</option>
							<option value={5}>EFTPOS</option>
						</select>
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Colour</label>
						<select bind:value={colour} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value={0}>None</option>
							<option value={1}>Red</option>
							<option value={2}>Orange</option>
							<option value={3}>Yellow</option>
							<option value={4}>Green</option>
							<option value={5}>Blue</option>
							<option value={6}>Purple</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Tabs -->
			<div class="rounded-xl bg-surface-container-lowest">
				<div class="border-b border-outline-variant/15 px-5 pt-3">
					<TabStrip tabs={allTabs} bind:activeTab />
				</div>

				<div class="p-5">
					{#if activeTab === 'by-account'}
						<div class="overflow-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="bg-surface-container-low">
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Account</th>
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
										<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Net</th>
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-24">Tax Code</th>
										<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Tax</th>
										<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
										<th class="px-3 py-2.5 w-10"></th>
									</tr>
								</thead>
								<tbody>
									{#each detailLines as line, i}
										<tr class="hover:bg-surface-container-low transition-colors">
											<td class="px-2 py-1.5">
												<select bind:value={line.account} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
													<option value="">Select...</option>
													{#each data.accounts as acct}
														<option value={acct.code}>{acct.code}: {acct.description}</option>
													{/each}
												</select>
											</td>
											<td class="px-2 py-1.5">
												<input type="text" bind:value={line.description} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Line description" />
											</td>
											<td class="px-2 py-1.5">
												<input type="number" bind:value={line.net} step="0.01" min="0" onchange={() => updateLineTax(i)} class="w-24 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
											</td>
											<td class="px-2 py-1.5">
												<select bind:value={line.taxCode} onchange={() => updateLineTax(i)} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
													<option value="">None</option>
													{#each data.taxCodes as tc}
														<option value={tc.code}>{tc.code}: {tc.description}</option>
													{/each}
												</select>
											</td>
											<td class="px-2 py-1.5 text-right text-sm text-muted-foreground tabular-nums">{line.tax.toFixed(2)}</td>
											<td class="px-2 py-1.5 text-right text-sm font-semibold tabular-nums">{line.gross.toFixed(2)}</td>
											<td class="px-2 py-1.5">
												{#if detailLines.length > 1}
													<button onclick={() => removeDetailLine(i)} class="text-muted-foreground hover:text-destructive text-xs">&times;</button>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr class="bg-surface-container-low">
										<td colspan="5" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Total</td>
										<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={detailTotal} /></td>
										<td></td>
									</tr>
								</tfoot>
							</table>
						</div>
						<button onclick={addDetailLine} class="mt-3 text-sm text-primary hover:underline">+ Add line</button>

					{:else if activeTab === 'by-item'}
						<div class="flex h-24 items-center justify-center text-muted-foreground text-sm">
							Item-based entry not yet available. Use the By Account tab.
						</div>

					{:else if activeTab === 'payment-on-invoice'}
						{#if loadingInvoices}
							<div class="flex h-24 items-center justify-center text-muted-foreground text-sm">Loading outstanding invoices...</div>
						{:else if outstandingInvoices.length === 0}
							<div class="flex h-24 items-center justify-center text-muted-foreground text-sm">
								{nameCode ? 'No outstanding invoices found for this supplier' : 'Select a supplier to see outstanding invoices'}
							</div>
						{:else}
							<div class="mb-3 flex items-center justify-between">
								<div class="text-sm text-muted-foreground">
									{outstandingInvoices.length} outstanding invoice{outstandingInvoices.length !== 1 ? 's' : ''}
								</div>
								<button onclick={autoDistribute} disabled={amount <= 0} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm font-medium hover:bg-surface transition-colors disabled:opacity-40">
									Auto Distribute
								</button>
							</div>

							<div class="overflow-auto">
								<table class="w-full text-sm">
									<thead>
										<tr class="bg-surface-container-low">
											<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Invoice</th>
											<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Order</th>
											<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
											<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
											<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Gross</th>
											<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Outstanding</th>
											<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Pay</th>
										</tr>
									</thead>
									<tbody>
										{#each outstandingInvoices as inv, i}
											<tr class="hover:bg-surface-container-low transition-colors {inv.pay > 0 ? 'bg-blue-50 dark:bg-blue-950/20' : ''}">
												<td class="px-3 py-2 font-mono text-xs">{inv.invoice}</td>
												<td class="px-3 py-2 font-mono text-xs text-muted-foreground">{inv.order || '-'}</td>
												<td class="px-3 py-2 text-muted-foreground max-w-xs truncate">{inv.description}</td>
												<td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
												<td class="px-3 py-2 text-right tabular-nums"><CurrencyDisplay amount={inv.gross} /></td>
												<td class="px-3 py-2 text-right tabular-nums font-semibold text-destructive"><CurrencyDisplay amount={inv.outstanding} /></td>
												<td class="px-2 py-1.5">
													<input
														type="number"
														step="0.01"
														min="0"
														max={inv.outstanding}
														bind:value={inv.pay}
														class="w-28 rounded-xl bg-surface-container-low px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-ring"
														placeholder="0.00"
													/>
												</td>
											</tr>
										{/each}
									</tbody>
									<tfoot>
										<tr class="bg-surface-container-low">
											<td colspan="6" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Allocation Total</td>
											<td class="px-3 py-2 text-right text-sm font-bold tabular-nums">
												<span class={allocationError ? 'text-destructive' : 'text-positive'}>
													<CurrencyDisplay amount={allocationTotal} />
												</span>
											</td>
										</tr>
									</tfoot>
								</table>
							</div>

							{#if allocationError}
								<div class="mt-2 text-sm text-destructive">{allocationError}</div>
							{/if}
						{/if}
					{/if}
				</div>
			</div>

			<!-- Summary + Submit -->
			<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-5">
				<div class="text-sm text-muted-foreground">
					{#if isSupplierMode && allocationTotal > 0}
						Allocating <span class="font-semibold text-foreground"><CurrencyDisplay amount={allocationTotal} /></span>
						of <span class="font-semibold text-foreground"><CurrencyDisplay amount={amount} /></span>
						against {outstandingInvoices.filter((i) => i.pay > 0).length} invoice(s)
					{:else if !isSupplierMode && detailTotal > 0}
						Detail total: <span class="font-semibold text-foreground"><CurrencyDisplay amount={detailTotal} /></span>
					{/if}
				</div>
				<div class="flex gap-2">
					<a href="/payments" class="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Cancel</a>
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!isValid || submitting}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating...' : 'Create Payment'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Create Payment" confirmLabel="Create" onConfirm={handleSubmit}>
	Create a payment for <strong><CurrencyDisplay amount={amount} /></strong>
	{#if isSupplierMode}
		to <strong>{toName || nameCode}</strong>
		allocating against {outstandingInvoices.filter((i) => i.pay > 0).length} invoice(s)
	{/if}
	from <strong>{selectedBank?.description || bankAccount}</strong>?
	This will be auto-posted in MoneyWorks.
</ConfirmDialog>
