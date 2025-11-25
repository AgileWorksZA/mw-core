/**
 * MoneyWorks Contact Enumerations
 *
 * @moneyworks-entity Contact
 * @moneyworks-dsl PURE
 * @ai-instruction Use ONLY these enum values when working with MoneyWorks contacts
 * @ai-critical NEVER create your own contact-related enums or use generic terms
 */

/**
 * MoneyWorks Contact Roles - 16-Bit Mapped Enumeration
 * Source: MoneyWorks Manual - moneyworks_names_roles.html
 *
 * VERIFIED ARCHITECTURE:
 * - 16 user-definable roles using bit-mapped flags
 * - Each role is a power of 2 (2^0, 2^1, 2^2, etc.)
 * - Roles can be combined using bitwise OR operations
 * - Role names are user-definable with 15 character limit
 * - Configured in Edit->Document Preferences->Fields panel
 * - Values stored as hexadecimal with # prefix in MoneyWorks (#01, #02, etc.)
 *
 * @ai-instruction When checking contact roles, use bitwise operations with these flags
 * @ai-critical Role field is a 16-bit bitmask, not an enum value
 * @ai-forbidden contact-type, person-role, position-type
 */
export enum MoneyWorksContactRoles {
	/**
	 * Role 1 - Default: "Payables" (bit 0)
	 * @moneyworks-value #01 (hex) / 1 (decimal)
	 * @ai-term Say "Role 1" or configured name, NEVER assume specific meaning
	 */
	ROLE_1 = 0x01,

	/**
	 * Role 2 - Default: "Receivables" (bit 1)
	 * @moneyworks-value #02 (hex) / 2 (decimal)
	 */
	ROLE_2 = 0x02,

	/**
	 * Role 3 - Default: "Technical" (bit 2)
	 * @moneyworks-value #04 (hex) / 4 (decimal)
	 */
	ROLE_3 = 0x04,

	/**
	 * Role 4 - Default: "Management" (bit 3)
	 * @moneyworks-value #08 (hex) / 8 (decimal)
	 */
	ROLE_4 = 0x08,

	/**
	 * Role 5 - User-defined (bit 4)
	 * @moneyworks-value #10 (hex) / 16 (decimal)
	 */
	ROLE_5 = 0x10,

	/**
	 * Role 6 - User-defined (bit 5)
	 * @moneyworks-value #20 (hex) / 32 (decimal)
	 */
	ROLE_6 = 0x20,

	/**
	 * Role 7 - User-defined (bit 6)
	 * @moneyworks-value #40 (hex) / 64 (decimal)
	 */
	ROLE_7 = 0x40,

	/**
	 * Role 8 - User-defined (bit 7)
	 * @moneyworks-value #80 (hex) / 128 (decimal)
	 */
	ROLE_8 = 0x80,

	/**
	 * Role 9 - User-defined (bit 8)
	 * @moneyworks-value #100 (hex) / 256 (decimal)
	 */
	ROLE_9 = 0x100,

	/**
	 * Role 10 - User-defined (bit 9)
	 * @moneyworks-value #200 (hex) / 512 (decimal)
	 */
	ROLE_10 = 0x200,

	/**
	 * Role 11 - User-defined (bit 10)
	 * @moneyworks-value #400 (hex) / 1024 (decimal)
	 */
	ROLE_11 = 0x400,

	/**
	 * Role 12 - User-defined (bit 11)
	 * @moneyworks-value #800 (hex) / 2048 (decimal)
	 */
	ROLE_12 = 0x800,

	/**
	 * Role 13 - User-defined (bit 12)
	 * @moneyworks-value #1000 (hex) / 4096 (decimal)
	 */
	ROLE_13 = 0x1000,

	/**
	 * Role 14 - User-defined (bit 13)
	 * @moneyworks-value #2000 (hex) / 8192 (decimal)
	 */
	ROLE_14 = 0x2000,

