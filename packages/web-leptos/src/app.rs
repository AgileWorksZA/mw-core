use leptos::prelude::*;
use leptos_meta::{provide_meta_context, MetaTags, Stylesheet, Title};
use leptos_router::{
    components::{Route, Router, Routes},
    StaticSegment,
};

use crate::components::sidebar::Sidebar;
use crate::components::theme_toggle::ThemeToggle;
use crate::pages::dashboard::DashboardPage;

#[cfg(feature = "ssr")]
use crate::server::api_client::ElysiaClient;

/// Shared app state available to Axum handlers and server functions
#[derive(Clone, Debug)]
#[cfg(feature = "ssr")]
pub struct AppState {
    pub leptos_options: LeptosOptions,
    pub api_client: ElysiaClient,
    pub token: String,
}

#[cfg(feature = "ssr")]
impl axum::extract::FromRef<AppState> for LeptosOptions {
    fn from_ref(state: &AppState) -> Self {
        state.leptos_options.clone()
    }
}

pub fn shell(options: LeptosOptions) -> impl IntoView {
    view! {
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Manrope:wght@400..800&display=swap" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet"/>
                <AutoReload options=options.clone()/>
                <HydrationScripts options/>
                <MetaTags/>
            </head>
            <body>
                <App/>
            </body>
        </html>
    }
}

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Stylesheet id="leptos" href="/pkg/mw-web-leptos.css"/>
        <Title text="MoneyWorks"/>

        <Router>
            <div class="flex h-screen overflow-hidden bg-surface">
                // Sidebar (hidden on mobile)
                <div class="hidden md:block">
                    <Sidebar pathname=Signal::derive(|| String::from("/dashboard")) company="Acme Widgets Ltd".to_string()/>
                </div>

                // Main content
                <div class="flex flex-1 flex-col overflow-hidden">
                    // Top bar
                    <div class="flex items-center justify-between bg-surface-container-lowest px-3 md:px-5 py-3">
                        <div class="hidden md:block"></div>
                        <div class="flex items-center gap-3">
                            <ThemeToggle/>
                        </div>
                    </div>

                    // Page content
                    <main class="flex-1 overflow-auto bg-surface">
                        <Routes fallback=|| view! { <p class="p-6 text-muted-foreground">"Page not found."</p> }>
                            <Route path=StaticSegment("") view=DashboardPage/>
                            <Route path=StaticSegment("dashboard") view=DashboardPage/>
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    }
}
