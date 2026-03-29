<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { showToast } from '$lib/stores/toast';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Setup state
	let statementDate = $state(new Date().toISOString().split('T')[0]);
	let statementNumber = $state('');
	let openingBalanceInput = $state(0);
	let closingBalance = $state(0);
	let setupComplete = $state(false);
	let confirmFinishOpen = $state(false);

	// Reconciliation state (client-side)
	let reconciledSet = $state(new Set<number>());

	function selectBank(code: string) {
		reconciledSet = new Set();
		closingBalance = 0;
		setupComplete = false;
		goto(`/bank-reconciliation?bank=${code}`, { invalidateAll: true });
	}

	function startReconciliation() {
		setupComplete = true;
	}

	function toggleReconciled(seq: number) {
		const next = new Set(reconciledSet);
		if (next.has(seq)) next.delete(seq);
		else next.add(seq);
		reconciledSet = next;
	}

	function startOver() {
		reconciledSet = new Set();
	}

	function finishLater() {
		showToast('Reconciliation progress saved for later', 'success');
		setupComplete = false;
	}

	function handleFinish() {
		confirmFinishOpen = false;
		showToast(`Bank reconciliation completed. ${reconciledSet.size} transactions reconciled.`, 'success');
		reconciledSet = new Set();
		setupComplete = false;
	}

	// Computed reconciliation values
	const reconciledTxs = $derived(data.transactions.filter((t) => reconciledSet.has(t.seq)));
	const unreconciledTxs = $derived(data.transactions.filter((t) => !reconciledSet.has(t.seq)));
	const processedDeposits = $derived(reconciledTxs.reduce((s, t) => s + t.deposit, 0));
	const processedWithdrawals = $derived(reconciledTxs.reduce((s, t) => s + t.withdrawal, 0));
	const amountProcessed = $derived(processedDeposits - processedWithdrawals);
	const openingBalance = $derived(setupComplete ? openingBalanceInput : (data.selectedBank?.balance ?? 0));
	const calculatedClosing = $derived(openingBalance + amountProcessed);
	const difference = $derived(Math.round((calculatedClosing - closingBalance) * 100) / 100);
	const isBalanced = $derived(Math.abs(difference) < 0.01);
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="font-headline text-xl font-bold">Bank Reconciliation</h1>
		{#if data.selectedBank}
			<p class="text-sm text-muted-foreground">{data.selectedBank.code}: {data.selectedBank.description}</p>
		{:else}
			<p class="text-sm text-muted-foreground">Select a bank account to reconcile</p>
		{/if}
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if !data.bankCode}
			<!-- Phase 1: Bank account selector -->
			<div class="mx-auto max-w-lg space-y-3">
				<h2 class="font-headline text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Bank Account</h2>
				{#each data.bankAccounts as bank}
					<button
						onclick={() => selectBank(bank.code)}
						class="flex w-full items-center justify-between rounded-xl bg-surface-container-lowest p-4 text-left transition-colors hover:bg-surface-container-low"
					>
						<div>
							<div class="font-medium">{bank.description}</div>
							<div class="text-sm text-muted-foreground font-mono">{bank.code} — {bank.type === 'CC' ? 'Credit Card' : 'Bank Account'}</div>
						</div>
						<div class="text-lg font-bold"><CurrencyDisplay amount={bank.balance} /></div>
					</button>
				{/each}
			</div>

		{:else if !setupComplete}
			<!-- Phase 2: Setup dialog -->
			<div class="mx-auto max-w-lg">
				<div class="rounded-xl bg-surface-container-lowest p-6 space-y-4">
					<h2 class="text-lg font-semibold font-headline">Reconciliation Setup</h2>
					<p class="text-sm text-muted-foreground">{data.selectedBank?.code}: {data.selectedBank?.description}</p>

					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label class="text-sm font-medium">Statement Date</label>
							<input type="date" bind:value={statementDate} class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
						</div>
						<div class="space-y-1.5">
							<label class="text-sm font-medium">Statement Number</label>
							<input type="text" bind:value={statementNumber} placeholder="Optional" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
						</div>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div class="space-y-1.5">
							<label class="text-sm font-medium">Opening Balance</label>
							<input type="number" bind:value={openingBalanceInput} step="0.01" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
							<div class="text-xs text-muted-foreground">Previous closing balance</div>
						</div>
						<div class="space-y-1.5">
							<label class="text-sm font-medium">Closing Balance</label>
							<input type="number" bind:value={closingBalance} step="0.01" class="w-full rounded-xl bg-surface-container-low px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-ring" />
							<div class="text-xs text-muted-foreground">From bank statement</div>
						</div>
					</div>

					<div class="flex gap-2 pt-2">
						<button onclick={() => selectBank('')} class="flex-1 rounded-xl bg-surface-container-low px-4 py-2.5 text-sm hover:bg-surface transition-colors">Change Bank</button>
						<button
							onclick={startReconciliation}
							disabled={closingBalance === 0}
							class="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Start Reconciliation
						</button>
					</div>
				</div>
			</div>

		{:else}
			<!-- Phase 3: Dual-panel reconciliation -->
			<div class="space-y-4">
				<!-- Summary bar -->
				<div class="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4">
					<div class="flex gap-6 text-sm">
						<div><span class="text-muted-foreground">Opening:</span> <span class="font-semibold"><CurrencyDisplay amount={openingBalance} /></span></div>
						<div><span class="text-muted-foreground">Processed:</span> <span class="font-semibold"><CurrencyDisplay amount={amountProcessed} /></span></div>
						<div><span class="text-muted-foreground">Calc Close:</span> <span class="font-semibold"><CurrencyDisplay amount={calculatedClosing} /></span></div>
						<div><span class="text-muted-foreground">Stmt Close:</span> <span class="font-semibold"><CurrencyDisplay amount={closingBalance} /></span></div>
						<div>
							<span class="text-muted-foreground">Difference:</span>
							<span class="ml-1 font-bold {isBalanced ? 'text-positive' : 'text-destructive'}"><CurrencyDisplay amount={difference} /></span>
						</div>
					</div>
					<div class="flex gap-2">
						<button onclick={startOver} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm hover:bg-surface transition-colors">Start Over</button>
						<button onclick={finishLater} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm hover:bg-surface transition-colors">Finish Later</button>
						<button
							onclick={() => { confirmFinishOpen = true; }}
							disabled={!isBalanced}
							class="rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Finish
						</button>
					</div>
				</div>

				<!-- Top panel: Reconciled items -->
				<div class="rounded-xl bg-surface-container-lowest">
					<div class="border-b border-outline-variant/15 px-5 py-3 flex items-center justify-between">
						<h3 class="text-sm font-semibold font-headline">Reconciled ({reconciledTxs.length})</h3>
						<span class="text-sm text-muted-foreground">
							Deposits: <span class="text-positive font-semibold"><CurrencyDisplay amount={processedDeposits} /></span>
							Withdrawals: <span class="text-destructive font-semibold"><CurrencyDisplay amount={processedWithdrawals} /></span>
						</span>
					</div>
					<div class="max-h-64 overflow-auto">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 text-left font-medium text-muted-foreground w-20">Type</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Ref</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Deposit</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Withdrawal</th>
									<th class="px-3 py-2 w-10"></th>
								</tr>
							</thead>
							<tbody>
								{#if reconciledTxs.length === 0}
									<tr><td colspan="7" class="px-3 py-6 text-center text-muted-foreground">No items reconciled yet. Check transactions below to match them.</td></tr>
								{:else}
									{#each reconciledTxs as t}
										<tr class="hover:bg-surface-container-low transition-colors bg-positive/5">
											<td class="px-3 py-1.5"><span class="text-xs font-medium {t.type === 'Receipt' ? 'text-positive' : 'text-destructive'}">{t.type}</span></td>
											<td class="px-3 py-1.5 text-muted-foreground">{t.date}</td>
											<td class="px-3 py-1.5 font-mono text-xs">{t.ref}</td>
											<td class="px-3 py-1.5 text-muted-foreground max-w-xs truncate">{t.description || t.name}</td>
											<td class="px-3 py-1.5 text-right tabular-nums">{#if t.deposit > 0}<span class="text-positive"><CurrencyDisplay amount={t.deposit} /></span>{/if}</td>
											<td class="px-3 py-1.5 text-right tabular-nums">{#if t.withdrawal > 0}<span class="text-destructive"><CurrencyDisplay amount={t.withdrawal} /></span>{/if}</td>
											<td class="px-3 py-1.5 text-center">
												<button onclick={() => toggleReconciled(t.seq)} class="text-xs text-muted-foreground hover:text-destructive">&times;</button>
											</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>

				<!-- Bottom panel: Unreconciled items -->
				<div class="rounded-xl bg-surface-container-lowest">
					<div class="border-b border-outline-variant/15 px-5 py-3">
						<h3 class="text-sm font-semibold font-headline">Unreconciled ({unreconciledTxs.length})</h3>
					</div>
					<div class="max-h-96 overflow-auto">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2 text-center font-medium text-muted-foreground w-12">OK</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground w-20">Type</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Ref</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
									<th class="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2 text-right font-medium text-muted-foreground">Amount</th>
								</tr>
							</thead>
							<tbody>
								{#if unreconciledTxs.length === 0}
									<tr><td colspan="7" class="px-3 py-6 text-center text-muted-foreground">All transactions reconciled</td></tr>
								{:else}
									{#each unreconciledTxs as t}
										<tr class="hover:bg-surface-container-low transition-colors cursor-pointer" onclick={() => toggleReconciled(t.seq)}>
											<td class="px-3 py-1.5 text-center">
												<input type="checkbox" checked={false} onclick={(e) => e.stopPropagation()} onchange={() => toggleReconciled(t.seq)} class="h-4 w-4 rounded accent-primary" />
											</td>
											<td class="px-3 py-1.5"><span class="text-xs font-medium {t.type === 'Receipt' ? 'text-positive' : 'text-destructive'}">{t.type}</span></td>
											<td class="px-3 py-1.5 text-muted-foreground">{t.date}</td>
											<td class="px-3 py-1.5 font-mono text-xs">{t.ref}</td>
											<td class="px-3 py-1.5">{t.name}</td>
											<td class="px-3 py-1.5 max-w-xs truncate text-muted-foreground">{t.description}</td>
											<td class="px-3 py-1.5 text-right tabular-nums font-semibold {t.deposit > 0 ? 'text-positive' : 'text-destructive'}">
												<CurrencyDisplay amount={t.deposit > 0 ? t.deposit : -t.withdrawal} />
											</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<ConfirmDialog bind:open={confirmFinishOpen} title="Finish Reconciliation" confirmLabel="Finish" onConfirm={handleFinish}>
	Complete the bank reconciliation for <strong>{data.selectedBank?.description}</strong>?
	<br/>{reconciledTxs.length} transactions will be marked as reconciled.
	<br/>Difference: <strong><CurrencyDisplay amount={difference} /></strong>
</ConfirmDialog>
