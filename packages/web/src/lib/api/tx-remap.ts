/**
 * Transaction field remapping workaround.
 *
 * The MoneyWorks TSV export for the Transaction table includes an extra
 * _Timestamp column (position 3) that the field discovery doesn't account for.
 * This causes a systematic 1-position shift from column 3 onwards:
 *   - field "Transdate" actually contains OurRef
 *   - field "Theirref" actually contains Type
 *   - field "Flag" actually contains NameCode
 *   - field "Analysis" actually contains Gross
 *   etc.
 *
 * TODO: Fix in @moneyworks/data field discovery layer.
 * This workaround remaps the shifted fields at the BFF layer.
 */

export interface MappedTransaction {
	id: number;
	ourRef: string;
	transDate: string;
	enterDate: string;
	dueDate: string;
	period: number;
	type: string;
	theirRef: string;
	nameCode: string;
	flag: string;
	description: string;
	gross: number;
	analysis: string;
	contra: string;
	toFrom: string;
	// Status is lost due to boolean coercion of Hold field — derive from type suffix
	status: string;
	hold: boolean;
	taxAmount: number;
	amtPaid: number;
	colour: number;
	salesPerson: string;
	paymentMethod: number;
	enteredBy: string;
	postedBy: string;
	currency: string;
	exchangeRate: number;
	deliveryAddress: string;
	mailingAddress: string;
}

/** Remap a raw transaction record from the API (with shifted fields) */
export function remapTransaction(raw: Record<string, any>): MappedTransaction {
	// Columns 1-2 are correct: Sequencenumber, LastModifiedTime
	// From column 3 onwards, each field contains the NEXT field's value
	// (because _Timestamp is injected as column 3 in TSV but not in headers)

	const typeRaw = String(raw.Theirref ?? '');
	// Type comes as "DIC", "DII", "CIC", "CP", "CR" etc.
	// Base type is first 2 chars; 3rd char indicates status (I=incomplete, C=complete)
	const baseType = typeRaw.substring(0, 2);
	// Derive status: if type ends in C = complete/posted, I = incomplete
	const status = typeRaw.length === 3 && typeRaw[2] === 'C' ? 'P'
		: typeRaw.length === 3 && typeRaw[2] === 'I' ? 'U'
		: typeRaw === 'CP' || typeRaw === 'CR' || typeRaw === 'JN' ? 'P'
		: 'U';

	return {
		id: raw.Sequencenumber ?? 0,
		ourRef: String(raw.Transdate ?? ''),
		transDate: String(raw.Enterdate ?? ''),
		enterDate: String(raw.Duedate ?? ''),
		dueDate: String(raw.Period ?? ''),
		period: Number(raw.Type) || 0,
		type: baseType,
		theirRef: String(raw.Namecode ?? ''),
		nameCode: String(raw.Flag ?? ''),
		flag: String(raw.Description ?? ''),
		description: String(raw.Gross ?? ''),
		gross: Number(raw.Analysis) || 0,
		analysis: String(raw.Contra ?? ''),
		contra: String(raw.Tofrom ?? ''),
		toFrom: String(raw.Status ?? ''),
		status,
		hold: raw.Datepaid === '1' || raw.Datepaid === 1,
		taxAmount: Number(raw.Recurring) || 0,
		amtPaid: Number(raw.Payamount) || 0,
		colour: Number(raw.Bankjnseq) || 0,
		salesPerson: String(raw.User1 ?? ''),
		paymentMethod: Number(raw.Timeposted) || 0,
		enteredBy: String(raw.User2 ?? ''),
		postedBy: String(raw.User3 ?? ''),
		currency: String(raw.Promptpaymentamt ?? ''),
		exchangeRate: Number(raw.Prodpricecode) || 0,
		deliveryAddress: String(raw.Freightcode ?? ''),
		mailingAddress: String(raw.Deliveryaddress ?? '')
	};
}
