<script lang="ts">
	import type { NameScreenData } from '$lib/api/types';

	let { contacts }: { contacts: NameScreenData['name']['contacts'] } = $props();

	let selectedIndex = $state(0);
	const selected = $derived(contacts[selectedIndex]);
</script>

<div class="grid grid-cols-3 gap-6">
	<!-- Contact List -->
	<div class="rounded-lg border border-border">
		<div class="border-b border-border bg-muted/50 px-3 py-2">
			<h3 class="text-sm font-semibold text-muted-foreground">
				Contacts ({contacts.length})
			</h3>
		</div>
		{#if contacts.length === 0}
			<div class="p-4 text-center text-sm text-muted-foreground">No contacts</div>
		{:else}
			<div class="divide-y divide-border">
				{#each contacts as contact, i}
					<button
						class="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50
							{i === selectedIndex ? 'bg-primary/5 border-l-2 border-l-primary' : ''}"
						onclick={() => (selectedIndex = i)}
					>
						<div class="font-medium">{contact.name || 'Unnamed'}</div>
						{#if contact.position}
							<div class="text-xs text-muted-foreground">{contact.position}</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Contact Detail -->
	<div class="col-span-2 rounded-lg border border-border p-4">
		{#if selected}
			<h3 class="mb-4 text-lg font-semibold">{selected.name || 'Unnamed Contact'}</h3>
			<div class="grid grid-cols-2 gap-4 text-sm">
				{#if selected.salutation}
					<div>
						<span class="text-muted-foreground">Salutation</span>
						<p>{selected.salutation}</p>
					</div>
				{/if}
				{#if selected.position}
					<div>
						<span class="text-muted-foreground">Position</span>
						<p>{selected.position}</p>
					</div>
				{/if}
				{#if selected.phone}
					<div>
						<span class="text-muted-foreground">Phone / DDI</span>
						<p>{selected.phone}</p>
					</div>
				{/if}
				{#if selected.mobile}
					<div>
						<span class="text-muted-foreground">Mobile</span>
						<p>{selected.mobile}</p>
					</div>
				{/if}
				{#if selected.email}
					<div>
						<span class="text-muted-foreground">Email</span>
						<p>
							<a href="mailto:{selected.email}" class="text-primary hover:underline">{selected.email}</a>
						</p>
					</div>
				{/if}
				{#if selected.memo}
					<div class="col-span-2">
						<span class="text-muted-foreground">Memo</span>
						<p class="whitespace-pre-wrap">{selected.memo}</p>
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-center text-sm text-muted-foreground">Select a contact</p>
		{/if}
	</div>
</div>
