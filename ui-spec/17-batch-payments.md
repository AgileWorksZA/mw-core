# Batch Payments

## Overview
Batch Payments processes multiple supplier payments in a single session. Generates payment transactions for selected suppliers based on outstanding invoices.

## Access Points
- Navigator: Day-to-day → Batch Payments icon
- Command menu: Batch Creditor Payments... (⌘Y)

## Workflow
1. Select bank account for payments
2. System shows suppliers with outstanding balances
3. Select which suppliers to pay
4. Choose payment amounts (full or partial)
5. Select payment method
6. Generate payments
7. Optionally generate electronic payment file

## Features
- Select all or specific suppliers
- Pay in full or set custom amounts
- Filter by due date (e.g., pay all due within 7 days)
- Electronic payment file generation for bank upload
- Print remittance advices

## Business Rules
- Creates individual Payment transactions per supplier
- Allocates against oldest invoices first (or specific selection)
- Bank balance checks before processing
- Supports prompt payment discount application
