# MoneyWorks Transaction Types - Manual Extract

> Source: MoneyWorks User Guide (pages 769, 154-161, 192-213, 414-443)
> Extracted: 2025-11-26

## Key Discovery: Status Suffix Convention

MoneyWorks uses a **3-letter code** where:
- First 2 letters = Transaction type (e.g., `DI`, `CI`, `CR`)
- 3rd letter = Status:
  - **I** = Incomplete (Unpaid/Part-paid)
  - **C** = Complete (Fully Paid)

## Complete Transaction Reference

| Code | Full Name | Category | Description | Typical Accounts Affected | Special Behaviors / Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DI** (DII, DIC) | **Debtor Invoice** | Sales | An invoice sent to a customer for goods or services to be paid at a future date. • **DII:** Incomplete (Unpaid/Part-paid) • **DIC:** Complete (Fully Paid) | **Debits:** Accounts Receivable Control **Credits:** Sales/Income (or Stock if selling inventory) | • Entering a negative amount creates a **Credit Note**. • Posted invoices increase the debtor's balance. • Requires a valid Debtor code. |
| **CI** (CII, CIC) | **Creditor Invoice** | Purchasing | An invoice received from a supplier for goods or services. • **CII:** Incomplete (Unpaid/Part-paid) • **CIC:** Complete (Fully Paid) | **Credits:** Accounts Payable Control **Debits:** Expense/Cost of Goods/Asset | • Entering a negative amount creates a **Credit Note**. • Posted invoices increase the creditor's balance. • Requires a valid Creditor code. |
| **CR** | **Cash Receipt** | Cash | A direct sale or income received immediately (not associated with an existing invoice). e.g., Shop counter sale. | **Debits:** Bank Account (or Holding Account) **Credits:** Sales/Income | • Does not affect the Debtors Ledger. • Cash amounts are aggregated on bank deposit slips. • Can be imported via Bank Statement import. |
| **CP** | **Cash Payment** | Cash | A direct payment for expenses/purchases (not associated with an existing invoice). e.g., Buying stamps or petrol. | **Credits:** Bank Account **Debits:** Expense/Asset | • Does not affect the Creditors Ledger. • Can be printed as a cheque. • Can be imported via Bank Statement import. |
| **CRD** | **Receipt on Invoice** | Sales / Cash | A payment received from a debtor to pay off specific outstanding invoices. | **Debits:** Bank Account **Credits:** Accounts Receivable Control | • Must be linked to a Debtor. • Reduces the debtor's outstanding balance. • Created via "Batch Debtor Receipts" or by receipting against a specific debtor. |
| **CPC** | **Payment on Invoice** | Purchasing / Cash | A payment made to a creditor to pay off specific outstanding invoices. | **Credits:** Bank Account **Debits:** Accounts Payable Control | • Must be linked to a Creditor. • Reduces the amount owed to the creditor. • Created via "Batch Creditor Payments" or by paying a specific supplier. |
| **JN** | **General Journal** | General Ledger | Used for adjustments, accruals, depreciation, and transferring balances between accounts. | **Debits/Credits:** User defined (Must Balance) | • Cannot be used to adjust Accounts Receivable or Payable control accounts. • Does not handle GST/VAT automatically (must be calculated manually). • **Banking Journals** (Funds Transfer) are a specific subtype of JN. |
| **JNS** | **Stock Journal** | Inventory | Adjusts stock levels and values. There are 5 sub-types: Make, Break, WriteOff, Create, Revalue, Transfer. | **Debits/Credits:** Stock Asset and Cost of Goods/Stock Adjustment account | • **Make/Break:** Assembles/Disassembles manufactured items. • **WriteOff/Create:** Adjusts quantity and value. • **Revalue:** Changes value without changing quantity. • **Transfer:** Moves stock between locations or corrects serial numbers. |
| **SO** (SOI, SOC) | **Sales Order** | Sales | An order received from a customer. It is a non-accounting transaction until processed into an invoice. • **SOI:** Incomplete • **SOC:** Complete (Sold) | **None** (until processed/shipped) | • Tracks **Backorders**. • Allocates/Commits stock (reduces "Available" stock but not "On Hand"). • Can accept a deposit (creates a receipt transaction linked to the order). |
| **PO** (POI, POC) | **Purchase Order** | Purchasing | An order placed with a supplier. It is a non-accounting transaction until goods are received. • **POI:** Incomplete • **POC:** Complete (Bought) | **None** (until processed/received) | • Tracks **On Order** stock quantities. • Goods can be received before the invoice arrives (creates a stock journal). • Can pay a deposit (creates a payment transaction linked to the order). |
| **QU** | **Quote** | Sales | A price quotation given to a customer. Non-accounting transaction. | **None** | • Can be converted into a **Sales Order** or a **Job**. • Can be duplicated to act as a template. |
| **CPD** | **Returned Refund** | Adjustment | Used when you refund a Debtor (Customer) who has overpaid or has a credit note. | **Credits:** Bank Account **Debits:** Accounts Receivable Control | • Access via *Command > Adjustments > Return Refund to Debtor*. • Clears credit notes/overpayments from the debtor's account. |
| **CRC** | **Refund from Creditor** | Adjustment | Used when you receive a refund from a Creditor (Supplier) whom you overpaid. | **Debits:** Bank Account **Credits:** Accounts Payable Control | • Access via *Command > Adjustments > Receive Refund from Creditor*. • Clears credit notes/overpayments from the creditor's account. |

## Key Insights

### Credit Notes via Negative Amounts
- **DI with negative amount** = Debtor Credit Note
- **CI with negative amount** = Creditor Credit Note
- This explains why Type stays DII when reversing - the sign flip makes it a credit!

### Non-Accounting Transactions
These don't hit the GL until converted:
- **QU** (Quote)
- **SO** (Sales Order) - until shipped/invoiced
- **PO** (Purchase Order) - until received/invoiced

### Stock Allocation vs On Hand
- **SO** (Sales Order): Reduces "Available" but not "On Hand"
- **PO** (Purchase Order): Increases "On Order"
- Actual "On Hand" only changes when posted

### Control Account Restrictions
- **JN** (General Journal) **cannot** adjust AR/AP control accounts
- Must use proper transaction types for debtor/creditor adjustments

### Refund Transaction Types
- **CPD**: Refund TO customer (reduces AR)
- **CRC**: Refund FROM supplier (reduces AP)
