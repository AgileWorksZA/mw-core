use leptos::prelude::*;

/// Simple page header with title, subtitle, and optional trailing content.
///
/// Uses Precision Ledger styling: bg-surface-container-lowest, font-headline.
#[component]
pub fn PageHeader(
    /// Page title.
    #[prop(into)]
    title: String,
    /// Optional subtitle text.
    #[prop(default = String::new(), into)]
    subtitle: String,
    /// Optional trailing content (e.g. badges, totals, filter buttons).
    #[prop(optional)]
    children: Option<Children>,
) -> impl IntoView {
    view! {
        <div class="bg-surface-container-lowest px-6 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-xl font-bold font-headline">{title}</h1>
                    {if !subtitle.is_empty() {
                        Some(view! {
                            <p class="text-sm text-muted-foreground">{subtitle}</p>
                        })
                    } else {
                        None
                    }}
                </div>
                {children.map(|c| c())}
            </div>
        </div>
    }
}
