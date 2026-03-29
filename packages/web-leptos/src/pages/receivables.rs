use leptos::prelude::*;

use crate::components::currency_display::CurrencyDisplay;
use crate::components::page_header::PageHeader;
use crate::models::receivables::*;

#[cfg(feature = "ssr")]
use crate::server::api_client::ElysiaClient;

// ─── Server-side data fetch ─────────────────────────────────────────

#[cfg(feature = "ssr")]
pub async fn fetch_receivables_data(
    client: &ElysiaClient,
    token: &str,
) -> Result<ReceivablesData, String> {
    use crate::models::api::TransactionRecord;

    let today = chrono::Local::now().format("%Y-%m-%d").to_string();

    let params: [(&str, &str); 2] = [
        ("filter", "left(Type,2)=\"DI\" AND Status=\"P\""),
        ("limit", "2000"),
    ];
    let tx_res = client
        .get::<Vec<TransactionRecord>>("/tables/transaction", token, &params)
        .await
        .map_err(|e| format!("Failed to fetch receivables: {e}"))?;

    let all = tx_res.data.unwrap_or_default();

    let mut invoices: Vec<ReceivableRow> = Vec::new();
    for t in &all {
        let gross = t.gross.unwrap_or(0.0);
        let paid = t.amt_paid.unwrap_or(0.0);
        let outstanding = gross - paid;
        if outstanding <= 0.01 {
            continue;
        }
        let due_date = t.due_date.clone().unwrap_or_default();
        let overdue = !due_date.is_empty() && due_date.as_str() < today.as_str();
        invoices.push(ReceivableRow {
            ref_number: t.our_ref.clone().unwrap_or_default(),
            name_code: t.name_code.clone().unwrap_or_default(),
            name: t
                .to_from
                .clone()
                .or_else(|| t.name_code.clone())
                .unwrap_or_default(),
            date: t.trans_date.clone().unwrap_or_default(),
            due_date,
            gross,
            paid,
            outstanding,
            overdue,
        });
    }

    invoices.sort_by(|a, b| a.due_date.cmp(&b.due_date));

    // Summary
    let total_outstanding: f64 = invoices.iter().map(|i| i.outstanding).sum();
    let overdue_count = invoices.iter().filter(|i| i.overdue).count();
    let overdue_amount: f64 = invoices
        .iter()
        .filter(|i| i.overdue)
        .map(|i| i.outstanding)
        .sum();

    // Aging buckets
    let mut aging = AgingBuckets::default();
    let today_date = chrono::NaiveDate::parse_from_str(&today, "%Y-%m-%d").unwrap();
    for inv in &invoices {
        if inv.due_date.is_empty() {
            aging.current += inv.outstanding;
            continue;
        }
        if let Ok(due) = chrono::NaiveDate::parse_from_str(&inv.due_date, "%Y-%m-%d") {
            let days = (today_date - due).num_days();
            if days <= 0 {
                aging.current += inv.outstanding;
            } else if days <= 30 {
                aging.thirty_plus += inv.outstanding;
            } else if days <= 60 {
                aging.sixty_plus += inv.outstanding;
            } else {
                aging.ninety_plus += inv.outstanding;
            }
        } else {
            aging.current += inv.outstanding;
        }
    }

    let invoice_count = invoices.len();
    Ok(ReceivablesData {
        today,
        invoices,
        summary: ReceivablesSummary {
            total_outstanding,
            invoice_count,
            overdue_count,
            overdue_amount,
            aging,
        },
    })
}

// ─── Server function ────────────────────────────────────────────────

#[server(GetReceivablesData)]
pub async fn get_receivables_data() -> Result<ReceivablesData, ServerFnError> {
    let state = use_context::<crate::app::AppState>()
        .ok_or_else(|| ServerFnError::new("AppState not found in context"))?;

    fetch_receivables_data(&state.api_client, &state.token)
        .await
        .map_err(|e| ServerFnError::new(e))
}

// ─── Page component ─────────────────────────────────────────────────

#[component]
pub fn ReceivablesPage() -> impl IntoView {
    let receivables = Resource::new(|| (), |_| get_receivables_data());

    view! {
        <div class="flex h-full flex-col">
            <Suspense fallback=move || view! {
                <div class="flex h-40 items-center justify-center text-muted-foreground">"Loading receivables..."</div>
            }>
                {move || {
                    receivables.get().map(|result| match result {
                        Ok(data) => view! { <ReceivablesContent data=data/> }.into_any(),
                        Err(e) => view! {
                            <div class="p-6 text-destructive">{format!("Error: {e}")}</div>
                        }.into_any(),
                    })
                }}
            </Suspense>
        </div>
    }
}

