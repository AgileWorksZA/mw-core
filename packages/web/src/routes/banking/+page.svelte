<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<h1 class="text-xl font-bold">Banking</h1>
		<p class="text-sm text-muted-foreground">Bank accounts and recent activity</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		<!-- Bank Accounts -->
		<div>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Accounts</h2>
				<div class="text-sm text-muted-foreground">Total: <span class="font-bold text-foreground"><CurrencyDisplay amount={data.totalBalance} /></span></div>
			</div>
			<div class="grid grid-cols-3 gap-4">
				{#each data.bankAccounts as bank}
					<a href="/bank-reconciliation?bank={bank.code}" class="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
						<div class="flex items-center justify-between">
							<div>
								<div class="font-medium">{bank.description}</div>
								<div class="text-xs text-muted-foreground font-mono">{bank.code}</div>
							</div>
							<div class="text-xs text-muted-foreground">{bank.type === 'CC' ? 'Credit Card' : 'Bank'}</div>
						</div>
						<div class="mt-2 text-2xl font-bold" class:text-destructive={bank.balance < 0}>
							<CurrencyDisplay amount={bank.balance} />
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="grid grid-cols-2 gap-8">
			<!-- Recent Receipts -->
			<div>
				<h2 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Receipts</h2>
				{#if data.recentReceipts.length > 0}
					<div class="space-y-1">
						{#each data.recentReceipts as r}
							<div class="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted/50">
								<div class="flex items-center gap-3">
									<span class="text-xs text-muted-foreground">{r.date}</span>
									<span>{r.name}</span>
								</div>
								<span class="font-semibold text-green-600"><CurrencyDisplay amount={r.amount} /></span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-sm text-muted-foreground">No recent receipts</div>
				{/if}
			</div>

			<!-- Recent Payments -->
			<div>
				<h2 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Payments</h2>
				{#if data.recentPayments.length > 0}
					<div class="space-y-1">
						{#each data.recentPayments as p}
							<div class="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted/50">
								<div class="flex items-center gap-3">
									<span class="text-xs text-muted-foreground">{p.date}</span>
									<span>{p.name}</span>
								</div>
								<span class="font-semibold text-red-500"><CurrencyDisplay amount={p.amount} /></span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-sm text-muted-foreground">No recent payments</div>
				{/if}
			</div>
		</div>
	</div>
</div>
