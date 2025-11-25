# MoneyWorks Entity Guide: Contacts

## Architectural Overview
The **Contacts** entity acts as an extension to the **Names** table. It solves the limitation of the Names table, which only supports two hard-coded contacts (`Contact`/`Contact2`).

### Critical Concepts

#### 1. Dual-Layer Contact Architecture
MoneyWorks uses a hybrid approach to contact management:
*   **Embedded (Names Table)**: Every Customer/Supplier has fields for `Contact` and `Contact2`. These are fast, simple, and used by default on forms.
*   **Subfile (Contacts Table)**: For organizations with 3+ people, or complex hierarchies, you use the Contacts subfile. These records link back to the Name via `ParentSeq`.

#### 2. The "Role" Bitmask
Contacts have a `Role` field similar to the Names table. This allows you to tag specific people for specific functions (e.g., "Accounts Payable", "Purchasing Officer").
*   *Usage*: When emailing an invoice, you can tell MoneyWorks to "Send to all contacts with Role = Accounts".

#### 3. Field Capacity Differences
The Contacts table generally offers *more* space than the embedded fields, making it better for international or complex data.
*   **Name**: 39 chars (vs 25/29 in Names).
*   **Position**: 39 chars (vs 29 in Names).
*   **Mobile**: 19 chars (vs 14 in Names).
*   *Exception*: **Email** is shorter (63 chars vs 80 in Names).

---

## Canonical Schemas

### Contact Fields

#### Core Identification
| Field | Type | Max | Required | Description | Relationship |
|-------|------|-----|----------|-------------|--------------|
| `ParentSeq` | Num | - | **Yes** | Link to Name record. | `Names.Seq` |
| `Order` | Num | - | - | Sort order within the Name. | - |
| `Role` | Num | - | - | Bit-mapped role flags. | - |

#### Personal Details
| Field | Type | Max | Description |
|-------|------|-----|-------------|
| `Contact` | Text | 39 | Full Name. |
| `Salutation` | Text | 39 | Formal greeting (e.g. "Mr Smith"). |
| `Position` | Text | 39 | Job Title. |
| `Memo` | Text | 255 | Internal notes. |

#### Communication
| Field | Type | Max | Description |
|-------|------|-----|-------------|
| `eMail` | Text | 63 | Email Address. |
| `Mobile` | Text | 19 | Mobile Phone. |
| `DDI` | Text | 19 | Direct Dial Phone. |
| `AfterHours` | Text | 19 | After Hours Phone. |

#### System & Custom
| Field | Type | Description |
|-------|------|-------------|
| `LastModifiedTime` | Text | Last edit timestamp. |
| `UserNum` | Num | Scriptable number storage. |
| `UserText` | Text | Scriptable text storage. |
| `TaggedText` | Text | Scriptable tag storage. |

---

## Developer Tips

### 1. Creating a Contact
You cannot create a Contact without a parent.
1.  Find the `Seq` (Sequence Number) of the parent Name record.
2.  Create the Contact record with `ParentSeq = [Name.Seq]`.

### 2. Searching for Contacts
Contacts are not "first class" in the same way Names are. You typically search for them *via* the Name.
*   *Search*: `ParentSeq = [Seq]` to find all contacts for a specific company.

### 3. The Email Length Trap
Be careful migrating data from `Names.email` (80 chars) to `Contacts.eMail` (63 chars). You may truncate long addresses if you blindly move them to the subfile.

---

## Role Bit Flags

The `Role` field is a bitmask. Common role bits:

| Bit | Value | Purpose |
|-----|-------|---------|
| 0 | `0x0001` | Receives Statements |
| 1 | `0x0002` | Receives Remittances |
| 2 | `0x0004` | Receives Invoices |
| 3 | `0x0008` | Receives Purchase Orders |
| 4 | `0x0010` | Receives Quotes |
| 16 | `0x10000` | Contact1 (legacy - embedded contact) |
| 17 | `0x20000` | Contact2 (legacy - embedded contact) |

---

## SDK Usage Examples

### Repository Access

```typescript
import { createMoneyWorksClient } from '@moneyworks/data';
import { MoneyWorksContactRoles, hasContactRole } from '@moneyworks/canonical';

const client = createMoneyWorksClient({ /* config */ });
const contactRepo = client.repositories.contact;
const nameRepo = client.repositories.name;
```

### Find Contacts for a Customer

```typescript
// Get customer
const customer = await nameRepo.findByCode('ACME');

// Get all contacts for that customer
const contacts = await contactRepo.findByParentSeq(customer.SequenceNumber);
```

### Find Contacts by Role

```typescript
// Find all contacts who receive statements
const statementRecipients = await contactRepo.findByRole(
  MoneyWorksContactRoles.STATEMENT
);

// Find contacts who receive invoices
const invoiceRecipients = await contactRepo.findByRole(
  MoneyWorksContactRoles.INVOICE
);

// Using raw bitwise search
const poRecipients = await contactRepo.find({
  search: `(Role&#8) != 0`  // Bit 3 = Purchase Orders
});
```

### Find Contacts by Email

```typescript
const contact = await contactRepo.findByEmail('john@acme.com');
```

### Check Contact Roles

```typescript
import {
  hasContactRole,
  decodeContactRoles,
  MoneyWorksContactRoles,
} from '@moneyworks/canonical';

const contact = await contactRepo.findBySequenceNumber(12345);

// Check single role
if (hasContactRole(contact.Role, MoneyWorksContactRoles.STATEMENT)) {
  console.log('This contact receives statements');
}

// Get all roles
const roles = decodeContactRoles(contact.Role);
console.log('Contact roles:', roles);
```

### Complete Customer with Contacts Example

```typescript
async function getCustomerWithContacts(code: string) {
  const customer = await nameRepo.findByCode(code);
  if (!customer) return null;

  const contacts = await contactRepo.findByParentSeq(customer.SequenceNumber);

  return {
    customer,
    contacts,
    primaryContact: contacts.find(c =>
      hasContactRole(c.Role, MoneyWorksContactRoles.CONTACT1)
    ),
    invoiceContacts: contacts.filter(c =>
      hasContactRole(c.Role, MoneyWorksContactRoles.INVOICE)
    ),
  };
}
```

---

## Related Documentation

- [**Names Entity**](names.md) - Parent entity for Contacts
- [**Entity Relationships**](../concepts/relationships.md) - How Contact links to Name
- [**Query Syntax**](../reference/query-syntax.md) - Bitwise search syntax
