//! Sales invoices page data structures.

use serde::{Deserialize, Serialize};

/// A single sales invoice row.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SalesInvoiceRow {
    pub seq: i64,
    pub ref_number: String,
    pub name_code: String,
    pub name: String,
    pub description: String,
    pub date: String,
    pub due_date: String,
    pub gross: f64,
    pub paid: f64,
    pub outstanding: f64,
    pub status: String,
    pub overdue: bool,
}

/// Summary statistics for the sales invoices page.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct SalesInvoicesSummary {
    pub total: usize,
    pub posted: usize,
    pub unposted: usize,
    pub total_gross: f64,
    pub total_outstanding: f64,
}

/// Full sales invoices page payload.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SalesInvoicesData {
    pub today: String,
    pub invoices: Vec<SalesInvoiceRow>,
    pub status: String,
    pub summary: SalesInvoicesSummary,
}
