/**
 * MoneyWorks Contacts Repository
 *
 * @moneyworks-entity Contacts
 * @moneyworks-dsl PURE
 * @ai-instruction This repository handles all Contacts data operations
 * @ai-critical Table name is PLURAL: "Contacts" not "Contact"
 *
 * Contacts are a subfile of Names, providing unlimited additional contacts
 * beyond the built-in Contact1/Contact2 fields.
 */

import type {
	MoneyWorksContact,
	MoneyWorksContactCreateInput,
	MoneyWorksContactUpdateInput,
} from "@moneyworks/canonical/entities/contacts";
import { BaseMoneyWorksRepository } from "./base.repository";

/**
 * Repository for MoneyWorks Contacts entity
 *
 * @ai-instruction Use this for all Contacts data operations
 * @ai-term Say "ContactsRepository", NEVER "ContactRepository" (singular)
 *
 * KEY RELATIONSHIPS:
 * - Contacts link to Names via ParentSeq = Name.SequenceNumber
 * - Multiple contacts can exist for a single Name record
 * - Use findByParentSeq to get all contacts for a Name
 */
export class ContactsRepository extends BaseMoneyWorksRepository<
	MoneyWorksContact,
	MoneyWorksContactCreateInput,
	MoneyWorksContactUpdateInput
