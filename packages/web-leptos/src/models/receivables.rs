//! Receivables page data structures.

use serde::{Deserialize, Serialize};

/// A single receivable invoice row.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ReceivableRow {
    pub ref_number: String,
    pub name_code: String,
    pub name: String,
    pub date: String,
    pub due_date: String,
    pub gross: f64,
    pub paid: f64,
    pub outstanding: f64,
    pub overdue: bool,
}

/// Aging buckets for the stacked bar.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct AgingBuckets {
    pub current: f64,
    pub thirty_plus: f64,
    pub sixty_plus: f64,
    pub ninety_plus: f64,
}

/// Summary statistics.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct ReceivablesSummary {
    pub total_outstanding: f64,
    pub invoice_count: usize,
    pub overdue_count: usize,
    pub overdue_amount: f64,
    pub aging: AgingBuckets,
}

/// Full receivables page payload.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ReceivablesData {
    pub today: String,
    pub invoices: Vec<ReceivableRow>,
    pub summary: ReceivablesSummary,
}
