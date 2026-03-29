<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Header fields
	let nameCode = $state('');
	let invoiceRef = $state('');
	let orderRef = $state('');
	let fromName = $state('');
	let description = $state('');
	let transDate = $state(new Date().toISOString().split('T')[0]);
	let dueDate = $state('');
	let colour = $state(0);
	let submitting = $state(false);
	let confirmOpen = $state(false);

	// Detail lines
	let detailLines = $state<Array<{ account: string; description: string; net: number; taxCode: string; tax: number; gross: number }>>([
		{ account: '', description: '', net: 0, taxCode: '', tax: 0, gross: 0 }
	]);

	// Derived
	const detailTotal = $derived(detailLines.reduce((s, l) => s + (l.gross || 0), 0));
	const detailTax = $derived(detailLines.reduce((s, l) => s + (l.tax || 0), 0));
	const detailNet = $derived(detailLines.reduce((s, l) => s + (l.net || 0), 0));
	const isValid = $derived(nameCode !== '' && detailTotal > 0);

	$effect(() => {
		if (nameCode) {
			const sup = data.suppliers.find((s) => s.code === nameCode);
			if (sup) fromName = sup.name;
		}
	});

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

	async function handleSubmit() {
		confirmOpen = false;
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const lines = detailLines.filter((l) => l.account && l.gross > 0);
			const res = await fetch('/invoices/purchases/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nameCode, invoiceRef, orderRef, transDate, dueDate,
					description, colour, detailLines: lines
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to create purchase invoice');
				return;
			}
			showToast('Purchase invoice created successfully', 'success');
			await goto('/invoices/purchases');
		} catch (err: any) {
			showError(err.message || 'Failed to create purchase invoice');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="New Purchase Invoice" subtitle="Creditor Invoice">
		<a href="/invoices/purchases" class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Purchase Invoices</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-4xl space-y-6">
			<!-- Header Fields -->
			<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Creditor</label>
						<select bind:value={nameCode} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value="">Select creditor...</option>
							{#each data.suppliers as sup}
								<option value={sup.code}>{sup.code}: {sup.name}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">From</label>
						<input type="text" bind:value={fromName} placeholder="Supplier name" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Invoice #</label>
						<input type="text" bind:value={invoiceRef} placeholder="Supplier's invoice number" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Order #</label>
						<input type="text" bind:value={orderRef} placeholder="Internal order reference" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Date</label>
						<input type="date" bind:value={transDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Due Date</label>
						<input type="date" bind:value={dueDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Description</label>
						<input type="text" bind:value={description} placeholder="Invoice description" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
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

			<!-- Detail Lines -->
			<div class="rounded-xl bg-surface-container-lowest">
				<div class="border-b border-outline-variant/15 px-5 py-3">
					<h3 class="text-sm font-semibold font-headline">By Account</h3>
				</div>
				<div class="p-5">
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
									<td colspan="2" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Totals</td>
									<td class="px-3 py-2 text-right text-sm font-semibold tabular-nums"><CurrencyDisplay amount={detailNet} /></td>
									<td></td>
									<td class="px-3 py-2 text-right text-sm font-semibold tabular-nums"><CurrencyDisplay amount={detailTax} /></td>
									<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={detailTotal} /></td>
									<td></td>
								</tr>
							</tfoot>
						</table>
					</div>
					<button onclick={addDetailLine} class="mt-3 text-sm text-primary hover:underline">+ Add line</button>
				</div>
			</div>

			<!-- Summary + Submit -->
			<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-5">
				<div class="text-sm text-muted-foreground">
					{#if detailTotal > 0}
						Invoice total: <span class="font-semibold text-foreground"><CurrencyDisplay amount={detailTotal} /></span>
						(Net: <CurrencyDisplay amount={detailNet} /> + Tax: <CurrencyDisplay amount={detailTax} />)
					{/if}
				</div>
				<div class="flex gap-2">
					<a href="/invoices/purchases" class="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Cancel</a>
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!isValid || submitting}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating...' : 'Create Purchase Invoice'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Create Purchase Invoice" confirmLabel="Create" onConfirm={handleSubmit}>
	Create a purchase invoice for <strong><CurrencyDisplay amount={detailTotal} /></strong>
	from <strong>{fromName || nameCode}</strong>?
	{#if invoiceRef}
		Invoice #: <strong>{invoiceRef}</strong>
	{/if}
</ConfirmDialog>
