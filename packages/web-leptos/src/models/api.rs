//! Rust types mirroring the Elysia API at localhost:3400/api/v1.
//!
//! Field names use MoneyWorks canonical DSL naming (PascalCase) via serde rename.
//! All record fields are Option<T> since MW may not return every field.

use serde::{Deserialize, Serialize};

// ─── Generic API envelope ────────────────────────────────────────────

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub data: Option<T>,
    pub metadata: Option<ApiMetadata>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ApiMetadata {
    pub table: Option<String>,
    pub format: Option<String>,
    pub count: Option<u32>,
    pub timestamp: Option<String>,
    #[serde(rename = "requestId")]
    pub request_id: Option<String>,
    pub pagination: Option<Pagination>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Pagination {
    pub limit: u32,
    pub offset: u32,
    #[serde(rename = "hasMore")]
    pub has_more: bool,
}

// ─── Auth ────────────────────────────────────────────────────────────

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuthTokenRequest {
    pub host: String,
    pub port: u16,
    #[serde(rename = "dataFile")]
    pub data_file: String,
    pub username: String,
    pub password: String,
    #[serde(rename = "folderName", skip_serializing_if = "Option::is_none")]
    pub folder_name: Option<String>,
    #[serde(rename = "folderPassword", skip_serializing_if = "Option::is_none")]
    pub folder_password: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuthTokenResponse {
    #[serde(rename = "accessToken")]
    pub access_token: String,
    #[serde(rename = "refreshToken")]
    pub refresh_token: String,
    #[serde(rename = "connectionId")]
    pub connection_id: String,
    pub company: Option<CompanyInfo>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CompanyInfo {
    pub name: String,
    #[serde(rename = "dataFile")]
    pub data_file: String,
}

// ─── Eval ────────────────────────────────────────────────────────────

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EvalRequest {
    pub expression: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EvalResponse {
    pub expression: String,
    pub result: String,
    #[serde(rename = "dataType")]
    pub data_type: Option<String>,
    #[serde(rename = "executionTime")]
    pub execution_time: Option<f64>,
}

// ─── Transaction record (MoneyWorks canonical field names) ───────────

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct TransactionRecord {
    #[serde(rename = "Sequencenumber")]
    pub sequence_number: Option<i64>,
    #[serde(rename = "Ourref")]
    pub our_ref: Option<String>,
    #[serde(rename = "Theirref")]
    pub their_ref: Option<String>,
    #[serde(rename = "Type")]
    pub tx_type: Option<String>,
    #[serde(rename = "Status")]
    pub status: Option<String>,
    #[serde(rename = "Transdate")]
    pub trans_date: Option<String>,
    #[serde(rename = "Duedate")]
    pub due_date: Option<String>,
    #[serde(rename = "Enterdate")]
    pub enter_date: Option<String>,
    #[serde(rename = "Period")]
    pub period: Option<i32>,
    #[serde(rename = "Namecode")]
    pub name_code: Option<String>,
    #[serde(rename = "Tofrom")]
    pub to_from: Option<String>,
    #[serde(rename = "Description")]
    pub description: Option<String>,
    #[serde(rename = "Gross")]
    pub gross: Option<f64>,
    #[serde(rename = "Taxamount")]
    pub tax_amount: Option<f64>,
    #[serde(rename = "Amtpaid")]
    pub amt_paid: Option<f64>,
    #[serde(rename = "Hold")]
    pub hold: Option<bool>,
    #[serde(rename = "Colour")]
    pub colour: Option<i32>,
    #[serde(rename = "Salesperson")]
    pub sales_person: Option<String>,
    #[serde(rename = "Contra")]
    pub contra: Option<String>,
    #[serde(rename = "Paymentmethod")]
    pub payment_method: Option<i32>,
    #[serde(rename = "Enteredby")]
    pub entered_by: Option<String>,
    #[serde(rename = "Postedby")]
    pub posted_by: Option<String>,
    #[serde(rename = "Currency")]
    pub currency: Option<String>,
    #[serde(rename = "Exchangerate")]
    pub exchange_rate: Option<f64>,
    #[serde(rename = "Analysis")]
    pub analysis: Option<String>,
    #[serde(rename = "Freightamount")]
    pub freight_amount: Option<f64>,
    #[serde(rename = "Ordertotal")]
    pub order_total: Option<f64>,
    #[serde(rename = "Ordershipped")]
    pub order_shipped: Option<f64>,
    #[serde(rename = "Deliveryaddress")]
    pub delivery_address: Option<String>,
    #[serde(rename = "Mailingaddress")]
    pub mailing_address: Option<String>,
    #[serde(rename = "Flag")]
    pub flag: Option<String>,
    #[serde(rename = "Amtwrittenoff")]
    pub amt_written_off: Option<f64>,
    #[serde(rename = "Recurring")]
    pub recurring: Option<bool>,
}

// ─── Account record ──────────────────────────────────────────────────

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct AccountRecord {
    #[serde(rename = "Code")]
    pub code: Option<String>,
    #[serde(rename = "Description")]
    pub description: Option<String>,
    /// Account type: CA, CL, FA, SF, IN, CS, EX, SA
    #[serde(rename = "Type")]
    pub account_type: Option<String>,
    #[serde(rename = "Group")]
    pub group: Option<String>,
    #[serde(rename = "Category")]
    pub category: Option<String>,
    #[serde(rename = "Category2")]
    pub category2: Option<String>,
    #[serde(rename = "Category3")]
    pub category3: Option<String>,
    #[serde(rename = "Category4")]
    pub category4: Option<String>,
    #[serde(rename = "Pandl")]
    pub pandl: Option<String>,
    #[serde(rename = "TaxCode")]
    pub tax_code: Option<String>,
    #[serde(rename = "Flags")]
    pub flags: Option<i32>,
    /// System role: BK (bank), CC (credit card), AR, AP
    #[serde(rename = "System")]
    pub system: Option<String>,
    #[serde(rename = "Colour")]
    pub colour: Option<i32>,
    #[serde(rename = "Currency")]
    pub currency: Option<String>,
    #[serde(rename = "BankAccountNumber")]
    pub bank_account_number: Option<String>,
    #[serde(rename = "Accountantcode")]
    pub accountant_code: Option<String>,
    #[serde(rename = "Comments")]
    pub comments: Option<String>,
    #[serde(rename = "SecurityLevel")]
    pub security_level: Option<i32>,
}

// ─── Name (customer / supplier) record ───────────────────────────────

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct NameRecord {
    #[serde(rename = "SequenceNumber")]
    pub sequence_number: Option<i64>,
    #[serde(rename = "Code")]
    pub code: Option<String>,
    #[serde(rename = "Name")]
    pub name: Option<String>,
    #[serde(rename = "CustomerType")]
    pub customer_type: Option<i32>,
    #[serde(rename = "SupplierType")]
    pub supplier_type: Option<i32>,
    #[serde(rename = "Kind")]
    pub kind: Option<i32>,
    #[serde(rename = "Address1")]
    pub address1: Option<String>,
    #[serde(rename = "Address2")]
    pub address2: Option<String>,
    #[serde(rename = "Address3")]
    pub address3: Option<String>,
    #[serde(rename = "Address4")]
    pub address4: Option<String>,
    #[serde(rename = "PostCode")]
    pub post_code: Option<String>,
    #[serde(rename = "State")]
    pub state: Option<String>,
    #[serde(rename = "Contact")]
    pub contact: Option<String>,
    #[serde(rename = "Phone")]
    pub phone: Option<String>,
    #[serde(rename = "Fax")]
    pub fax: Option<String>,
    #[serde(rename = "Mobile")]
    pub mobile: Option<String>,
    #[serde(rename = "Email")]
    pub email: Option<String>,
    #[serde(rename = "WebURL")]
    pub web_url: Option<String>,
    #[serde(rename = "Currency")]
    pub currency: Option<String>,
    #[serde(rename = "CreditLimit")]
    pub credit_limit: Option<f64>,
    #[serde(rename = "Hold")]
    pub hold: Option<bool>,
    #[serde(rename = "RecAccount")]
    pub rec_account: Option<String>,
    #[serde(rename = "PayAccount")]
    pub pay_account: Option<String>,
    #[serde(rename = "DebtorTerms")]
    pub debtor_terms: Option<i32>,
    #[serde(rename = "CreditorTerms")]
    pub creditor_terms: Option<i32>,
    #[serde(rename = "PaymentMethod")]
    pub payment_method: Option<i32>,
    #[serde(rename = "TaxCode")]
    pub tax_code: Option<String>,
    #[serde(rename = "TaxNumber")]
    pub tax_number: Option<String>,
    #[serde(rename = "Category")]
    pub category: Option<String>,
    #[serde(rename = "Category1")]
    pub category1: Option<String>,
    #[serde(rename = "Category2")]
    pub category2: Option<String>,
    #[serde(rename = "Category3")]
    pub category3: Option<String>,
    #[serde(rename = "Category4")]
    pub category4: Option<String>,
    #[serde(rename = "Colour")]
    pub colour: Option<i32>,
    #[serde(rename = "SalesPerson")]
    pub sales_person: Option<String>,
    #[serde(rename = "Discount")]
    pub discount: Option<f64>,
    #[serde(rename = "Comment")]
    pub comment: Option<String>,
    /// Debtor aging buckets
    #[serde(rename = "DCurrent")]
    pub d_current: Option<f64>,
    #[serde(rename = "D30Plus")]
    pub d_30_plus: Option<f64>,
    #[serde(rename = "D60Plus")]
    pub d_60_plus: Option<f64>,
    #[serde(rename = "D90Plus")]
    pub d_90_plus: Option<f64>,
    #[serde(rename = "CCurrent")]
    pub c_current: Option<f64>,
    #[serde(rename = "Datelastsale")]
    pub date_last_sale: Option<String>,
    #[serde(rename = "TheirRef")]
    pub their_ref: Option<String>,
    #[serde(rename = "ProductPricing")]
    pub product_pricing: Option<String>,
    #[serde(rename = "Flags")]
    pub flags: Option<i32>,
    #[serde(rename = "Custom1")]
    pub custom1: Option<String>,
    #[serde(rename = "Custom2")]
    pub custom2: Option<String>,
    #[serde(rename = "Custom3")]
    pub custom3: Option<String>,
    #[serde(rename = "Custom4")]
    pub custom4: Option<String>,
}

// ─── Detail (line item) record ───────────────────────────────────────

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct DetailRecord {
    #[serde(rename = "ParentSeq")]
    pub parent_seq: Option<i64>,
    #[serde(rename = "Sort")]
    pub sort: Option<i32>,
    #[serde(rename = "Account")]
    pub account: Option<String>,
    #[serde(rename = "Description")]
    pub description: Option<String>,
    #[serde(rename = "Debit")]
    pub debit: Option<f64>,
    #[serde(rename = "Credit")]
    pub credit: Option<f64>,
    #[serde(rename = "Tax")]
    pub tax: Option<f64>,
    #[serde(rename = "Gross")]
    pub gross: Option<f64>,
    #[serde(rename = "StockCode")]
    pub stock_code: Option<String>,
    #[serde(rename = "StockQty")]
    pub stock_qty: Option<f64>,
    #[serde(rename = "UnitPrice")]
    pub unit_price: Option<f64>,
    #[serde(rename = "CostPrice")]
    pub cost_price: Option<f64>,
    #[serde(rename = "Discount")]
    pub discount: Option<f64>,
    #[serde(rename = "SaleUnit")]
    pub sale_unit: Option<String>,
    #[serde(rename = "TaxCode")]
    pub tax_code: Option<String>,
    #[serde(rename = "JobCode")]
    pub job_code: Option<String>,
    #[serde(rename = "TransactionType")]
    pub transaction_type: Option<String>,
}

// ─── Product record ──────────────────────────────────────────────────

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct ProductRecord {
    #[serde(rename = "Code")]
    pub code: Option<String>,
    #[serde(rename = "Description")]
    pub description: Option<String>,
    #[serde(rename = "Sellprice")]
    pub sell_price: Option<f64>,
    #[serde(rename = "Costprice")]
    pub cost_price: Option<f64>,
    #[serde(rename = "Taxcode")]
    pub tax_code: Option<String>,
    #[serde(rename = "Sellunit")]
    pub sell_unit: Option<String>,
    #[serde(rename = "Supplier")]
    pub supplier: Option<String>,
    #[serde(rename = "Stockonhand")]
    pub stock_on_hand: Option<f64>,
    #[serde(rename = "Stockvalue")]
    pub stock_value: Option<f64>,
    #[serde(rename = "Reorderlevel")]
    pub reorder_level: Option<f64>,
    #[serde(rename = "Barcode")]
    pub barcode: Option<String>,
    #[serde(rename = "Type")]
    pub product_type: Option<String>,
    #[serde(rename = "Colour")]
    pub colour: Option<i32>,
    #[serde(rename = "Category1")]
    pub category1: Option<String>,
    #[serde(rename = "Category2")]
    pub category2: Option<String>,
    #[serde(rename = "Category3")]
    pub category3: Option<String>,
    #[serde(rename = "Category4")]
    pub category4: Option<String>,
    #[serde(rename = "Salesacct")]
    pub sales_acct: Option<String>,
    #[serde(rename = "Cogacct")]
    pub cog_acct: Option<String>,
    #[serde(rename = "Stockacct")]
    pub stock_acct: Option<String>,
    #[serde(rename = "Buyprice")]
    pub buy_price: Option<f64>,
    #[serde(rename = "Buyunit")]
    pub buy_unit: Option<String>,
    #[serde(rename = "Flags")]
    pub flags: Option<i32>,
}

// ─── Tax rate record ─────────────────────────────────────────────────

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct TaxRateRecord {
    #[serde(rename = "Code")]
    pub code: Option<String>,
    #[serde(rename = "TaxCode")]
    pub tax_code: Option<String>,
    #[serde(rename = "Description")]
    pub description: Option<String>,
    #[serde(rename = "Ratename")]
    pub rate_name: Option<String>,
    #[serde(rename = "Rate")]
    pub rate: Option<f64>,
    #[serde(rename = "Rate1")]
    pub rate1: Option<f64>,
    #[serde(rename = "Rate2")]
    pub rate2: Option<f64>,
    #[serde(rename = "Type")]
    pub rate_type: Option<i32>,
    #[serde(rename = "PaidAccount")]
    pub paid_account: Option<String>,
    #[serde(rename = "ReceivedAccount")]
    pub received_account: Option<String>,
    #[serde(rename = "RecAccount")]
    pub rec_account: Option<String>,
}
