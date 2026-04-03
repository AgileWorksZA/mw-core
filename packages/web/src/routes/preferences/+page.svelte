<script lang="ts">
	import type { PageData } from './$types';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import TabStrip from '$lib/components/TabStrip.svelte';

	let { data }: { data: PageData } = $props();
	const c = data.company;
	const x = data.extra ?? {};

	let activeTab = $state('company');

	const tabs = [
		{ id: 'company', label: 'Company Details' },
		{ id: 'tax', label: 'Tax / HST' },
		{ id: 'sequences', label: 'Seq N\u00B0s' },
		{ id: 'terms', label: 'Terms' },
		{ id: 'dataentry', label: 'Data Entry' },
		{ id: 'locale', label: 'Locale / Currency' },
		{ id: 'system', label: 'System' }
	];

	// Helpers
	function bool(v: string | undefined): boolean {
		return v === '1' || v === 'true';
	}
	function formatDate(v: string | undefined): string {
		if (!v || v.length < 8) return v ?? '—';
		if (/^\d{8}$/.test(v)) return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
		return v;
	}

	// Period names parsing
	const periodNames = $derived(
		x.periodNames ? x.periodNames.split(',').map((n: string) => n.trim()).filter(Boolean) : []
	);

	// GST cycle label
	const gstCycleLabel = $derived(() => {
		const months = c?.tax?.gstCycleMonths;
		if (!months) return '—';
		if (months === 1) return 'Monthly';
		if (months === 2) return 'Two Monthly';
		if (months === 3) return 'Quarterly';
		if (months === 6) return 'Six Monthly';
		if (months === 12) return 'Annually';
		return `${months} months`;
	});

	// Static data for Data Entry and Sequences tabs
	const colours = [
		{ name: 'Orange', color: 'bg-orange-500' },
		{ name: 'Red', color: 'bg-red-500' },
		{ name: 'Magenta', color: 'bg-pink-500' },
		{ name: 'Cyan', color: 'bg-cyan-500' },
		{ name: 'Blue', color: 'bg-blue-500' },
		{ name: 'Green', color: 'bg-green-500' },
		{ name: 'Brown', color: 'bg-amber-700' }
	];

	const paymentMethods = [
		{ default: 'Cash', display: 'Cash' },
		{ default: 'Cheque', display: 'Cheque' },
		{ default: 'Electronic', display: 'Electronic' },
		{ default: 'Credit Card', display: 'Credit Card' },
		{ default: 'Method 5', display: '—' },
		{ default: 'Method 6', display: '—' },
		{ default: 'Method 7', display: '—' }
	];

	const fieldLabels = [
		{ field: 'Transaction.Salesperson', label: 'Salesperson' },
		{ field: 'Transaction.User1–8', label: 'User 1–8' },
		{ field: 'Transaction.Flag', label: 'Flag' },
		{ field: 'Transaction.Analysis', label: 'Analysis' },
		{ field: 'Product.Category1', label: 'Material' },
		{ field: 'Product.Category2', label: 'Size' },
		{ field: 'Product.Category3', label: 'Style' },
		{ field: 'Product.Category4', label: 'Category 4' }
	];

	const contactRoles = [
		{ num: 1, name: 'Payables' },
		{ num: 2, name: 'Receivables' },
		{ num: 3, name: 'CEO' },
		{ num: 4, name: 'CFO' },
		{ num: 5, name: 'Sales' },
		{ num: 6, name: 'Purchasing' }
	];

	const seqTypes = [
		{ type: 'Batch Receipt N\u00B0', desc: 'Auto-number for batch receipt entries' },
		{ type: 'Cash Receipt N\u00B0', desc: 'Auto-number for cash receipts' },
		{ type: 'Cash Payment N\u00B0', desc: 'Auto-number for cash payments (per bank account)' },
		{ type: 'Order N\u00B0', desc: 'Auto-number for purchase/sales orders' },
		{ type: 'Invoice N\u00B0', desc: 'Auto-number for invoices' },
		{ type: 'Quote / SO N\u00B0', desc: 'Auto-number for quotes and sales orders' },
		{ type: 'Job N\u00B0', desc: 'Auto-number for jobs' }
	];
</script>

