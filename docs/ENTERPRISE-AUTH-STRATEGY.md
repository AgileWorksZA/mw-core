# Enterprise Authentication Strategy

## Overview

This document outlines our authentication strategy as we scale from serving small accounting firms to enterprise clients. We currently use Clerk for authentication and will add WorkOS for enterprise features when needed.

## Current State (Phase 1)

- **Authentication**: Clerk
- **Target Market**: Individual accountants, small to medium accounting firms
- **Features**: Email/password auth, basic team invitations, session management

## Future State (Phase 2+)

A hybrid approach using both Clerk and WorkOS:

### Why Both?

| Feature | Clerk | WorkOS | Rationale |
|---------|-------|---------|-----------|
| Basic Auth | ✅ | ❌ | Already implemented, works well for SMB |
| UI Components | ✅ | ❌ | Pre-built React components save development time |
| Enterprise SSO | ❌ | ✅ | Required by large firms (SAML, OIDC) |
| Directory Sync | ❌ | ✅ | Auto-provision/deprovision users |
| Audit Logs | Basic | ✅ | Compliance-grade audit trails |
| Pricing | Per user | Per company | Better economics for large orgs |

## Implementation Roadmap

### Phase 1: Current (Clerk Only) ✅
- Basic authentication
- User management
- Simple team features

### Phase 2: Add Audit Logs
**Trigger**: First client requiring compliance reports

```typescript
// Example: Logging MoneyWorks data access
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

// Log when user accesses client books
await workos.auditLogs.createEvent({
  organization: organizationId,
  event: {
    action: 'moneyworks.datafile.accessed',
    actor: {
      id: userId,
      name: userName,
      type: 'user'
    },
    targets: [{
      id: connectionId,
      name: dataFileName,
      type: 'moneyworks_connection'
    }],
    context: {
      location: request.ip,
      user_agent: request.headers['user-agent']
    }
  }
});
```

### Phase 3: Add SSO
**Trigger**: Enterprise client requiring SAML/OIDC

```typescript
// Example: SSO integration alongside Clerk
import { useAuth as useClerk } from '@clerk/clerk-react';
import { useWorkOS } from './hooks/use-workos';

function SignIn() {
  const { signIn: clerkSignIn } = useClerk();
  const { ssoSignIn } = useWorkOS();
  
  // Show SSO option for organizations with SSO enabled
  if (organization?.ssoEnabled) {
    return <SSOLoginButton onClick={() => ssoSignIn(organization.id)} />;
  }
  
  // Otherwise use Clerk
  return <ClerkSignIn />;
}
```

### Phase 4: Directory Sync (SCIM)
**Trigger**: Large firm with IT department

```typescript
// Example: Map directory users to MoneyWorks groups
interface DirectorySyncMapping {
  // WorkOS directory group -> MoneyWorks group
  'Finance Team': 'finance-group-id',
  'Audit Team': 'audit-group-id',
  'Tax Team': 'tax-group-id'
}

// Auto-provision users into correct groups based on directory
async function handleDirectoryUserCreated(event: WorkOSEvent) {
  const { user, groups } = event.data;
  
  // Create user in our system
  const dbUser = await createUser({
    email: user.email,
    name: user.name,
    externalId: user.id
  });
  
  // Add to appropriate MoneyWorks groups
  for (const group of groups) {
    const mwGroupId = DIRECTORY_MAPPING[group.name];
    if (mwGroupId) {
      await groupService.addGroupMember({
        group_id: mwGroupId,
        user_id: dbUser.id,
        role: 'member'
      });
    }
  }
}
```

## Key Integration Points

### 1. Authentication Flow
```
                    ┌─────────────┐
                    │   User      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Is Org SSO │
                    │   Enabled?  │
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                │                     │
           Yes  │                     │ No
                ▼                     ▼
        ┌──────────────┐     ┌──────────────┐
        │   WorkOS     │     │    Clerk     │
        │  SSO Flow    │     │   Sign In    │
        └──────┬───────┘     └──────┬───────┘
               │                     │
               └──────────┬──────────┘
                          │
                   ┌──────▼──────┐
                   │Create/Update│
                   │   Session   │
                   └─────────────┘
```

