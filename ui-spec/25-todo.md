# To Do — Workflow Task Board

## Overview
The To Do screen is a visual workflow board organizing routine accounting tasks by frequency. It shows task status with badges, last-run dates, and direct links to execute each task. This is essentially MoneyWorks' built-in accounting workflow automation.

## Access Points
- Navigator: To Do

## Layout — Four Frequency Columns

### Daily Column
| Task | Description |
|------|-------------|
| **Today's Reminders** | Shows reminders due today (from contact activity logs) |
| **People to call** | Contacts with pending follow-ups |
| **Receivables Due** | Shows overdue count badge (e.g., "96" in red) |
| **Payables Due** | Shows overdue count badge (e.g., "17" in red) |

Flow: Today's Reminders → branches to People to call, Receivables Due, and Payables Due

### Regular Column
| Task | Status Info | Description |
|------|-------------|-------------|
| **Bank Reconciliation** | | Opens bank reconciliation workflow |
| **Backup** | Last Backup: date/time | Create backup of data file |

### Monthly Column
| Task | Status Info | Description |
|------|-------------|-------------|
| **Print Statements** | | Generate and print customer statements |
| **Age Debtors** | Last Aged: date, "OVERDUE" badge if stale | Recalculate debtor aging buckets |
| **Open/Close Period** | Current: period name + end date | Period management |

### HST Time Column
| Task | Status Info | Description |
|------|-------------|-------------|
| **Print HST Report** | Last Done: date | Generate tax return report |
| **Print Sales Tax Report** | | Generate sales tax report |

### Bottom Area
- **Reminders** — Create new reminder (+ button)

## Key Features
- **Live badges**: Receivables Due and Payables Due show real-time overdue counts
- **Status tracking**: Last Backup, Last Aged, Last Done dates show when each task was last performed
- **OVERDUE indicators**: Tasks that haven't been run recently show overdue badges
- **Direct actions**: Each task icon is clickable and opens the relevant screen/workflow
- **Current period display**: Shows current open accounting period

## Web Modernization Opportunities
- Add scheduling/automation for routine tasks
- Push notifications for overdue items
- Task completion history/audit trail
- Customizable task list (add/remove tasks)
- Integration with external calendars
