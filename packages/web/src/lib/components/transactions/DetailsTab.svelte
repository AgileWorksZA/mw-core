<script lang="ts">
	import type { TransactionScreenData } from '$lib/api/types';

	let { header }: { header: TransactionScreenData['transaction']['header'] } = $props();

	const payMethodLabels: Record<number, string> = {
		0: 'None',
		1: 'Cash',
		2: 'Cheque',
		3: 'Electronic',
		4: 'Credit Card',
		5: 'User Defined 1',
		6: 'User Defined 2',
		7: 'User Defined 3'
	};
</script>

<div class="grid grid-cols-2 gap-6">
	<!-- References -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			References
		</h3>
		<div class="space-y-2 text-sm">
			<div class="flex gap-2">
				<span class="w-24 shrink-0 text-muted-foreground">Our Ref</span>
				<span class="font-mono">{header.ourRef}</span>
			</div>
			{#if header.theirRef}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Their Ref</span>
					<span>{header.theirRef}</span>
				</div>
			{/if}
			{#if header.analysis}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Analysis/Job</span>
					<span class="font-mono">{header.analysis}</span>
				</div>
			{/if}
			{#if header.salesPerson}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Salesperson</span>
					<span>{header.salesPerson}</span>
				</div>
			{/if}
			{#if header.flag}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Flag</span>
					<span>{header.flag}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Payment -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Payment
		</h3>
		<div class="space-y-2 text-sm">
			<div class="flex gap-2">
				<span class="w-28 shrink-0 text-muted-foreground">Method</span>
				<span>{payMethodLabels[header.paymentMethod] ?? 'Unknown'}</span>
			</div>
			{#if header.contra}
				<div class="flex gap-2">
					<span class="w-28 shrink-0 text-muted-foreground">Bank/Control</span>
					<span class="font-mono">{header.contra}</span>
				</div>
			{/if}
			{#if header.currency}
				<div class="flex gap-2">
					<span class="w-28 shrink-0 text-muted-foreground">Currency</span>
					<span>{header.currency}</span>
					{#if header.exchangeRate}
						<span class="text-muted-foreground">@ {header.exchangeRate}</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- Description -->
	{#if header.description}
		<div class="col-span-2 rounded-lg border border-border p-4">
			<h3 class="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
				Description
			</h3>
			<p class="whitespace-pre-wrap text-sm">{header.description}</p>
		</div>
	{/if}

	<!-- Addresses -->
	{#if header.deliveryAddress || header.mailingAddress}
		{#if header.mailingAddress}
			<div class="rounded-lg border border-border p-4">
				<h3 class="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
					Mailing Address
				</h3>
				<p class="whitespace-pre-wrap text-sm">{header.mailingAddress}</p>
			</div>
		{/if}
		{#if header.deliveryAddress}
			<div class="rounded-lg border border-border p-4">
				<h3 class="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
					Delivery Address
				</h3>
				<p class="whitespace-pre-wrap text-sm">{header.deliveryAddress}</p>
			</div>
		{/if}
	{/if}
</div>
