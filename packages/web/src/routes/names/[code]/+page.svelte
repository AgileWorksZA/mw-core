<script lang="ts">
	import TabStrip from '$lib/components/TabStrip.svelte';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import BalancesTab from '$lib/components/names/BalancesTab.svelte';
	import DetailsTab from '$lib/components/names/DetailsTab.svelte';
	import PricingTermsTab from '$lib/components/names/PricingTermsTab.svelte';
	import BankEdiTab from '$lib/components/names/BankEdiTab.svelte';
	import ContactsTab from '$lib/components/names/ContactsTab.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const tabs = [
		{ id: 'balances', label: 'Balances' },
		{ id: 'details', label: 'Details' },
		{ id: 'pricing', label: 'Pricing & Terms' },
		{ id: 'bank', label: 'Bank & EDI' },
		{ id: 'contacts', label: 'Contacts' }
	];

	let activeTab = $state('balances');

	const { header, details, pricingTerms, bankEdi, balances, contacts } = data.name;

	function flagLabels(): string[] {
		const labels: string[] = [];
		if (header.flags.debtor) labels.push('Debtor');
		else if (header.flags.customer) labels.push('Customer');
		if (header.flags.creditor) labels.push('Creditor');
		else if (header.flags.supplier) labels.push('Supplier');
		return labels;
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header bar -->
	<div class="border-b border-border bg-card px-6 py-4">
		<div class="flex items-center gap-3">
			<a href="/names" class="text-muted-foreground hover:text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<ColourBadge colour={header.colour} />
			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-xl font-bold">{header.name}</h1>
					<span class="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
						{header.code}
					</span>
				</div>
				<div class="mt-0.5 flex gap-1.5">
					{#each flagLabels() as label}
						<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
							{label}
						</span>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="bg-card px-6">
		<TabStrip {tabs} bind:activeTab />
	</div>

	<!-- Tab content -->
	<div class="flex-1 overflow-auto p-6">
		{#if activeTab === 'balances'}
			<BalancesTab {balances} transactions={data.transactionHistory} />
		{:else if activeTab === 'details'}
			<DetailsTab {details} />
		{:else if activeTab === 'pricing'}
			<PricingTermsTab pricing={pricingTerms} lookups={data.lookups} />
		{:else if activeTab === 'bank'}
			<BankEdiTab bank={bankEdi} />
		{:else if activeTab === 'contacts'}
			<ContactsTab {contacts} />
		{/if}
	</div>
</div>
