use leptos::prelude::*;

use crate::components::currency_display::{format_currency_value, CurrencyDisplay};
use crate::components::data_table::{Column, DataTable, TableRow};
use crate::components::page_header::PageHeader;
use crate::models::customers::*;

#[cfg(feature = "ssr")]
use crate::server::api_client::ElysiaClient;

// ─── TableRow impl for CustomerRow ──────────────────────────────────

impl TableRow for CustomerRow {
    fn get(&self, key: &str) -> String {
        match key {
            "code" => self.code.clone(),
            "name" => self.name.clone(),
            "phone" => self.phone.clone(),
            "category" => self.category.clone(),
            "isDebtor" => {
                if self.is_debtor {
                    "Credit".to_string()
                } else {
                    "Cash".to_string()
                }
            }
            "owed" => {
                if self.owed > 0.01 {
                    format_currency_value(self.owed)
                } else {
                    String::new()
                }
            }
            _ => String::new(),
        }
    }
}

// ─── Server-side data fetch ─────────────────────────────────────────

#[cfg(feature = "ssr")]
pub async fn fetch_customers_data(
    client: &ElysiaClient,
    token: &str,
) -> Result<CustomersData, String> {
    use crate::models::api::NameRecord;

    let params: [(&str, &str); 2] = [("filter", "CustomerType>=\"1\""), ("limit", "500")];
    let names_res = client
        .get::<Vec<NameRecord>>("/tables/name", token, &params)
        .await
        .map_err(|e| format!("Failed to fetch customers: {e}"))?;

    let all = names_res.data.unwrap_or_default();
    let mut customers: Vec<CustomerRow> = Vec::with_capacity(all.len());

    for n in &all {
        let owed = n.d_current.unwrap_or(0.0)
            + n.d_30_plus.unwrap_or(0.0)
            + n.d_60_plus.unwrap_or(0.0)
            + n.d_90_plus.unwrap_or(0.0);
        customers.push(CustomerRow {
            code: n.code.clone().unwrap_or_default(),
            name: n.name.clone().unwrap_or_default(),
            phone: n.phone.clone().unwrap_or_default(),
            category: n.category.clone().unwrap_or_default(),
            is_debtor: n.customer_type.unwrap_or(0) >= 2,
            owed,
        });
    }

    let debtors = customers.iter().filter(|c| c.is_debtor).count();
    let total_owed: f64 = customers.iter().map(|c| c.owed).sum();

    Ok(CustomersData {
        summary: CustomerSummary {
            total: customers.len(),
            debtors,
            total_owed,
        },
        customers,
    })
}

// ─── Server function ────────────────────────────────────────────────

#[server(GetCustomersData)]
pub async fn get_customers_data() -> Result<CustomersData, ServerFnError> {
    let state = use_context::<crate::app::AppState>()
        .ok_or_else(|| ServerFnError::new("AppState not found in context"))?;

    fetch_customers_data(&state.api_client, &state.token)
        .await
        .map_err(|e| ServerFnError::new(e))
}

// ─── Page component ─────────────────────────────────────────────────

#[component]
pub fn CustomersPage() -> impl IntoView {
    let customers = Resource::new(|| (), |_| get_customers_data());

    view! {
        <div class="flex h-full flex-col">
            <Suspense fallback=move || view! {
                <div class="flex h-40 items-center justify-center text-muted-foreground">"Loading customers..."</div>
            }>
                {move || {
                    customers.get().map(|result| match result {
                        Ok(data) => view! { <CustomersContent data=data/> }.into_any(),
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
fn CustomersContent(data: CustomersData) -> impl IntoView {
    let columns = vec![
        Column::new("code", "Code").mono(),
        Column::new("name", "Name").class("font-medium"),
        Column::new("phone", "Phone").class("text-muted-foreground"),
        Column::new("category", "Category").class("text-muted-foreground"),
        Column::new("isDebtor", "Debtor").center(),
        Column::new("owed", "Owed").right(),
    ];

    let subtitle = format!(
        "{} customers \u{2014} {} debtors",
        data.summary.total, data.summary.debtors
    );
    let total_owed = data.summary.total_owed;

    // Custom cell renderer for debtor badge and owed coloring
    let cell_renderer = move |key: &str, row: &CustomerRow| -> Option<AnyView> {
        match key {
            "isDebtor" => {
                if row.is_debtor {
                    Some(
                        view! { <span class="text-xs font-medium text-blue-500">"Credit"</span> }
                            .into_any(),
                    )
                } else {
                    Some(
                        view! { <span class="text-xs text-muted-foreground">"Cash"</span> }
                            .into_any(),
                    )
                }
            }
            "owed" => {
                if row.owed > 0.01 {
                    let amount = row.owed;
                    Some(
                        view! {
                            <span class="font-semibold text-destructive">
                                <CurrencyDisplay amount=Signal::derive(move || amount)/>
                            </span>
                        }
                        .into_any(),
                    )
                } else {
                    Some(view! { <span></span> }.into_any())
                }
            }
            "code" => {
                let code = row.code.clone();
                let href = format!("/names/{}", code);
                Some(
                    view! {
                        <a href=href class="hover:underline">{code}</a>
                    }
                    .into_any(),
                )
            }
            _ => None,
        }
    };

    view! {
        <PageHeader title="Customers" subtitle=subtitle>
            <span class="text-sm text-muted-foreground">
                "Total owed: "
                <span class="font-semibold">
                    <CurrencyDisplay amount=Signal::derive(move || total_owed)/>
                </span>
            </span>
        </PageHeader>

        <div class="flex-1 overflow-auto p-6">
            <DataTable
                columns=columns
                rows=data.customers
                empty_message="No customers found"
                cell_renderer=cell_renderer
            />
        </div>
    }
}
