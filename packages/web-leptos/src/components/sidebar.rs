use leptos::prelude::*;
use leptos_router::components::A;

/// A single navigation item in the sidebar.
#[derive(Clone, Debug)]
struct NavItem {
    href: &'static str,
    label: &'static str,
    icon: &'static str,
    group: &'static str,
}

/// A group of navigation items sharing a section header.
#[derive(Clone, Debug)]
struct NavGroup {
    label: &'static str,
    items: Vec<NavItem>,
}

/// All sidebar nav items, mirroring the SvelteKit Sidebar.svelte.
fn nav_items() -> Vec<NavItem> {
    vec![
        NavItem { href: "/dashboard", label: "Overview", icon: "dashboard", group: "Dashboards" },
        NavItem { href: "/dashboard/daily-summary", label: "Daily Summary", icon: "calendar", group: "Dashboards" },
        NavItem { href: "/dashboard/income-expenses", label: "Income & Expenses", icon: "trending", group: "Dashboards" },
        NavItem { href: "/dashboard/yoy-income", label: "YoY Income", icon: "trending", group: "Dashboards" },
        NavItem { href: "/dashboard/ledger-chart", label: "Ledger Chart", icon: "trending", group: "Dashboards" },
        NavItem { href: "/dashboard/sales-explorer", label: "Sales Explorer", icon: "search", group: "Dashboards" },
        NavItem { href: "/dashboard/calendar", label: "Calendar", icon: "calendar", group: "Dashboards" },
        NavItem { href: "/quotes", label: "Quotes", icon: "file-text", group: "Sales" },
        NavItem { href: "/orders/sales", label: "Sales Orders", icon: "file-text", group: "Sales" },
        NavItem { href: "/invoices/sales", label: "Sales Invoices", icon: "file-text", group: "Sales" },
        NavItem { href: "/receivables", label: "Receivables", icon: "arrow-down", group: "Sales" },
        NavItem { href: "/batch-receipts", label: "Batch Receipts", icon: "arrow-down", group: "Sales" },
        NavItem { href: "/customers", label: "Customers", icon: "users", group: "Sales" },
        NavItem { href: "/orders/purchases", label: "Purchase Orders", icon: "file-text", group: "Purchases" },
        NavItem { href: "/receive-goods", label: "Receive Goods", icon: "box", group: "Purchases" },
        NavItem { href: "/invoices/purchases", label: "Purchase Invoices", icon: "file-text", group: "Purchases" },
        NavItem { href: "/payables", label: "Payables", icon: "arrow-up", group: "Purchases" },
        NavItem { href: "/batch-payments", label: "Batch Payments", icon: "arrow-up", group: "Purchases" },
        NavItem { href: "/suppliers", label: "Suppliers", icon: "users", group: "Purchases" },
        NavItem { href: "/banking", label: "Banking", icon: "ledger", group: "Cash & Banking" },
        NavItem { href: "/receipts", label: "Receipts", icon: "arrow-down", group: "Cash & Banking" },
        NavItem { href: "/payments", label: "Payments", icon: "arrow-up", group: "Cash & Banking" },
        NavItem { href: "/journals", label: "Journals", icon: "file-text", group: "Cash & Banking" },
        NavItem { href: "/funds-transfer", label: "Funds Transfer", icon: "trending", group: "Cash & Banking" },
        NavItem { href: "/bank-reconciliation", label: "Bank Rec", icon: "ledger", group: "Cash & Banking" },
        NavItem { href: "/transactions", label: "All Transactions", icon: "file-text", group: "Cash & Banking" },
        NavItem { href: "/names", label: "Names", icon: "users", group: "Master Data" },
        NavItem { href: "/items", label: "Items", icon: "box", group: "Master Data" },
        NavItem { href: "/accounts", label: "Accounts", icon: "ledger", group: "Master Data" },
        NavItem { href: "/assets", label: "Fixed Assets", icon: "box", group: "Master Data" },
        NavItem { href: "/tax-rates", label: "Tax Rates", icon: "file-text", group: "Master Data" },
        NavItem { href: "/jobs", label: "Jobs", icon: "box", group: "Master Data" },
        NavItem { href: "/enquiry/sales", label: "Sales Enquiry", icon: "search", group: "Enquiries" },
        NavItem { href: "/enquiry/purchases", label: "Purchase Enquiry", icon: "cart", group: "Enquiries" },
        NavItem { href: "/reports", label: "Reports", icon: "file-text", group: "Reports & Tools" },
        NavItem { href: "/todo", label: "To Do", icon: "dashboard", group: "Reports & Tools" },
        NavItem { href: "/import-export", label: "Import / Export", icon: "trending", group: "Reports & Tools" },
        NavItem { href: "/housekeeping", label: "Housekeeping", icon: "dashboard", group: "Reports & Tools" },
        NavItem { href: "/preferences", label: "Preferences", icon: "dashboard", group: "Reports & Tools" },
    ]
}

