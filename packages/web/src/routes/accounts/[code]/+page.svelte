<script lang="ts">
	import ColourBadge from '$lib/components/ColourBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { account, lookups } = data;

	const isBank = $derived(account.system === 'BK' || account.system === 'CC');
	const taxCodeInfo = $derived(lookups.taxCodes.find((t) => t.code === account.taxCode));
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="bg-surface-container-lowest px-6 py-4">
		<div class="flex items-center gap-3">
			<a href="/accounts" class="text-muted-foreground hover:text-foreground">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<ColourBadge colour={account.colour} />
			<div>
				<div class="flex items-center gap-2">
					<h1 class="font-headline text-xl font-bold">{account.description || account.code}</h1>
					<span class="rounded bg-surface-container-low px-2 py-0.5 text-xs font-mono text-muted-foreground">
						{account.code}
					</span>
				</div>
				<div class="mt-0.5 flex gap-1.5">
					<span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
						{account.type} {account.typeLabel}
					</span>
					{#if isBank}
						<span class="rounded-full bg-surface-container-low px-2 py-0.5 text-xs text-muted-foreground">
							{account.system === 'CC' ? 'Credit Card' : 'Bank'}
						</span>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-auto p-6">
		<div class="grid grid-cols-2 gap-6">
			<!-- Classification -->
			<div class="rounded-xl bg-surface-container-lowest p-4">
				<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Classification</h3>
				<div class="space-y-2 text-sm">
					<div class="flex gap-2">
						<span class="w-24 shrink-0 text-muted-foreground">Type</span>
						<span>{account.type} — {account.typeLabel}</span>
					</div>
					{#if account.group}
						<div class="flex gap-2">
							<span class="w-24 shrink-0 text-muted-foreground">Group</span>
							<span>{account.group}</span>
						</div>
					{/if}
					{#if account.pandl}
						<div class="flex gap-2">
							<span class="w-24 shrink-0 text-muted-foreground">P&L</span>
							<span>{account.pandl}</span>
						</div>
					{/if}
					{#if account.system}
						<div class="flex gap-2">
							<span class="w-24 shrink-0 text-muted-foreground">System</span>
							<span>{account.system}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Tax -->
			<div class="rounded-xl bg-surface-container-lowest p-4">
				<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tax & Currency</h3>
				<div class="space-y-2 text-sm">
					<div class="flex gap-2">
						<span class="w-24 shrink-0 text-muted-foreground">Tax Code</span>
						<span>
							{account.taxCode || 'Default'}
							{#if taxCodeInfo}
								<span class="text-muted-foreground">({taxCodeInfo.name}, {taxCodeInfo.rate}%)</span>
							{/if}
						</span>
					</div>
					{#if account.currency}
						<div class="flex gap-2">
							<span class="w-24 shrink-0 text-muted-foreground">Currency</span>
							<span>{account.currency}</span>
						</div>
					{/if}
					{#if account.accountantCode}
						<div class="flex gap-2">
							<span class="w-24 shrink-0 text-muted-foreground">Accountant</span>
							<span class="font-mono">{account.accountantCode}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Categories -->
			{#if account.category || account.category2 || account.category3 || account.category4}
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
					<div class="space-y-2 text-sm">
						{#if account.category}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Cat 1</span><span>{account.category}</span></div>{/if}
						{#if account.category2}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Cat 2</span><span>{account.category2}</span></div>{/if}
						{#if account.category3}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Cat 3</span><span>{account.category3}</span></div>{/if}
						{#if account.category4}<div class="flex gap-2"><span class="w-20 text-muted-foreground">Cat 4</span><span>{account.category4}</span></div>{/if}
					</div>
				</div>
			{/if}

			<!-- Banking -->
			{#if isBank}
				<div class="rounded-xl bg-surface-container-lowest p-4">
					<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Banking</h3>
					<div class="space-y-2 text-sm">
						{#if account.bankAccountNumber}
							<div class="flex gap-2">
								<span class="w-24 shrink-0 text-muted-foreground">Account #</span>
								<span class="font-mono">{account.bankAccountNumber}</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Comments -->
			{#if account.comments}
				<div class="col-span-2 rounded-xl bg-surface-container-lowest p-4">
					<h3 class="font-headline mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Comments</h3>
					<p class="whitespace-pre-wrap text-sm">{account.comments}</p>
				</div>
			{/if}
		</div>
	</div>
</div>
