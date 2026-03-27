<script lang="ts">
	import type { TransactionScreenData } from '$lib/api/types';

	let { header }: { header: TransactionScreenData['transaction']['header'] } = $props();
</script>

<div class="grid grid-cols-2 gap-6">
	<!-- Status -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Status
		</h3>
		<div class="space-y-2 text-sm">
			<div class="flex gap-2">
				<span class="w-20 shrink-0 text-muted-foreground">Status</span>
				<span>
					{#if header.status === 'P'}
						<span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
							Posted
						</span>
					{:else}
						<span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
							Unposted
						</span>
					{/if}
				</span>
			</div>
			<div class="flex gap-2">
				<span class="w-20 shrink-0 text-muted-foreground">Hold</span>
				<span class={header.hold ? 'font-semibold text-destructive' : ''}>
					{header.hold ? 'ON HOLD' : 'No'}
				</span>
			</div>
		</div>
	</div>

	<!-- Audit Trail -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Audit Trail
		</h3>
		<div class="space-y-2 text-sm">
			{#if header.enteredBy}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Entered by</span>
					<span>{header.enteredBy}</span>
				</div>
			{/if}
			{#if header.enterDate}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Enter date</span>
					<span>{header.enterDate}</span>
				</div>
			{/if}
			{#if header.postedBy}
				<div class="flex gap-2">
					<span class="w-20 shrink-0 text-muted-foreground">Posted by</span>
					<span>{header.postedBy}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Dates -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Dates
		</h3>
		<div class="space-y-2 text-sm">
			<div class="flex gap-2">
				<span class="w-24 shrink-0 text-muted-foreground">Trans Date</span>
				<span>{header.date}</span>
			</div>
			{#if header.dueDate}
				<div class="flex gap-2">
					<span class="w-24 shrink-0 text-muted-foreground">Due Date</span>
					<span>{header.dueDate}</span>
				</div>
			{/if}
			<div class="flex gap-2">
				<span class="w-24 shrink-0 text-muted-foreground">Period</span>
				<span>{header.period}</span>
			</div>
		</div>
	</div>

	<!-- Type Info -->
	<div class="rounded-lg border border-border p-4">
		<h3 class="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
			Classification
		</h3>
		<div class="space-y-2 text-sm">
			<div class="flex gap-2">
				<span class="w-20 shrink-0 text-muted-foreground">Type</span>
				<span>
					<span class="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">{header.type}</span>
					{header.typeLabel}
				</span>
			</div>
			<div class="flex gap-2">
				<span class="w-20 shrink-0 text-muted-foreground">Sequence</span>
				<span class="font-mono text-xs">{header.id}</span>
			</div>
		</div>
	</div>
</div>
