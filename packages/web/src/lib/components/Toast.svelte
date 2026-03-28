<script lang="ts">
	import { toasts, dismissToast } from '$lib/stores/toast';
</script>

{#if $toasts.length > 0}
	<div class="fixed bottom-4 right-4 z-50 space-y-2">
		{#each $toasts as toast (toast.id)}
			<div
				class="flex items-start gap-3 rounded-xl px-4 py-3 shadow-md max-w-sm animate-in
					{toast.type === 'error' ? 'bg-destructive/10 text-destructive' :
					 toast.type === 'success' ? 'bg-positive/10 text-positive' :
					 'bg-surface-container-lowest text-foreground'}"
			>
				{#if toast.type === 'error'}
					<svg class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<line x1="15" y1="9" x2="9" y2="15" />
						<line x1="9" y1="9" x2="15" y2="15" />
					</svg>
				{/if}
				<div class="flex-1 text-sm">{toast.message}</div>
				<button onclick={() => dismissToast(toast.id)} class="flex-shrink-0 opacity-50 hover:opacity-100">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}
