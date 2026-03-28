<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const codeColumnReports = new Set([
		'trial-balance', 'aged-receivables', 'aged-payables',
		'customer-sales-month', 'customer-sales-summary',
		'backorders-customer', 'backorders-product',
		'transaction-posting', 'accounts-list', 'account-movements',
		'customer-sales-item', 'purchases-over-time', 'budget-year'
	]);
	const showCode = $derived(codeColumnReports.has(data.reportId));
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-border bg-card px-6 py-4">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-xl font-bold">{data.title}</h1>
				<p class="text-sm text-muted-foreground">Generated {new Date().toLocaleDateString()}</p>
			</div>
			<a href="/reports" class="rounded-md bg-muted px-3 py-1.5 text-sm hover:bg-muted/80">Back to Reports</a>
		</div>
	</div>

	<div class="flex-1 overflow-auto p-6">
		{#if data.lines.length > 0}
			<div class="mx-auto max-w-2xl">
				<div class="overflow-auto rounded-md border border-border">
					<table class="w-full text-sm">
						{#if data.reportId === 'trial-balance'}
							<thead>
								<tr class="border-b border-border bg-muted/50">
									<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Code</th>
									<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Account</th>
									<th class="px-4 py-2.5 text-right font-medium text-muted-foreground">Debit</th>
									<th class="px-4 py-2.5 text-right font-medium text-muted-foreground">Credit</th>
								</tr>
							</thead>
							<tbody>
								{#each data.lines as line}
									<tr class="border-b border-border last:border-0">
										<td class="px-4 py-2 font-mono text-xs">{line.code}</td>
										<td class="px-4 py-2">{line.description}</td>
										<td class="px-4 py-2 text-right">{line.amount > 0 ? '' : ''}<CurrencyDisplay amount={line.amount > 0 ? line.amount : 0} /></td>
										<td class="px-4 py-2 text-right"><CurrencyDisplay amount={line.amount < 0 ? Math.abs(line.amount) : 0} /></td>
									</tr>
								{/each}
								<tr class="bg-muted/30 font-bold">
									<td class="px-4 py-2.5" colspan="2">Total</td>
									<td class="px-4 py-2.5 text-right"><CurrencyDisplay amount={data.totals.debit ?? 0} /></td>
									<td class="px-4 py-2.5 text-right"><CurrencyDisplay amount={data.totals.credit ?? 0} /></td>
								</tr>
							</tbody>
						{:else}
							<thead>
								<tr class="border-b border-border bg-muted/50">
									{#if showCode}
										<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Code</th>
									{/if}
									<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-4 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
								</tr>
							</thead>
							<tbody>
								{#each data.lines as line}
									{#if line.description || line.amount}
										<tr class="border-b border-border last:border-0 {line.bold ? 'bg-muted/30 font-semibold' : ''}">
											{#if showCode}
												<td class="px-4 py-2 font-mono text-xs">{line.code}</td>
											{/if}
											<td class="px-4 py-2" style="padding-left: {(line.indent ?? 0) * 20 + 16}px">{line.description}</td>
											<td class="px-4 py-2 text-right" class:text-green-600={line.amount > 0 && line.bold} class:text-destructive={line.amount < 0}>
												<CurrencyDisplay amount={line.amount} />
											</td>
										</tr>
									{:else}
										<tr><td colspan="{showCode ? 3 : 2}" class="py-1"></td></tr>
									{/if}
								{/each}
								{#if data.totals.total !== undefined}
									<tr class="bg-muted/30 font-bold">
										{#if showCode}<td class="px-4 py-2.5"></td>{/if}
										<td class="px-4 py-2.5">Total</td>
										<td class="px-4 py-2.5 text-right"><CurrencyDisplay amount={data.totals.total} /></td>
									</tr>
								{/if}
								{#if data.totals.debit !== undefined && data.reportId !== 'trial-balance'}
									<tr class="bg-muted/30 font-bold">
										{#if showCode}<td class="px-4 py-2.5"></td>{/if}
										<td class="px-4 py-2.5">Totals (Debit / Credit)</td>
										<td class="px-4 py-2.5 text-right"><CurrencyDisplay amount={data.totals.debit} /> / <CurrencyDisplay amount={data.totals.credit} /></td>
									</tr>
								{/if}
							</tbody>
						{/if}
					</table>
				</div>
			</div>
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">No data for this report</div>
		{/if}
	</div>
</div>
