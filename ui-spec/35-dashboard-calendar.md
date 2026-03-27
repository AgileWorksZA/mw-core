# Dashboard: Calendar

## Overview
Monthly calendar view showing business activity, holidays, and reminders by date. Provides temporal context for accounting workflows.

## Access Points
- Navigator: Dashboard → Calendar

## Layout

### Header
Company name | **< Month Year >** | Date (YYYY-MM-DD format)
Navigation: < and > buttons to move between months

### Calendar Grid
- 7-column grid: Sunday through Saturday
- 6 rows of dates (covers full month plus overflow)
- Current date highlighted with red border
- Holidays shown in red text (e.g., "New Year's Day" on Jan 1)
- Days from adjacent months shown in lighter text
- Cream/yellow background for weekdays, slightly different shade for weekends

## Content per Day
- **Transaction indicators**: Days with posted transactions would show count/amount indicators
- **Holiday labels**: Public holidays shown in red
- **Due dates**: Invoices due, payments due on their respective dates
- **Reminders**: To-do items on their recall dates

## Web Modernization Opportunities
- Click on a date to see all transactions for that day
- Drag transactions to change dates
- Week/day/agenda views (not just monthly)
- Color-coded event types (receipts vs payments vs invoices due)
- Integration with external calendars (Google Calendar, Outlook)
- Recurring event patterns
- Overdue highlighting for past-due items
