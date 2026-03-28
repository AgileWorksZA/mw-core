<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { showToast, showError } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let fromAccount = $state('');
	let toAccount = $state('');
	let amount = $state(0);
	let reference = $state('');
	let description = $state('');
	let transferDate = $state(new Date().toISOString().split('T')[0]);
	let submitting = $state(false);

	const fromBank = $derived(data.bankAccounts.find((b) => b.code === fromAccount));
	const toBank = $derived(data.bankAccounts.find((b) => b.code === toAccount));
	const isValid = $derived(fromAccount !== '' && toAccount !== '' && fromAccount !== toAccount && amount > 0);

	async function handleTransfer() {
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const res = await fetch('/funds-transfer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fromAccount, toAccount, amount, transferDate, reference, description })
			});
			const data = await res.json();
			if (!res.ok) {
				showError(data.error || 'Transfer failed');
				return;
			}
			showToast('Funds transfer completed successfully', 'success');
			// Reset form
			fromAccount = '';
			toAccount = '';
			amount = 0;
			reference = '';
			description = '';
			await invalidateAll();
		} catch (err: any) {
			showError(err.message || 'Transfer failed');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Funds Transfer" subtitle="Transfer between bank accounts" />

	<div class="flex-1 overflow-auto p-6">
		<div class="mx-auto max-w-lg space-y-6">
			<!-- From Account -->
			<div>
				<label class="mb-1.5 block text-sm font-medium">From Account</label>
				<select
					bind:value={fromAccount}
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<option value="">Select source account...</option>
					{#each data.bankAccounts as bank}
						<option value={bank.code} disabled={bank.code === toAccount}>
							{bank.code}: {bank.description} ({bank.type === 'CC' ? 'Credit Card' : 'Bank'})
						</option>
					{/each}
				</select>
				{#if fromBank}
					<div class="mt-1 text-sm text-muted-foreground">Balance: <span class="font-semibold"><CurrencyDisplay amount={fromBank.balance} /></span></div>
				{/if}
			</div>

			<!-- Arrow -->
			<div class="flex justify-center">
				<svg class="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" />
				</svg>
			</div>

			<!-- To Account -->
			<div>
				<label class="mb-1.5 block text-sm font-medium">To Account</label>
				<select
					bind:value={toAccount}
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<option value="">Select destination account...</option>
					{#each data.bankAccounts as bank}
						<option value={bank.code} disabled={bank.code === fromAccount}>
							{bank.code}: {bank.description} ({bank.type === 'CC' ? 'Credit Card' : 'Bank'})
						</option>
					{/each}
				</select>
				{#if toBank}
					<div class="mt-1 text-sm text-muted-foreground">Balance: <span class="font-semibold"><CurrencyDisplay amount={toBank.balance} /></span></div>
				{/if}
			</div>

			<!-- Amount -->
			<div>
				<label class="mb-1.5 block text-sm font-medium">Amount</label>
				<input
					type="number"
					bind:value={amount}
					step="0.01"
					min="0"
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					placeholder="0.00"
				/>
			</div>

			<!-- Date + Reference -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="mb-1.5 block text-sm font-medium">Date</label>
					<input
						type="date"
						bind:value={transferDate}
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium">Reference</label>
					<input
						type="text"
						bind:value={reference}
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						placeholder="Optional"
					/>
				</div>
			</div>

			<!-- Description -->
			<div>
				<label class="mb-1.5 block text-sm font-medium">Description</label>
				<input
					type="text"
					bind:value={description}
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					placeholder="Funds transfer"
				/>
			</div>

			<!-- Preview -->
			{#if isValid}
				<div class="rounded-lg border border-border bg-muted/30 p-4">
					<div class="text-sm font-medium text-muted-foreground mb-2">Transfer Preview</div>
					<div class="flex items-center justify-between text-sm">
						<span>{fromBank?.description} ({fromAccount})</span>
						<span class="font-mono text-destructive">-<CurrencyDisplay amount={amount} /></span>
					</div>
					<div class="flex items-center justify-between text-sm mt-1">
						<span>{toBank?.description} ({toAccount})</span>
						<span class="font-mono text-green-600">+<CurrencyDisplay amount={amount} /></span>
					</div>
				</div>
			{/if}

			<!-- Submit -->
			<button
				onclick={handleTransfer}
				disabled={!isValid || submitting}
				class="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{submitting ? 'Transferring...' : 'Transfer Funds'}
			</button>
		</div>
	</div>
</div>
