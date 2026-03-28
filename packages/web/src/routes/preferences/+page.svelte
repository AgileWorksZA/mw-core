<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const c = data.company;
</script>

<div class="flex h-full flex-col">
	<div class="bg-surface-container-lowest px-6 py-4">
		<h1 class="font-headline text-xl font-bold">Preferences</h1>
		<p class="text-sm text-muted-foreground">Company details and settings</p>
	</div>

	<div class="flex-1 overflow-auto p-6 space-y-8">
		{#if c}
			<!-- Company Details -->
			<div>
				<h2 class="font-headline mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Company Details</h2>
				<div class="grid grid-cols-2 gap-6">
					<div class="space-y-4">
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<div class="text-2xl font-bold">{c.name}</div>
							<div class="mt-2 space-y-0.5 text-sm text-muted-foreground">
								{#if c.address.line1}<div>{c.address.line1}</div>{/if}
								{#if c.address.line2}<div>{c.address.line2}</div>{/if}
								{#if c.address.line3}<div>{c.address.line3}</div>{/if}
								{#if c.address.line4}<div>{c.address.line4}</div>{/if}
							</div>
						</div>
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-2">Contact</h3>
							<div class="space-y-1.5 text-sm">
								{#if c.contact.phone}<div class="flex justify-between"><span class="text-muted-foreground">Phone</span><span>{c.contact.phone}</span></div>{/if}
								{#if c.contact.fax}<div class="flex justify-between"><span class="text-muted-foreground">Fax</span><span>{c.contact.fax}</span></div>{/if}
								{#if c.contact.email}<div class="flex justify-between"><span class="text-muted-foreground">Email</span><span>{c.contact.email}</span></div>{/if}
								{#if c.contact.website}<div class="flex justify-between"><span class="text-muted-foreground">Website</span><span>{c.contact.website}</span></div>{/if}
							</div>
						</div>
					</div>
					<div class="space-y-4">
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-2">Accounting</h3>
							<div class="space-y-1.5 text-sm">
								<div class="flex justify-between"><span class="text-muted-foreground">Periods/Year</span><span>{c.accounting.periodsInYear}</span></div>
								<div class="flex justify-between"><span class="text-muted-foreground">Current Period</span><span class="font-mono">{c.accounting.currentPeriod}</span></div>
								<div class="flex justify-between"><span class="text-muted-foreground">Base Currency</span><span>{c.accounting.baseCurrency}</span></div>
								<div class="flex justify-between"><span class="text-muted-foreground">Multi-Currency</span><span>{c.accounting.multiCurrencyEnabled ? 'Enabled' : 'Disabled'}</span></div>
							</div>
						</div>
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-2">Tax</h3>
							<div class="space-y-1.5 text-sm">
								<div class="flex justify-between"><span class="text-muted-foreground">GST/Tax Number</span><span class="font-mono">{c.tax.gstRegistrationNumber}</span></div>
								<div class="flex justify-between"><span class="text-muted-foreground">GST Cycle</span><span>{c.tax.gstCycleMonths} months</span></div>
							</div>
						</div>
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-2">System</h3>
							<div class="space-y-1.5 text-sm">
								<div class="flex justify-between"><span class="text-muted-foreground">MoneyWorks Version</span><span class="font-mono">{c.system.version}</span></div>
								<div class="flex justify-between"><span class="text-muted-foreground">Platform</span><span>{c.system.platform}</span></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Tax Rates -->
			{#if data.taxRates.length > 0}
				<div>
					<h2 class="font-headline mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tax Rates</h2>
					<div class="overflow-auto rounded-xl bg-surface-container-lowest">
						<table class="w-full text-sm">
							<thead>
								<tr class="bg-surface-container-low">
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Code</th>
									<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
									<th class="px-3 py-2.5 text-right font-medium text-muted-foreground">Rate</th>
								</tr>
							</thead>
							<tbody>
								{#each data.taxRates as tax}
									<tr class="hover:bg-surface-container-low">
										<td class="px-3 py-2 font-mono text-xs">{tax.code}</td>
										<td class="px-3 py-2">{tax.description}</td>
										<td class="px-3 py-2 text-right">{tax.rate}%</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		{:else}
			<div class="flex h-40 items-center justify-center text-muted-foreground">Unable to load company details</div>
		{/if}
	</div>
</div>
