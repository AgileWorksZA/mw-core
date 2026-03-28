<script lang="ts">
	let {
		tabs,
		activeTab = $bindable()
	}: {
		tabs: Array<{ id: string; label: string }>;
		activeTab: string;
	} = $props();
</script>

<div class="flex gap-1 py-1">
	{#each tabs as tab}
		<button
			class="px-4 py-2 text-sm font-medium font-headline transition-colors rounded-xl
				{activeTab === tab.id
					? 'bg-surface-container-lowest text-primary'
					: 'text-muted-foreground hover:text-foreground'}"
			onclick={() => (activeTab = tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>
