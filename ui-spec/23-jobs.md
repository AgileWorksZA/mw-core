# Jobs (Project Costing)

## Overview
Jobs provide project costing and tracking. Transactions can be assigned to jobs to track revenue and costs per project. Supports time entry, billing, and work-in-progress reporting.

## Access Points
- Navigator: Jobs
- Command menu: Job Timesheet (⌘⇧J), Bill Job (⌘⇧!), Work in Progress Journal

## Features

### Job Register
- Job list with code, description, status, budget, actual
- Jobs can be hierarchical (parent/child for phases)

### Job Timesheet
- Time entry against specific jobs
- Employee/resource assignment
- Hourly rate calculation
- Billable/non-billable flag

### Bill Job
- Generate Sales Invoice from unbilled job costs
- Select which costs to include
- Apply markup or fixed billing rates

### Work in Progress Journal
- Create WIP journal entries
- Move costs from P&L to Balance Sheet (WIP asset)
- Reverse when job is billed

### Analysis Code
- Transactions can carry an Analysis/Job code
- Enables job profitability reporting

## Job Record Fields (Expected)
| Field | Type | Description |
|-------|------|-------------|
| Job Code | Text | Unique job identifier |
| Description | Text | Job name/description |
| Customer | Lookup | Customer for this job |
| Status | Dropdown | Active, Complete, On Hold |
| Budget | Currency | Job budget |
| Start Date | Date | Project start |
| End Date | Date | Expected completion |
| Category | Text | Job category |

## Business Rules
- Job codes appear on transaction line items via Analysis/Job field
- All transaction types can reference a job
- WIP represents unbilled costs (asset on balance sheet)
- Billing a job converts WIP to revenue
- Job profitability = Revenue - Costs
