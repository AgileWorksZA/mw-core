<script lang="ts">
	import { goto } from '$app/navigation';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Reconciliation state (client-side)
	let reconciledSet = $state(new Set<number>());
	let closingBalance = $state(0);

	function selectBank(code: string) {
		reconciledSet = new Set();
		closingBalance = 0;
		goto(`/bank-reconciliation?bank=${code}`, { invalidateAll: true });
	}

	function toggleReconciled(seq: number) {
		const next = new Set(reconciledSet);
		if (next.has(seq)) next.delete(seq);
		else next.add(seq);
		reconciledSet = next;
	}

	function toggleAll() {
		if (reconciledSet.size === data.transactions.length) {
			reconciledSet = new Set();
		} else {
			reconciledSet = new Set(data.transactions.map((t) => t.seq));
		}
	}

	// Computed reconciliation values
	const processedDeposits = $derived(
		data.transactions.filter((t) => reconciledSet.has(t.seq)).reduce((s, t) => s + t.deposit, 0)
	);
	const processedWithdrawals = $derived(
		data.transactions.filter((t) => reconciledSet.has(t.seq)).reduce((s, t) => s + t.withdrawal, 0)
	);
	const amountProcessed = $derived(processedDeposits - processedWithdrawals);
	const openingBalance = $derived(data.selectedBank?.balance ?? 0);
	const calculatedClosing = $derived(openingBalance - amountProcessed);
	const difference = $derived(closingBalance - calculatedClosing);
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
		{:else}
			<!-- Phase 2: Reconciliation -->
			<div class="space-y-6">
				<!-- Summary panel -->
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
					<div class="rounded-xl bg-surface-container-lowest p-3 text-center">
						<div class="text-xs text-muted-foreground uppercase">Opening Balance</div>
						<div class="mt-1 font-bold"><CurrencyDisplay amount={openingBalance} /></div>
					</div>
					<div class="rounded-xl bg-surface-container-lowest p-3 text-center">
						<div class="text-xs text-muted-foreground uppercase">Processed</div>
						<div class="mt-1 font-bold"><CurrencyDisplay amount={amountProcessed} /></div>
					</div>
					<div class="rounded-xl bg-surface-container-lowest p-3 text-center">
						<div class="text-xs text-muted-foreground uppercase">Calculated Close</div>
						<div class="mt-1 font-bold"><CurrencyDisplay amount={calculatedClosing} /></div>
					</div>
					<div class="rounded-xl bg-surface-container-lowest p-3 text-center">
						<div class="text-xs text-muted-foreground uppercase">Statement Close</div>
						<input
							type="number"
							bind:value={closingBalance}
							step="0.01"
							class="mt-1 w-full rounded-xl bg-surface-container-low px-2 py-1 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>
					<div class="rounded-xl p-3 text-center {Math.abs(difference) < 0.01 ? 'bg-positive/5' : 'bg-destructive/5'}">
						<div class="text-xs text-muted-foreground uppercase">Difference</div>
						<div class="mt-1 font-bold" class:text-positive={Math.abs(difference) < 0.01} class:text-destructive={Math.abs(difference) >= 0.01}>
							<CurrencyDisplay amount={difference} />
						</div>
					</div>
				</div>

				<!-- Tick count -->
				<div class="flex items-center justify-between text-sm text-muted-foreground">
					<span>{reconciledSet.size} of {data.transactions.length} transactions reconciled</span>
					<div class="flex gap-2">
						<button onclick={() => selectBank('')} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm hover:bg-surface-container-low/80">Change Bank</button>
						<button onclick={toggleAll} class="rounded-xl bg-surface-container-low px-3 py-1.5 text-sm hover:bg-surface-container-low/80">
							{reconciledSet.size === data.transactions.length ? 'Untick All' : 'Tick All'}
						</button>
					</div>
				</div>

				<!-- Transactions table -->
				{#if data.transactions.length > 0}
					<div class="overflow-auto rounded-xl bg-surface-container-lowest">
						<table class="w-full text-sm">
							<thead class="sticky top-0">
								<tr class="bg-surface-container-lowest">
									<th class="px-3 py-2.5 text-center font-medium text-muted-foreground w-10">OK</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Date</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Ref</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Name</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Deposit</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Withdrawal</th>
								</tr>
							</thead>
							<tbody>
								{#each data.transactions as t}
									<tr
										class="cursor-pointer transition-colors
											{reconciledSet.has(t.seq) ? 'bg-positive/5' : 'hover:bg-surface-container-low'}"
										onclick={() => toggleReconciled(t.seq)}
									>
										<td class="px-3 py-2 text-center">
											<input
												type="checkbox"
												checked={reconciledSet.has(t.seq)}
												onclick={(e) => e.stopPropagation()}
												onchange={() => toggleReconciled(t.seq)}
												class="h-4 w-4 rounded border-gray-300"
											/>
										</td>
										<td class="px-3 py-2">
											<span class="text-xs font-medium {t.type === 'Receipt' ? 'text-positive' : 'text-red-500'}">{t.type}</span>
										</td>
										<td class="px-3 py-2 text-muted-foreground">{t.date}</td>
										<td class="px-3 py-2 font-mono text-xs">{t.ref}</td>
										<td class="px-3 py-2">{t.name}</td>
										<td class="px-3 py-2 max-w-xs truncate text-muted-foreground">{t.description}</td>
										<td class="px-3 py-2 text-right">
											{#if t.deposit > 0}<span class="text-positive"><CurrencyDisplay amount={t.deposit} /></span>{/if}
										</td>
										<td class="px-3 py-2 text-right">
											{#if t.withdrawal > 0}<span class="text-red-500"><CurrencyDisplay amount={t.withdrawal} /></span>{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="flex h-40 items-center justify-center text-muted-foreground">No transactions for this bank account</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
