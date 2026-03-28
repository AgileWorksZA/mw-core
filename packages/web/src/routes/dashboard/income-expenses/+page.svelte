<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SummaryCards from '$lib/components/SummaryCards.svelte';
	import RefreshIndicator from '$lib/components/RefreshIndicator.svelte';
	import { createAutoRefresh } from '$lib/stores/autoRefresh.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const refresh = createAutoRefresh(30_000);
	onMount(() => refresh.start());
	onDestroy(() => refresh.stop());

	const incomeMax = $derived(data.incomeAccounts.length > 0 ? data.incomeAccounts[0].balance : 1);
	const expenseMax = $derived(data.expenseAccounts.length > 0 ? data.expenseAccounts[0].balance : 1);

	const summaryCards = $derived([
		{ label: 'Total Income', value: data.totals.income, isCurrency: true, color: 'green' as const },
		{ label: 'Total Expenses', value: data.totals.expenses, isCurrency: true, color: 'red' as const },
		{ label: 'Net', value: data.totals.net, isCurrency: true, color: (data.totals.net >= 0 ? 'green' : 'red') as 'green' | 'red' }
	]);
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Income & Expenses" subtitle="By account — year to date">
		<RefreshIndicator enabled={refresh.enabled} refreshing={refresh.refreshing} onToggle={refresh.toggle} onRefresh={refresh.refreshNow} />
	</PageHeader>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		<!-- Summary cards -->
		<SummaryCards cards={summaryCards} />

		<div class="grid grid-cols-2 gap-8">
			<!-- Income -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Income</h2>
				{#if data.incomeAccounts.length > 0}
					<div class="space-y-2">
						{#each data.incomeAccounts as acct}
							<div class="rounded-lg border border-border p-3">
								<div class="mb-1 flex justify-between text-sm">
									<span class="truncate" title="{acct.code} — {acct.description}">
										<span class="font-mono text-xs text-muted-foreground">{acct.code}</span>
										{acct.description}
									</span>
									<span class="ml-2 font-semibold whitespace-nowrap"><CurrencyDisplay amount={acct.balance} /></span>
								</div>
								<div class="h-2 overflow-hidden rounded bg-muted">
									<div class="h-full rounded bg-green-500" style="width: {(acct.balance / incomeMax) * 100}%"></div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex h-20 items-center justify-center text-sm text-muted-foreground">No posted income</div>
				{/if}
			</div>

			<!-- Expenses -->
			<div>
				<h2 class="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Expenses</h2>
				{#if data.expenseAccounts.length > 0}
					<div class="space-y-2">
						{#each data.expenseAccounts as acct}
							<div class="rounded-lg border border-border p-3">
								<div class="mb-1 flex justify-between text-sm">
									<span class="truncate" title="{acct.code} — {acct.description}">
										<span class="font-mono text-xs text-muted-foreground">{acct.code}</span>
										{acct.description}
									</span>
									<span class="ml-2 font-semibold whitespace-nowrap"><CurrencyDisplay amount={acct.balance} /></span>
								</div>
								<div class="h-2 overflow-hidden rounded bg-muted">
									<div class="h-full rounded bg-red-400" style="width: {(acct.balance / expenseMax) * 100}%"></div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex h-20 items-center justify-center text-sm text-muted-foreground">No posted expenses</div>
				{/if}
			</div>
		</div>
	</div>
</div>
