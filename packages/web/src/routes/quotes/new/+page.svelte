<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let nameCode = $state('');
	let customerName = $state('');
	let description = $state('');
	let transDate = $state(new Date().toISOString().split('T')[0]);
	let expiresDate = $state('');
	let colour = $state(0);
	let submitting = $state(false);
	let confirmOpen = $state(false);

	let lines = $state<Array<{
		itemCode: string; qty: number; description: string; unitPrice: number;
		unit: string; discount: number; extension: number; taxCode: string;
	}>>([
		{ itemCode: '', qty: 0, description: '', unitPrice: 0, unit: '', discount: 0, extension: 0, taxCode: '' }
	]);

	const subtotal = $derived(lines.reduce((s, l) => s + l.extension, 0));
	const isValid = $derived(nameCode !== '' && subtotal > 0);

	$effect(() => {
		if (nameCode) {
			const cust = data.customers.find((c) => c.code === nameCode);
			if (cust) customerName = cust.name;
		}
	});

	function addLine() {
		lines = [...lines, { itemCode: '', qty: 0, description: '', unitPrice: 0, unit: '', discount: 0, extension: 0, taxCode: '' }];
	}

	function removeLine(index: number) {
		lines = lines.filter((_, i) => i !== index);
	}

	function onItemSelect(index: number) {
		const line = lines[index];
		const prod = data.products.find((p) => p.code === line.itemCode);
		if (prod) {
			line.description = prod.description;
			line.unitPrice = prod.sellPrice;
			line.unit = prod.unit;
			if (prod.taxCode) line.taxCode = prod.taxCode;
			recalcLine(index);
		}
		lines = [...lines];
	}

	function recalcLine(index: number) {
		const line = lines[index];
		line.extension = Math.round(line.qty * line.unitPrice * (1 - (line.discount || 0) / 100) * 100) / 100;
		lines = [...lines];
	}

	async function handleSubmit() {
		confirmOpen = false;
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const validLines = lines.filter((l) => l.itemCode && l.qty > 0);
			const res = await fetch('/quotes/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nameCode, transDate, expiresDate, description, colour,
					lines: validLines.map((l) => ({
						itemCode: l.itemCode, qty: l.qty, description: l.description,
						unitPrice: l.unitPrice, discount: l.discount, taxCode: l.taxCode
					}))
				})
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Failed to create quote');
				return;
			}
			showToast('Quote created successfully', 'success');
			await goto('/quotes');
		} catch (err: any) {
			showError(err.message || 'Failed to create quote');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="New Quote" subtitle="Customer Quote">
		<a href="/quotes" class="text-sm text-muted-foreground hover:text-foreground">&larr; Back to Quotes</a>
	</PageHeader>

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-5xl space-y-6">
			<div class="rounded-xl bg-surface-container-lowest p-5 space-y-4">
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
						<input type="text" bind:value={customerName} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Description</label>
						<input type="text" bind:value={description} placeholder="Quote description" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Quote Date</label>
						<input type="date" bind:value={transDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div class="space-y-1.5">
						<label class="text-sm font-medium">Expires</label>
						<input type="date" bind:value={expiresDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
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

			<!-- Line Items -->
			<div class="rounded-xl bg-surface-container-lowest p-5">
				<div class="overflow-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="bg-surface-container-low">
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Item</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-16">Qty</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Unit Price</th>
								<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-10">per</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-14">Disc.%</th>
								<th class="px-3 py-2.5 text-right font-medium text-muted-foreground w-24">Extension</th>
								<th class="px-3 py-2.5 text-left font-medium text-muted-foreground w-20">TC</th>
								<th class="px-3 py-2.5 w-8"></th>
							</tr>
						</thead>
						<tbody>
							{#each lines as line, i}
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
										<input type="number" bind:value={line.qty} step="1" min="0" onchange={() => recalcLine(i)} class="w-16 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5">
										<input type="text" bind:value={line.description} class="w-full rounded-lg bg-surface-container-low px-2 py-1 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5">
										<input type="number" bind:value={line.unitPrice} step="0.01" min="0" onchange={() => recalcLine(i)} class="w-24 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
									</td>
									<td class="px-2 py-1.5 text-center text-xs text-muted-foreground">{line.unit || '-'}</td>
									<td class="px-2 py-1.5">
										<input type="number" bind:value={line.discount} step="0.5" min="0" max="100" onchange={() => recalcLine(i)} class="w-14 rounded-lg bg-surface-container-low px-2 py-1 text-right text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
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
									<td class="px-2 py-1.5">
										{#if lines.length > 1}
											<button onclick={() => removeLine(i)} class="text-muted-foreground hover:text-destructive text-xs">&times;</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
						<tfoot>
							<tr class="bg-surface-container-low">
								<td colspan="6" class="px-3 py-2 text-right text-sm font-medium text-muted-foreground">Subtotal</td>
								<td class="px-3 py-2 text-right text-sm font-bold tabular-nums"><CurrencyDisplay amount={subtotal} /></td>
								<td colspan="2"></td>
							</tr>
						</tfoot>
					</table>
				</div>
				<button onclick={addLine} class="mt-3 text-sm text-primary hover:underline">+ Add line</button>
			</div>

			<!-- Submit -->
			<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-5">
				<div class="text-sm text-muted-foreground">
					Quote total: <span class="font-semibold text-foreground"><CurrencyDisplay amount={subtotal} /></span>
				</div>
				<div class="flex gap-2">
					<a href="/quotes" class="rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Cancel</a>
					<button
						onclick={() => { confirmOpen = true; }}
						disabled={!isValid || submitting}
						class="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{submitting ? 'Creating...' : 'Create Quote'}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<ConfirmDialog bind:open={confirmOpen} title="Create Quote" confirmLabel="Create" onConfirm={handleSubmit}>
	Create a quote for <strong><CurrencyDisplay amount={subtotal} /></strong>
	to <strong>{customerName || nameCode}</strong>
	with {lines.filter((l) => l.itemCode && l.qty > 0).length} line(s)?
</ConfirmDialog>
