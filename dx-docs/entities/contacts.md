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
