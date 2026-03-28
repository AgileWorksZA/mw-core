<script lang="ts">
	import type { NameScreenData } from '$lib/api/types';

	let { bank }: { bank: NameScreenData['name']['bankEdi'] } = $props();

	const payMethodLabels: Record<number, string> = {
		0: 'None',
		1: 'Cash',
		2: 'Cheque',
		3: 'Electronic',
		4: 'Credit Card',
		5: 'Direct Debit'
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
	<!-- Payment Method -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Payment
		</h3>
		<div class="space-y-2 text-sm">
			<div class="flex justify-between">
				<span class="text-muted-foreground">They pay by</span>
				<span>{payMethodLabels[bank.payBy] ?? `Method ${bank.payBy}`}</span>
			</div>
		</div>
	</div>

	<!-- Bank Details -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Bank Details
		</h3>
		<div class="space-y-2 text-sm">
			{#if bank.bank}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Bank</span>
					<span>{bank.bank}</span>
				</div>
			{/if}
			{#if bank.branch}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Branch</span>
					<span>{bank.branch}</span>
				</div>
			{/if}
			{#if bank.accountName}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Account Name</span>
					<span>{bank.accountName}</span>
				</div>
			{/if}
			{#if bank.accountNumber}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Account #</span>
					<span class="font-mono">{bank.accountNumber}</span>
				</div>
			{/if}
			{#if !bank.bank && !bank.branch && !bank.accountName && !bank.accountNumber}
				<p class="text-muted-foreground italic">No bank details recorded</p>
			{/if}
		</div>
	</div>

	<!-- Electronic -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Electronic
		</h3>
		<div class="space-y-2 text-sm">
			{#if bank.eInvoicingId}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">E-Invoicing ID</span>
					<span class="font-mono text-xs">{bank.eInvoicingId}</span>
				</div>
			{:else}
				<p class="text-muted-foreground italic">No e-invoicing configured</p>
			{/if}
		</div>
	</div>

	<!-- Card Details -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Card Details
		</h3>
		<div class="space-y-2 text-sm">
			{#if bank.cardNumber}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Card #</span>
					<span class="font-mono">****{bank.cardNumber.slice(-4)}</span>
				</div>
				{#if bank.cardName}
					<div class="flex gap-2">
						<span class="w-24 shrink-0 text-muted-foreground">Name</span>
						<span>{bank.cardName}</span>
					</div>
				{/if}
				{#if bank.cardExpiry}
					<div class="flex gap-2">
						<span class="w-24 shrink-0 text-muted-foreground">Expiry</span>
						<span>{bank.cardExpiry}</span>
					</div>
				{/if}
			{:else}
				<p class="text-muted-foreground italic">No card on file</p>
			{/if}
		</div>
	</div>
</div>