<div class="flex h-full flex-col">
	<PageHeader title="Settings & Preferences" subtitle="Company configuration and document settings" />

	<div class="px-3 md:px-6 pt-2">
		<TabStrip {tabs} bind:activeTab />
	</div>

	<div class="flex-1 overflow-auto p-3 md:p-6">
		{#if !c}
			<div class="flex h-40 items-center justify-center text-muted-foreground">Unable to load company details</div>
		{:else}

			<!-- ======================== COMPANY DETAILS ======================== -->
			{#if activeTab === 'company'}
				<div class="space-y-6">
					<!-- Company Name & Logo -->
					<div class="rounded-xl bg-surface-container-lowest p-5">
						<div class="flex items-start justify-between">
							<div>
								<div class="text-2xl font-bold font-headline">{c.name}</div>
								{#if x.coRegName}
									<div class="text-sm text-muted-foreground mt-1">Registered as: {x.coRegName}</div>
								{/if}
								{#if x.regNum}
									<div class="text-sm text-muted-foreground">Co. Reg #: <span class="font-mono">{x.regNum}</span></div>
								{/if}
								{#if c.tax?.gstRegistrationNumber}
									<div class="text-sm text-muted-foreground">GST #: <span class="font-mono">{c.tax.gstRegistrationNumber}</span></div>
								{/if}
							</div>
							{#if bool(x.haveLogo)}
								<div class="h-16 w-16 rounded-lg bg-surface-container-low flex items-center justify-center text-xs text-muted-foreground">
									Logo
								</div>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Postal Address -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Postal Address</h3>
							<div class="space-y-0.5 text-sm">
								{#if c.address?.line1}<div>{c.address.line1}</div>{/if}
								{#if c.address?.line2}<div>{c.address.line2}</div>{/if}
								{#if c.address?.line3}<div>{c.address.line3}</div>{/if}
								{#if c.address?.line4}<div>{c.address.line4}</div>{/if}
								{#if x.state || x.postCode}
									<div>{[x.state, x.postCode].filter(Boolean).join(' ')}</div>
								{/if}
							</div>
						</div>

						<!-- Delivery Address -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Delivery Address</h3>
							{#if x.delivery1 || x.delivery2 || x.delivery3 || x.delivery4}
								<div class="space-y-0.5 text-sm">
									{#if x.delivery1}<div>{x.delivery1}</div>{/if}
									{#if x.delivery2}<div>{x.delivery2}</div>{/if}
									{#if x.delivery3}<div>{x.delivery3}</div>{/if}
									{#if x.delivery4}<div>{x.delivery4}</div>{/if}
									{#if x.deliveryState || x.deliveryPostCode}
										<div>{[x.deliveryState, x.deliveryPostCode].filter(Boolean).join(' ')}</div>
									{/if}
								</div>
							{:else}
								<div class="text-sm text-muted-foreground italic">Same as postal address</div>
							{/if}
						</div>

						<!-- Contact Details -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Contact</h3>
							<div class="space-y-2 text-sm">
								{#if c.contact?.phone}
									<div class="flex justify-between"><span class="text-muted-foreground">Phone</span><span>{c.contact.phone}</span></div>
								{/if}
								{#if x.mobile}
									<div class="flex justify-between"><span class="text-muted-foreground">Mobile</span><span>{x.mobile}</span></div>
								{/if}
								{#if c.contact?.fax}
									<div class="flex justify-between"><span class="text-muted-foreground">Fax</span><span>{c.contact.fax}</span></div>
								{/if}
								{#if c.contact?.email}
									<div class="flex justify-between"><span class="text-muted-foreground">Email</span><a href="mailto:{c.contact.email}" class="text-primary hover:underline">{c.contact.email}</a></div>
								{/if}
								{#if c.contact?.website}
									<div class="flex justify-between"><span class="text-muted-foreground">Website</span><a href="{c.contact.website.startsWith('http') ? c.contact.website : 'https://' + c.contact.website}" target="_blank" class="text-primary hover:underline">{c.contact.website}</a></div>
								{/if}
							</div>
						</div>

						<!-- Remittance -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Remittance Account Message</h3>
							{#if x.remittanceMessage}
								<div class="text-sm whitespace-pre-line">{x.remittanceMessage}</div>
							{:else}
								<div class="text-sm text-muted-foreground italic">No remittance message configured</div>
							{/if}
						</div>
					</div>
				</div>

			<!-- ======================== TAX / HST ======================== -->
			{:else if activeTab === 'tax'}
				<div class="space-y-6">
					<!-- Tax Configuration -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Tax Registration</h3>
							<div class="space-y-2 text-sm">
								{#if x.taxName}
									<div class="flex justify-between"><span class="text-muted-foreground">Tax System Name</span><span>{x.taxName}</span></div>
								{/if}
								{#if c.tax?.gstRegistrationNumber}
									<div class="flex justify-between"><span class="text-muted-foreground">GST / Tax Number</span><span class="font-mono">{c.tax.gstRegistrationNumber}</span></div>
								{/if}
								{#if x.gstRegName}
									<div class="flex justify-between"><span class="text-muted-foreground">GST Registered Name</span><span>{x.gstRegName}</span></div>
								{/if}
								{#if x.gstGuideName}
									<div class="flex justify-between"><span class="text-muted-foreground">GST Guide</span><span>{x.gstGuideName}</span></div>
								{/if}
								<div class="flex justify-between">
									<span class="text-muted-foreground">Processing Suppressed</span>
									<span>{bool(x.gstProcessingSuppressed) ? 'Yes' : 'No'}</span>
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Basis for Calculation</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Income Basis</span>
									<span>{bool(x.gstIncomeInvoiceBasis) ? 'Invoice Basis' : 'Payments Basis'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Expense Basis</span>
									<span>{bool(x.gstExpensesInvoiceBasis) ? 'Invoice Basis' : 'Payments Basis'}</span>
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">HST Cycle</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Cycle Period</span>
									<span>{gstCycleLabel()}</span>
								</div>
								{#if x.gstCycleEndDate}
									<div class="flex justify-between">
										<span class="text-muted-foreground">Next Cycle Ends</span>
										<span class="font-mono">{formatDate(x.gstCycleEndDate)}</span>
									</div>
								{/if}
								{#if x.gstCycleNum}
									<div class="flex justify-between">
										<span class="text-muted-foreground">Cycle Number</span>
										<span class="font-mono">{x.gstCycleNum}</span>
									</div>
								{/if}
							</div>
						</div>
					</div>

					<!-- Tax Rates Table -->
					{#if data.taxRates.length > 0}
						<div>
							<h2 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tax Rates</h2>
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
											<tr class="hover:bg-surface-container-low border-t border-border/30">
												<td class="px-3 py-2 font-mono text-xs">{tax.code}</td>
												<td class="px-3 py-2">{tax.description}</td>
												<td class="px-3 py-2 text-right font-mono">{tax.rate}%</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/if}
				</div>

			<!-- ======================== SEQUENCE NUMBERS ======================== -->
			{:else if activeTab === 'sequences'}
				<div class="space-y-6">
					<div class="rounded-xl bg-surface-container-lowest p-5">
						<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-4">Auto-Numbering Sequences</h3>
						<p class="text-sm text-muted-foreground mb-4">
							Sequence numbers control automatic numbering for new documents. These settings are managed in MoneyWorks desktop under Edit → Document Preferences → Seq N°s.
						</p>
						<div class="overflow-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="bg-surface-container-low">
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Document Type</th>
										<th class="px-3 py-2.5 text-left font-medium text-muted-foreground">Description</th>
										<th class="px-3 py-2.5 text-center font-medium text-muted-foreground">Options</th>
									</tr>
								</thead>
								<tbody>
									{#each seqTypes as seq}
										<tr class="border-t border-border/30 hover:bg-surface-container-low">
											<td class="px-3 py-2 font-medium">{seq.type}</td>
											<td class="px-3 py-2 text-muted-foreground">{seq.desc}</td>
											<td class="px-3 py-2 text-center">
												<span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
													<span class="inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
													Active
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>

					<div class="rounded-xl bg-surface-container-low/50 p-4 text-sm text-muted-foreground">
						<div class="flex items-start gap-2">
							<svg class="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="16" x2="12" y2="12" />
								<line x1="12" y1="8" x2="12.01" y2="8" />
							</svg>
							<div>
								Each sequence type supports: <strong>Change starts new sequence</strong>, <strong>Can change</strong>, <strong>Check for duplicates</strong>, and <strong>Synchronise</strong> options. Configure these in MoneyWorks desktop.
							</div>
						</div>
					</div>
				</div>

			<!-- ======================== TERMS ======================== -->
			{:else if activeTab === 'terms'}
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Default Terms</h3>
							<div class="space-y-2 text-sm">
								<div class="text-muted-foreground">
									Default payment terms for new customers and suppliers. Configurable as:
								</div>
								<ul class="list-disc ml-4 space-y-1 text-muted-foreground">
									<li>Within a fixed number of days</li>
									<li>On a specific day of the following month</li>
								</ul>
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Credit Hold</h3>
							<div class="space-y-2 text-sm">
								{#if x.agingCycle}
									<div class="flex justify-between">
										<span class="text-muted-foreground">Aging Cycle</span>
										<span class="font-mono">{x.agingCycle} days</span>
									</div>
								{/if}
								<div class="text-muted-foreground">
									Auto credit hold triggers when customer exceeds overdue threshold. Configure in MoneyWorks desktop under Document Preferences → Terms.
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Code Assignment</h3>
							<div class="space-y-2 text-sm text-muted-foreground">
								New Name records can be automatically assigned templated codes, padded to a configurable length. Configure in MoneyWorks desktop.
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Other Options</h3>
							<ul class="space-y-2 text-sm text-muted-foreground">
								<li class="flex items-center gap-2">
									<span class="inline-block h-3 w-3 rounded border border-muted-foreground/30"></span>
									Overdue Warnings At Startup
								</li>
								<li class="flex items-center gap-2">
									<span class="inline-block h-3 w-3 rounded border border-muted-foreground/30"></span>
									Check for Duplicate Creditor Invoice Numbers
								</li>
							</ul>
						</div>
					</div>
				</div>

			<!-- ======================== DATA ENTRY ======================== -->
			{:else if activeTab === 'dataentry'}
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Colour Names -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Colour Names</h3>
							<p class="text-sm text-muted-foreground mb-3">Custom labels for the 7 transaction colour codes:</p>
							<div class="space-y-1.5">
								{#each colours as col}
									<div class="flex items-center gap-2 text-sm">
										<span class="inline-block h-3 w-3 rounded-full {col.color}"></span>
										<span>{col.name}</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Payment Methods -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Payment Methods</h3>
							<div class="overflow-auto">
								<table class="w-full text-sm">
									<thead>
										<tr>
											<th class="px-2 py-1.5 text-left text-xs text-muted-foreground font-medium">Default</th>
											<th class="px-2 py-1.5 text-left text-xs text-muted-foreground font-medium">Display As</th>
										</tr>
									</thead>
									<tbody>
										{#each paymentMethods as m}
											<tr class="border-t border-border/20">
												<td class="px-2 py-1.5">{m.default}</td>
												<td class="px-2 py-1.5 text-muted-foreground">{m.display}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>

						<!-- Field Labels -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Custom Field Labels</h3>
							<p class="text-sm text-muted-foreground mb-3">Custom labels for user-defined fields on transactions and products:</p>
							<div class="overflow-auto">
								<table class="w-full text-sm">
									<thead>
										<tr>
											<th class="px-2 py-1.5 text-left text-xs text-muted-foreground font-medium">Field</th>
											<th class="px-2 py-1.5 text-left text-xs text-muted-foreground font-medium">Default Label</th>
										</tr>
									</thead>
									<tbody>
										{#each fieldLabels as l}
											<tr class="border-t border-border/20">
												<td class="px-2 py-1.5 font-mono text-xs">{l.field}</td>
												<td class="px-2 py-1.5 text-muted-foreground">{l.label}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>

						<!-- Contact Roles -->
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Contact Roles</h3>
							<div class="overflow-auto">
								<table class="w-full text-sm">
									<thead>
										<tr>
											<th class="px-2 py-1.5 text-left text-xs text-muted-foreground font-medium">Role #</th>
											<th class="px-2 py-1.5 text-left text-xs text-muted-foreground font-medium">Name</th>
										</tr>
									</thead>
									<tbody>
										{#each contactRoles as r}
											<tr class="border-t border-border/20">
												<td class="px-2 py-1.5 font-mono text-xs">{r.num}</td>
												<td class="px-2 py-1.5">{r.name}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div class="rounded-xl bg-surface-container-low/50 p-4 text-sm text-muted-foreground">
						<div class="flex items-start gap-2">
							<svg class="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="16" x2="12" y2="12" />
								<line x1="12" y1="8" x2="12.01" y2="8" />
							</svg>
							<div>
								Colour names, payment methods, field labels, and contact roles are customizable per document in MoneyWorks desktop under Edit → Document Preferences → Data Entry.
							</div>
						</div>
					</div>
				</div>

			<!-- ======================== LOCALE / CURRENCY ======================== -->
			{:else if activeTab === 'locale'}
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Localisation</h3>
							<div class="space-y-2 text-sm">
								{#if x.localeFriendlyName || x.locale}
									<div class="flex justify-between">
										<span class="text-muted-foreground">Locale</span>
										<span>{x.localeFriendlyName || x.locale || '—'}</span>
									</div>
								{/if}
								{#if x.locale}
									<div class="flex justify-between">
										<span class="text-muted-foreground">Locale Code</span>
										<span class="font-mono">{x.locale}</span>
									</div>
								{/if}
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Currency</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Base Currency</span>
									<span class="font-mono font-medium">{c.accounting?.baseCurrency || '—'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Multi-Currency</span>
									<span class={c.accounting?.multiCurrencyEnabled ? 'text-green-600' : ''}>
										{c.accounting?.multiCurrencyEnabled ? 'Enabled' : 'Disabled'}
									</span>
								</div>
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Financial Year</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Periods in Year</span>
									<span class="font-mono">{c.accounting?.periodsInYear ?? '—'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Current Period</span>
									<span class="font-mono">{c.accounting?.currentPeriod ?? '—'}</span>
								</div>
							</div>
							{#if periodNames.length > 0}
								<div class="mt-3 pt-3 border-t border-border/30">
									<h4 class="text-xs font-semibold text-muted-foreground mb-2">Period Names</h4>
									<div class="grid grid-cols-3 gap-1">
										{#each periodNames as name, i}
											<div class="flex items-center gap-1.5 text-xs">
												<span class="text-muted-foreground font-mono w-4 text-right">{i + 1}</span>
												<span class={i + 1 === c.accounting?.currentPeriod ? 'font-semibold text-primary' : ''}>{name}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Job Costing</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Extended Job Costing</span>
									<span class={c.accounting?.extendedJobCosting ? 'text-green-600' : ''}>
										{c.accounting?.extendedJobCosting ? 'Enabled' : 'Disabled'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

			<!-- ======================== SYSTEM ======================== -->
			{:else if activeTab === 'system'}
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">MoneyWorks</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Version</span>
									<span class="font-mono">{c.system?.version || '—'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Platform</span>
									<span>{c.system?.platform || '—'}</span>
								</div>
								{#if bool(x.navigatorActive)}
									<div class="flex justify-between">
										<span class="text-muted-foreground">Navigator</span>
										<span class="text-green-600">Active</span>
									</div>
								{/if}
								{#if x.networkLatency}
									<div class="flex justify-between">
										<span class="text-muted-foreground">Network Latency</span>
										<span class="font-mono">{x.networkLatency}ms</span>
									</div>
								{/if}
							</div>
						</div>

						<div class="rounded-xl bg-surface-container-lowest p-4">
							<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Maintenance</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-muted-foreground">Last Backup</span>
									<span class="font-mono">{formatDate(x.lastBackup) || '—'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Last Aged Debtors</span>
									<span class="font-mono">{formatDate(x.lastAgedDebtors) || '—'}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-muted-foreground">Last Stocktake</span>
									<span class="font-mono">{formatDate(x.lastStocktake) || '—'}</span>
								</div>
							</div>
						</div>

						{#if x.logFilePath}
							<div class="rounded-xl bg-surface-container-lowest p-4 md:col-span-2">
								<h3 class="font-headline text-xs font-semibold text-muted-foreground uppercase mb-3">Log File</h3>
								<div class="text-sm font-mono text-muted-foreground break-all">{x.logFilePath}</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
