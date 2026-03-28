import { error } from '@sveltejs/kit';
import { apiGet, ApiError } from '$lib/api/client';
import type {
	ApiResponse,
	NameRecord,
	ContactRecord,
	TransactionRecord,
	TaxRateRecord,
	AccountRecord,
	NameScreenData
} from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }): Promise<NameScreenData> => {
	const { code } = params;
	const token = locals.token;

	// Phase 1: Fetch name + transactions + lookups in parallel
	let nameRes, transactionsRes, taxRatesRes, accountsRes;
	try {
	[nameRes, transactionsRes, taxRatesRes, accountsRes] = await Promise.all([
		apiGet<ApiResponse<NameRecord[]>>('/tables/name', {
			token,
			filter: `Code="${code}"`
		}),
		apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token,
			filter: `Namecode="${code}"`,
			limit: 50
		}),
		apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token }),
		apiGet<ApiResponse<AccountRecord[]>>('/tables/account', {
			token,
			filter: 'Type="CA" OR Type="CL"'
		})
	]);
	} catch (err) {
		console.error('BFF loader error:', err);
		if (err instanceof ApiError) {
			throw error(err.status === 401 ? 401 : 502, `API error: ${err.message}`);
		}
		throw error(500, `Failed to load name: ${err}`);
	}

	const n = nameRes.data[0];
	if (!n) {
		throw error(404, `Name "${code}" not found`);
	}

	// Phase 2: Fetch contacts using the Name's SequenceNumber
	let contactsRes;
	try {
		contactsRes = await apiGet<ApiResponse<ContactRecord[]>>('/tables/contact', {
			token,
			filter: `ParentSeq=${n.SequenceNumber}`
		});
	} catch {
		// Contacts may not exist - gracefully degrade
		contactsRes = { data: [], metadata: { table: 'contact', format: 'full', count: 0, timestamp: '', requestId: '' } };
	}

	// Reshape into BFF screen response
	return {
		name: {
			header: {
				code: n.Code,
				name: n.Name,
				colour: n.Colour,
				flags: {
					customer: n.CustomerType >= 1,
					supplier: n.SupplierType >= 1,
					debtor: n.CustomerType === 2,
					creditor: n.SupplierType === 2
				}
			},
			details: {
				mailing: [n.Address1, n.Address2, n.Address3, n.Address4].filter(Boolean),
				delivery: [n.DeliveryAddress1, n.DeliveryAddress2, n.DeliveryAddress3, n.DeliveryAddress4].filter(Boolean),
				postCode: n.PostCode,
				state: n.State,
				deliveryPostCode: n.DeliveryPostCode,
				deliveryState: n.DeliveryState,
				phone: n.Phone,
				fax: n.Fax,
				mobile: n.Mobile,
				email: n.email,
				webUrl: n.WebURL,
				gstNo: n.TaxNumber,
				theirRef: n.TheirRef,
				comment: n.Comment,
				category1: n.Category1,
				category2: n.Category2,
				category3: n.Category3,
				category4: n.Category4
			},
			pricingTerms: {
				discount: n.Discount,
				priceCode: n.ProductPricing,
				taxCode: n.TaxCode,
				currency: n.Currency,
				creditHold: n.Hold,
				salesPerson: n.SalesPerson,
				creditLimit: n.CreditLimit,
				debtorTerms: n.DebtorTerms,
				creditorTerms: n.CreditorTerms,
				recAccount: n.RecAccount,
				payAccount: n.PayAccount
			},
			bankEdi: {
				payBy: n.PaymentMethod,
				bank: n.Bank,
				branch: n.BankBranch,
				accountName: n['Account Name'],
				accountNumber: n.BankAccountNumber,
				eInvoicingId: n.EInvoiceID,
				cardNumber: n.CreditCardNum,
				cardName: n.CreditCardName,
				cardExpiry: n.CreditCardExpiry
			},
			balances: {
				debtor: {
					threeOrMore: n.D90Plus,
					twoCycles: n.D60Plus,
					oneCycle: n.D30Plus,
					current: n.DCurrent,
					theyOwe: n.D90Plus + n.D60Plus + n.D30Plus + n.DCurrent
				},
				creditor: {
					weOwe: n.CCurrent
				},
				dateOfLastSale: n.Datelastsale
			},
			contacts: contactsRes.data.map((c) => ({
				name: c.Contact ?? '',
				role: c.Role ?? 0,
				salutation: c.Salutation ?? '',
				position: c.Position ?? '',
				phone: c.DDI ?? '',
				mobile: c.Mobile ?? '',
				email: c.eMail ?? '',
				memo: c.Memo ?? ''
			}))
		},
		transactionHistory: transactionsRes.data.map((t) => ({
			status: t.Status,
			type: t.Type,
			ourRef: t.Ourref,
			description: t.Description,
			period: t.Period,
			date: t.Transdate,
			gross: t.Gross
		})),
		lookups: {
			taxCodes: taxRatesRes.data.map((t) => ({
				code: t.TaxCode,
				name: t.Ratename,
				rate: t.Rate2 || t.Rate1
			})),
			accounts: accountsRes.data.map((a) => ({
				code: a.Code,
				description: a.Description,
				type: a.Type
			}))
		}
	};
};
