# MoneyWorks Developer Experience (DX) Guide

## Overview
Welcome to the MoneyWorks Developer Guide. This documentation is designed to bridge the gap between the internal data structures of MoneyWorks and the business logic required to build robust integrations.

Unlike the standard user manual, this guide focuses on:
- **Canonical Schemas**: Exact field definitions, types, and validation rules.
- **Architectural Patterns**: How entities relate (e.g., Transactions vs. Details, Names vs. Contacts).
- **Developer Context**: Hidden constraints and usage patterns critical for API and script development.

## Documentation Structure

### 1. [Core Concepts](concepts/)
High-level architectural patterns that apply across the system.
- **Dual-Layer Contact Architecture**: Understanding the difference between Name contacts and the Contacts subfile.
- **Transaction Lifecycle**: The `Unposted` vs. `Posted` state machine and its implications.

### 2. [Entity Reference](entities/)
Deep dives into the core data tables. Each guide includes schema definitions, relationships, and business context.
- [**Transactions**](entities/transactions.md): The heart of the accounting system (Invoices, Journals, Payments).
- [**Names**](entities/names.md): Customers, Suppliers, and Creditors.
- **Accounts**: The General Ledger and Chart of Accounts.
- **Products**: Inventory items and pricing.

### 3. [Reference Data](reference/)
Lookup tables for system codes and enums.
- **Transaction Types**: `CIC`, `CII`, `CP`, `CR`, etc.
- **Status Codes**: Understanding flags and binary states.

### 4. [Scripting & Automation](scripting/)
Guides for MWScript and automation hooks.

## Source of Truth
This documentation is synthesized from:
1.  **The MoneyWorks Manual**: For business logic and "why".
2.  **Canonical Ontologies**: For strict schema definitions and "what".
