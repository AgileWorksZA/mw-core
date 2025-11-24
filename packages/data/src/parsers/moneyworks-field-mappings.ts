/**
 * MoneyWorks TSV Field Mappings
 *
 * MoneyWorks TSV exports have NO headers and the field order
 * doesn't always match the XML field order. These mappings
 * define the actual TSV column positions for each table.
 *
 * @moneyworks-dsl PURE
 */

/**
 * TaxRate table TSV field mapping
 * Based on actual MoneyWorks export observation
 */
export const TAXRATE_TSV_FIELD_MAPPING = [
	{
		position: 0,
		xmlName: "sequencenumber",
		pascalName: "Sequencenumber",
		dataType: "number" as const,
	},
	{
		position: 1,
		xmlName: "lastmodifiedtime",
		pascalName: "LastModifiedTime",
		dataType: "number" as const,
	},
	{
		position: 2,
		xmlName: "_timestamp",
		pascalName: "_Timestamp",
		dataType: "string" as const,
	}, // Formatted timestamp
	{
		position: 3,
		xmlName: "taxcode",
		pascalName: "TaxCode",
		dataType: "string" as const,
	},
	{
		position: 4,
		xmlName: "paidaccount",
		pascalName: "PaidAccount",
		dataType: "string" as const,
	},
	{
		position: 5,
		xmlName: "recaccount",
		pascalName: "RecAccount",
		dataType: "string" as const,
	},
	{
		position: 6,
		xmlName: "rate1",
		pascalName: "Rate1",
		dataType: "number" as const,
	},
	{
		position: 7,
		xmlName: "date",
		pascalName: "Date",
		dataType: "date" as const,
	},
	{
		position: 8,
		xmlName: "rate2",
		pascalName: "Rate2",
		dataType: "number" as const,
	},
	{
		position: 9,
		xmlName: "combinerate1",
		pascalName: "CombineRate1",
		dataType: "number" as const,
	},
	{
		position: 10,
		xmlName: "combinerate2",
		pascalName: "CombineRate2",
		dataType: "number" as const,
	},
	{
		position: 11,
		xmlName: "gstreceived",
		pascalName: "GSTReceived",
		dataType: "number" as const,
	},
	{
		position: 12,
		xmlName: "netreceived",
		pascalName: "NetReceived",
		dataType: "number" as const,
	},
	{
		position: 13,
		xmlName: "gstpaid",
		pascalName: "GSTPaid",
		dataType: "number" as const,
	},
	{
		position: 14,
		xmlName: "netpaid",
		pascalName: "NetPaid",
		dataType: "number" as const,
	},
	{
		position: 15,
		xmlName: "ratename",
		pascalName: "Ratename",
		dataType: "string" as const,
	},
	{
		position: 16,
		xmlName: "reportcyclestart",
		pascalName: "Reportcyclestart",
		dataType: "number" as const,
	},
	{
		position: 17,
		xmlName: "reportcycleend",
		pascalName: "Reportcycleend",
		dataType: "number" as const,
	},
	{
		position: 18,
		xmlName: "reportdate",
		pascalName: "Reportdate",
		dataType: "date" as const,
	},
	{
		position: 19,
		xmlName: "pstreceived",
		pascalName: "PSTReceived",
		dataType: "number" as const,
	},
	{
		position: 20,
		xmlName: "pstpaid",
		pascalName: "PSTPaid",
		dataType: "number" as const,
	},
	{
		position: 21,
		xmlName: "type",
		pascalName: "Type",
		dataType: "number" as const,
	},
	{
		position: 22,
		xmlName: "combination",
		pascalName: "Combination",
		dataType: "string" as const,
	},
	{
		position: 23,
		xmlName: "usernum",
		pascalName: "UserNum",
		dataType: "number" as const,
	},
	{
		position: 24,
		xmlName: "usertext",
		pascalName: "UserText",
		dataType: "string" as const,
	},
	{
		position: 25,
		xmlName: "taggedtext",
		pascalName: "TaggedText",
		dataType: "string" as const,
	},
	{
		position: 26,
		xmlName: "aliascode",
		pascalName: "Aliascode",
		dataType: "string" as const,
	},
	{
		position: 27,
		xmlName: "aliascountry",
		pascalName: "Aliascountry",
		dataType: "string" as const,
	},
	{
		position: 28,
		xmlName: "reversedrate1",
		pascalName: "Reversedrate1",
		dataType: "number" as const,
	},
	{
		position: 29,
		xmlName: "reversedrate2",
		pascalName: "Reversedrate2",
		dataType: "number" as const,
	},
];

