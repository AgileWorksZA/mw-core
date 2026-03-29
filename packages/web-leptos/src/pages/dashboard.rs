use leptos::prelude::*;

use crate::components::charts::bank_chart::BankChart;
use crate::components::charts::debtors_chart::DebtorsChart;
use crate::components::charts::profit_chart::ProfitChart;
use crate::components::currency_display::CurrencyDisplay;
use crate::components::refresh_indicator::RefreshIndicator;
use crate::models::dashboard::*;

#[cfg(feature = "ssr")]
use crate::server::api_client::ElysiaClient;

/// Fetch dashboard data from the Elysia API (server-side only)
#[cfg(feature = "ssr")]
pub async fn fetch_dashboard_data(
    client: &ElysiaClient,
    token: &str,
) -> Result<DashboardData, String> {
    use crate::models::api::*;
    use std::collections::HashMap;

    let today = chrono_today();
    let thirty_days_ago = chrono_days_ago(30);
    let _year_start = chrono_year_start();

    // Fetch transactions, accounts, and names in parallel
    let sales_filter = format!("left(Type,2)=\"DI\" AND Transdate>=\"{}\"", thirty_days_ago);
    let purchases_filter = format!("left(Type,2)=\"CI\" AND Transdate>=\"{}\"", thirty_days_ago);
    let sales_params: [(&str, &str); 2] = [("filter", sales_filter.as_str()), ("limit", "500")];
    let purchases_params: [(&str, &str); 2] = [("filter", purchases_filter.as_str()), ("limit", "500")];
    let account_params: [(&str, &str); 1] = [("limit", "500")];
    let name_params: [(&str, &str); 1] = [("limit", "500")];
    let (sales_res, purchases_res, accounts_res, names_res) = tokio::join!(
        client.get::<Vec<TransactionRecord>>("/tables/transaction", token, &sales_params),
        client.get::<Vec<TransactionRecord>>("/tables/transaction", token, &purchases_params),
        client.get::<Vec<AccountRecord>>("/tables/account", token, &account_params),
        client.get::<Vec<NameRecord>>("/tables/name", token, &name_params),
    );

    let sales = sales_res.ok().and_then(|r| r.data).unwrap_or_default();
    let purchases = purchases_res.ok().and_then(|r| r.data).unwrap_or_default();
    let accounts = accounts_res.ok().and_then(|r| r.data).unwrap_or_default();
    let names = names_res.ok().and_then(|r| r.data).unwrap_or_default();

    // Bank accounts
    let bank_account_records: Vec<&AccountRecord> = accounts
        .iter()
        .filter(|a| {
            let sys = a.system.as_deref().unwrap_or("");
            sys == "BK" || sys == "CC"
        })
        .collect();

    // Build balance eval expressions
    let mut eval_exprs: HashMap<String, String> = HashMap::new();
    eval_exprs.insert("currentAssets".into(), "GetBalance(\"Type=\\\"CA\\\"\", Today())".into());
    eval_exprs.insert("currentLiabilities".into(), "GetBalance(\"Type=\\\"CL\\\"\", Today())".into());
    eval_exprs.insert("receivables".into(), "GetBalance(\"AccountCode=\\\"1500\\\"\", Today())".into());
    eval_exprs.insert("payables".into(), "GetBalance(\"AccountCode=\\\"2500\\\"\", Today())".into());
    for bank in &bank_account_records {
        let code = bank.code.as_deref().unwrap_or("");
        eval_exprs.insert(
            format!("bank_{}", code),
            format!("GetBalance(\"AccountCode=\\\"{}\\\"\", Today())", code),
        );
    }

    let balance_results = client.eval_batch(&eval_exprs, token).await.unwrap_or_default();

    let parse_num = |s: &str| -> f64 { s.parse::<f64>().unwrap_or(0.0) };

    let bank_accounts: Vec<BankAccount> = bank_account_records
        .iter()
        .map(|a| {
            let code = a.code.clone().unwrap_or_default();
            BankAccount {
                balance: parse_num(balance_results.get(&format!("bank_{}", code)).unwrap_or(&"0".into())),
                code,
                description: a.description.clone().unwrap_or_default(),
                account_type: a.system.clone().unwrap_or_default(),
            }
        })
        .collect();

    let receivables = parse_num(balance_results.get("receivables").unwrap_or(&"0".into()));
    let payables = parse_num(balance_results.get("payables").unwrap_or(&"0".into())).abs();
    let current_assets = parse_num(balance_results.get("currentAssets").unwrap_or(&"0".into()));
    let current_liabilities = parse_num(balance_results.get("currentLiabilities").unwrap_or(&"0".into())).abs();
    let current_ratio = if current_liabilities > 0.0 {
        current_assets / current_liabilities
    } else {
        0.0
    };

    // Period metrics
    let sum_gross = |txns: &[TransactionRecord]| -> f64 {
        txns.iter().map(|t| t.gross.unwrap_or(0.0)).sum()
    };

    let seven_days_ago = chrono_days_ago(7);
    let sales_today: Vec<_> = sales.iter().filter(|t| t.trans_date.as_deref() == Some(&today)).cloned().collect();
    let purchases_today: Vec<_> = purchases.iter().filter(|t| t.trans_date.as_deref() == Some(&today)).cloned().collect();
    let sales_7: Vec<_> = sales.iter().filter(|t| t.trans_date.as_deref().unwrap_or("") >= seven_days_ago.as_str()).cloned().collect();
    let purchases_7: Vec<_> = purchases.iter().filter(|t| t.trans_date.as_deref().unwrap_or("") >= seven_days_ago.as_str()).cloned().collect();

    let period_metrics = |s: &[TransactionRecord], p: &[TransactionRecord]| -> PeriodMetrics {
        let sales_total = sum_gross(s);
        let cogs_total = sum_gross(p);
        PeriodMetrics {
            sales: sales_total,
            cogs: cogs_total,
            gross_margin: sales_total - cogs_total,
            margin_pct: if sales_total > 0.0 { ((sales_total - cogs_total) / sales_total) * 100.0 } else { 0.0 },
            invoice_count: s.len() as u32,
        }
    };

    // Debtor aging
    let debtors = DebtorAging {
        current: names.iter().map(|n| n.d_current.unwrap_or(0.0)).sum(),
        one_cycle: names.iter().map(|n| n.d_30_plus.unwrap_or(0.0)).sum(),
        two_cycles: names.iter().map(|n| n.d_60_plus.unwrap_or(0.0)).sum(),
        three_or_more: names.iter().map(|n| n.d_90_plus.unwrap_or(0.0)).sum(),
    };

    // Profit chart (simplified — empty for PoC, would need year-to-date transactions)
    let profit_chart = Vec::new();

    Ok(DashboardData {
        date: today,
        periods: PeriodData {
            today: period_metrics(&sales_today, &purchases_today),
            seven_day: period_metrics(&sales_7, &purchases_7),
            thirty_day: period_metrics(&sales, &purchases),
        },
        balances: BalanceData {
            receivables,
            payables,
            bank_accounts,
        },
        debtors,
        current_ratio,
        profit_chart,
    })
}

