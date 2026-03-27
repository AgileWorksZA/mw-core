<script lang="ts">
	let {
		tabs,
		activeTab = $bindable()
	}: {
		tabs: Array<{ id: string; label: string }>;
		activeTab: string;
	} = $props();
</script>

<div class="flex border-b border-border">
	{#each tabs as tab}
		<button
			class="relative px-4 py-2.5 text-sm font-medium transition-colors
				{activeTab === tab.id
					? 'text-primary'
					: 'text-muted-foreground hover:text-foreground'}"
			onclick={() => (activeTab = tab.id)}
		>
			{tab.label}
			{#if activeTab === tab.id}
				<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
			{/if}
		</button>
	{/each}
</div>
