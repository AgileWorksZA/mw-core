<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';

	let assetCode = $state('');
	let currentBookValue = $state(0);
	let newValue = $state(0);
	let newRate = $state(0);
	let processing = $state(false);

	const difference = $derived(newValue - currentBookValue);
	const isIncrease = $derived(difference > 0);

	async function revalue() {
		if (!assetCode || newValue <= 0) {
			showError('Enter asset code and new value');
			return;
		}
		processing = true;
		try {
			showToast(`Asset ${assetCode} revalued to ${newValue.toFixed(2)}`, 'success');
		} catch (err: any) {
			showError(err.message || 'Revaluation failed');
		} finally {
			processing = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Revalue Asset" subtitle="Adjust asset book value and depreciation rate" />

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-md space-y-6">
			<div class="rounded-xl bg-surface-container-lowest p-6 space-y-4">
				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">Asset Code</label>
					<input type="text" bind:value={assetCode} placeholder="Enter asset code..." class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>

				<div class="flex justify-between text-sm">
					<span class="text-muted-foreground">Current Book Value</span>
					<span class="font-mono"><CurrencyDisplay amount={currentBookValue} /></span>
				</div>

				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">New Value</label>
					<input type="number" bind:value={newValue} step="0.01" class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>

				<div>
					<label class="text-xs font-medium text-muted-foreground uppercase">New Depreciation Rate %</label>
					<input type="number" bind:value={newRate} step="0.1" class="mt-1 block w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm font-mono text-right focus:outline-none focus:ring-2 focus:ring-ring" />
				</div>

				{#if difference !== 0}
					<div class="rounded-lg bg-surface-container-low p-3 text-sm">
						<div class="flex justify-between">
							<span class="text-muted-foreground">{isIncrease ? 'Revaluation Increase' : 'Impairment Loss'}</span>
							<span class="font-mono font-semibold" class:text-positive={isIncrease} class:text-destructive={!isIncrease}>
								<CurrencyDisplay amount={Math.abs(difference)} />
							</span>
						</div>
						<div class="mt-2 text-xs text-muted-foreground">
							{#if isIncrease}
								Debit Asset Account, Credit Revaluation Surplus Reserve
							{:else}
								Debit Impairment Loss, Credit Asset Account
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				<button
					class="rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
					onclick={revalue}
					disabled={processing || !assetCode || newValue <= 0}
				>
					{processing ? 'Processing...' : 'Revalue Asset'}
				</button>
				<a href="/assets" class="text-sm text-muted-foreground hover:text-foreground">Cancel</a>
			</div>
		</div>
	</div>
</div>
