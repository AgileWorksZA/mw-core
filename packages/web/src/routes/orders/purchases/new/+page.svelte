<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let nameCode = $state('');
	let supplierName = $state('');
	let description = $state('');
	let transDate = $state(new Date().toISOString().split('T')[0]);
	let dueDate = $state('');
	let colour = $state(0);
	let submitting = $state(false);
	let confirmOpen = $state(false);

	let orderLines = $state<Array<{
		itemCode: string; description: string; qty: number;
		unitPrice: number; taxCode: string;
	}>>([
		{ itemCode: '', description: '', qty: 1, unitPrice: 0, taxCode: '' }
	]);

	const lineTotal = $derived(orderLines.reduce((s, l) => s + l.qty * l.unitPrice, 0));
	const isValid = $derived(nameCode !== '' && lineTotal > 0);

	$effect(() => {
		if (nameCode) {
			const sup = data.suppliers.find((s) => s.code === nameCode);
			if (sup) supplierName = sup.name;
		}
	});

	function addLine() {
		orderLines = [...orderLines, { itemCode: '', description: '', qty: 1, unitPrice: 0, taxCode: '' }];
	}

	function removeLine(index: number) {
		orderLines = orderLines.filter((_, i) => i !== index);
	}

	function onItemSelect(index: number) {
		const line = orderLines[index];
		const prod = data.products.find((p) => p.code === line.itemCode);
		if (prod) {
			line.description = prod.description;
			line.unitPrice = prod.costPrice;
			if (prod.taxCode) line.taxCode = prod.taxCode;
			orderLines = [...orderLines];
		}
	}

	async function handleSubmit() {
		confirmOpen = false;
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const lines = orderLines.filter((l) => l.itemCode && l.qty > 0);
			const res = await fetch('/orders/purchases/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nameCode, transDate, dueDate, description, colour, orderLines: lines
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to create purchase order');
				return;
			}
			showToast('Purchase order created successfully', 'success');
			await goto('/orders/purchases');
		} catch (err: any) {
			showError(err.message || 'Failed to create purchase order');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="New Purchase Order" subtitle="Order from Supplier">
		<a href="/orders/purchases" class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Purchase Orders</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-4xl space-y-6">
			<!-- Header -->
			<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Supplier</label>
						<select bind:value={nameCode} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value="">Select supplier...</option>
							{#each data.suppliers as sup}
								<option value={sup.code}>{sup.code}: {sup.name}</option>
							{/each}
						</select>
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Supplier Name</label>
						<input type="text" bind:value={supplierName} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Date</label>
						<input type="date" bind:value={transDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Expected Delivery</label>
						<input type="date" bind:value={dueDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Description</label>
						<input type="text" bind:value={description} placeholder="Order description" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Colour</label>
						<select bind:value={colour} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value={0}>None</option>
							<option value={1}>Red</option><option value={2}>Orange</option><option value={3}>Yellow</option>
							<option value={4}>Green</option><option value={5}>Blue</option><option value={6}>Purple</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Order Lines -->
			<div class="rounded-xl bg-surface-container-lowest">
				<div class="border-b border-outline-variant/15 px-5 py-3">
					<h3 class="text-sm font-semibold font-headline">Order Lines</h3>
				</div>
				<div class="p-5 overflow-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Item</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-16">Qty</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Unit Cost</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-24">Tax Code</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Extension</th>
								<th class="px-3 py-2.5 w-10"></th>
							</tr>
						</thead>
						<tbody>
							{#each orderLines as line, i}
								<tr class="hover:bg-surface-container-low transition-colors">
									<td class="px-2 py-1.5">
										<select bind:value={line.itemCode} onchange={() => onItemSelect(i)} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
											<option value="">—</option>
											{#each data.products as p}
												<option value={p.code}>{p.code}: {p.description}</option>
											{/each}
										</select>
									</td>
									<td class="px-2 py-1.5">
										<input type="text" bind:value={line.description} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5">
										<input type="number" bind:value={line.qty} min="1" step="1" class="w-16 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5">
										<input type="number" bind:value={line.unitPrice} step="0.01" min="0" class="w-24 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5">
										<select bind:value={line.taxCode} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
											<option value="">None</option>
											{#each data.taxCodes as tc}
												<option value={tc.code}>{tc.code}: {tc.description}</option>
											{/each}
										</select>
									</td>
									<td class="px-2 py-1.5 text-right text-sm font-semibold tabular-nums">{(line.qty * line.unitPrice).toFixed(2)}</td>
									<td class="px-2 py-1.5">
										{#if orderLines.length > 1}
											<button onclick={() => removeLine(i)} class="text-muted-foreground hover:text-destructive text-xs">&times;</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="bg-surface-container-low">
								<td colspan="5" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Total</td>
								<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={lineTotal} /></td>
								<td></td>
							</tr>
						</tfoot>
					</table>
					<button onclick={addLine} class="mt-3 text-sm text-primary hover:underline">+ Add line</button>
				</div>
			</div>

			<!-- Submit -->
			<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-5">
				<div class="text-sm text-muted-foreground">
					{#if lineTotal > 0}
						Order total: <span class="font-semibold text-foreground"><CurrencyDisplay amount={lineTotal} /></span>
					{/if}
				</div>
				<div class="flex gap-2">
					<a href="/orders/purchases" class="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Cancel</a>
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!isValid || submitting}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating...' : 'Create Purchase Order'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Create Purchase Order" confirmLabel="Create" onConfirm={handleSubmit}>
	Create a purchase order for <strong><CurrencyDisplay amount={lineTotal} /></strong>
	from <strong>{supplierName || nameCode}</strong>?
</ConfirmDialog>
