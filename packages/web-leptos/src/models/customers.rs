//! Customer page data structures.

use serde::{Deserialize, Serialize};

/// A single customer row for the table.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CustomerRow {
    pub code: String,
    pub name: String,
    pub phone: String,
    pub category: String,
    pub is_debtor: bool,
    pub owed: f64,
}

/// Summary stats shown in the page header.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CustomerSummary {
    pub total: usize,
    pub debtors: usize,
    #[serde(rename = "totalOwed")]
    pub total_owed: f64,
}

/// Full customers page payload.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CustomersData {
    pub customers: Vec<CustomerRow>,
    pub summary: CustomerSummary,
}