> {
	/**
	 * MoneyWorks table name
	 * @ai-critical Must be PLURAL: "Contacts"
	 */
	protected readonly tableName = "Contacts";

	/**
	 * Primary key field
	 * @ai-critical SequenceNumber is the primary key for Contact
	 */
	protected readonly primaryKey = "SequenceNumber";

	/**
	 * Post-process records to parse MW data types
	 *
	 * @ai-instruction Smart client already parsed basic types, we ensure proper types
	 */
	protected postProcess(record: any): MoneyWorksContact {
		// Parse numeric fields
		const numericFields = [
			"ParentSeq",
			"SequenceNumber",
			"Order",
			"Role",
			"Colour",
			"UserNum",
		];

		const processed: any = { ...record };

		// Parse numeric fields
		for (const field of numericFields) {
			if (
				field in processed &&
				processed[field] !== null &&
				processed[field] !== ""
			) {
				processed[field] = Number(processed[field]);
			}
		}

		return processed as MoneyWorksContact;
	}

	/**
	 * Prepare data for MoneyWorks
	 *
	 * @ai-instruction Converts typed data to MW format
	 */
	protected prepare(
		data: MoneyWorksContactCreateInput | MoneyWorksContactUpdateInput,
	): any {
		const prepared: any = {};

		// Required field for creation
		if ("ParentSeq" in data && data.ParentSeq !== undefined) {
			prepared.ParentSeq = data.ParentSeq;
		}

		// Personal details
		if ("Contact" in data && data.Contact !== undefined) {
			prepared.Contact = data.Contact;
		}
		if ("Salutation" in data && data.Salutation !== undefined) {
			prepared.Salutation = data.Salutation;
		}
		if ("Position" in data && data.Position !== undefined) {
			prepared.Position = data.Position;
		}
		if ("Memo" in data && data.Memo !== undefined) {
			prepared.Memo = data.Memo;
		}

		// Communication fields
		if ("eMail" in data && data.eMail !== undefined) {
			prepared.eMail = data.eMail;
		}
		if ("Mobile" in data && data.Mobile !== undefined) {
			prepared.Mobile = data.Mobile;
		}
		if ("DDI" in data && data.DDI !== undefined) {
			prepared.DDI = data.DDI;
		}
		if ("AfterHours" in data && data.AfterHours !== undefined) {
			prepared.AfterHours = data.AfterHours;
		}

		// Role and order
		if ("Role" in data && data.Role !== undefined) {
			prepared.Role = data.Role;
		}
		if ("Order" in data && data.Order !== undefined) {
			prepared.Order = data.Order;
		}

		// Metadata
		if ("Colour" in data && data.Colour !== undefined) {
			prepared.Colour = data.Colour;
		}

		// User-defined fields
		if ("UserNum" in data && data.UserNum !== undefined) {
			prepared.UserNum = data.UserNum;
		}
		if ("UserText" in data && data.UserText !== undefined) {
			prepared.UserText = data.UserText;
		}
		if ("TaggedText" in data && data.TaggedText !== undefined) {
			prepared.TaggedText = data.TaggedText;
		}

		return prepared;
	}

	/**
	 * Find all contacts for a specific Name record by ParentSeq
	 *
	 * @param parentSeq - The SequenceNumber of the parent Name record
	 * @returns Array of contacts linked to this Name
	 *
	 * @example
	 * ```typescript
	 * // Get all contacts for Name with SequenceNumber 42
	 * const contacts = await repo.findByParentSeq(42);
	 * for (const contact of contacts) {
	 *   console.log(`${contact.Contact}: ${contact.eMail}`);
	 * }
	 * ```
	 *
	 * @ai-instruction Use this to find all contacts for a Name record
	 * @ai-context This is the primary way to retrieve contacts
	 */
	async findByParentSeq(parentSeq: number): Promise<MoneyWorksContact[]> {
		return this.find(`ParentSeq=${parentSeq}`);
	}

	/**
	 * Find all contacts for a Name by its Code
	 *
	 * This is a convenience method that first looks up the Name.SequenceNumber
	 * from the Name.Code, then queries Contact.ParentSeq.
	 *
	 * @param nameCode - The Code of the Name record (e.g., "CUST001")
	 * @returns Array of contacts linked to this Name
	 *
	 * @example
	 * ```typescript
	 * // Get all contacts for customer "CUST001"
	 * const contacts = await repo.findByNameCode("CUST001");
	 * ```
	 *
	 * @ai-instruction Use when you have the Name.Code but not the SequenceNumber
	 * @ai-context Requires a Name table lookup first
	 */
	async findByNameCode(nameCode: string): Promise<MoneyWorksContact[]> {
		// First, get the Name's SequenceNumber
		// Use smartExport to query Name table
		const names = await this.client.smartExport("Name", {
			search: `Code="${nameCode}"`,
			limit: 1,
		});

		if (names.length === 0) {
			return [];
		}

		const parentSeq = Number(names[0].SequenceNumber);
		return this.findByParentSeq(parentSeq);
	}

	/**
	 * Find contacts by role bit(s)
	 *
	 * Searches for contacts that have ANY of the specified role bits set.
	 * Uses bitwise AND operation: (Role & roleBit) != 0
	 *
	 * @param roleBit - Role bit(s) to search for (can be combined with OR)
	 * @returns Array of contacts with matching role(s)
	 *
	 * @example
	 * ```typescript
	 * import { MoneyWorksContactRoles } from "@moneyworks/canonical/entities/contacts";
	 *
	 * // Find all contacts with Payables role
	 * const payablesContacts = await repo.findByRole(MoneyWorksContactRoles.ROLE_1);
	 *
	 * // Find contacts with Payables OR Technical role
	 * const contacts = await repo.findByRole(
	 *   MoneyWorksContactRoles.ROLE_1 | MoneyWorksContactRoles.ROLE_3
	 * );
	 * ```
	 *
	 * @ai-instruction Use for role-based contact filtering
	 * @ai-context MoneyWorks search supports bitwise operations
	 */
	async findByRole(roleBit: number): Promise<MoneyWorksContact[]> {
		// MoneyWorks supports bitwise AND in search expressions
		// Format: (Role & #xx) != 0 where #xx is hex
		const hexBit = roleBit.toString(16).toUpperCase();
		return this.find(`(Role&#${hexBit})!=0`);
	}

	/**
	 * Find contacts by email address
	 *
	 * @param email - Email address to search for (exact match)
	 * @returns Array of contacts with matching email
	 *
	 * @example
	 * ```typescript
	 * const contacts = await repo.findByEmail("john@example.com");
	 * if (contacts.length > 0) {
	 *   const contact = contacts[0];
	 *   console.log(`Found: ${contact.Contact} at ${contact.Position}`);
	 * }
	 * ```
	 *
	 * @ai-instruction Use for email-based contact lookup
	 * @ai-context Note: eMail field is max 63 chars in Contact table
	 */
	async findByEmail(email: string): Promise<MoneyWorksContact[]> {
		return this.find(`eMail="${email}"`);
	}

	/**
	 * Find contacts for a Name that have a specific role
	 *
	 * Combines ParentSeq and Role filtering for efficient lookup.
	 *
	 * @param parentSeq - The SequenceNumber of the parent Name record
	 * @param roleBit - Role bit(s) to filter by
	 * @returns Array of contacts matching both criteria
	 *
	 * @example
	 * ```typescript
	 * // Find Payables contacts for a specific customer
	 * const payables = await repo.findByParentSeqAndRole(
	 *   42,
	 *   MoneyWorksContactRoles.ROLE_1
	 * );
	 * ```
	 *
	 * @ai-instruction Use for efficient filtered contact lookup
	 */
	async findByParentSeqAndRole(
		parentSeq: number,
		roleBit: number,
	): Promise<MoneyWorksContact[]> {
		const hexBit = roleBit.toString(16).toUpperCase();
		return this.find(`ParentSeq=${parentSeq} AND (Role&#${hexBit})!=0`);
	}

	/**
	 * Search contacts by name (Contact field)
	 *
	 * @param searchText - Text to search for in the Contact field
	 * @returns Array of contacts with matching names
	 *
	 * @example
	 * ```typescript
	 * // Find all contacts named "John"
	 * const contacts = await repo.searchByName("John");
	 * ```
	 *
	 * @ai-instruction Use CONTAINS for partial matching
	 */
	async searchByName(searchText: string): Promise<MoneyWorksContact[]> {
		return this.find(`Contact CONTAINS "${searchText}"`);
	}
}
