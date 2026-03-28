<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const showSidebar = $derived(data.isLoggedIn && data.pathname !== '/login');
	let sidebarOpen = $state(false);

	$effect(() => {
		data.pathname;
		sidebarOpen = false;
	});
</script>

<div class="flex h-screen overflow-hidden bg-surface">
	{#if showSidebar}
		<div class="hidden md:block">
			<Sidebar company={data.company} pathname={data.pathname} />
		</div>

		{#if sidebarOpen}
			<div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onclick={() => sidebarOpen = false}></div>
			<div class="fixed inset-y-0 left-0 z-50 md:hidden">
				<Sidebar company={data.company} pathname={data.pathname} />
			</div>
		{/if}
	{/if}

	<div class="flex flex-1 flex-col overflow-hidden">
		{#if showSidebar}
			<div class="flex items-center justify-between bg-surface-container-lowest px-5 py-3">
				<button
					onclick={() => sidebarOpen = !sidebarOpen}
					class="rounded-xl p-2 text-muted-foreground hover:bg-surface-container-low md:hidden"
					aria-label="Toggle sidebar"
				>
					<span class="material-symbols-outlined text-xl">menu</span>
				</button>
				<div class="hidden md:block"></div>
				<SearchBar />
			</div>
		{/if}
		<main class="flex-1 overflow-auto bg-surface">
			{@render children()}
		</main>
	</div>
</div>

<Toast />
