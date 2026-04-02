<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function selectPO(ref: string) {
		goto(`/receive-goods?po=${encodeURIComponent(ref)}`, { invalidateAll: true });
	}

	function backToList() {
		goto('/receive-goods', { invalidateAll: true });
	}

	const poColumns = [
		{ key: 'ref', label: 'PO #', mono: true },
		{ key: 'name', label: 'Supplier', class: 'font-medium' },
		{ key: 'description', label: 'Description', class: 'text-muted-foreground' },
		{ key: 'date', label: 'Date', class: 'text-muted-foreground' },
		{ key: 'dueDate', label: 'Expected', class: 'text-muted-foreground' },
		{ key: 'gross', label: 'Value', align: 'right' as const }
	];

	const totalLineValue = $derived(data.poLines.reduce((s: number, l: any) => s + l.gross, 0));
</script>

<div class="flex h-full flex-col">
	{#if !data.poHeader}
		<!-- PO LIST VIEW -->
		<PageHeader title="Receive Goods" subtitle="{data.orders.length} open purchase orders" />

		<div class="flex-1 overflow-auto p-6">
			<DataTable columns={poColumns} rows={data.orders} emptyMessage="No open purchase orders">
				{#snippet cell({ column, row, value })}
					{#if column.key === 'ref'}
						<button
							onclick={() => selectPO(row.ref)}
							class="font-mono text-primary hover:underline"
						>
							{value}
						</button>
					{:else if column.key === 'gross'}
						<span class="font-semibold"><CurrencyDisplay amount={value} /></span>
					{:else}
						{value ?? ''}
					{/if}
				{/snippet}
			</DataTable>
		</div>
	{:else}
		<!-- PO DETAIL VIEW -->
		<PageHeader
			title="Receive Against PO {data.poHeader.ref}"
			subtitle="{data.poHeader.name} — {data.poHeader.date}"
		>
			<div class="flex gap-2">
				<button
					onclick={backToList}
					class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm hover:bg-surface-container-low/80"
				>
					Back to List
				</button>
			</div>
		</PageHeader>

		<div class="flex-1 overflow-auto p-6">
			<!-- PO Summary -->
			<div class="mb-6 grid grid-cols-3 gap-4">
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<div class="text-xs text-muted-foreground">PO Value</div>
					<div class="mt-1 text-lg font-semibold"><CurrencyDisplay amount={data.poHeader.gross} /></div>
				</div>
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<div class="text-xs text-muted-foreground">Line Items</div>
					<div class="mt-1 text-lg font-semibold">{data.poLines.length}</div>
				</div>
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<div class="text-xs text-muted-foreground">Status</div>
					<div class="mt-1 text-lg font-semibold">
						<span class="rounded bg-amber-500/20 px-2 py-0.5 text-sm text-amber-700 dark:text-amber-400">
							{data.poHeader.status === 'E' ? 'Entered' : data.poHeader.status}
						</span>
					</div>
				</div>
			</div>

			<!-- Line Items -->
			<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Order Lines</h3>
			<div class="overflow-auto rounded-xl bg-surface-container-lowest">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr class="bg-surface-container-low">
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Item</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Qty</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Unit Price</th>
							<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
							<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Tax</th>
						</tr>
					</thead>
					<tbody>
						{#if data.poLines.length === 0}
							<tr><td colspan="6" class="px-3 py-8 text-center text-muted-foreground">No line items</td></tr>
						{:else}
							{#each data.poLines as line}
								<tr class="hover:bg-surface-container-low transition-colors">
									<td class="px-3 py-2 font-mono text-xs">{line.stockCode || '—'}</td>
									<td class="px-3 py-2">{line.description}</td>
									<td class="px-3 py-2 text-right">{line.qty}</td>
									<td class="px-3 py-2 text-right"><CurrencyDisplay amount={line.unitPrice} /></td>
									<td class="px-3 py-2 text-right font-medium"><CurrencyDisplay amount={line.gross} /></td>
									<td class="px-3 py-2 text-xs text-muted-foreground">{line.taxCode}</td>
								</tr>
							{/each}
							<tr class="bg-surface-container-low font-bold">
								<td class="px-3 py-2.5" colspan="4">Total</td>
								<td class="px-3 py-2.5 text-right"><CurrencyDisplay amount={totalLineValue} /></td>
								<td class="px-3 py-2.5"></td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
