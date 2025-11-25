# MoneyWorks Entity Guide: Jobs

## Architectural Overview
The **Jobs** entity is the core of MoneyWorks' project management and costing system. It goes beyond simple tagging—it tracks time, materials, billing status, and hierarchical project structures.

### Critical Concepts

#### 1. The Job Lifecycle
Jobs follow a strict state machine controlled by the `Status` field:
*   **Quoted (`QU`)**: A proposal. Costs and time can be estimated but not "used".
*   **Active (`OP`)**: Work in progress. Timesheets and materials can be posted against the job.
*   **Complete (`CO`)**: Closed. No further costs can be posted.

#### 2. Project Hierarchy
MoneyWorks supports nested projects via the `Project` field.
*   **Master Project**: A Job record that acts as a container.
*   **Sub-Job**: A Job record where `Project` = Code of the Master Project.
*   *Usage*: Costs posted to sub-jobs roll up to the Master Project for reporting.

#### 3. Client-Centric Costing
Every Job must belong to a Client (Debtor). This enforces a billable relationship.
*   **Work In Progress (WIP)**: Costs posted to a job (Time, Items) accumulate as WIP.
*   **Billing**: When you invoice the client (`Type=DI`), you "bill out" the WIP, moving it from a Balance Sheet asset to Cost of Goods Sold.

---

## Canonical Schemas

### Job Fields

#### Core Identification
| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `Code` | Text | 9 | **Yes** | Unique Job Code. | Primary Key |
| `Description` | Text | 255 | **Yes** | Job Name/Title. | - |
| `Status` | Text | 2 | **Yes** | `QU`=Quoted, `OP`=Active, `CO`=Complete. | [See Status](#job-status) |
| `Client` | Text | 11 | **Yes** | Customer Code. | `Names.Code` (Debtor) |
| `Project` | Text | 9 | - | Parent Project Code. | `Jobs.Code` |
| `Manager` | Text | 3 | - | Initials of project manager. | `User.Initials` |

#### Financial Tracking
| Field | Type | Description |
|-------|------|-------------|
| `Quote` | Num | Total Quoted Value (Revenue). |
| `Billed` | Num | Total Billed Invoiced to date. |
| `Markup` | Num | Default markup % for materials. |
| `PercentComplete` | Num | Manual progress tracking (0-100). |
| `OrderNum` | Text | Client's Purchase Order Number. |

#### Dates & Scheduling
| Field | Type | Description |
|-------|------|-------------|
| `StartDate` | Date | Actual start date. |
| `TargetDate` | Date | Deadline. |
| `EndDate` | Date | Actual completion date. |

#### Contact & Categorization
| Field | Type | Description |
|-------|------|-------------|
| `Contact` | Text | Primary contact person name. |
| `Phone` | Text | Contact phone. |
| `Category1`..`4` | Text | Analysis categories. |
| `Colour` | Num | UI display colour index. |
| `Custom1`..`8` | Text | User defined fields. |
| `UserNum`, `UserText` | Var | Scriptable storage. |

---

## Reference: Job Status (`Status`)

| Code | Canonical Name | Business Logic |
|------|----------------|----------------|
| **QU** | **Quoted** | Planning phase. Estimates allowed. No actual costs. |
| **OP** | **Active** | "Open". Fully operational. Accepting costs and billing. |
| **CO** | **Complete** | Archived. Read-only for financial posting. |

## Developer Tips

### 1. Creating Sub-Jobs
To create a hierarchy:
1.  Create the Parent Job (e.g., `JOB-100`).
2.  Create the Child Job (e.g., `JOB-100-A`).
3.  Set `Child.Project = "JOB-100"`.
*Note: The Parent Job `Client` field generally propagates to children, but this is business logic, not strict schema enforcement.*

### 2. The "Job Code Required" Account Flag
If a General Ledger Account has `Flags & 0x0004`, you **cannot** post a transaction line to it without a valid `JobCode`. This is common for Expense and Cost of Sales accounts to ensure no costs "leak" outside of projects.

### 3. Markup Logic
The `Markup` field on the Job overrides the default markup on Products.
*   *Logic*: If `Job.Markup` is set, `SellPrice = Cost + (Cost * Job.Markup)`.
*   *Usage*: Cost-plus contracts.