#[component]
fn ReceivablesContent(data: ReceivablesData) -> impl IntoView {
    let summary = data.summary.clone();
    let subtitle = format!("Outstanding sales invoices \u{2014} {}", data.today);
    let overdue_count = summary.overdue_count;

    let total_outstanding = summary.total_outstanding;
    let invoice_count = summary.invoice_count;
    let overdue_amount = summary.overdue_amount;

    // Aging bar total
    let aging = summary.aging.clone();
    let aging_total = aging.current + aging.thirty_plus + aging.sixty_plus + aging.ninety_plus;

    let has_invoices = !data.invoices.is_empty();
    let invoices = data.invoices;

    view! {
        <PageHeader title="Receivables" subtitle=subtitle>
            {if overdue_count > 0 {
                Some(view! {
                    <span class="rounded-full bg-destructive px-3 py-1 text-sm font-medium text-white">
                        {format!("{overdue_count} overdue")}
                    </span>
                })
            } else {
                None
            }}
        </PageHeader>

        <div class="flex-1 overflow-auto p-6">
            // Summary cards
            <div class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <SummaryCard label="Outstanding" value=format_currency(total_outstanding) />
                <SummaryCard label="Invoices" value=invoice_count.to_string() />
                <SummaryCard label="Overdue" value=overdue_count.to_string() color="red" />
                <SummaryCard label="Overdue Amount" value=format_currency(overdue_amount) color="red" />
            </div>

            // Aging bar
            {if aging_total > 0.0 {
                let current_pct = (aging.current / aging_total) * 100.0;
                let thirty_pct = (aging.thirty_plus / aging_total) * 100.0;
                let sixty_pct = (aging.sixty_plus / aging_total) * 100.0;
                let ninety_pct = (aging.ninety_plus / aging_total) * 100.0;
                Some(view! {
                    <div class="mb-6">
                        <div class="mb-2 flex justify-between text-xs text-muted-foreground">
                            <span>"Aging Distribution"</span>
                        </div>
                        <div class="flex h-3 overflow-hidden rounded-full">
                            <div class="bg-positive" style=format!("width: {current_pct:.1}%")></div>
                            <div class="bg-amber-400" style=format!("width: {thirty_pct:.1}%")></div>
                            <div class="bg-orange-500" style=format!("width: {sixty_pct:.1}%")></div>
                            <div class="bg-red-500" style=format!("width: {ninety_pct:.1}%")></div>
                        </div>
                        <div class="mt-2 flex gap-4 text-xs text-muted-foreground">
                            <span class="flex items-center gap-1">
                                <span class="inline-block h-2 w-2 rounded-full bg-positive"></span>
                                "Current"
                            </span>
                            <span class="flex items-center gap-1">
                                <span class="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
                                "30+ days"
                            </span>
                            <span class="flex items-center gap-1">
                                <span class="inline-block h-2 w-2 rounded-full bg-orange-500"></span>
                                "60+ days"
                            </span>
                            <span class="flex items-center gap-1">
                                <span class="inline-block h-2 w-2 rounded-full bg-red-500"></span>
                                "90+ days"
                            </span>
                        </div>
                    </div>
                })
            } else {
                None
            }}

            // Invoice table
            {if has_invoices {
                view! {
                    <div class="overflow-auto rounded-xl bg-surface-container-lowest">
                        <table class="w-full text-sm">
                            <thead class="sticky top-0">
                                <tr class="bg-surface-container-low">
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Invoice"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Customer"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Date"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Due Date"</th>
                                    <th class="px-3 py-2.5 text-right font-medium text-muted-foreground">"Gross"</th>
                                    <th class="px-3 py-2.5 text-right font-medium text-muted-foreground">"Paid"</th>
                                    <th class="px-3 py-2.5 text-right font-medium text-muted-foreground">"Outstanding"</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.into_iter().map(|inv| {
                                    let row_class = if inv.overdue { "transition-colors hover:bg-surface-container-low text-destructive" } else { "transition-colors hover:bg-surface-container-low" };
                                    let due_class = if inv.overdue { "px-3 py-2 font-semibold" } else { "px-3 py-2" };
                                    let gross = inv.gross;
                                    let paid = inv.paid;
                                    let outstanding = inv.outstanding;
                                    view! {
                                        <tr class=row_class>
                                            <td class="px-3 py-2 font-mono text-xs">{inv.ref_number}</td>
                                            <td class="px-3 py-2">{inv.name}</td>
                                            <td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
                                            <td class=due_class>{inv.due_date}</td>
                                            <td class="px-3 py-2 text-right">
                                                <CurrencyDisplay amount=Signal::derive(move || gross)/>
                                            </td>
                                            <td class="px-3 py-2 text-right">
                                                <CurrencyDisplay amount=Signal::derive(move || paid)/>
                                            </td>
                                            <td class="px-3 py-2 text-right font-semibold">
                                                <CurrencyDisplay amount=Signal::derive(move || outstanding)/>
                                            </td>
                                        </tr>
                                    }
                                }).collect::<Vec<_>>()}
                            </tbody>
                        </table>
                    </div>
                }.into_any()
            } else {
                view! {
                    <div class="flex h-40 items-center justify-center text-muted-foreground">"No outstanding receivables"</div>
                }.into_any()
            }}
        </div>
    }
}

/// Summary card used in the receivables page.
#[component]
fn SummaryCard(
    #[prop(into)] label: String,
    #[prop(into)] value: String,
    #[prop(default = "default".to_string(), into)] color: String,
) -> impl IntoView {
    let value_class = match color.as_str() {
        "red" => "text-2xl font-bold tabular-nums text-destructive",
        _ => "text-2xl font-bold tabular-nums",
    };

    view! {
        <div class="rounded-xl bg-surface-container-lowest p-4">
            <div class="text-xs text-muted-foreground">{label}</div>
            <div class=value_class>{value}</div>
        </div>
    }
}

fn format_currency(value: f64) -> String {
    crate::components::currency_display::format_currency_value(value)
}
