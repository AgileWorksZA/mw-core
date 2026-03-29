use leptos::prelude::*;

use crate::components::currency_display::CurrencyDisplay;
use crate::components::page_header::PageHeader;
use crate::models::invoices::*;

#[cfg(feature = "ssr")]
use crate::server::api_client::ElysiaClient;

// ─── Server-side data fetch ─────────────────────────────────────────

#[cfg(feature = "ssr")]
pub async fn fetch_sales_invoices_data(
    client: &ElysiaClient,
    token: &str,
    status: &str,
) -> Result<SalesInvoicesData, String> {
    use crate::models::api::TransactionRecord;

    let today = chrono::Local::now().format("%Y-%m-%d").to_string();

    let mut filter_parts = vec!["left(Type,2)=\"DI\"".to_string()];
    match status {
        "posted" => filter_parts.push("Status=\"P\"".to_string()),
        "unposted" => filter_parts.push("Status=\"U\"".to_string()),
        _ => {}
    }
    let filter = filter_parts.join(" AND ");

    let params: [(&str, &str); 2] = [("filter", filter.as_str()), ("limit", "500")];
    let tx_res = client
        .get::<Vec<TransactionRecord>>("/tables/transaction", token, &params)
        .await
        .map_err(|e| format!("Failed to fetch sales invoices: {e}"))?;

    let all = tx_res.data.unwrap_or_default();

    let mut invoices: Vec<SalesInvoiceRow> = Vec::with_capacity(all.len());
    for t in &all {
        let gross = t.gross.unwrap_or(0.0);
        let paid = t.amt_paid.unwrap_or(0.0);
        let outstanding = gross - paid;
        let due_date = t.due_date.clone().unwrap_or_default();
        let tx_status = t.status.clone().unwrap_or_default();
        let overdue =
            outstanding > 0.01 && !due_date.is_empty() && due_date.as_str() < today.as_str();
        invoices.push(SalesInvoiceRow {
            seq: t.sequence_number.unwrap_or(0),
            ref_number: t.our_ref.clone().unwrap_or_default(),
            name_code: t.name_code.clone().unwrap_or_default(),
            name: t
                .to_from
                .clone()
                .or_else(|| t.name_code.clone())
                .unwrap_or_default(),
            description: t.description.clone().unwrap_or_default(),
            date: t.trans_date.clone().unwrap_or_default(),
            due_date,
            gross,
            paid,
            outstanding,
            status: tx_status,
            overdue,
        });
    }

    let posted = invoices.iter().filter(|i| i.status == "P").count();
    let total_gross: f64 = invoices.iter().map(|i| i.gross).sum();
    let total_outstanding: f64 = invoices.iter().map(|i| i.outstanding).sum();

    Ok(SalesInvoicesData {
        today,
        invoices,
        status: status.to_string(),
        summary: SalesInvoicesSummary {
            total: all.len(),
            posted,
            unposted: all.len() - posted,
            total_gross,
            total_outstanding,
        },
    })
}

// ─── Server function ────────────────────────────────────────────────

#[server(GetSalesInvoicesData)]
pub async fn get_sales_invoices_data(
    status: String,
) -> Result<SalesInvoicesData, ServerFnError> {
    let state = use_context::<crate::app::AppState>()
        .ok_or_else(|| ServerFnError::new("AppState not found in context"))?;

    fetch_sales_invoices_data(&state.api_client, &state.token, &status)
        .await
        .map_err(|e| ServerFnError::new(e))
}

// ─── Page component ─────────────────────────────────────────────────

