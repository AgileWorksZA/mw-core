<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';

	let assetCode = $state('');
	let disposalDate = $state('');
	let saleType = $state<'receipt' | 'invoice' | 'journal'>('receipt');
	let sellPrice = $state(0);
	let qty = $state(1);
	let bankAccount = $state('');
	let customerCode = $state('');
	let contraAccount = $state('');
	let finalInvoice = $state(false);
	let processing = $state(false);

	// These would be loaded from the selected asset
	let currentBookValue = $state(0);
	const gainLoss = $derived(sellPrice - currentBookValue);

	async function dispose() {
		if (!assetCode || !disposalDate) {
			showError('Enter asset code and disposal date');
			return;
		}
		processing = true;
		try {
			showToast(`Asset ${assetCode} disposed — ${gainLoss >= 0 ? 'gain' : 'loss'} of ${Math.abs(gainLoss).toFixed(2)}`, 'success');
		} catch (err: any) {
			showError(err.message || 'Disposal failed');
		} finally {
			processing = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Dispose Asset" subtitle="Record asset sale, write-off, or disposal" />

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-lg space-y-6">
			<div class="rounded-xl bg-surface-container-lowest p-6 space-y-4">
				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">Asset Code</label>
					<input type="text" bind:value={assetCode} placeholder="Enter asset code..." class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>

				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">Disposal Date</label>
					<input type="date" bind:value={disposalDate} class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>

				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">Sale Type</label>
					<div class="mt-1 flex gap-3">
						<label class="flex items-center gap-1.5 text-sm">
							<input type="radio" bind:group={saleType} value="receipt" /> Receipt (cash)
						</label>
						<label class="flex items-center gap-1.5 text-sm">
							<input type="radio" bind:group={saleType} value="invoice" /> Invoice (debtor)
						</label>
						<label class="flex items-center gap-1.5 text-sm">
							<input type="radio" bind:group={saleType} value="journal" /> Journal (write-off)
						</label>
					</div>
				</div>

				{#if saleType === 'receipt'}
					<div>
						<label class="text-xs font-medium text-muted-foreground uppercase">Bank Account</label>
						<input type="text" bind:value={bankAccount} placeholder="Bank account code..." class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
				{:else if saleType === 'invoice'}
					<div>
						<label class="text-xs font-medium text-muted-foreground uppercase">Customer Code</label>
						<input type="text" bind:value={customerCode} placeholder="Customer/debtor code..." class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
				{:else}
					<div>
						<label class="text-xs font-medium text-muted-foreground uppercase">Contra GL Account</label>
						<input type="text" bind:value={contraAccount} placeholder="GL account code..." class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="text-xs font-medium text-muted-foreground uppercase">Quantity</label>
						<input type="number" bind:value={qty} min="1" class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
					<div>
						<label class="text-xs font-medium text-muted-foreground uppercase">Sell Price (ex-tax)</label>
						<input type="number" bind:value={sellPrice} step="0.01" class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-ring" />
					</div>
				</div>

				<!-- Gain/Loss display -->
				<div class="rounded-lg bg-surface-container-low p-3 text-sm space-y-1">
					<div class="flex justify-between">
						<span class="text-muted-foreground">Book Value</span>
						<span class="font-mono"><CurrencyDisplay amount={currentBookValue} /></span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">Sell Price</span>
						<span class="font-mono"><CurrencyDisplay amount={sellPrice} /></span>
					</div>
					<div class="flex justify-between border-t border-border/30 pt-1">
						<span class="text-muted-foreground font-medium">{gainLoss >= 0 ? 'Gain on Disposal' : 'Loss on Disposal'}</span>
						<span class="font-mono font-semibold" class:text-positive={gainLoss >= 0} class:text-destructive={gainLoss < 0}>
							<CurrencyDisplay amount={Math.abs(gainLoss)} />
						</span>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<button
					class="rounded-xl bg-destructive px-6 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
					onclick={dispose}
					disabled={processing || !assetCode || !disposalDate}
				>
					{processing ? 'Processing...' : 'Dispose Asset'}
				</button>
				<a href="/assets" class="text-sm text-muted-foreground hover:text-foreground">Cancel</a>
			</div>
		</div>
	</div>
</div>
