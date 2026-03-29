use leptos::prelude::*;

/// Refresh indicator showing live/paused connection status with a refresh button.
///
/// Mirrors the SvelteKit RefreshIndicator component. Shows "Live" badge when SSE
/// is connected (green), "Paused" when not. Includes a spinning refresh button.
#[component]
pub fn RefreshIndicator(
    /// Whether auto-refresh / SSE is currently enabled.
    enabled: Signal<bool>,
    /// Whether a refresh is currently in progress.
    refreshing: Signal<bool>,
    /// Callback to toggle auto-refresh on/off.
    on_toggle: Callback<()>,
    /// Callback to trigger an immediate refresh.
    on_refresh: Callback<()>,
) -> impl IntoView {
    let refresh_icon_class = move || {
        if refreshing.get() {
            "h-4 w-4 animate-spin"
        } else {
            "h-4 w-4"
        }
    };

    let status_class = move || {
        if enabled.get() {
            "rounded-xl px-1.5 py-0.5 transition-colors bg-positive/10 text-positive"
        } else {
            "rounded-xl px-1.5 py-0.5 transition-colors bg-surface-container-low text-muted-foreground"
        }
    };

    let status_title = move || {
        if enabled.get() {
            "Auto-refresh ON (30s)"
        } else {
            "Auto-refresh OFF"
        }
    };

    let status_label = move || {
        if enabled.get() {
            "Live"
        } else {
            "Paused"
        }
    };

    view! {
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <button
                on:click=move |_| on_refresh.run(())
                disabled=move || refreshing.get()
                class="rounded-xl p-1 hover:bg-surface-container-low transition-colors disabled:opacity-50"
                title="Refresh now"
                aria-label="Refresh now"
            >
                <svg class=refresh_icon_class fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
            <button
                on:click=move |_| on_toggle.run(())
                class=status_class
                title=status_title
            >
                {status_label}
            </button>
        </div>
    }
}
