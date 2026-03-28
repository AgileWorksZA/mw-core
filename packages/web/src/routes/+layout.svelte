<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const showSidebar = $derived(data.isLoggedIn && data.pathname !== '/login');
	let sidebarOpen = $state(false);

	// Close sidebar on navigation (mobile)
	$effect(() => {
		data.pathname;
		sidebarOpen = false;
	});
</script>

<div class="flex h-screen overflow-hidden">
	{#if showSidebar}
		<!-- Desktop sidebar (always visible) -->
		<div class="hidden md:block">
			<Sidebar company={data.company} pathname={data.pathname} />
		</div>

		<!-- Mobile sidebar overlay -->
		{#if sidebarOpen}
			<div class="fixed inset-0 z-40 bg-black/50 md:hidden" onclick={() => sidebarOpen = false}></div>
			<div class="fixed inset-y-0 left-0 z-50 md:hidden">
				<Sidebar company={data.company} pathname={data.pathname} />
			</div>
		{/if}
	{/if}

	<div class="flex flex-1 flex-col overflow-hidden">
		{#if showSidebar}
			<div class="flex items-center justify-between border-b border-border bg-card px-4 py-2">
				<!-- Hamburger (mobile only) -->
				<button
					onclick={() => sidebarOpen = !sidebarOpen}
					class="rounded-md p-1.5 text-muted-foreground hover:bg-muted md:hidden"
					aria-label="Toggle sidebar"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<!-- Spacer for desktop -->
				<div class="hidden md:block"></div>
				<SearchBar />
			</div>
		{/if}
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>

<Toast />
