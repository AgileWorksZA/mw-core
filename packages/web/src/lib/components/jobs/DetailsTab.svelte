<script lang="ts">
	import CurrencyDisplay from '$lib/components/CurrencyDisplay.svelte';

	let { job, lookups }: {
		job: Record<string, any>;
		lookups: { clients: Array<{ code: string; name: string }>; currentAssetAccounts: Array<{ code: string; description: string }> };
	} = $props();

	const clientName = $derived(lookups.clients.find(c => c.code === job.client)?.name ?? '');
	const wipAccountDesc = $derived(lookups.currentAssetAccounts.find(a => a.code === job.wipAccount)?.description ?? '');
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
	<!-- Basic Info -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Job Details</h3>
		<div class="space-y-2 text-sm">
			<div class="flex justify-between"><span class="text-muted-foreground">Code</span><span class="font-mono">{job.code}</span></div>
			<div class="flex justify-between"><span class="text-muted-foreground">Name</span><span class="font-medium">{job.name}</span></div>
			{#if job.description && job.description !== job.name}
				<div class="flex justify-between"><span class="text-muted-foreground">Description</span><span>{job.description}</span></div>
			{/if}
			<div class="flex justify-between">
				<span class="text-muted-foreground">Client</span>
				<span>{#if job.client}<a href="/names/{job.client}" class="text-primary hover:underline">{job.client}</a>{#if clientName} — {clientName}{/if}{:else}—{/if}</span>
			</div>
			<div class="flex justify-between"><span class="text-muted-foreground">Status</span>
				<span class="rounded-full px-2 py-0.5 text-xs font-medium
					{job.status === 'A' ? 'bg-positive/10 text-positive' : job.status === 'C' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}">
					{job.statusLabel}
				</span>
			</div>
			{#if job.project}
				<div class="flex justify-between"><span class="text-muted-foreground">Project (Parent)</span><a href="/jobs/{job.project}" class="text-primary hover:underline font-mono">{job.project}</a></div>
			{/if}
			{#if job.manager}
				<div class="flex justify-between"><span class="text-muted-foreground">Manager</span><span>{job.manager}</span></div>
			{/if}
			{#if job.category}
				<div class="flex justify-between"><span class="text-muted-foreground">Category</span><span>{job.category}</span></div>
			{/if}
		</div>
	</div>

	<!-- Billing & Budget -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Billing & Budget</h3>
		<div class="space-y-2 text-sm">
			<div class="flex justify-between"><span class="text-muted-foreground">Billing Mode</span><span>{job.billingLabel || '—'}</span></div>
			{#if job.billing === 'Q'}
				<div class="flex justify-between"><span class="text-muted-foreground">Quoted Amount</span><span class="font-mono"><CurrencyDisplay amount={job.quotedAmount} /></span></div>
			{:else if job.billing === 'C'}
				<div class="flex justify-between"><span class="text-muted-foreground">Markup</span><span class="font-mono">{job.markup}%</span></div>
			{/if}
			<div class="flex justify-between"><span class="text-muted-foreground">Budget</span><span class="font-mono"><CurrencyDisplay amount={job.budget} /></span></div>
			<div class="flex justify-between"><span class="text-muted-foreground">Billed to Date</span><span class="font-mono font-semibold"><CurrencyDisplay amount={job.billedToDate} /></span></div>
			{#if job.percentComplete > 0}
				<div class="flex justify-between items-center">
					<span class="text-muted-foreground">% Complete</span>
					<div class="flex items-center gap-2">
						<div class="h-2 w-24 rounded-full bg-surface-container-low overflow-hidden">
							<div class="h-full rounded-full bg-primary" style="width: {Math.min(job.percentComplete, 100)}%"></div>
						</div>
						<span class="font-mono text-xs">{job.percentComplete}%</span>
					</div>
				</div>
			{/if}
			{#if job.wipAccount}
				<div class="flex justify-between"><span class="text-muted-foreground">WIP Account</span><span class="font-mono">{job.wipAccount}{#if wipAccountDesc} — <span class="text-muted-foreground font-sans">{wipAccountDesc}</span>{/if}</span></div>
			{/if}
		</div>
	</div>

	<!-- Dates -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dates</h3>
		<div class="space-y-2 text-sm">
			<div class="flex justify-between"><span class="text-muted-foreground">Start Date</span><span class="font-mono">{job.startDate || '—'}</span></div>
			<div class="flex justify-between"><span class="text-muted-foreground">Target Date</span><span class="font-mono">{job.targetDate || '—'}</span></div>
			{#if job.finishDate}
				<div class="flex justify-between"><span class="text-muted-foreground">Finish Date</span><span class="font-mono">{job.finishDate}</span></div>
			{/if}
		</div>
	</div>

	<!-- Contact & Custom -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact</h3>
		<div class="space-y-2 text-sm">
			{#if job.customerOrderNo}
				<div class="flex justify-between"><span class="text-muted-foreground">Customer Order No</span><span>{job.customerOrderNo}</span></div>
			{/if}
			{#if job.contactPerson}
				<div class="flex justify-between"><span class="text-muted-foreground">Contact Person</span><span>{job.contactPerson}</span></div>
			{/if}
			{#if job.phone}
				<div class="flex justify-between"><span class="text-muted-foreground">Phone</span><span>{job.phone}</span></div>
			{/if}
			{#if job.custom1}<div class="flex justify-between"><span class="text-muted-foreground">Custom 1</span><span>{job.custom1}</span></div>{/if}
			{#if job.custom2}<div class="flex justify-between"><span class="text-muted-foreground">Custom 2</span><span>{job.custom2}</span></div>{/if}
			{#if job.custom3}<div class="flex justify-between"><span class="text-muted-foreground">Custom 3</span><span>{job.custom3}</span></div>{/if}
			{#if job.custom4}<div class="flex justify-between"><span class="text-muted-foreground">Custom 4</span><span>{job.custom4}</span></div>{/if}
		</div>
	</div>
</div>
