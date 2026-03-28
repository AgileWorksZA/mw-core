<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
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
	let confirmOpen = $state(false);

	const fromBank = $derived(data.bankAccounts.find((b) => b.code === fromAccount));
	const toBank = $derived(data.bankAccounts.find((b) => b.code === toAccount));
	const isValid = $derived(fromAccount !== '' && toAccount !== '' && fromAccount !== toAccount && amount > 0);

	async function handleTransfer() {
		confirmOpen = false;
		if (!isValid || submitting) return;
		submitting = true;
		try {
			const res = await fetch('/funds-transfer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fromAccount, toAccount, amount, transferDate, reference, description })
			});
			const result = await res.json();
			if (!res.ok) {
				showError(result.error || 'Transfer failed');
				return;
			}
			showToast('Funds transfer completed successfully', 'success');
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
			<div class="space-y-1.5">
				<Label>From Account</Label>
				<select bind:value={fromAccount} class="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring">
					<option value="">Select source account...</option>
					{#each data.bankAccounts as bank}
						<option value={bank.code} disabled={bank.code === toAccount}>{bank.code}: {bank.description} ({bank.type === 'CC' ? 'Credit Card' : 'Bank'})</option>
					{/each}
				</select>
				{#if fromBank}
					<div class="text-sm text-muted-foreground">Balance: <span class="font-semibold"><CurrencyDisplay amount={fromBank.balance} /></span></div>
				{/if}
			</div>

			<div class="flex justify-center">
				<svg class="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" />
				</svg>
			</div>

			<div class="space-y-1.5">
				<Label>To Account</Label>
				<select bind:value={toAccount} class="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring">
					<option value="">Select destination account...</option>
					{#each data.bankAccounts as bank}
						<option value={bank.code} disabled={bank.code === fromAccount}>{bank.code}: {bank.description} ({bank.type === 'CC' ? 'Credit Card' : 'Bank'})</option>
					{/each}
				</select>
				{#if toBank}
					<div class="text-sm text-muted-foreground">Balance: <span class="font-semibold"><CurrencyDisplay amount={toBank.balance} /></span></div>
				{/if}
			</div>

			<div class="space-y-1.5">
				<Label>Amount</Label>
				<Input type="number" bind:value={amount} step="0.01" min="0" placeholder="0.00" />
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-1.5">
					<Label>Date</Label>
					<Input type="date" bind:value={transferDate} />
				</div>
				<div class="space-y-1.5">
					<Label>Reference</Label>
					<Input type="text" bind:value={reference} placeholder="Optional" />
				</div>
			</div>

			<div class="space-y-1.5">
				<Label>Description</Label>
				<Input type="text" bind:value={description} placeholder="Funds transfer" />
			</div>

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

			<Button class="w-full" disabled={!isValid || submitting} onclick={() => { confirmOpen = true; }}>
				{submitting ? 'Transferring...' : 'Transfer Funds'}
			</Button>
		</div>
	</div>
</div>

<AlertDialog.Root bind:open={confirmOpen}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Confirm Transfer</AlertDialog.Title>
				<AlertDialog.Description>
					Transfer <strong><CurrencyDisplay amount={amount} /></strong> from
					<strong>{fromBank?.description}</strong> to <strong>{toBank?.description}</strong>?
					This will create a journal entry in MoneyWorks.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={handleTransfer}>Transfer</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
