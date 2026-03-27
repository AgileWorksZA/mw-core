# Receive Goods

## Overview
Receive Goods processes the physical receipt of items ordered via Purchase Orders. It updates inventory quantities and can trigger creation of Purchase Invoices.

## Access Points
- Navigator: Day-to-day → Receive Goods icon in Purchases and Expenses
- From Purchase Order → Receive action

## Workflow
1. Select Purchase Order to receive against
2. Enter quantities received per line item
3. Note any discrepancies (damaged, short-shipped)
4. Confirm receipt
5. Stock on Hand updates for received items
6. PO backorder quantities update

## Business Rules
- Partial receipts allowed — PO remains open for backordered items
- SOH increases on receipt confirmation
- Can create Purchase Invoice directly from receipt
- Receipt creates an audit trail for goods received
