<script lang="ts">
	import TabStrip from '$lib/components/TabStrip.svelte';
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import DetailsTab from '$lib/components/jobs/DetailsTab.svelte';
	import SheetItemsTab from '$lib/components/jobs/SheetItemsTab.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const tabs = [
		{ id: 'details', label: 'Details' },
		{ id: 'comments', label: 'Comments' },
		{ id: 'pending', label: `Pending (${data.sheetItems.pending.length})` },
		{ id: 'processed', label: `Processed (${data.sheetItems.processed.length})` },
		{ id: 'budget', label: `Budget (${data.sheetItems.budget.length})` }
	];

	let activeTab = $state('details');

	const { job } = data;

	const statusColors: Record<string, string> = {
		A: 'bg-positive/10 text-positive',
		C: 'bg-blue-500/10 text-blue-500',
		H: 'bg-amber-500/10 text-amber-500'
	};
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="bg-surface-container-lowest px-6 py-4">
		<div class="flex items-center gap-3">
			<a href="/jobs" class="text-muted-foreground hover:text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<ColourBadge colour={job.colour} />
			<div>
				<div class="flex items-center gap-2">
					<h1 class="font-headline text-xl font-bold">{job.name || job.code}</h1>
					<span class="rounded bg-surface-container-low px-2 py-0.5 text-xs font-mono text-muted-foreground">
						{job.code}
					</span>
					<span class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[job.status] ?? ''}">
						{job.statusLabel}
					</span>
				</div>
				<div class="mt-0.5 flex gap-2 text-xs text-muted-foreground">
					{#if job.client}
						<span>Client: <a href="/names/{job.client}" class="text-primary hover:underline">{job.client}</a></span>
					{/if}
					{#if job.billingLabel}
						<span>Billing: {job.billingLabel}</span>
					{/if}
					{#if job.project}
						<span>Project: <a href="/jobs/{job.project}" class="text-primary hover:underline">{job.project}</a></span>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="bg-surface-container-lowest px-6">
		<TabStrip {tabs} bind:activeTab />
	</div>

	<!-- Tab content -->
	<div class="flex-1 overflow-auto p-6">
		{#if activeTab === 'details'}
			<DetailsTab {job} lookups={data.lookups} />
		{:else if activeTab === 'comments'}
			<div class="rounded-xl bg-surface-container-lowest p-4">
				<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Comments</h3>
				{#if job.comments}
					<div class="text-sm whitespace-pre-line">{job.comments}</div>
				{:else}
					<div class="text-sm text-muted-foreground italic">No comments</div>
				{/if}
				{#if job.notes && job.notes !== job.comments}
					<h3 class="font-headline mt-6 mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</h3>
					<div class="text-sm whitespace-pre-line">{job.notes}</div>
				{/if}
			</div>
		{:else if activeTab === 'pending'}
			<SheetItemsTab items={data.sheetItems.pending} title="Pending Items" emptyMessage="No pending (unbilled) job sheet items" />
		{:else if activeTab === 'processed'}
			<SheetItemsTab items={data.sheetItems.processed} title="Processed Items" emptyMessage="No processed (billed) job sheet items" />
		{:else if activeTab === 'budget'}
			<SheetItemsTab items={data.sheetItems.budget} title="Budget Items" emptyMessage="No budget entries for this job" />
		{/if}
	</div>
</div>