/// Group flat nav items into labeled sections.
fn grouped_items() -> Vec<NavGroup> {
    let items = nav_items();
    let mut groups: Vec<NavGroup> = Vec::new();
    let mut current_group = "";

    for item in items {
        if item.group != current_group {
            current_group = item.group;
            groups.push(NavGroup {
                label: current_group,
                items: Vec::new(),
            });
        }
        if let Some(last) = groups.last_mut() {
            last.items.push(item);
        }
    }

    groups
}

/// Render an SVG icon by name, matching the SvelteKit icon set.
#[component]
fn NavIcon(icon: &'static str) -> impl IntoView {
    match icon {
        "dashboard" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        }.into_any(),
        "search" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        }.into_any(),
        "file-text" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        }.into_any(),
        "users" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        }.into_any(),
        "box" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        }.into_any(),
        "ledger" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
        }.into_any(),
        "cart" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        }.into_any(),
        "calendar" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        }.into_any(),
        "trending" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
                <polyline points="17,6 23,6 23,12" />
            </svg>
        }.into_any(),
        "arrow-down" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-7-7m7 7l7-7" />
            </svg>
        }.into_any(),
        "arrow-up" => view! {
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
        }.into_any(),
        // Fallback: empty span
        _ => view! { <span class="h-4 w-4" /> }.into_any(),
    }
}

/// Sidebar navigation component.
///
/// Displays the MoneyWorks brand, grouped nav links, and a logout button.
/// Uses `bg-sidebar text-sidebar-foreground` with deep navy styling.
/// Active item uses `bg-sidebar-accent`.
#[component]
pub fn Sidebar(
    /// The current URL pathname, used for active-link highlighting.
    pathname: Signal<String>,
    /// Company name to display below the brand.
    #[prop(into)]
    company: String,
) -> impl IntoView {
    let groups = grouped_items();

    view! {
        <aside class="flex h-full w-60 flex-col bg-sidebar text-sidebar-foreground">
            // Brand
            <div class="px-4 py-6">
                <h1 class="text-lg font-bold font-headline">"MoneyWorks"</h1>
                {if !company.is_empty() {
                    let c = company.clone();
                    Some(view! {
                        <p class="mt-0.5 truncate text-xs text-sidebar-foreground/60">{c}</p>
                    })
                } else {
                    None
                }}
            </div>

            // Navigation
            <nav class="flex-1 overflow-auto sidebar-scroll px-2 py-3">
                {groups.into_iter().map(|group| {
                    let items = group.items;
                    view! {
                        <div class="mb-1 px-3 pt-3 pb-1 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest first:pt-0">
                            {group.label}
                        </div>
                        {items.into_iter().map(|item| {
                            let href = item.href;
                            let label = item.label;
                            let icon = item.icon;
                            let is_active = {
                                let pathname = pathname.clone();
                                move || {
                                    let path = pathname.get();
                                    if href == "/dashboard" {
                                        path == "/dashboard"
                                    } else {
                                        path.starts_with(href)
                                    }
                                }
                            };
                            view! {
                                <A
                                    href=href
                                    attr:class=move || {
                                        if is_active() {
                                            "mb-0.5 flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm transition-colors bg-sidebar-accent text-sidebar-foreground font-medium"
                                        } else {
                                            "mb-0.5 flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm transition-colors text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground"
                                        }
                                    }
                                >
                                    <NavIcon icon=icon />
                                    {label}
                                </A>
                            }
                        }).collect::<Vec<_>>()}
                    }
                }).collect::<Vec<_>>()}
            </nav>

            // Logout
            <div class="px-2 py-6">
                <form method="POST" action="/logout">
                    <button
                        type="submit"
                        class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-muted hover:text-sidebar-foreground"
                    >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16,17 21,12 16,7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        "Logout"
                    </button>
                </form>
            </div>
        </aside>
    }
}
