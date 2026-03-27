<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const incomeMax = $derived(data.incomeAccounts.length > 0 ? data.incomeAccounts[0].balance : 1);
	const expenseMax = $derived(data.expenseAccounts.length > 0 ? data.expenseAccounts[0].balance : 1);
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Income & Expenses</h1>
		<p class="text-sm text-muted-foreground">By account — year to date</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		<!-- Summary cards -->
		<div class="grid grid-cols-3 gap-4">
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Income</div>
				<div class="mt-1 text-xl font-bold text-green-600"><CurrencyDisplay amount={data.totals.income} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Total Expenses</div>
				<div class="mt-1 text-xl font-bold text-red-500"><CurrencyDisplay amount={data.totals.expenses} /></div>
			</div>
			<div class="rounded-lg border border-border p-4 text-center">
				<div class="text-xs font-medium text-muted-foreground uppercase">Net</div>
				<div class="mt-1 text-xl font-bold" class:text-green-600={data.totals.net >= 0} class:text-destructive={data.totals.net < 0}>
					<CurrencyDisplay amount={data.totals.net} />
				</div>
			</div>
		</div>

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
