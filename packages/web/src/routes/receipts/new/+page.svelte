<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TabStrip from '$lib/components/TabStrip.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Header fields
	let isCustomerMode = $state(false);
	let nameCode = $state('');
	let bankAccount = $state('');
	let fromName = $state('');
	let description = $state('');
	let transDate = $state(new Date().toISOString().split('T')[0]);
	let amount = $state(0);
	let paidBy = $state(0);
	let colour = $state(0);
	let submitting = $state(false);
	let confirmOpen = $state(false);

	// Tab state
	let activeTab = $state('by-account');
	const baseTabs = [
		{ id: 'by-account', label: 'By Account' },
		{ id: 'by-item', label: 'By Item' }
	];
	const allTabs = $derived(
		isCustomerMode
			? [...baseTabs, { id: 'payment-on-invoice', label: 'Payment on Invoice' }]
			: baseTabs
	);

	// By Account detail lines
	let detailLines = $state<Array<{ account: string; description: string; net: number; taxCode: string; tax: number; gross: number }>>([
		{ account: '', description: '', net: 0, taxCode: '', tax: 0, gross: 0 }
	]);

	// By Item detail lines
	let itemLines = $state<Array<{ itemCode: string; qty: number; description: string; unitPrice: number; unit: string; discount: number; extension: number; taxCode: string }>>([
		{ itemCode: '', qty: 0, description: '', unitPrice: 0, unit: '', discount: 0, extension: 0, taxCode: '' }
	]);

	// Outstanding invoices (loaded when customer selected)
	let outstandingInvoices = $state<Array<{
		seq: number; invoice: string; order: string; description: string;
		date: string; gross: number; outstanding: number; pay: number;
	}>>([]);
	let loadingInvoices = $state(false);

	// Derived values
	const selectedBank = $derived(data.bankAccounts.find((b) => b.code === bankAccount));
	const allocationTotal = $derived(outstandingInvoices.reduce((s, inv) => s + (inv.pay || 0), 0));
	const detailTotal = $derived(detailLines.reduce((s, l) => s + (l.gross || 0), 0));
	const itemTotal = $derived(itemLines.reduce((s, l) => s + (l.extension || 0), 0));
	const allocationError = $derived(allocationTotal > amount && amount > 0 ? 'Allocation total exceeds the receipt amount' : '');
	const hasDetailData = $derived(
		(activeTab === 'by-account' && detailTotal > 0) ||
		(activeTab === 'by-item' && itemTotal > 0) ||
		(isCustomerMode && allocationTotal > 0)
	);
	const isValid = $derived(
		bankAccount !== '' &&
		amount > 0 &&
		(isCustomerMode ? nameCode !== '' && allocationTotal > 0 && !allocationError : hasDetailData)
	);

	// When customer checkbox toggled off, switch tab back
	$effect(() => {
		if (!isCustomerMode && activeTab === 'payment-on-invoice') {
			activeTab = 'by-account';
		}
	});

	// Auto-populate fromName when customer selected
	$effect(() => {
		if (isCustomerMode && nameCode) {
			const cust = data.customers.find((c) => c.code === nameCode);
			if (cust) fromName = cust.name;
		}
	});

	async function fetchOutstandingInvoices() {
		if (!nameCode) return;
		loadingInvoices = true;
		try {
			const res = await fetch(`/api/outstanding-invoices?nameCode=${encodeURIComponent(nameCode)}&type=customer`);
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

	function handleCustomerSelect() {
		if (isCustomerMode && nameCode) {
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

	function addItemLine() {
		itemLines = [...itemLines, { itemCode: '', qty: 0, description: '', unitPrice: 0, unit: '', discount: 0, extension: 0, taxCode: '' }];
	}

	function removeItemLine(index: number) {
		itemLines = itemLines.filter((_, i) => i !== index);
	}

	function onItemSelect(index: number) {
		const line = itemLines[index];
		const prod = data.products.find((p) => p.code === line.itemCode);
		if (prod) {
			line.description = prod.description;
			line.unitPrice = prod.sellPrice;
			line.unit = prod.unit;
			if (prod.taxCode) line.taxCode = prod.taxCode;
			recalcItemLine(index);
		}
		itemLines = [...itemLines];
	}

	function recalcItemLine(index: number) {
		const line = itemLines[index];
		line.extension = Math.round(line.qty * line.unitPrice * (1 - (line.discount || 0) / 100) * 100) / 100;
		itemLines = [...itemLines];
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
			const allocations = isCustomerMode
				? outstandingInvoices.filter((inv) => inv.pay > 0).map((inv) => ({
					invoice: inv.invoice, amount: inv.pay, seq: inv.seq
				}))
				: [];

			const lines = !isCustomerMode && activeTab === 'by-account'
				? detailLines.filter((l) => l.account && l.gross > 0)
				: [];

			const items = !isCustomerMode && activeTab === 'by-item'
				? itemLines.filter((l) => l.itemCode && l.qty > 0)
				: [];

			const res = await fetch('/receipts/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nameCode: isCustomerMode ? nameCode : '',
					bankAccount, amount, transDate, description, paidBy, colour,
					isCustomerMode,
					allocations,
					detailLines: lines,
					itemLines: items
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to create receipt');
				return;
			}
			showToast('Receipt created successfully', 'success');
			await goto('/receipts');
		} catch (err: any) {
			showError(err.message || 'Failed to create receipt');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="New Receipt" subtitle="Cash Receipt / Customer Payment">
		<a href="/receipts" class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Receipts</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-4xl space-y-6">
			<!-- Header Fields -->
			<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
				<!-- Customer toggle row -->
				<div class="flex items-center gap-4">
					<label class="flex items-center gap-2 text-sm font-medium cursor-pointer">
						<input type="checkbox" bind:checked={isCustomerMode} class="h-4 w-4 rounded accent-primary" />
						Customer
					</label>
					{#if isCustomerMode}
						<div class="flex-1">
							<select
								bind:value={nameCode}
								onchange={handleCustomerSelect}
								class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="">Select customer...</option>
								{#each data.customers as cust}
									<option value={cust.code}>{cust.code}: {cust.name}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>

				<!-- Main fields grid -->
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
						<label class="text-sm font-medium">From</label>
						<input type="text" bind:value={fromName} placeholder="Received from..." class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
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
						<label class="text-sm font-medium">Description</label>
						<input type="text" bind:value={description} placeholder={isCustomerMode ? 'Auto-populated from invoices' : 'Description'} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

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
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
						<!-- By Account detail lines -->
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
						<!-- By Item detail lines -->
						<div class="overflow-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="bg-surface-container-low">
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Item</th>
										<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-16">Qty</th>
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
										<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Unit Price</th>
										<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-12">per</th>
										<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-16">Disc.%</th>
										<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Extension</th>
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-24">TC</th>
										<th class="px-3 py-2.5 w-10"></th>
									</tr>
								</thead>
								<tbody>
									{#each itemLines as line, i}
										<tr class="hover:bg-surface-container-low transition-colors">
											<td class="px-2 py-1.5">
												<select bind:value={line.itemCode} onchange={() => onItemSelect(i)} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
													<option value="">Select...</option>
													{#each data.products as prod}
														<option value={prod.code}>{prod.code}: {prod.description}</option>
													{/each}
												</select>
											</td>
											<td class="px-2 py-1.5">
												<input type="number" bind:value={line.qty} step="1" min="0" onchange={() => recalcItemLine(i)} class="w-16 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
											</td>
											<td class="px-2 py-1.5">
												<input type="text" bind:value={line.description} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
											</td>
											<td class="px-2 py-1.5">
												<input type="number" bind:value={line.unitPrice} step="0.01" min="0" onchange={() => recalcItemLine(i)} class="w-24 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
											</td>
											<td class="px-2 py-1.5 text-center text-xs text-muted-foreground">{line.unit || '-'}</td>
											<td class="px-2 py-1.5">
												<input type="number" bind:value={line.discount} step="0.5" min="0" max="100" onchange={() => recalcItemLine(i)} class="w-16 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
											</td>
											<td class="px-2 py-1.5 text-right text-sm font-semibold tabular-nums">{line.extension.toFixed(2)}</td>
											<td class="px-2 py-1.5">
												<select bind:value={line.taxCode} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
													<option value="">None</option>
													{#each data.taxCodes as tc}
														<option value={tc.code}>{tc.code}: {tc.description}</option>
													{/each}
												</select>
											</td>
											<td class="px-2 py-1.5">
												{#if itemLines.length > 1}
													<button onclick={() => removeItemLine(i)} class="text-muted-foreground hover:text-destructive text-xs">&times;</button>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
								<tfoot>
									<tr class="bg-surface-container-low">
										<td colspan="6" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Total</td>
										<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={itemTotal} /></td>
										<td colspan="2"></td>
									</tr>
								</tfoot>
							</table>
						</div>
						<button onclick={addItemLine} class="mt-3 text-sm text-primary hover:underline">+ Add item</button>

					{:else if activeTab === 'payment-on-invoice'}
						<!-- Payment on Invoice allocation grid -->
						{#if loadingInvoices}
							<div class="flex h-24 items-center justify-center text-muted-foreground text-sm">Loading outstanding invoices...</div>
						{:else if outstandingInvoices.length === 0}
							<div class="flex h-24 items-center justify-center text-muted-foreground text-sm">
								{nameCode ? 'No outstanding invoices found for this customer' : 'Select a customer to see outstanding invoices'}
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
											<tr class="hover:bg-surface-container-low transition-colors {inv.pay > 0 ? 'bg-green-50 dark:bg-green-950/20' : ''}">
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
					{#if isCustomerMode && allocationTotal > 0}
						Allocating <span class="font-semibold text-foreground"><CurrencyDisplay amount={allocationTotal} /></span>
						of <span class="font-semibold text-foreground"><CurrencyDisplay amount={amount} /></span>
						against {outstandingInvoices.filter((i) => i.pay > 0).length} invoice(s)
					{:else if !isCustomerMode && (detailTotal > 0 || itemTotal > 0)}
						Detail total: <span class="font-semibold text-foreground"><CurrencyDisplay amount={activeTab === 'by-item' ? itemTotal : detailTotal} /></span>
					{/if}
				</div>
				<div class="flex gap-2">
					<a href="/receipts" class="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Cancel</a>
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!isValid || submitting}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating...' : 'Create Receipt'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Create Receipt" confirmLabel="Create" onConfirm={handleSubmit}>
	Create a receipt for <strong><CurrencyDisplay amount={amount} /></strong>
	{#if isCustomerMode}
		from <strong>{fromName || nameCode}</strong>
		allocating against {outstandingInvoices.filter((i) => i.pay > 0).length} invoice(s)
	{/if}
	into <strong>{selectedBank?.description || bankAccount}</strong>?
	This will be auto-posted in MoneyWorks.
</ConfirmDialog>
