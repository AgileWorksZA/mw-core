<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';
	import type { NameScreenData } from '$lib/api/types';

	let {
		pricing,
		lookups
	}: {
		pricing: NameScreenData['name']['pricingTerms'];
		lookups: NameScreenData['lookups'];
	} = $props();

	function termsLabel(terms: number): string {
		if (terms === 0) return 'COD';
		if (terms > 0) return `Within ${terms} days`;
		return `${Math.abs(terms)}th of following month`;
	}

	function findTaxCode(code: string) {
		return lookups.taxCodes.find((t) => t.code === code);
	}

	function findAccount(code: string) {
		return lookups.accounts.find((a) => a.code === code);
	}

	const taxCodeInfo = $derived(pricing.taxCode ? findTaxCode(pricing.taxCode) : undefined);
	const recAccountInfo = $derived(pricing.recAccount ? findAccount(pricing.recAccount) : undefined);
	const payAccountInfo = $derived(pricing.payAccount ? findAccount(pricing.payAccount) : undefined);
</script>

<div class="grid grid-cols-2 gap-6">
	<!-- Pricing & Tax -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Pricing & Tax
		</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Customer Discount</span>
				<span>{pricing.discount}%</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Price Code</span>
				<span>{pricing.priceCode || 'Default'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Tax Code</span>
				<span>
					{#if pricing.taxCode}
						{pricing.taxCode}
						{#if taxCodeInfo}
							<span class="text-muted-foreground">({taxCodeInfo.name}, {taxCodeInfo.rate}%)</span>
						{/if}
					{:else}
						<span class="text-muted-foreground">Default</span>
					{/if}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Currency</span>
				<span>{pricing.currency || 'Local'}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Salesperson</span>
				<span>{pricing.salesPerson || '—'}</span>
			</div>
		</div>
	</div>

	<!-- Credit Hold -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Credit
		</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Credit Hold</span>
				<span
					class={pricing.creditHold ? 'font-semibold text-destructive' : 'text-green-600'}
				>
					{pricing.creditHold ? 'ON HOLD' : 'No'}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Credit Limit</span>
				<CurrencyDisplay amount={pricing.creditLimit} />
			</div>
		</div>
	</div>

	<!-- Debtor Control -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Debtor Control
		</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Terms</span>
				<span>{termsLabel(pricing.debtorTerms)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Receivables Acct</span>
				<span class="font-mono text-xs">
					{pricing.recAccount || '—'}
					{#if recAccountInfo}
						<span class="text-muted-foreground"> {recAccountInfo.description}</span>
					{/if}
				</span>
			</div>
		</div>
	</div>

	<!-- Creditor Control -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Creditor Control
		</h3>
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">Terms</span>
				<span>{termsLabel(pricing.creditorTerms)}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-muted-foreground">Payables Acct</span>
				<span class="font-mono text-xs">
					{pricing.payAccount || '—'}
					{#if payAccountInfo}
						<span class="text-muted-foreground"> {payAccountInfo.description}</span>
					{/if}
				</span>
			</div>
		</div>
	</div>
</div>