	/**
	 * Role 15 - User-defined (bit 14)
	 * @moneyworks-value #4000 (hex) / 16384 (decimal)
	 */
	ROLE_15 = 0x4000,

	/**
	 * Role 16 - User-defined (bit 15)
	 * @moneyworks-value #8000 (hex) / 32768 (decimal)
	 */
	ROLE_16 = 0x8000,
}

/**
 * MoneyWorks Legacy Contact Special Values
 * Source: moneyworks_names_roles.html - legacy contact handling
 *
 * IMPORTANT: Legacy contacts (Contact1, Contact2) in Names entity have assumed role bits
 * that extend beyond the normal 16-bit role field for compatibility.
 *
 * @ai-instruction Use these to query legacy Contact1/Contact2 fields via GetContactForRole
 * @ai-context These values work with GetContactForRole(#10000, "email") etc.
 */
export enum MoneyWorksLegacyContactRoles {
	/**
	 * Contact1 assumed role bit - MoneyWorks: #10000
	 * @ai-context Use to retrieve Contact1 data via role-based functions
	 */
	CONTACT_1_ASSUMED = 0x10000,

	/**
	 * Contact2 assumed role bit - MoneyWorks: #20000
	 * @ai-context Use to retrieve Contact2 data via role-based functions
	 */
	CONTACT_2_ASSUMED = 0x20000,
}

/**
 * Default role names as configured in MoneyWorks
 * Source: Document Preferences -> Fields tab -> Contact Roles list
 *
 * @ai-instruction These are default names, actual names may be customized per document
 */
export const MONEYWORKS_DEFAULT_ROLE_NAMES: Record<number, string> = {
	[MoneyWorksContactRoles.ROLE_1]: "Payables",
	[MoneyWorksContactRoles.ROLE_2]: "Receivables",
	[MoneyWorksContactRoles.ROLE_3]: "Technical",
	[MoneyWorksContactRoles.ROLE_4]: "Management",
	[MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED]: "Contact1",
	[MoneyWorksLegacyContactRoles.CONTACT_2_ASSUMED]: "Contact2",
} as const;

/**
 * Encode multiple roles into a single role field value
 *
 * @param roles - Array of role bits to combine
 * @returns Combined role field value
 *
 * @example
 * ```typescript
 * // Combine Payables and Technical roles
 * const roleField = encodeRoles([
 *   MoneyWorksContactRoles.ROLE_1,
 *   MoneyWorksContactRoles.ROLE_3
 * ]);
 * // Result: 5 (0x05)
 * ```
 *
 * @ai-instruction Use this to create role field values for import/create
 */
export function encodeRoles(
	roles: (MoneyWorksContactRoles | MoneyWorksLegacyContactRoles)[],
): number {
	let result = 0;
	for (const role of roles) {
		result |= role;
	}
	return result;
}

/**
 * Decode a role field value into individual role bits
 *
 * @param roleField - The combined role field value
 * @returns Array of individual role bits that are set
 *
 * @example
 * ```typescript
 * // Decode role field value 5 (Payables + Technical)
 * const roles = decodeRoles(5);
 * // Result: [MoneyWorksContactRoles.ROLE_1, MoneyWorksContactRoles.ROLE_3]
 * ```
 *
 * @ai-instruction Use this to determine which roles are assigned to a contact
 */
export function decodeRoles(roleField: number): MoneyWorksContactRoles[] {
	const roles: MoneyWorksContactRoles[] = [];

	for (let i = 0; i < 16; i++) {
		const roleValue = 1 << i;
		if (roleField & roleValue) {
			roles.push(roleValue as MoneyWorksContactRoles);
		}
	}

	return roles;
}

/**
 * Check if a role field has a specific role set
 *
 * @param roleField - The role field value to check
 * @param role - The role bit to check for
 * @returns True if the role is set
 *
 * @example
 * ```typescript
 * if (hasRole(contact.Role, MoneyWorksContactRoles.ROLE_1)) {
 *   console.log("Contact is assigned to Payables");
 * }
 * ```
 *
 * @ai-instruction Use for checking individual role membership
 */