/**
 * Name table TSV field mapping
 * Based on actual MoneyWorks export observation and XML analysis
 */
export const NAME_TSV_FIELD_MAPPING = [
	{
		position: 0,
		xmlName: "sequencenumber",
		pascalName: "Sequencenumber",
		dataType: "number" as const,
	},
	{
		position: 1,
		xmlName: "lastmodifiedtime",
		pascalName: "LastModifiedTime",
		dataType: "number" as const,
	},
	{
		position: 2,
		xmlName: "_timestamp",
		pascalName: "_Timestamp",
		dataType: "string" as const,
	}, // Formatted timestamp
	{
		position: 3,
		xmlName: "code",
		pascalName: "Code",
		dataType: "string" as const,
	},
	{
		position: 4,
		xmlName: "name",
		pascalName: "Name",
		dataType: "string" as const,
	},
	{
		position: 5,
		xmlName: "contact",
		pascalName: "Contact",
		dataType: "string" as const,
	},
	{
		position: 6,
		xmlName: "position",
		pascalName: "Position",
		dataType: "string" as const,
	},
	{
		position: 7,
		xmlName: "address1",
		pascalName: "Address1",
		dataType: "string" as const,
	},
	{
		position: 8,
		xmlName: "address2",
		pascalName: "Address2",
		dataType: "string" as const,
	},
	{
		position: 9,
		xmlName: "address3",
		pascalName: "Address3",
		dataType: "string" as const,
	},
	{
		position: 10,
		xmlName: "address4",
		pascalName: "Address4",
		dataType: "string" as const,
	},
	{
		position: 11,
		xmlName: "delivery1",
		pascalName: "Delivery1",
		dataType: "string" as const,
	},
	{
		position: 12,
		xmlName: "delivery2",
		pascalName: "Delivery2",
		dataType: "string" as const,
	},
	{
		position: 13,
		xmlName: "delivery3",
		pascalName: "Delivery3",
		dataType: "string" as const,
	},
	{
		position: 14,
		xmlName: "delivery4",
		pascalName: "Delivery4",
		dataType: "string" as const,
	},
	{
		position: 15,
		xmlName: "phone",
		pascalName: "Phone",
		dataType: "string" as const,
	},
	{
		position: 16,
		xmlName: "fax",
		pascalName: "Fax",
		dataType: "string" as const,
	},
	{
		position: 17,
		xmlName: "category1",
		pascalName: "Category1",
		dataType: "string" as const,
	},
	{
		position: 18,
		xmlName: "category2",
		pascalName: "Category2",
		dataType: "string" as const,
	},
	{
		position: 19,
		xmlName: "category3",
		pascalName: "Category3",
		dataType: "string" as const,
	},
	{
		position: 20,
		xmlName: "category4",
		pascalName: "Category4",
		dataType: "string" as const,
	},
	{
		position: 21,
		xmlName: "customertype",
		pascalName: "CustomerType",
		dataType: "number" as const,
	},
	{
		position: 22,
		xmlName: "d90plus",
		pascalName: "D90Plus",
		dataType: "number" as const,
	},
	{
		position: 23,
		xmlName: "d60plus",
		pascalName: "D60Plus",
		dataType: "number" as const,
	},
	{
		position: 24,
		xmlName: "d30plus",
		pascalName: "D30Plus",
		dataType: "number" as const,
	},
	{
		position: 25,
		xmlName: "dcurrent",
		pascalName: "DCurrent",
		dataType: "number" as const,
	},
	{
		position: 26,
		xmlName: "ccurrent",
		pascalName: "CCurrent",
		dataType: "number" as const,
	},
	{
		position: 27,
		xmlName: "debtorterms",
		pascalName: "DebtorTerms",
		dataType: "number" as const,
	},
	{
		position: 28,
		xmlName: "creditorterms",
		pascalName: "CreditorTerms",
		dataType: "number" as const,
	},
	{
		position: 29,
		xmlName: "bank",
		pascalName: "Bank",
		dataType: "string" as const,
	},
	{
		position: 30,
		xmlName: "accountname",
		pascalName: "AccountName",
		dataType: "string" as const,
	},
	{
		position: 31,
		xmlName: "bankbranch",
		pascalName: "BankBranch",
		dataType: "string" as const,
	},
	{
		position: 32,
		xmlName: "theirref",
		pascalName: "TheirRef",
		dataType: "string" as const,
	},
	{
		position: 33,
		xmlName: "hold",
		pascalName: "Hold",
		dataType: "boolean" as const,
	},
	{
		position: 34,
		xmlName: "recaccount",
		pascalName: "RecAccount",
		dataType: "string" as const,
	},
	{
		position: 35,
		xmlName: "payaccount",
		pascalName: "PayAccount",
		dataType: "string" as const,
	},
	{
		position: 36,
		xmlName: "kind",
		pascalName: "Kind",
		dataType: "number" as const,
	},
	{
		position: 37,
		xmlName: "creditlimit",
		pascalName: "CreditLimit",
		dataType: "number" as const,
	},
	{
		position: 38,
		xmlName: "discount",
		pascalName: "Discount",
		dataType: "number" as const,
	},
	{
		position: 39,
		xmlName: "comment",
		pascalName: "Comment",
		dataType: "string" as const,
	},
	{
		position: 40,
		xmlName: "suppliertype",
		pascalName: "SupplierType",
		dataType: "number" as const,
	},
	{
		position: 41,
		xmlName: "colour",
		pascalName: "Colour",
		dataType: "number" as const,
	},
	{
		position: 42,
		xmlName: "salesperson",
		pascalName: "Salesperson",
		dataType: "string" as const,
	},
	{
		position: 43,
		xmlName: "taxcode",
		pascalName: "TaxCode",
		dataType: "string" as const,
	},
	{
		position: 44,
		xmlName: "postcode",
		pascalName: "Postcode",
		dataType: "string" as const,
	},
	{
		position: 45,
		xmlName: "state",
		pascalName: "State",
		dataType: "string" as const,
	},
	{
		position: 46,
		xmlName: "bankaccountnumber",
		pascalName: "BankAccountNumber",
		dataType: "string" as const,
	},
	{
		position: 47,
		xmlName: "currency",
		pascalName: "Currency",
		dataType: "string" as const,
	},
	{
		position: 48,
		xmlName: "paymentmethod",
		pascalName: "PaymentMethod",
		dataType: "number" as const,
	},
	{
		position: 49,
		xmlName: "dbalance",
		pascalName: "DBalance",
		dataType: "number" as const,
	},
	{
		position: 50,
		xmlName: "ddi",
		pascalName: "DDI",
		dataType: "string" as const,
	},
	{
		position: 51,
		xmlName: "email",
		pascalName: "Email",
		dataType: "string" as const,
	},
	{
		position: 52,
		xmlName: "mobile",
		pascalName: "Mobile",
		dataType: "string" as const,
	},
	{
		position: 53,
		xmlName: "afterhours",
		pascalName: "AfterHours",
		dataType: "string" as const,
	},
	{
		position: 54,
		xmlName: "contact2",
		pascalName: "Contact2",
		dataType: "string" as const,
	},
	{
		position: 55,
		xmlName: "position2",
		pascalName: "Position2",
		dataType: "string" as const,
	},
	{
		position: 56,
		xmlName: "ddi2",
		pascalName: "DDI2",
		dataType: "string" as const,
	},
	{
		position: 57,
		xmlName: "email2",
		pascalName: "Email2",
		dataType: "string" as const,
	},
	{
		position: 58,
		xmlName: "mobile2",
		pascalName: "Mobile2",
		dataType: "string" as const,
	},
	{
		position: 59,
		xmlName: "afterhours2",
		pascalName: "AfterHours2",
		dataType: "string" as const,
	},
	{
		position: 60,
		xmlName: "weburl",
		pascalName: "WebURL",
		dataType: "string" as const,
	},
	{
		position: 61,
		xmlName: "productpricing",
		pascalName: "ProductPricing",
		dataType: "string" as const,
	},
	{
		position: 62,
		xmlName: "dateoflastsale",
		pascalName: "DateOfLastSale",
		dataType: "date" as const,
	},
	{
		position: 63,
		xmlName: "splitacct1",
		pascalName: "SplitAcct1",
		dataType: "string" as const,
	},
	{
		position: 64,
		xmlName: "splitacct2",
		pascalName: "SplitAcct2",
		dataType: "string" as const,
	},
	{
		position: 65,
		xmlName: "splitpercent",
		pascalName: "SplitPercent",
		dataType: "number" as const,
	},
	{
		position: 66,
		xmlName: "usernum",
		pascalName: "UserNum",
		dataType: "number" as const,
	},
	{
		position: 67,
		xmlName: "usertext",
		pascalName: "UserText",
		dataType: "string" as const,
	},
	{
		position: 68,
		xmlName: "custpromptpaymentterms",
		pascalName: "CustPromptPaymentTerms",
		dataType: "number" as const,
	},
	{
		position: 69,
		xmlName: "custpromptpaymentdiscount",
		pascalName: "CustPromptPaymentDiscount",
		dataType: "number" as const,
	},
	{
		position: 70,
		xmlName: "supppromptpaymentterms",
		pascalName: "SuppPromptPaymentTerms",
		dataType: "number" as const,
	},
	{
		position: 71,
		xmlName: "supppromptpaymentdiscount",
		pascalName: "SuppPromptPaymentDiscount",
		dataType: "number" as const,
	},
	{
		position: 72,
		xmlName: "lastpaymentmethod",
		pascalName: "LastPaymentMethod",
		dataType: "number" as const,
	},
	{
		position: 73,
		xmlName: "creditcardnum",
		pascalName: "CreditCardNum",
		dataType: "string" as const,
	},
	{
		position: 74,
		xmlName: "creditcardexpiry",
		pascalName: "CreditCardExpiry",
		dataType: "string" as const,
	},
	{
		position: 75,
		xmlName: "creditcardname",
		pascalName: "CreditCardName",
		dataType: "string" as const,
	},
	{
		position: 76,
		xmlName: "taxnumber",
		pascalName: "TaxNumber",
		dataType: "string" as const,
	},
	{
		position: 77,
		xmlName: "custom1",
		pascalName: "Custom1",
		dataType: "string" as const,
	},
	{
		position: 78,
		xmlName: "custom2",
		pascalName: "Custom2",
		dataType: "string" as const,
	},
	{
		position: 79,
		xmlName: "custom3",
		pascalName: "Custom3",
		dataType: "string" as const,
	},
	{
		position: 80,
		xmlName: "custom4",
		pascalName: "Custom4",
		dataType: "string" as const,
	},
	{
		position: 81,
		xmlName: "deliverypostcode",
		pascalName: "DeliveryPostcode",
		dataType: "string" as const,
	},
	{
		position: 82,
		xmlName: "deliverystate",
		pascalName: "DeliveryState",
		dataType: "string" as const,
	},
	{
		position: 83,
		xmlName: "addresscountry",
		pascalName: "AddressCountry",
		dataType: "string" as const,
	},
	{
		position: 84,
		xmlName: "deliverycountry",
		pascalName: "DeliveryCountry",
		dataType: "string" as const,
	},
	{
		position: 85,
		xmlName: "receiptmethod",
		pascalName: "ReceiptMethod",
		dataType: "number" as const,
	},
	{
		position: 86,
		xmlName: "abuid",
		pascalName: "ABUID",
		dataType: "string" as const,
	},
	{
		position: 87,
		xmlName: "flags",
		pascalName: "Flags",
		dataType: "number" as const,
	},
	{
		position: 88,
		xmlName: "salutation",
		pascalName: "Salutation",
		dataType: "string" as const,
	},
	{
		position: 89,
		xmlName: "salutation2",
		pascalName: "Salutation2",
		dataType: "string" as const,
	},
	{
		position: 90,
		xmlName: "memo",
		pascalName: "Memo",
		dataType: "string" as const,
	},
	{
		position: 91,
		xmlName: "memo2",
		pascalName: "Memo2",
		dataType: "string" as const,
	},
	{
		position: 92,
		xmlName: "role",
		pascalName: "Role",
		dataType: "number" as const,
	},
	{
		position: 93,
		xmlName: "role2",
		pascalName: "Role2",
		dataType: "number" as const,
	},
	{
		position: 94,
		xmlName: "custom5",
		pascalName: "Custom5",
		dataType: "string" as const,
	},
	{
		position: 95,
		xmlName: "custom6",
		pascalName: "Custom6",
		dataType: "string" as const,
	},
	{
		position: 96,
		xmlName: "custom7",
		pascalName: "Custom7",
		dataType: "string" as const,
	},
	// Note: TSV has 97 columns, but we can always add more if needed
];

/**
 * Get TSV field mapping for a table
 */
export function getTSVFieldMapping(tableName: string) {
	switch (tableName.toUpperCase()) {
		case "TAXRATE":
			return TAXRATE_TSV_FIELD_MAPPING;
		case "NAME":
			return NAME_TSV_FIELD_MAPPING;
		default:
			// For other tables, we'll need to discover dynamically
			return null;
	}
}
