# Feature Backlog

## Overview
This document tracks all feature ideas, use cases, and enhancements for the MoneyWorks Core platform. Items are organized by priority and grooming status.

## Priority Levels
- **P0**: Critical - Must have for MVP
- **P1**: High - Important for early customers
- **P2**: Medium - Nice to have, improves user experience
- **P3**: Low - Future enhancements

## Status Definitions
- **Groomed**: Ready for development with clear requirements
- **Needs Grooming**: Requires further specification
- **Parked**: Good idea but not prioritized
- **In Progress**: Currently being developed
- **Completed**: Done and deployed

---

## Group Management Features

### ✅ Completed
- [x] Basic group creation and hierarchy
- [x] Group tree navigation UI
- [x] Add companies/connections to groups
- [x] Database schema for groups and permissions

### 🚀 Groomed & Ready

#### P1: Group Tax Code Validation
**Use Case**: Validate tax codes across group companies in the same country
**Acceptance Criteria**:
- Query all tax rates for companies in a group
- Filter by country/jurisdiction
- Highlight inconsistencies in tax setup
- Export validation report
**Technical Notes**:
```typescript
// API endpoint: GET /api/groups/:groupId/tax-validation?country=ZA
// Returns comparison matrix of tax codes
```

#### P1: Basic Group Permissions
**Use Case**: Control who can view/edit group companies
**Acceptance Criteria**:
- Implement roles: Admin, Editor, Viewer
- Apply permissions at group level
- Inherit permissions to child groups
- Audit log for permission changes

### 📋 Needs Grooming

#### P2: Create GL Accounts Across Group
**Use Case**: Create standardized GL accounts across all group companies
**Questions to Answer**:
- How to handle existing accounts with same code?
- Should we validate account codes before creation?
- Bulk operation UI/UX design needed
- Rollback strategy for partial failures?

#### P2: Group-wide Report Templates
**Use Case**: Apply consistent report formats across group
**Needs**:
- Define what reports to support first
- Template storage mechanism
- Version control for templates

### 🅿️ Parked Features

#### P3: Intercompany Transaction Matching
**Use Case**: Match and eliminate intercompany transactions
**Why Parked**: Complex feature requiring deep MW integration
**Prerequisites**:
- Transaction API implementation
- Advanced filtering capabilities
- Elimination rules engine

#### P3: Consolidated Financial Statements
**Use Case**: Generate consolidated P&L, Balance Sheet across group
**Why Parked**: Requires extensive accounting rules
**Prerequisites**:
- Full chart of accounts access
- Currency conversion handling
- Elimination entries system

#### P3: Supplier/Customer Code Standardization
**Use Case**: Ensure consistent supplier/customer codes across group
**Why Parked**: Needs bulk data management features first
**Prerequisites**:
- Supplier/Customer APIs
- Bulk update capabilities
- Conflict resolution UI

#### P3: Group-wide Settings Sync
**Use Case**: Synchronize payment terms, credit limits across group
**Why Parked**: Low initial demand, high complexity
**Prerequisites**:
- Settings API
- Selective sync capabilities
- Change management workflow

---

## Other Feature Areas

### Authentication & Security

#### P1: Audit Logging (Groomed)
**Use Case**: Track all data access and modifications
**Acceptance Criteria**:
- Log all MoneyWorks data access
- Include user, timestamp, IP address
- Exportable audit reports
- 90-day retention minimum

#### P2: Two-Factor Authentication (Needs Grooming)
**Use Case**: Enhanced security for sensitive financial data
**Questions**:
- SMS vs Authenticator app?
- Backup codes strategy?
- Remember device option?

#### P3: Enterprise SSO (Parked)
**Use Case**: SAML/OIDC for large firms
**Why Parked**: No enterprise customers yet
**Trigger**: First enterprise client request

### Data Management

#### P1: Bulk Export Improvements (Groomed)
**Use Case**: Export multiple tables with relationships
**Acceptance Criteria**:
- Select multiple tables for export
- Maintain referential integrity
- Progress indication for large exports
- Multiple format support (CSV, JSON, Excel)

#### P2: Data Import Wizard (Needs Grooming)
**Use Case**: Import data from other accounting systems
**Questions**:
- Which formats to support?
- Validation rules?
- Mapping interface design?

### Reporting & Analytics

#### P2: Custom Report Builder (Needs Grooming)
**Use Case**: Create custom reports without leaving the app
**Needs**:
- Define available data fields
- Report builder UI mockups
- Save/share functionality

#### P3: Dashboard Analytics (Parked)
**Use Case**: Real-time business metrics
**Why Parked**: Focus on core functionality first

---

## Technical Debt & Infrastructure

### P1: Remove Client-Side Fetching (In Progress)
- Convert remaining pages to loader pattern
- Remove useEffect for data fetching
- Improve performance and SEO

### P2: Comprehensive Error Handling
- Standardize error responses
- User-friendly error messages
- Error boundary components

### P3: Performance Monitoring
- Add application monitoring
- Track API response times
- User experience metrics

---

## How to Use This Document

1. **Product Planning**: Review P0/P1 items for sprint planning
2. **Grooming Sessions**: Pick "Needs Grooming" items to specify
3. **Customer Feedback**: Update priorities based on user requests
4. **Parking Decisions**: Document why features are parked

## Review Schedule
- Weekly: Update status of in-progress items
- Monthly: Re-prioritize based on customer feedback
- Quarterly: Review parked items for promotion

Last Updated: 2025-01-04
Next Review: 2025-01-11