### 2. Audit Events to Track

Critical events for accounting compliance:

- `moneyworks.connection.created` - New data file connected
- `moneyworks.connection.accessed` - User opened client books
- `moneyworks.export.created` - Data exported from system
- `moneyworks.taxrate.modified` - Tax configuration changed
- `moneyworks.group.member_added` - User granted access to client
- `moneyworks.group.member_removed` - User access revoked

### 3. Organization Structure Mapping

```typescript
// Current structure (Clerk)
interface ClerkOrganization {
  users: User[];
  invitations: Invitation[];
}

// Future structure (Clerk + WorkOS)
interface EnterpriseOrganization {
  // Clerk handles
  users: User[];
  sessions: Session[];
  
  // WorkOS handles
  ssoConnection?: SSOConnection;
  directorySync?: DirectorySync;
  auditLogs: AuditLogConfig;
  
  // Our system maps
  groups: CompanyGroup[];
  permissions: GroupPermission[];
}
```

## Cost Analysis

### Small Firm (5 users)
- **Clerk only**: ~$25/month
- **No need for WorkOS**

### Medium Firm (50 users)
- **Clerk**: ~$250/month
- **WorkOS Audit Logs**: $99/month
- **Total**: ~$349/month

### Enterprise Firm (500 users)
- **Clerk**: ~$2,500/month (consider negotiating)
- **WorkOS SSO + SCIM + Audit**: ~$499/month
- **Total**: ~$2,999/month
- **Note**: At this scale, consider WorkOS AuthKit as full replacement

## Migration Considerations

### When to Start Migration
1. First enterprise client requests SSO
2. Compliance audit requires detailed logs
3. Client IT department needs directory sync
4. You have 10+ organizations using the platform

### Data to Preserve
- User IDs (map Clerk ID to WorkOS ID)
- Session tokens (dual validation period)
- Organization structure
- Permissions and roles

## Security Considerations

### With SSO Enabled
- Disable password reset for SSO users
- Enforce SSO for all org members (no bypass)
- Regular token rotation
- IP allowlisting for sensitive orgs

### Audit Log Retention
- 7 years for financial data access (SOX compliance)
- 3 years for general user activity
- Encrypted at rest
- Immutable once written

## Implementation Checklist

When ready to implement:

- [ ] Sign up for WorkOS account
- [ ] Install WorkOS SDK: `bun add @workos-inc/node`
- [ ] Add environment variables:
  - `WORKOS_API_KEY`
  - `WORKOS_CLIENT_ID`
  - `WORKOS_WEBHOOK_SECRET`
- [ ] Create webhook endpoint for WorkOS events
- [ ] Update user model with `external_id` field
- [ ] Add `sso_enabled` flag to organizations
- [ ] Create SSO configuration UI for org admins
- [ ] Implement audit log service
- [ ] Add compliance report generation
- [ ] Update documentation
- [ ] Train support team on enterprise features

## Resources

- [WorkOS Documentation](https://workos.com/docs)
- [Clerk + WorkOS Integration Guide](https://workos.com/blog/integrate-workos-with-clerk)
- [SAML vs OIDC Comparison](https://workos.com/blog/saml-vs-oidc)
- [Audit Log Best Practices](https://workos.com/blog/audit-log-best-practices)

## Decision Log

**2025-01-03**: Decided to continue with Clerk for initial launch and add WorkOS when first enterprise client signs. This avoids premature optimization while keeping a clear upgrade path.

**Rationale**: 
- Clerk is already implemented and working well
- Most initial clients will be small/medium firms
- WorkOS adds complexity and cost not yet justified
- Clear migration path exists when needed