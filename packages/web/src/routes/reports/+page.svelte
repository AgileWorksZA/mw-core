<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const executableReports = new Set([
		'trial-balance', 'profit-year', 'profit-month', 'profit-comparison',
		'balance-sheet', 'account-movements', 'accounts-list',
		'aged-receivables', 'aged-payables',
		'customer-sales-month', 'customer-sales-summary',
		'ledger-report', 'address-list', 'item-sales',
		'backorders-customer', 'backorders-product',
		'transaction-posting', 'budget-year', 'forecast',
		'customer-sales-item', 'purchases-over-time'
	]);

	const categoryColors: Record<string, string> = {
		'Financial': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
		'Audit': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
		'Budget': 'bg-positive/10 text-positive',
		'Customer / Supplier': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
		'Item': 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
	};
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="font-headline text-xl font-bold">Reports</h1>
		<p class="text-sm text-muted-foreground">{data.totalReports} reports available</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		{#each data.categories as cat}
			<div>
				<h2 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{cat.name}</h2>
				<div class="grid grid-cols-3 gap-3">
					{#each cat.reports as report}
						{@const isExec = executableReports.has(report.id)}
						<a
							href={isExec ? `/reports/view?id=${report.id}` : '#'}
							class="rounded-xl p-4 text-left transition-colors hover:bg-surface-container-low
								{isExec ? 'bg-primary/5' : 'bg-surface-container-lowest'}"
						>
							<div class="flex items-center gap-2">
								<span class="rounded px-1.5 py-0.5 text-[10px] font-semibold {categoryColors[cat.name] || 'bg-muted text-muted-foreground'}">
									{cat.name.split(' ')[0]}
								</span>
								<span class="text-sm font-medium">{report.name}</span>
								{#if isExec}
									<span class="ml-auto rounded-full bg-positive/10 px-1.5 py-0.5 text-[9px] font-semibold text-positive">LIVE</span>
								{/if}
							</div>
							<div class="mt-1 text-xs text-muted-foreground">{report.description}</div>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
