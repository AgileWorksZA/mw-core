use leptos::prelude::*;
use leptos_meta::{provide_meta_context, MetaTags, Stylesheet, Title};
use leptos_router::{
    components::{Route, Router, Routes},
    hooks::use_location,
    StaticSegment,
};

use crate::components::sidebar::Sidebar;
use crate::components::theme_toggle::ThemeToggle;
use crate::pages::customers::CustomersPage;
use crate::pages::dashboard::DashboardPage;
use crate::pages::invoices_sales::InvoicesSalesPage;
use crate::pages::receivables::ReceivablesPage;

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
                // Blocking script: apply dark mode before first paint to prevent flash
                <script>{r#"
                    (function(){
                        var t = localStorage.getItem('theme');
                        if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                            document.documentElement.classList.add('dark');
                        }
                    })();
                "#}</script>
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

/// Stub page for routes not yet ported.
#[component]
fn StubPage(title: &'static str) -> impl IntoView {
    view! {
        <div class="flex h-full flex-col">
            <div class="bg-surface-container-lowest px-3 md:px-6 py-4">
                <h1 class="text-xl font-bold font-headline">{title}</h1>
                <p class="text-sm text-muted-foreground">"Coming soon"</p>
            </div>
        </div>
    }
}

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Stylesheet id="leptos" href="/pkg/mw-web-leptos.css"/>
        <Title text="MoneyWorks"/>

        <Router>
            <AppLayout/>
        </Router>
    }
}

/// Inner layout that has access to router context for `use_location`.
#[component]
fn AppLayout() -> impl IntoView {
    let location = use_location();
    let pathname = Signal::derive(move || location.pathname.get());

    view! {
        <div class="flex h-screen overflow-hidden bg-surface">
            // Sidebar (hidden on mobile)
            <div class="hidden md:block">
                <Sidebar pathname=pathname company="Acme Widgets Ltd".to_string()/>
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
                        // Dashboard routes
                        <Route path=StaticSegment("") view=DashboardPage/>
                        <Route path=StaticSegment("dashboard") view=DashboardPage/>
                        <Route path=(StaticSegment("dashboard"), StaticSegment("daily-summary")) view=|| view! { <StubPage title="Daily Summary"/> }/>
                        <Route path=(StaticSegment("dashboard"), StaticSegment("income-expenses")) view=|| view! { <StubPage title="Income & Expenses"/> }/>
                        <Route path=(StaticSegment("dashboard"), StaticSegment("yoy-income")) view=|| view! { <StubPage title="YoY Income"/> }/>
                        <Route path=(StaticSegment("dashboard"), StaticSegment("ledger-chart")) view=|| view! { <StubPage title="Ledger Chart"/> }/>
                        <Route path=(StaticSegment("dashboard"), StaticSegment("sales-explorer")) view=|| view! { <StubPage title="Sales Explorer"/> }/>
                        <Route path=(StaticSegment("dashboard"), StaticSegment("calendar")) view=|| view! { <StubPage title="Calendar"/> }/>

                        // Sales routes
                        <Route path=StaticSegment("quotes") view=|| view! { <StubPage title="Quotes"/> }/>
                        <Route path=(StaticSegment("orders"), StaticSegment("sales")) view=|| view! { <StubPage title="Sales Orders"/> }/>
                        <Route path=(StaticSegment("invoices"), StaticSegment("sales")) view=InvoicesSalesPage/>
                        <Route path=StaticSegment("receivables") view=ReceivablesPage/>
                        <Route path=StaticSegment("batch-receipts") view=|| view! { <StubPage title="Batch Receipts"/> }/>
                        <Route path=StaticSegment("customers") view=CustomersPage/>

                        // Purchases routes
                        <Route path=(StaticSegment("orders"), StaticSegment("purchases")) view=|| view! { <StubPage title="Purchase Orders"/> }/>
                        <Route path=StaticSegment("receive-goods") view=|| view! { <StubPage title="Receive Goods"/> }/>
                        <Route path=(StaticSegment("invoices"), StaticSegment("purchases")) view=|| view! { <StubPage title="Purchase Invoices"/> }/>
                        <Route path=StaticSegment("payables") view=|| view! { <StubPage title="Payables"/> }/>
                        <Route path=StaticSegment("batch-payments") view=|| view! { <StubPage title="Batch Payments"/> }/>
                        <Route path=StaticSegment("suppliers") view=|| view! { <StubPage title="Suppliers"/> }/>

                        // Cash & Banking routes
                        <Route path=StaticSegment("banking") view=|| view! { <StubPage title="Banking"/> }/>
                        <Route path=StaticSegment("receipts") view=|| view! { <StubPage title="Receipts"/> }/>
                        <Route path=StaticSegment("payments") view=|| view! { <StubPage title="Payments"/> }/>
                        <Route path=StaticSegment("journals") view=|| view! { <StubPage title="Journals"/> }/>
                        <Route path=StaticSegment("funds-transfer") view=|| view! { <StubPage title="Funds Transfer"/> }/>
                        <Route path=StaticSegment("bank-reconciliation") view=|| view! { <StubPage title="Bank Rec"/> }/>
                        <Route path=StaticSegment("transactions") view=|| view! { <StubPage title="All Transactions"/> }/>

                        // Master Data routes
                        <Route path=StaticSegment("names") view=|| view! { <StubPage title="Names"/> }/>
                        <Route path=StaticSegment("items") view=|| view! { <StubPage title="Items"/> }/>
                        <Route path=StaticSegment("accounts") view=|| view! { <StubPage title="Accounts"/> }/>
                        <Route path=StaticSegment("assets") view=|| view! { <StubPage title="Fixed Assets"/> }/>
                        <Route path=StaticSegment("tax-rates") view=|| view! { <StubPage title="Tax Rates"/> }/>
                        <Route path=StaticSegment("jobs") view=|| view! { <StubPage title="Jobs"/> }/>

                        // Enquiries
                        <Route path=(StaticSegment("enquiry"), StaticSegment("sales")) view=|| view! { <StubPage title="Sales Enquiry"/> }/>
                        <Route path=(StaticSegment("enquiry"), StaticSegment("purchases")) view=|| view! { <StubPage title="Purchase Enquiry"/> }/>

                        // Reports & Tools
                        <Route path=StaticSegment("reports") view=|| view! { <StubPage title="Reports"/> }/>
                        <Route path=StaticSegment("todo") view=|| view! { <StubPage title="To Do"/> }/>
                        <Route path=StaticSegment("import-export") view=|| view! { <StubPage title="Import / Export"/> }/>
                        <Route path=StaticSegment("housekeeping") view=|| view! { <StubPage title="Housekeeping"/> }/>
                        <Route path=StaticSegment("preferences") view=|| view! { <StubPage title="Preferences"/> }/>
                    </Routes>
                </main>
            </div>
        </div>
    }
}
