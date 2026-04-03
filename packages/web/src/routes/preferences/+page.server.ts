import { apiGet, apiEvalBatch } from '$lib/api/client';
import type { ApiResponse, TaxRateRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

interface CompanyNested {
	name: string;
	address: { line1: string; line2: string; line3: string; line4: string };
	contact: { phone: string; fax: string; email: string; website: string };
	accounting: {
		periodsInYear: number;
		currentPeriod: number;
		baseCurrency: string;
		multiCurrencyEnabled: boolean;
		extendedJobCosting: boolean;
	};
	tax: { gstCycleMonths: number; gstRegistrationNumber: string };
	system: { version: string; platform: string };
}

export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;

	// Parallel: company info, tax rates, and extended company fields via MWScript eval
	const extraFields: Record<string, string> = {
		// Address extras
		state: 'State',
		postCode: 'PostCode',
		delivery1: 'Delivery1',
		delivery2: 'Delivery2',
		delivery3: 'Delivery3',
		delivery4: 'Delivery4',
		deliveryState: 'DeliveryState',
		deliveryPostCode: 'DeliveryPostCode',
		mobile: 'Mobile',
		// Tax & Legal
		taxName: 'TaxName',
		regNum: 'RegNum',
		coRegName: 'CoRegName',
		remittanceMessage: 'RemittanceMessage',
		gstCycleEndDate: 'GstCycleEndDate',
		gstCycleNum: 'GstCycleNum',
		gstIncomeInvoiceBasis: 'GstIncomeInvoiceBasis',
		gstExpensesInvoiceBasis: 'GSTExpensesInvoiceBasis',
		gstProcessingSuppressed: 'GSTProcessingSuppressed',
		gstGuideName: 'GSTGuideName',
		gstRegName: 'GSTRegName',
		// Locale
		locale: 'Locale',
		localeFriendlyName: 'LocaleFriendlyName',
		// System extras
		haveLogo: 'Have_Logo',
		lastBackup: 'LastBackup',
		lastAgedDebtors: 'LastAgedDebtors',
		lastStocktake: 'LastStocktake',
		logFilePath: 'LogFilePath',
		agingCycle: 'AgingCycle',
		periodNames: 'PeriodNames',
		navigatorActive: 'NavigatorActive',
		networkLatency: 'NetworkLatency',
	};

	let companyRes: any = null;
	let taxRes: ApiResponse<TaxRateRecord[]> = { data: [], metadata: {} as any };
	let extra: Record<string, string> = {};

	try {
		[companyRes, taxRes, extra] = await Promise.all([
			apiGet<{ data: CompanyNested }>('/company', { token }),
			apiGet<ApiResponse<TaxRateRecord[]>>('/tables/taxrate', { token, limit: 50 }),
			apiEvalBatch(extraFields, token)
		]);
	} catch {
		return { company: null, taxRates: [], extra: {} };
	}

	const company = companyRes?.data ?? null;
	const taxRates = (taxRes.data ?? []).map((t) => ({
		code: t.TaxCode ?? t.Code ?? '',
		description: t.Description ?? '',
		rate: t.Rate ?? 0,
		accountCode: (t as any).AccountCode ?? '',
		sellTaxCode: (t as any).SellTaxCode ?? '',
		buyTaxCode: (t as any).BuyTaxCode ?? ''
	}));

	return { company, taxRates, extra };
};
