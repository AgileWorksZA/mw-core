<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const showSidebar = $derived(data.isLoggedIn && data.pathname !== '/login');
</script>

<div class="flex h-screen overflow-hidden">
	{#if showSidebar}
		<Sidebar company={data.company} pathname={data.pathname} />
	{/if}
	<main class="flex-1 overflow-auto" class:pl-0={!showSidebar}>
		{@render children()}
	</main>
</div>