#[cfg(feature = "ssr")]
fn chrono_today() -> String {
    chrono::Local::now().format("%Y-%m-%d").to_string()
}

#[cfg(feature = "ssr")]
fn chrono_days_ago(days: i64) -> String {
    (chrono::Local::now() - chrono::Duration::days(days))
        .format("%Y-%m-%d")
        .to_string()
}

#[cfg(feature = "ssr")]
fn chrono_year_start() -> String {
    let now = chrono::Local::now();
    format!("{}-01-01", now.format("%Y"))
}

/// Server function to load dashboard data
#[server(GetDashboardData)]
pub async fn get_dashboard_data() -> Result<DashboardData, ServerFnError> {
    let state = use_context::<crate::app::AppState>()
        .ok_or_else(|| ServerFnError::new("AppState not found in context"))?;

    fetch_dashboard_data(&state.api_client, &state.token)
        .await
        .map_err(|e| ServerFnError::new(e))
}

/// Dashboard page component
#[component]
pub fn DashboardPage() -> impl IntoView {
    let dashboard = Resource::new(|| (), |_| get_dashboard_data());

    view! {
        <div class="flex h-full flex-col">
            // Header
            <div class="bg-surface-container-lowest px-3 md:px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl font-bold font-headline">"Dashboard"</h1>
                        <p class="text-sm text-muted-foreground">"Company Overview"</p>
                    </div>
                    <RefreshIndicator
                        enabled=Signal::derive(|| true)
                        refreshing=Signal::derive(|| false)
                        on_toggle=Callback::new(|_| {})
                        on_refresh=Callback::new(|_| {})
                    />
                </div>
            </div>

            // Content
            <Suspense fallback=move || view! {
                <div class="flex h-40 items-center justify-center text-muted-foreground">"Loading..."</div>
            }>
                {move || {
                    dashboard.get().map(|result| match result {
                        Ok(data) => view! { <DashboardContent data=data/> }.into_any(),
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
fn DashboardContent(data: DashboardData) -> impl IntoView {
    let total_debtors = data.debtors.current + data.debtors.one_cycle + data.debtors.two_cycles + data.debtors.three_or_more;

    view! {
        <div class="flex-1 overflow-auto p-3 md:p-6 space-y-6 md:space-y-12">
            // Charts 2x2 grid
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                // Profit chart
                <div class="rounded-xl bg-surface-container-lowest p-6">
                    <h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">"Profit"</h3>
                    {if data.profit_chart.is_empty() {
                        view! { <div class="flex h-40 items-center justify-center text-muted-foreground text-sm">"No data"</div> }.into_any()
                    } else {
                        view! { <ProfitChart data=data.profit_chart.clone()/> }.into_any()
                    }}
                </div>

                // Current ratio
                <div class="rounded-xl bg-surface-container-lowest p-6">
                    <h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">"Current Ratio"</h3>
                    <div class="flex items-center justify-center">
                        <div class="text-center">
                            <div class={format!("text-5xl font-bold tabular-nums {}",
                                if data.current_ratio >= 1.5 { "text-positive" }
                                else if data.current_ratio >= 1.0 { "text-amber-500" }
                                else { "text-destructive" }
                            )}>
                                {format!("{:.2}", data.current_ratio)}
                            </div>
                            <div class="mt-2 text-sm text-muted-foreground">"Current Assets / Current Liabilities"</div>
                        </div>
                    </div>
                </div>

                // Bank balances
                <div class="rounded-xl bg-surface-container-lowest p-6">
                    <h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">"Bank Balances"</h3>
                    {if data.balances.bank_accounts.is_empty() {
                        view! { <div class="flex h-40 items-center justify-center text-muted-foreground text-sm">"No bank accounts"</div> }.into_any()
                    } else {
                        view! { <BankChart data=data.balances.bank_accounts.clone()/> }.into_any()
                    }}
                </div>

                // Debtors
                <div class="rounded-xl bg-surface-container-lowest p-6">
                    <h3 class="mb-2 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">"Debtors"</h3>
                    {if total_debtors > 0.0 {
                        view! { <DebtorsChart debtors=data.debtors.clone()/> }.into_any()
                    } else {
                        view! { <div class="flex h-40 items-center justify-center text-muted-foreground text-sm">"No debtors"</div> }.into_any()
                    }}
                </div>
            </div>

            // Balances & Aging
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                // Balances
                <div>
                    <h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">"Balances"</h2>
                    <div class="space-y-3 tabular-nums">
                        <div class="rounded-xl bg-surface-container-lowest p-4">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">"Receivables"</span>
                                <span class="text-lg font-bold"><CurrencyDisplay amount=data.balances.receivables/></span>
                            </div>
                        </div>
                        <div class="rounded-xl bg-surface-container-lowest p-4">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">"Payables"</span>
                                <span class="text-lg font-bold"><CurrencyDisplay amount=data.balances.payables/></span>
                            </div>
                        </div>
                    </div>
                </div>

                // Debtors aging detail
                <div>
                    <h2 class="mb-4 text-sm font-semibold font-headline text-muted-foreground uppercase tracking-wider">"Debtors Aging"</h2>
                    <div class="rounded-xl bg-surface-container-lowest p-4 tabular-nums">
                        <div class="space-y-3">
                            <div class="flex justify-between text-sm">
                                <span class="text-muted-foreground">"Current"</span>
                                <CurrencyDisplay amount=data.debtors.current/>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-muted-foreground">"1 cycle (30+ days)"</span>
                                <CurrencyDisplay amount=data.debtors.one_cycle/>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-muted-foreground">"2 cycles (60+ days)"</span>
                                <CurrencyDisplay amount=data.debtors.two_cycles/>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-muted-foreground">"3+ cycles (90+ days)"</span>
                                <CurrencyDisplay amount=data.debtors.three_or_more/>
                            </div>
                            <div class="flex justify-between pt-2 font-semibold">
                                <span>"Total Debtors"</span>
                                <CurrencyDisplay amount=total_debtors/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
