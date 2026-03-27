# Preferences

## Overview
Two levels of preferences: Document Preferences (per-file settings) and MoneyWorks Preferences (application-wide settings).

## Access Points
- Edit menu: Document Preferences...
- Edit menu: MoneyWorks Preferences...

## Document Preferences

Title: "Preferences for Document '{filename}'"

### Tabs: Data Entry, Seq N°s, Startup, Terms, HST, PPD, Fields, Jobs, Locale/Currency

### Data Entry Tab
| Section | Fields |
|---------|--------|
| **Colour Names** | Configurable labels for 7 colours: Orange, Red, Magenta, Cyan, Blue, Green, Brown. Scope selector (For: Transaction dropdown). Window sidebar colour with Default reset. |
| **Field Labels** | Customizable labels for: Transaction.Salesperson → "Salesperson", Transaction.User1-8, Transaction.Flag, Transaction.Analysis, Product.Category1 → "Material", Product.Category2 → "Size", Product.Category3 → "Style", Product.Category4, Product.Custom1+ |
| **Payment Methods** | Default → Display as mapping: Cash→Cash, Cheque→Cheque, Electronic→Electronic, Credit Card→Credit Card, Method 5→Five, Method 6→Six, Method 7→Seven |
| **Contact Roles** | Role number → name mapping: 1→Payables, 2→Receivables, 3→CEO, 4→CFO, 5→Sales, 6→Purchasing |

### Seq N°s (Sequence Numbers) Tab
Auto-numbering configuration for each document type:

| Document Type | Current N° | # Digits | Options |
|---------------|------------|----------|---------|
| Batch Receipt N° | 218 | Any | Change starts new seq, Can change, Check for duplicates |
| Cash Receipt N° | 351 | Any | Same options |
| Cash Payment N° | (per bank account) | | |
| Order N° | 49 | Any | |
| Invoice N° | 2129 | 4 | |
| Quote/SO N° | 0008 | 4 | Synchronise option |
| Job N° | 000002 | | |

Each has: Change starts new seq checkbox, Can change checkbox, Check for duplicates checkbox, Synchronise checkbox.

### Startup Tab
- Configures what happens when the file is opened
- Default view, startup actions

### Terms Tab
| Section | Fields |
|---------|--------|
| **Default Terms** | Within fixed number of days / On day of following month (Day of month: 20), Apply to All button |
| **Credit Hold** | Auto Credit Hold when X days overdue (30), Limit on-the-fly write-offs to: (0.00) |
| **Code assignment for new Names** | Make templated codes unique by padding to X chars (5), Same for all new Names checkbox |
| **Other Options** | Overdue Warnings At Startup checkbox, Check for Dup. Creditor Invoice Numbers checkbox |

### HST (Tax) Tab
| Section | Fields |
|---------|--------|
| **Flags** | "I need to account for HST" checkbox, "Use two-tier HST" checkbox |
| **Basis for calculation** | Income: Payments Basis / Invoice Basis. Expenses: Payments Basis / Invoice Basis |
| **Rounding** | Dropdown: Round half to even (Bankers' Rounding) |
| **HST Cycle Period** | Monthly / Two Monthly / Quarterly / Six Monthly / Other X months. Next cycle ends on: (date) |

### PPD (Prompt Payment Discount) Tab
- Configuration for prompt payment discount handling

### Fields Tab
- Additional field configuration options

### Jobs Tab
- Job-related configuration

### Locale/Currency Tab
| Field | Type | Description |
|-------|------|-------------|
| Localisation | Dropdown | Country (e.g., "Canada...") with ON toggle |
| Use custom base currency format | Checkbox | Override system currency display |
| Symbol | Text + Before/After | Currency symbol position |
| Use multiple currencies in this document | Checkbox | Enable multi-currency |
| Base Currency | Dropdown | e.g., "CAD - Canadian Dollars" |

## Company Details (Show → Company Details)
| Field | Type | Description |
|-------|------|-------------|
| Name | Text | Company name |
| Postal Address | Multi-line | Mailing address (multiple lines + State + Post Code + Country) |
| Phone | Text | Phone number |
| Fax | Text | Fax number |
| Cell | Text | Mobile number |
| Delivery Address | Multi-line | Delivery address (separate from postal) |
| email | Text | Company email |
| website | Text | Company website |
| remittance account message | Text | Message for remittance advices (e.g., "Payments may be made by direct deposit into account xxx") |
| **Tax Information** | | |
| GST# | Text | Tax registration number |
| Co.Reg# | Text | Company registration number |
| **Logo** | Button | Upload company logo |

## MoneyWorks Preferences
Application-wide settings — applies regardless of which file is open. Contains display, behavior, and startup settings.
