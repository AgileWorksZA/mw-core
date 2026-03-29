//! Dashboard data structures.
//!
//! Mirrors the shape returned by the SvelteKit +page.server.ts dashboard loader.
//! These types are used on both server (SSR) and client (hydration) sides.

use serde::{Deserialize, Serialize};

/// Top-level dashboard payload returned to the page component.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DashboardData {
    /// ISO date string (YYYY-MM-DD) of when the data was fetched.
    pub date: String,
    /// Revenue / margin metrics for today, 7-day, and 30-day windows.
    pub periods: PeriodData,
    /// GL-based balance summary: receivables, payables, and bank accounts.
    pub balances: BalanceData,
    /// Debtor aging buckets aggregated from the Name table.
    pub debtors: DebtorAging,
    /// Current assets / current liabilities ratio from GL.
    #[serde(rename = "currentRatio")]
    pub current_ratio: f64,
    /// Monthly income vs expenses for the last 12 months.
    #[serde(rename = "profitChart")]
    pub profit_chart: Vec<ProfitMonth>,
}

/// Period metrics for three rolling windows.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PeriodData {
    pub today: PeriodMetrics,
    #[serde(rename = "sevenDay")]
    pub seven_day: PeriodMetrics,
    #[serde(rename = "thirtyDay")]
    pub thirty_day: PeriodMetrics,
}

/// Revenue and margin figures for a single period window.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct PeriodMetrics {
    /// Total sales (DI transactions) gross.
    pub sales: f64,
    /// Total cost of goods sold (CI transactions) gross.
    pub cogs: f64,
    /// sales - cogs
    #[serde(rename = "grossMargin")]
    pub gross_margin: f64,
    /// Margin as a percentage of sales.
    #[serde(rename = "marginPct")]
    pub margin_pct: f64,
    /// Number of sales invoices in the period.
    #[serde(rename = "invoiceCount")]
    pub invoice_count: u32,
}

/// GL balance summary.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct BalanceData {
    /// Accounts receivable balance (account 1500).
    pub receivables: f64,
    /// Accounts payable balance (account 2500, shown as positive).
    pub payables: f64,
    /// Individual bank / credit card account balances.
    #[serde(rename = "bankAccounts")]
    pub bank_accounts: Vec<BankAccount>,
}

/// A single bank or credit card account with its GL balance.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BankAccount {
    /// Account code (e.g. "1000").
    pub code: String,
    /// Account description.
    pub description: String,
    /// System role: "BK" for bank, "CC" for credit card.
    #[serde(rename = "type")]
    pub account_type: String,
    /// Current GL balance from GetBalance.
    pub balance: f64,
}

/// Debtor aging buckets (aggregated from Name.DCurrent etc.).
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct DebtorAging {
    /// Current (not yet due).
    pub current: f64,
    /// 1 aging cycle (30+ days).
    #[serde(rename = "oneCycle")]
    pub one_cycle: f64,
    /// 2 aging cycles (60+ days).
    #[serde(rename = "twoCycles")]
    pub two_cycles: f64,
    /// 3+ aging cycles (90+ days).
    #[serde(rename = "threeOrMore")]
    pub three_or_more: f64,
}

/// One month in the 12-month profit chart.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ProfitMonth {
    /// Short month label, e.g. "Jan", "Feb".
    pub label: String,
    /// Total income (sales) for the month.
    pub income: f64,
    /// Total expenses (purchases) for the month.
    pub expenses: f64,
    /// income - expenses
    pub profit: f64,
}

impl DashboardData {
    /// Return an empty dashboard (used as fallback when API calls fail).
    pub fn empty(date: &str) -> Self {
        Self {
            date: date.to_string(),
            periods: PeriodData {
                today: PeriodMetrics::default(),
                seven_day: PeriodMetrics::default(),
                thirty_day: PeriodMetrics::default(),
            },
            balances: BalanceData::default(),
            debtors: DebtorAging::default(),
            current_ratio: 0.0,
            profit_chart: Vec::new(),
        }
    }
}
