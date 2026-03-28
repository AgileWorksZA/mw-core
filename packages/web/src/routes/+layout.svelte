<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const showSidebar = $derived(data.isLoggedIn && data.pathname !== '/login');
</script>

<div class="flex h-screen overflow-hidden">
	{#if showSidebar}
		<Sidebar company={data.company} pathname={data.pathname} />
	{/if}
	<div class="flex flex-1 flex-col overflow-hidden">
		{#if showSidebar}
			<div class="flex items-center justify-end border-b border-border bg-card px-4 py-2">
				<SearchBar />
			</div>
		{/if}
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