export function hasRole(
	roleField: number,
	role: MoneyWorksContactRoles | MoneyWorksLegacyContactRoles,
): boolean {
	return (roleField & role) !== 0;
}

/**
 * Add a role to an existing role field value
 *
 * @param roleField - Current role field value
 * @param role - Role to add
 * @returns Updated role field value
 *
 * @ai-instruction Use for updating contact roles
 */
export function addRole(
	roleField: number,
	role: MoneyWorksContactRoles | MoneyWorksLegacyContactRoles,
): number {
	return roleField | role;
}

/**
 * Remove a role from an existing role field value
 *
 * @param roleField - Current role field value
 * @param role - Role to remove
 * @returns Updated role field value
 *
 * @ai-instruction Use for updating contact roles
 */
export function removeRole(
	roleField: number,
	role: MoneyWorksContactRoles | MoneyWorksLegacyContactRoles,
): number {
	return roleField & ~role;
}

/**
 * Convert role field to MoneyWorks hexadecimal format
 *
 * @param roleField - The role field value
 * @returns MoneyWorks hex format string (e.g., "#05", "#FF")
 *
 * @example
 * ```typescript
 * const hexFormat = toMoneyWorksHex(5);
 * // Result: "#05"
 * ```
 *
 * @ai-instruction Use when preparing data for MoneyWorks import
 */
export function toMoneyWorksHex(roleField: number): string {
	return `#${roleField.toString(16).toUpperCase().padStart(2, "0")}`;
}

/**
 * Parse MoneyWorks hexadecimal format to role field value
 *
 * @param hexString - MoneyWorks hex format string (e.g., "#05", "#FF")
 * @returns Role field value as number
 *
 * @example
 * ```typescript
 * const roleField = fromMoneyWorksHex("#05");
 * // Result: 5
 * ```
 *
 * @ai-instruction Use when parsing data from MoneyWorks export
 */
export function fromMoneyWorksHex(hexString: string): number {
	const cleanHex = hexString.startsWith("#") ? hexString.slice(1) : hexString;
	return parseInt(cleanHex, 16);
}

/**
 * Get human-readable role names from a role field value
 *
 * @param roleField - The role field value
 * @param customRoleNames - Optional custom role name mapping
 * @returns Comma-separated string of role names
 *
 * @example
 * ```typescript
 * const roleNames = getRoleNames(5);
 * // Result: "Payables, Technical"
 * ```
 *
 * @ai-instruction Use for display purposes
 */
export function getRoleNames(
	roleField: number,
	customRoleNames?: Record<number, string>,
): string {
	const roles = decodeRoles(roleField);
	const names: string[] = [];

	// Check for legacy contact roles
	if (roleField & MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED) {
		names.push(
			customRoleNames?.[MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED] ||
				MONEYWORKS_DEFAULT_ROLE_NAMES[
					MoneyWorksLegacyContactRoles.CONTACT_1_ASSUMED
				],
		);
	}
	if (roleField & MoneyWorksLegacyContactRoles.CONTACT_2_ASSUMED) {
		names.push(
			customRoleNames?.[MoneyWorksLegacyContactRoles.CONTACT_2_ASSUMED] ||
				MONEYWORKS_DEFAULT_ROLE_NAMES[
					MoneyWorksLegacyContactRoles.CONTACT_2_ASSUMED
				],
		);
	}

	// Add regular role names
	for (const role of roles) {
		const name =
			customRoleNames?.[role] ||
			MONEYWORKS_DEFAULT_ROLE_NAMES[role] ||
			`Role ${Math.log2(role) + 1}`;
		names.push(name);
	}

	return names.length > 0 ? names.join(", ") : "No roles assigned";
}
