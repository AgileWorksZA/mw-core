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
	let nameCode = $state('');
	let customerName = $state('');
	let description = $state('');
	let transDate = $state(new Date().toISOString().split('T')[0]);
	let dueDate = $state(new Date().toISOString().split('T')[0]);
	let colour = $state(0);
	let orderType = $state<'SO' | 'QU'>('SO');
	let processStage = $state('enter');
	let holdOrder = $state(false);
	let submitting = $state(false);
	let confirmOpen = $state(false);

	// Order lines
	let orderLines = $state<Array<{
		itemCode: string; orderQty: number; soh: number; shipQty: number;
		boQty: number; done: boolean; description: string; unitPrice: number;
		unit: string; discount: number; extension: number; taxCode: string;
	}>>([
		{ itemCode: '', orderQty: 0, soh: 0, shipQty: 0, boQty: 0, done: false, description: '', unitPrice: 0, unit: '', discount: 0, extension: 0, taxCode: '' }
	]);

	// Tabs
	let activeTab = $state('all');
	const tabs = [
		{ id: 'all', label: 'All Order Lines' },
		{ id: 'backorders', label: 'Backorders' }
	];

	// Derived
	const subtotal = $derived(orderLines.reduce((s, l) => s + l.extension, 0));
	const backorderLines = $derived(orderLines.filter((l) => l.boQty > 0));
	const visibleLines = $derived(activeTab === 'backorders' ? backorderLines : orderLines);
	const isValid = $derived(nameCode !== '' && subtotal > 0);

	$effect(() => {
		if (nameCode) {
			const cust = data.customers.find((c) => c.code === nameCode);
			if (cust) customerName = cust.name;
		}
	});

	function addLine() {
		orderLines = [...orderLines, { itemCode: '', orderQty: 0, soh: 0, shipQty: 0, boQty: 0, done: false, description: '', unitPrice: 0, unit: '', discount: 0, extension: 0, taxCode: '' }];
	}

	function removeLine(index: number) {
		orderLines = orderLines.filter((_, i) => i !== index);
	}

	function onItemSelect(index: number) {
		const line = orderLines[index];
		const prod = data.products.find((p) => p.code === line.itemCode);
		if (prod) {
			line.description = prod.description;
			line.unitPrice = prod.sellPrice;
			line.unit = prod.unit;
			line.soh = prod.stockOnHand;
			if (prod.taxCode) line.taxCode = prod.taxCode;
			recalcLine(index);
		}
		orderLines = [...orderLines];
	}

	function recalcLine(index: number) {
		const line = orderLines[index];
		line.extension = Math.round(line.orderQty * line.unitPrice * (1 - (line.discount || 0) / 100) * 100) / 100;
		// Auto-calc ship and backorder
		line.shipQty = Math.min(line.orderQty, line.soh);
		line.boQty = Math.max(0, line.orderQty - line.shipQty);
		orderLines = [...orderLines];
	}

	async function handleSubmit() {
		confirmOpen = false;
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const lines = orderLines.filter((l) => l.itemCode && l.orderQty > 0);
			const res = await fetch('/orders/sales/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nameCode, transDate, dueDate, description, colour,
					orderType, processStage,
					orderLines: lines.map((l) => ({
						itemCode: l.itemCode, orderQty: l.orderQty, shipQty: l.shipQty,
						description: l.description, unitPrice: l.unitPrice,
						discount: l.discount, taxCode: l.taxCode, done: l.done
					}))
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to create order');
				return;
			}
			showToast(`${orderType === 'QU' ? 'Quote' : 'Sales Order'} created successfully`, 'success');
			await goto('/orders/sales');
		} catch (err: any) {
			showError(err.message || 'Failed to create order');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="New {orderType === 'QU' ? 'Quote' : 'Sales Order'}" subtitle="Order Entry">
		<a href="/orders/sales" class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Sales Orders</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-5xl space-y-6">
			<!-- Header Fields -->
			<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
				<!-- Order Type toggle -->
				<div class="flex items-center gap-4">
					<div class="flex rounded-xl bg-surface-container-low p-0.5">
						<button onclick={() => { orderType = 'SO'; }} class="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors {orderType === 'SO' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}">Sales Order</button>
						<button onclick={() => { orderType = 'QU'; }} class="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors {orderType === 'QU' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}">Quote</button>
					</div>
					<label class="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
						<input type="checkbox" bind:checked={holdOrder} class="h-4 w-4 rounded accent-primary" />
						Hold
					</label>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Customer</label>
						<select bind:value={nameCode} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
							<option value="">Select customer...</option>
							{#each data.customers as cust}
								<option value={cust.code}>{cust.code}: {cust.name}</option>
							{/each}
						</select>
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">To</label>
						<input type="text" bind:value={customerName} placeholder="Customer name" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Description</label>
						<input type="text" bind:value={description} placeholder="Order description" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">Date</label>
						<input type="date" bind:value={transDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>

					<div class="space-y-1.5">
						<label class="text-sm font-medium">{orderType === 'QU' ? 'Expires' : 'Due Date'}</label>
						<input type="date" bind:value={dueDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
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

			<!-- Order Lines -->
			<div class="rounded-xl bg-surface-container-lowest">
				<div class="border-b border-outline-variant/15 px-5 pt-3">
					<TabStrip {tabs} bind:activeTab />
				</div>

				<div class="p-5">
					<div class="overflow-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Item</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-16">Order</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-14">SOH</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-14">Ship</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-14">B/O</th>
									<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-12">Done</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Unit Price</th>
									<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-10">per</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-14">Disc.%</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Extension</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-20">TC</th>
									{#if activeTab === 'all'}<th class="px-3 py-2.5 w-8"></th>{/if}
								</tr>
							</thead>
							<tbody>
								{#each visibleLines as line, i}
									{@const realIndex = activeTab === 'backorders' ? orderLines.indexOf(line) : i}
									<tr class="hover:bg-surface-container-low transition-colors">
										<td class="px-2 py-1.5">
											<select bind:value={line.itemCode} onchange={() => onItemSelect(realIndex)} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
												<option value="">Select...</option>
												{#each data.products as prod}
													<option value={prod.code}>{prod.code}: {prod.description}</option>
												{/each}
											</select>
										</td>
										<td class="px-2 py-1.5">
											<input type="number" bind:value={line.orderQty} step="1" min="0" onchange={() => recalcLine(realIndex)} class="w-16 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
										</td>
										<td class="px-2 py-1.5 text-right text-xs text-muted-foreground tabular-nums">{line.soh}</td>
										<td class="px-2 py-1.5">
											<input type="number" bind:value={line.shipQty} step="1" min="0" max={line.orderQty} class="w-14 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
										</td>
										<td class="px-2 py-1.5 text-right text-xs tabular-nums {line.boQty > 0 ? 'text-amber-600 font-semibold' : 'text-muted-foreground'}">{line.boQty}</td>
										<td class="px-2 py-1.5 text-center">
											<input type="checkbox" bind:checked={line.done} class="h-4 w-4 rounded accent-primary" />
										</td>
										<td class="px-2 py-1.5">
											<input type="text" bind:value={line.description} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
										</td>
										<td class="px-2 py-1.5">
											<input type="number" bind:value={line.unitPrice} step="0.01" min="0" onchange={() => recalcLine(realIndex)} class="w-24 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
										</td>
										<td class="px-2 py-1.5 text-center text-xs text-muted-foreground">{line.unit || '-'}</td>
										<td class="px-2 py-1.5">
											<input type="number" bind:value={line.discount} step="0.5" min="0" max="100" onchange={() => recalcLine(realIndex)} class="w-14 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
										</td>
										<td class="px-2 py-1.5 text-right text-sm font-semibold tabular-nums">{line.extension.toFixed(2)}</td>
										<td class="px-2 py-1.5">
											<select bind:value={line.taxCode} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
												<option value="">-</option>
												{#each data.taxCodes as tc}
													<option value={tc.code}>{tc.code}: {tc.description}</option>
												{/each}
											</select>
										</td>
										{#if activeTab === 'all'}
											<td class="px-2 py-1.5">
												{#if orderLines.length > 1}
													<button onclick={() => removeLine(realIndex)} class="text-muted-foreground hover:text-destructive text-xs">&times;</button>
												{/if}
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
							<tfoot>
								<tr class="bg-surface-container-low">
									<td colspan="10" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Subtotal</td>
									<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={subtotal} /></td>
									<td colspan="2"></td>
								</tr>
							</tfoot>
						</table>
					</div>
					{#if activeTab === 'all'}
						<button onclick={addLine} class="mt-3 text-sm text-primary hover:underline">+ Add line</button>
					{/if}
				</div>
			</div>

			<!-- Process Order + Submit -->
			<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-5">
				<div class="flex items-center gap-4">
					{#if orderType === 'SO'}
						<div class="space-y-1">
							<div class="text-xs font-medium text-muted-foreground uppercase">Process Order</div>
							<select bind:value={processStage} class="rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring">
								<option value="enter">Enter Order</option>
								<option value="deposit">Receive deposit for order</option>
								<option value="ship">Ship goods with invoice</option>
							</select>
						</div>
					{/if}
					<div class="text-sm text-muted-foreground">
						Order total: <span class="font-semibold text-foreground"><CurrencyDisplay amount={subtotal} /></span>
						{#if backorderLines.length > 0}
							<span class="ml-2 text-amber-600">{backorderLines.length} backorder line(s)</span>
						{/if}
					</div>
				</div>
				<div class="flex gap-2">
					<a href="/orders/sales" class="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Cancel</a>
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!isValid || submitting}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating...' : orderType === 'QU' ? 'Create Quote' : 'Create Order'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Create {orderType === 'QU' ? 'Quote' : 'Sales Order'}" confirmLabel="Create" onConfirm={handleSubmit}>
	Create a {orderType === 'QU' ? 'quote' : 'sales order'} for <strong><CurrencyDisplay amount={subtotal} /></strong>
	to <strong>{customerName || nameCode}</strong>
	with {orderLines.filter((l) => l.itemCode && l.orderQty > 0).length} line(s)?
</ConfirmDialog>