#[component]
pub fn InvoicesSalesPage() -> impl IntoView {
    let (status, set_status) = signal("all".to_string());

    let invoices = Resource::new(
        move || status.get(),
        |s| get_sales_invoices_data(s),
    );

    view! {
        <div class="flex h-full flex-col">
            <Suspense fallback=move || view! {
                <div class="flex h-40 items-center justify-center text-muted-foreground">"Loading sales invoices..."</div>
            }>
                {move || {
                    invoices.get().map(|result| match result {
                        Ok(data) => {
                            let set_status = set_status.clone();
                            view! { <InvoicesSalesContent data=data set_status=set_status/> }.into_any()
                        }
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
fn InvoicesSalesContent(
    data: SalesInvoicesData,
    set_status: WriteSignal<String>,
) -> impl IntoView {
    let subtitle = format!(
        "{} invoices \u{2014} {}",
        data.summary.total, data.today
    );
    let current_status = data.status.clone();

    let total_gross = data.summary.total_gross;
    let total_outstanding = data.summary.total_outstanding;

    let has_invoices = !data.invoices.is_empty();
    let invoices = data.invoices;

    // Status filter button classes
    let btn_class = |key: &str| -> &'static str {
        if key == current_status.as_str() {
            "rounded-md px-3 py-1.5 text-sm transition-colors bg-primary text-primary-foreground"
        } else {
            "rounded-md px-3 py-1.5 text-sm transition-colors bg-muted text-muted-foreground hover:bg-muted/80"
        }
    };

    let all_class = btn_class("all");
    let posted_class = btn_class("posted");
    let unposted_class = btn_class("unposted");

    view! {
        <PageHeader title="Sales Invoices" subtitle=subtitle>
            <div class="flex gap-1">
                <button class=all_class on:click=move |_| set_status.set("all".to_string())>"All"</button>
                <button class=posted_class on:click=move |_| set_status.set("posted".to_string())>"Posted"</button>
                <button class=unposted_class on:click=move |_| set_status.set("unposted".to_string())>"Unposted"</button>
            </div>
        </PageHeader>

        <div class="flex-1 overflow-auto p-6">
            // Summary cards
            <div class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
                <SummaryCard label="Invoices" value=data.summary.total.to_string() />
                <SummaryCard label="Posted" value=data.summary.posted.to_string() color="green" />
                <SummaryCard label="Unposted" value=data.summary.unposted.to_string() color="amber" />
                <SummaryCard label="Total Gross" value=format_currency(total_gross) />
                {
                    let outstanding_color = if total_outstanding > 0.0 { "red".to_string() } else { "default".to_string() };
                    view! { <SummaryCard label="Outstanding" value=format_currency(total_outstanding) color=outstanding_color /> }
                }
            </div>

            // Invoice table
            {if has_invoices {
                view! {
                    <div class="overflow-auto rounded-xl bg-surface-container-lowest">
                        <table class="w-full text-sm">
                            <thead class="sticky top-0">
                                <tr class="bg-surface-container-low">
                                    <th class="w-8 px-3 py-2.5 text-left font-medium text-muted-foreground">"St"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Invoice"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Customer"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Description"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Date"</th>
                                    <th class="px-3 py-2.5 text-left font-medium text-muted-foreground">"Due"</th>
                                    <th class="px-3 py-2.5 text-right font-medium text-muted-foreground">"Gross"</th>
                                    <th class="px-3 py-2.5 text-right font-medium text-muted-foreground">"Paid"</th>
                                    <th class="px-3 py-2.5 text-right font-medium text-muted-foreground">"Outstanding"</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.into_iter().map(|inv| {
                                    let row_class = if inv.overdue {
                                        "transition-colors hover:bg-surface-container-low text-destructive"
                                    } else {
                                        "transition-colors hover:bg-surface-container-low"
                                    };
                                    let due_class = if inv.overdue { "px-3 py-2 font-semibold" } else { "px-3 py-2" };
                                    let status_dot = if inv.status == "P" { "inline-block h-2 w-2 rounded-full bg-positive" } else { "inline-block h-2 w-2 rounded-full bg-amber-500" };
                                    let href = format!("/transactions/{}", inv.seq);
                                    let gross = inv.gross;
                                    let paid = inv.paid;
                                    let outstanding = inv.outstanding;
                                    let show_outstanding = outstanding > 0.01;
                                    view! {
                                        <tr class=row_class>
                                            <td class="px-3 py-2">
                                                <span class=status_dot></span>
                                            </td>
                                            <td class="px-3 py-2 font-mono text-xs">
                                                <a href=href class="hover:underline">{inv.ref_number}</a>
                                            </td>
                                            <td class="px-3 py-2">{inv.name}</td>
                                            <td class="max-w-xs truncate px-3 py-2 text-muted-foreground">{inv.description}</td>
                                            <td class="px-3 py-2 text-muted-foreground">{inv.date}</td>
                                            <td class=due_class>{inv.due_date}</td>
                                            <td class="px-3 py-2 text-right">
                                                <CurrencyDisplay amount=Signal::derive(move || gross)/>
                                            </td>
                                            <td class="px-3 py-2 text-right">
                                                <CurrencyDisplay amount=Signal::derive(move || paid)/>
                                            </td>
                                            <td class="px-3 py-2 text-right font-semibold">
                                                {if show_outstanding {
                                                    view! { <CurrencyDisplay amount=Signal::derive(move || outstanding)/> }.into_any()
                                                } else {
                                                    view! { <span></span> }.into_any()
                                                }}
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
                    <div class="flex h-40 items-center justify-center text-muted-foreground">"No sales invoices found"</div>
                }.into_any()
            }}
        </div>
    }
}

/// Summary card used in the sales invoices page.
#[component]
fn SummaryCard(
    #[prop(into)] label: String,
    #[prop(into)] value: String,
    #[prop(default = "default".to_string(), into)] color: String,
) -> impl IntoView {
    let value_class = match color.as_str() {
        "red" => "text-2xl font-bold tabular-nums text-destructive",
        "green" => "text-2xl font-bold tabular-nums text-positive",
        "amber" => "text-2xl font-bold tabular-nums text-amber-500",
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
