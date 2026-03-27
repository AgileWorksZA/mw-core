import { error } from '@sveltejs/kit';
import { apiGet, ApiError } from '$lib/api/client';
import type { ApiResponse, AccountRecord, TaxRateRecord } from '$lib/api/types';
import { ACCOUNT_TYPE_LABELS } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { code } = params;
	const token = locals.token;

	let accountRes, taxRatesRes;
	try {
		[accountRes, taxRatesRes] = await Promise.all([
			apiGet<ApiResponse<AccountRecord[]>>('/tables/account', {
				token,
				filter: `Code="${code}"`
			}),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token })
		]);
	} catch (err) {
		if (err instanceof ApiError) {
			throw error(err.status === 401 ? 401 : 502, `API error: ${err.message}`);
		}
		throw error(500, `Failed to load account: ${err}`);
	}

	const a = accountRes.data[0];
	if (!a) {
		throw error(404, `Account "${code}" not found`);
	}

	return {
		account: {
			code: a.Code,
			description: a.Description ?? '',
			type: a.Type ?? '',
			typeLabel: ACCOUNT_TYPE_LABELS[a.Type ?? ''] ?? a.Type ?? '',
			group: a.Group ?? '',
			category: a.Category ?? '',
			category2: a.Category2 ?? '',
			category3: a.Category3 ?? '',
			category4: a.Category4 ?? '',
			pandl: a.Pandl ?? '',
			taxCode: a.TaxCode ?? '',
			flags: a.Flags ?? 0,
			system: a.System ?? '',
			colour: a.Colour ?? 0,
			currency: a.Currency ?? '',
			bankAccountNumber: a.BankAccountNumber ?? '',
			accountantCode: a.Accountantcode ?? '',
			comments: a.Comments ?? '',
			securityLevel: a.SecurityLevel ?? 0
		},
		lookups: {
			taxCodes: taxRatesRes.data.map((t) => ({
				code: t.TaxCode,
				name: t.Ratename,
				rate: t.Rate2 || t.Rate1
			}))
		}
	};
};
