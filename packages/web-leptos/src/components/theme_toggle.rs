use leptos::prelude::*;

/// Dark mode toggle button.
///
/// On the client, reads localStorage key "theme" to determine initial state.
/// Toggles the "dark" class on the document element and persists to localStorage.
/// Uses Material Symbols-style SVG icons for light_mode / dark_mode.
#[component]
pub fn ThemeToggle() -> impl IntoView {
    // Start with light; client-side effect will correct on hydration.
    let (is_dark, set_is_dark) = signal(false);

    // On mount (client only): read stored theme or system preference.
    #[cfg(feature = "hydrate")]
    {
        use leptos::task::spawn_local;
        spawn_local(async move {
            if let Some(window) = web_sys::window() {
                let storage = window.local_storage().ok().flatten();
                let stored = storage.as_ref().and_then(|s| s.get_item("theme").ok().flatten());

                let dark = match stored.as_deref() {
                    Some("dark") => true,
                    Some("light") => false,
                    _ => window
                        .match_media("(prefers-color-scheme: dark)")
                        .ok()
                        .flatten()
                        .map(|mql| mql.matches())
                        .unwrap_or(false),
                };

                set_is_dark.set(dark);
                apply_theme_to_dom(dark);
            }
        });
    }

    let toggle = move |_| {
        let new_dark = !is_dark.get();
        set_is_dark.set(new_dark);

        #[cfg(feature = "hydrate")]
        apply_theme_to_dom(new_dark);
    };

    view! {
        <button
            on:click=toggle
            class="rounded-xl p-2 text-muted-foreground hover:bg-surface-container-low transition-colors"
            title=move || if is_dark.get() { "Switch to light mode" } else { "Switch to dark mode" }
            aria-label="Toggle theme"
        >
            {move || {
                if is_dark.get() {
                    // Sun icon (currently dark, click to go light)
                    view! {
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    }.into_any()
                } else {
                    // Moon icon (currently light, click to go dark)
                    view! {
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    }.into_any()
                }
            }}
        </button>
    }
}

/// Apply the dark/light theme to the DOM and persist to localStorage.
#[cfg(feature = "hydrate")]
fn apply_theme_to_dom(dark: bool) {
    if let Some(window) = web_sys::window() {
        if let Some(doc) = window.document() {
            if let Some(root) = doc.document_element() {
                let class_list = root.class_list();
                if dark {
                    let _ = class_list.add_1("dark");
                } else {
                    let _ = class_list.remove_1("dark");
                }
            }
        }

        if let Ok(Some(storage)) = window.local_storage() {
            let _ = storage.set_item("theme", if dark { "dark" } else { "light" });
        }
    }
}
