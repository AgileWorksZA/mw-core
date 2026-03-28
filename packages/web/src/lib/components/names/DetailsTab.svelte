<script lang="ts">
	import type { NameScreenData } from '$lib/api/types';

	let { details }: { details: NameScreenData['name']['details'] } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
	<!-- Mailing Address -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Mailing Address
		</h3>
		<div class="space-y-1 text-sm">
			{#each details.mailing as line}
				<p>{line}</p>
			{/each}
			{#if details.postCode || details.state}
				<p class="text-muted-foreground">{details.state} {details.postCode}</p>
			{/if}
		</div>
	</div>

	<!-- Delivery Address -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Delivery Address
		</h3>
		<div class="space-y-1 text-sm">
			{#if details.delivery.length > 0}
				{#each details.delivery as line}
					<p>{line}</p>
				{/each}
				{#if details.deliveryPostCode || details.deliveryState}
					<p class="text-muted-foreground">{details.deliveryState} {details.deliveryPostCode}</p>
				{/if}
			{:else}
				<p class="text-muted-foreground italic">Same as mailing</p>
			{/if}
		</div>
	</div>

	<!-- Contact Info -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Contact
		</h3>
		<div class="space-y-2 text-sm">
			{#if details.phone}
				<div class="flex gap-2">
					<span class="w-16 shrink-0 text-muted-foreground">Phone</span>
					<span>{details.phone}</span>
				</div>
			{/if}
			{#if details.fax}
				<div class="flex gap-2">
					<span class="w-16 shrink-0 text-muted-foreground">Fax</span>
					<span>{details.fax}</span>
				</div>
			{/if}
			{#if details.mobile}
				<div class="flex gap-2">
					<span class="w-16 shrink-0 text-muted-foreground">Mobile</span>
					<span>{details.mobile}</span>
				</div>
			{/if}
			{#if details.email}
				<div class="flex gap-2">
					<span class="w-16 shrink-0 text-muted-foreground">Email</span>
					<a href="mailto:{details.email}" class="text-primary hover:underline">{details.email}</a>
				</div>
			{/if}
			{#if details.webUrl}
				<div class="flex gap-2">
					<span class="w-16 shrink-0 text-muted-foreground">Web</span>
					<a href="{details.webUrl.startsWith('http') ? details.webUrl : `https://${details.webUrl}`}" target="_blank" rel="noopener" class="text-primary hover:underline">
						{details.webUrl}
					</a>
				</div>
			{/if}
		</div>
	</div>

	<!-- Additional Info -->
	<div class="rounded-xl bg-surface-container-lowest p-4">
		<h3 class="font-headline mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Additional
		</h3>
		<div class="space-y-2 text-sm">
			{#if details.gstNo}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">GST#</span>
					<span>{details.gstNo}</span>
				</div>
			{/if}
			{#if details.theirRef}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Their Ref</span>
					<span>{details.theirRef}</span>
				</div>
			{/if}
			{#if details.category1}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Category 1</span>
					<span>{details.category1}</span>
				</div>
			{/if}
			{#if details.category2}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Category 2</span>
					<span>{details.category2}</span>
				</div>
			{/if}
			{#if details.category3}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Category 3</span>
					<span>{details.category3}</span>
				</div>
			{/if}
			{#if details.category4}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Category 4</span>
					<span>{details.category4}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Comments -->
	{#if details.comment}
		<div class="col-span-2 rounded-xl bg-surface-container-lowest p-4">
			<h3 class="font-headline mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
				Comment
			</h3>
			<p class="whitespace-pre-wrap text-sm">{details.comment}</p>
		</div>
	{/if}
</div>
