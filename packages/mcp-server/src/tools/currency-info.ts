import { z } from "zod";
import type { TicketService } from "../services/ticket-service";

let ticketService: TicketService | undefined;

// Initialize ticket service
export function initializeCurrencyInfoTools(ticketSvc: TicketService) {
	ticketService = ticketSvc;
}

// Helper function for error tracking
async function trackError(error: unknown, toolName: string, args: unknown) {
	if (!ticketService) return;

	try {
		await ticketService.createTicket({
			type: "bug",
			severity: "medium",
			status: "open",
			user_prompt: `Tool ${toolName} failed with args: ${JSON.stringify(args)}`,
			ai_attempted_action: `Execute ${toolName}`,
			mcp_tool_used: toolName,
			error_message: error instanceof Error ? error.message : String(error),
			error_stack: error instanceof Error ? error.stack : undefined,
			session_id: process.env.SESSION_ID,
		});
	} catch (trackingError) {
		console.error("Failed to track error:", trackingError);
	}
}

// Currency information interfaces
interface CurrencyInfo {
	code: string;
	name: string;
	symbol: string;
	symbolPosition: "before" | "after";
	decimalPlaces: number;
	decimalSeparator: string;
	thousandsSeparator: string;
	country: string;
	region: string;
	isActive: boolean;
	exchangeRate?: number;
	lastUpdated?: string;
}

interface CurrencyFormatting {
	currency: CurrencyInfo;
	formatting: {
		positive: string;
		negative: string;
		zero: string;
		examples: {
			small: string;
			medium: string;
			large: string;
		};
	};
	rules: {
		roundingMethod: "round" | "floor" | "ceil";
		minAmount?: number;
		maxAmount?: number;
		allowNegative: boolean;
	};
}

interface ExchangeRateInfo {
	baseCurrency: string;
	targetCurrency: string;
	rate: number;
	lastUpdated: string;
	source: string;
	type: "spot" | "historical" | "forecast";
}

// Get currency information
const getCurrencyInfoInputSchema = z.object({
	currencyCode: z
		.string()
		.optional()
		.describe("ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP')"),
	includeFormatting: z
		.boolean()
		.default(true)
		.describe("Include formatting rules and examples"),
	includeExchangeRates: z
		.boolean()
		.default(false)
		.describe("Include current exchange rates"),
});

export const getCurrencyInfoTool = {
	description:
		"Get comprehensive currency information including formatting rules and exchange rates",
	inputSchema: getCurrencyInfoInputSchema,

	async execute(args: z.infer<typeof getCurrencyInfoInputSchema>) {
		try {
			if (args.currencyCode) {
				// Get specific currency information
				const currencyInfo = getCurrencyDetails(args.currencyCode);
				const formatting = args.includeFormatting
					? getCurrencyFormatting(currencyInfo)
					: undefined;
				const exchangeRates = args.includeExchangeRates
					? getExchangeRates(args.currencyCode)
					: undefined;

				return {
					currency: currencyInfo,
					formatting: formatting,
					exchangeRates: exchangeRates,
					examples: formatting
						? generateFormattingExamples(formatting)
						: undefined,
					recommendations: generateCurrencyRecommendations(currencyInfo),
				};
			} else {
				// Get all supported currencies
				const currencies = getAllSupportedCurrencies();
				const baseCurrency = getBaseCurrency();

				return {
					baseCurrency: baseCurrency,
					supportedCurrencies: currencies,
					totalCurrencies: currencies.length,
					byRegion: groupCurrenciesByRegion(currencies),
					mostCommon: getMostCommonCurrencies(),
					summary: {
						activeCurrencies: currencies.filter((c) => c.isActive).length,
						regions: [...new Set(currencies.map((c) => c.region))].length,
						lastUpdated: new Date().toISOString(),
					},
				};
			}
		} catch (error) {
			await trackError(error, "getCurrencyInfo", args);
			throw error;
		}
	},
};

// Get currency formatting rules
const getCurrencyFormattingInputSchema = z.object({
	currencyCode: z.string().describe("ISO 4217 currency code"),
	locale: z
		.string()
		.default("en-US")
		.describe("Locale for formatting (e.g., 'en-US', 'en-GB', 'de-DE')"),
	amount: z
		.number()
		.optional()
		.describe("Specific amount to format as example"),
});

export const getCurrencyFormattingTool = {
	description:
		"Get detailed currency formatting rules and examples for a specific currency and locale",
	inputSchema: getCurrencyFormattingInputSchema,

	async execute(args: z.infer<typeof getCurrencyFormattingInputSchema>) {
		try {
			const currencyInfo = getCurrencyDetails(args.currencyCode);
			const formatting = getCurrencyFormattingForLocale(
				currencyInfo,
				args.locale,
			);

			// Generate examples with specific amount if provided
			const examples = args.amount
				? formatAmount(args.amount, formatting)
				: generateFormattingExamples(formatting);

			return {
				currency: args.currencyCode,
				locale: args.locale,
				formatting: formatting,
				examples: examples,
				validation: getCurrencyValidationRules(currencyInfo),
				localeInfo: getLocaleSpecificRules(args.locale),
				recommendations: generateFormattingRecommendations(formatting),
			};
		} catch (error) {
			await trackError(error, "getCurrencyFormatting", args);
			throw error;
		}
	},
};

// Get exchange rates
const getExchangeRatesInputSchema = z.object({
	baseCurrency: z.string().describe("Base currency code (e.g., 'USD')"),
	targetCurrencies: z
		.array(z.string())
		.optional()
		.describe(
			"Target currency codes. If not provided, returns rates for all major currencies",
		),
	includeHistorical: z
		.boolean()
		.default(false)
		.describe("Include historical rate information"),
});

export const getExchangeRatesTool = {
	description: "Get current and historical exchange rates between currencies",
	inputSchema: getExchangeRatesInputSchema,

	async execute(args: z.infer<typeof getExchangeRatesInputSchema>) {
		try {
			const targetCurrencies = args.targetCurrencies || getMajorCurrencies();
			const rates = getExchangeRatesForCurrencies(
				args.baseCurrency,
				targetCurrencies,
			);

			const historical = args.includeHistorical
				? getHistoricalRates(args.baseCurrency, targetCurrencies)
				: undefined;

			return {
				baseCurrency: args.baseCurrency,
				rates: rates,
				historical: historical,
				summary: {
					totalRates: rates.length,
					lastUpdated:
						rates.length > 0 ? rates[0].lastUpdated : new Date().toISOString(),
					source: "MoneyWorks Exchange Rate Service",
					coverage: rates.length / targetCurrencies.length,
				},
				calculations: generateExchangeCalculations(rates),
				trends: args.includeHistorical
					? analyzeRateTrends(historical || [])
					: undefined,
			};
		} catch (error) {
			await trackError(error, "getExchangeRates", args);
			throw error;
		}
	},
};

// Convert currency amounts
const convertCurrencyInputSchema = z.object({
	amount: z.number().describe("Amount to convert"),
	fromCurrency: z.string().describe("Source currency code"),
	toCurrency: z.string().describe("Target currency code"),
	includeFormatting: z
		.boolean()
		.default(true)
		.describe("Include formatted output"),
	rateDate: z
		.string()
		.optional()
		.describe("Specific date for exchange rate (YYYY-MM-DD)"),
});

export const convertCurrencyTool = {
	description:
		"Convert an amount from one currency to another using current or historical exchange rates",
	inputSchema: convertCurrencyInputSchema,

	async execute(args: z.infer<typeof convertCurrencyInputSchema>) {
		try {
			const exchangeRate = getExchangeRate(
				args.fromCurrency,
				args.toCurrency,
				args.rateDate,
			);

			const convertedAmount = args.amount * exchangeRate.rate;

			const result = {
				originalAmount: args.amount,
				convertedAmount: convertedAmount,
				fromCurrency: args.fromCurrency,
				toCurrency: args.toCurrency,
				exchangeRate: exchangeRate,
				calculation: `${args.amount} ${args.fromCurrency} × ${exchangeRate.rate} = ${convertedAmount} ${args.toCurrency}`,
			};

			if (args.includeFormatting) {
				const fromCurrency = getCurrencyDetails(args.fromCurrency);
				const toCurrency = getCurrencyDetails(args.toCurrency);
				const fromFormatting = getCurrencyFormatting(fromCurrency);
				const toFormatting = getCurrencyFormatting(toCurrency);

				Object.assign(result, {
					formatted: {
						original: formatAmount(args.amount, fromFormatting),
						converted: formatAmount(convertedAmount, toFormatting),
					},
				});
			}

			return result;
		} catch (error) {
			await trackError(error, "convertCurrency", args);
			throw error;
		}
	},
};

// Get MoneyWorks currency settings
const getMoneyWorksCurrencySettingsInputSchema = z.object({
	includeMultiCurrency: z
		.boolean()
		.default(true)
		.describe("Include multi-currency configuration"),
});

export const getMoneyWorksCurrencySettingsTool = {
	description:
		"Get MoneyWorks-specific currency settings and multi-currency configuration",
	inputSchema: getMoneyWorksCurrencySettingsInputSchema,

	async execute(
		args: z.infer<typeof getMoneyWorksCurrencySettingsInputSchema>,
	) {
		try {
			const settings = getMoneyWorksCurrencyConfiguration();
			const multiCurrency = args.includeMultiCurrency
				? getMultiCurrencySettings()
				: undefined;

			return {
				settings: settings,
				multiCurrency: multiCurrency,
				limitations: getMoneyWorksCurrencyLimitations(),
				bestPractices: getMoneyWorksCurrencyBestPractices(),
				migration: getCurrencyMigrationGuidance(),
			};
		} catch (error) {
			await trackError(error, "getMoneyWorksCurrencySettings", args);
			throw error;
		}
	},
};

// Helper functions for currency operations

// Get currency details
function getCurrencyDetails(currencyCode: string): CurrencyInfo {
	const currencies: Record<string, CurrencyInfo> = {
		USD: {
			code: "USD",
			name: "US Dollar",
			symbol: "$",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "United States",
			region: "North America",
			isActive: true,
		},
		EUR: {
			code: "EUR",
			name: "Euro",
			symbol: "€",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "European Union",
			region: "Europe",
			isActive: true,
		},
		GBP: {
			code: "GBP",
			name: "British Pound Sterling",
			symbol: "£",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "United Kingdom",
			region: "Europe",
			isActive: true,
		},
		JPY: {
			code: "JPY",
			name: "Japanese Yen",
			symbol: "¥",
			symbolPosition: "before",
			decimalPlaces: 0,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "Japan",
			region: "Asia",
			isActive: true,
		},
		CAD: {
			code: "CAD",
			name: "Canadian Dollar",
			symbol: "C$",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "Canada",
			region: "North America",
			isActive: true,
		},
		AUD: {
			code: "AUD",
			name: "Australian Dollar",
			symbol: "A$",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "Australia",
			region: "Oceania",
			isActive: true,
		},
		CHF: {
			code: "CHF",
			name: "Swiss Franc",
			symbol: "CHF",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "Switzerland",
			region: "Europe",
			isActive: true,
		},
		CNY: {
			code: "CNY",
			name: "Chinese Yuan",
			symbol: "¥",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "China",
			region: "Asia",
			isActive: true,
		},
		NZD: {
			code: "NZD",
			name: "New Zealand Dollar",
			symbol: "NZ$",
			symbolPosition: "before",
			decimalPlaces: 2,
			decimalSeparator: ".",
			thousandsSeparator: ",",
			country: "New Zealand",
			region: "Oceania",
			isActive: true,
		},
	};

	const currency = currencies[currencyCode.toUpperCase()];
	if (!currency) {
		throw new Error(`Currency '${currencyCode}' not found`);
	}

	return currency;
}

// Get currency formatting
function getCurrencyFormatting(currency: CurrencyInfo): CurrencyFormatting {
	return {
		currency: currency,
		formatting: {
			positive:
				currency.symbolPosition === "before"
					? `${currency.symbol}#,##0.00`
					: `#,##0.00${currency.symbol}`,
			negative:
				currency.symbolPosition === "before"
					? `(${currency.symbol}#,##0.00)`
					: `(#,##0.00${currency.symbol})`,
			zero:
				currency.symbolPosition === "before"
					? `${currency.symbol}0.00`
					: `0.00${currency.symbol}`,
			examples: {
				small: formatCurrencyAmount(12.34, currency),
				medium: formatCurrencyAmount(1234.56, currency),
				large: formatCurrencyAmount(1234567.89, currency),
			},
		},
		rules: {
			roundingMethod: "round",
			allowNegative: true,
		},
	};
}

// Format currency amount
function formatCurrencyAmount(amount: number, currency: CurrencyInfo): string {
	const rounded =
		Math.round(amount * Math.pow(10, currency.decimalPlaces)) /
		Math.pow(10, currency.decimalPlaces);
	const parts = Math.abs(rounded).toFixed(currency.decimalPlaces).split(".");
	const integerPart = parts[0].replace(
		/\B(?=(\d{3})+(?!\d))/g,
		currency.thousandsSeparator,
	);
	const decimalPart =
		currency.decimalPlaces > 0 ? currency.decimalSeparator + parts[1] : "";

	const formattedAmount = integerPart + decimalPart;
	const isNegative = rounded < 0;

	if (currency.symbolPosition === "before") {
		return isNegative
			? `(${currency.symbol}${formattedAmount})`
			: `${currency.symbol}${formattedAmount}`;
	} else {
		return isNegative
			? `(${formattedAmount}${currency.symbol})`
			: `${formattedAmount}${currency.symbol}`;
	}
}

// Get all supported currencies
function getAllSupportedCurrencies(): CurrencyInfo[] {
	const currencyCodes = [
		"USD",
		"EUR",
		"GBP",
		"JPY",
		"CAD",
		"AUD",
		"CHF",
		"CNY",
		"NZD",
	];
	return currencyCodes.map((code) => getCurrencyDetails(code));
}

// Get base currency (typically from MoneyWorks settings)
function getBaseCurrency(): CurrencyInfo {
	// This would typically come from MoneyWorks company settings
	return getCurrencyDetails(process.env.MW_BASE_CURRENCY || "USD");
}

// Group currencies by region
function groupCurrenciesByRegion(
	currencies: CurrencyInfo[],
): Record<string, CurrencyInfo[]> {
	const grouped: Record<string, CurrencyInfo[]> = {};

	for (const currency of currencies) {
		if (!grouped[currency.region]) {
			grouped[currency.region] = [];
		}
		grouped[currency.region].push(currency);
	}

	return grouped;
}

// Get most common currencies
function getMostCommonCurrencies(): string[] {
	return ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
}

// Get major currencies for exchange rates
function getMajorCurrencies(): string[] {
	return ["EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];
}

// Get currency formatting for specific locale
function getCurrencyFormattingForLocale(
	currency: CurrencyInfo,
	locale: string,
): CurrencyFormatting {
	const baseFormatting = getCurrencyFormatting(currency);

	// Adjust formatting based on locale
	const localeAdjustments: Record<string, Partial<CurrencyInfo>> = {
		"de-DE": {
			decimalSeparator: ",",
			thousandsSeparator: ".",
		},
		"fr-FR": {
			decimalSeparator: ",",
			thousandsSeparator: " ",
		},
	};

	const adjustment = localeAdjustments[locale];
	if (adjustment) {
		const adjustedCurrency = { ...currency, ...adjustment };
		return getCurrencyFormatting(adjustedCurrency);
	}

	return baseFormatting;
}

// Format specific amount
function formatAmount(
	amount: number,
	formatting: CurrencyFormatting,
): {
	formatted: string;
	parts: {
		symbol: string;
		integer: string;
		decimal: string;
		sign: string;
	};
} {
	const formatted = formatCurrencyAmount(amount, formatting.currency);

	return {
		formatted: formatted,
		parts: {
			symbol: formatting.currency.symbol,
			integer: Math.floor(Math.abs(amount)).toString(),
			decimal: (Math.abs(amount) % 1)
				.toFixed(formatting.currency.decimalPlaces)
				.slice(2),
			sign: amount < 0 ? "-" : "",
		},
	};
}

// Generate formatting examples
function generateFormattingExamples(formatting: CurrencyFormatting): {
	positive: string[];
	negative: string[];
	zero: string;
	edge_cases: string[];
} {
	const currency = formatting.currency;

	return {
		positive: [
			formatCurrencyAmount(1, currency),
			formatCurrencyAmount(12.34, currency),
			formatCurrencyAmount(1234.56, currency),
			formatCurrencyAmount(1234567.89, currency),
		],
		negative: [
			formatCurrencyAmount(-1, currency),
			formatCurrencyAmount(-12.34, currency),
			formatCurrencyAmount(-1234.56, currency),
		],
		zero: formatCurrencyAmount(0, currency),
		edge_cases: [
			formatCurrencyAmount(0.01, currency),
			formatCurrencyAmount(999999999.99, currency),
			formatCurrencyAmount(-0.01, currency),
		],
	};
}

// Get currency validation rules
function getCurrencyValidationRules(currency: CurrencyInfo): {
	amount: Array<{ rule: string; message: string }>;
	format: Array<{ rule: string; message: string }>;
} {
	return {
		amount: [
			{
				rule: `Decimal places <= ${currency.decimalPlaces}`,
				message: `${currency.code} amounts cannot have more than ${currency.decimalPlaces} decimal places`,
			},
			{
				rule: "Amount >= -999999999.99",
				message: "Amount is below minimum allowed value",
			},
			{
				rule: "Amount <= 999999999.99",
				message: "Amount exceeds maximum allowed value",
			},
		],
		format: [
			{
				rule: `Use ${currency.decimalSeparator} for decimal separator`,
				message: `Decimal separator must be '${currency.decimalSeparator}'`,
			},
			{
				rule: `Use ${currency.thousandsSeparator} for thousands separator`,
				message: `Thousands separator must be '${currency.thousandsSeparator}'`,
			},
		],
	};
}

// Get locale-specific rules
function getLocaleSpecificRules(locale: string): {
	name: string;
	decimalSeparator: string;
	thousandsSeparator: string;
	symbolPosition: "before" | "after";
	negativeFormat: string;
} {
	const rules: Record<string, any> = {
		"en-US": {
			name: "English (United States)",
			decimalSeparator: ".",
			thousandsSeparator: ",",
			symbolPosition: "before",
			negativeFormat: "parentheses",
		},
		"en-GB": {
			name: "English (United Kingdom)",
			decimalSeparator: ".",
			thousandsSeparator: ",",
			symbolPosition: "before",
			negativeFormat: "minus",
		},
		"de-DE": {
			name: "German (Germany)",
			decimalSeparator: ",",
			thousandsSeparator: ".",
			symbolPosition: "after",
			negativeFormat: "minus",
		},
		"fr-FR": {
			name: "French (France)",
			decimalSeparator: ",",
			thousandsSeparator: " ",
			symbolPosition: "after",
			negativeFormat: "minus",
		},
	};

	return rules[locale] || rules["en-US"];
}

// Generate formatting recommendations
function generateFormattingRecommendations(
	formatting: CurrencyFormatting,
): string[] {
	const recommendations: string[] = [];

	recommendations.push(
		"Use consistent currency formatting throughout the application",
	);
	recommendations.push("Validate currency amounts before formatting");
	recommendations.push("Consider locale-specific formatting preferences");

	if (formatting.currency.decimalPlaces === 0) {
		recommendations.push("This currency typically doesn't use decimal places");
	}

	if (formatting.currency.symbolPosition === "after") {
		recommendations.push("Symbol appears after the amount for this currency");
	}

	return recommendations;
}

// Generate currency recommendations
function generateCurrencyRecommendations(currency: CurrencyInfo): string[] {
	const recommendations: string[] = [];

	if (!currency.isActive) {
		recommendations.push(
			"This currency is marked as inactive - verify current status",
		);
	}

	if (currency.decimalPlaces === 0) {
		recommendations.push("This currency doesn't typically use decimal places");
	}

	if (currency.code === "JPY" || currency.code === "KRW") {
		recommendations.push(
			"This currency has different decimal handling - amounts are typically whole numbers",
		);
	}

	recommendations.push(
		"Always validate exchange rates before currency conversion",
	);
	recommendations.push("Consider rounding rules for this currency");

	return recommendations;
}

// Mock exchange rate functions (would integrate with actual service)
function getExchangeRates(baseCurrency: string): ExchangeRateInfo[] {
	// Mock exchange rates
	const rates: Record<string, number> = {
		EUR: 0.85,
		GBP: 0.73,
		JPY: 110.0,
		CAD: 1.25,
		AUD: 1.35,
		CHF: 0.92,
		CNY: 6.45,
	};

	return Object.entries(rates).map(([currency, rate]) => ({
		baseCurrency: baseCurrency,
		targetCurrency: currency,
		rate: rate,
		lastUpdated: new Date().toISOString(),
		source: "Mock Service",
		type: "spot" as const,
	}));
}

function getExchangeRatesForCurrencies(
	base: string,
	targets: string[],
): ExchangeRateInfo[] {
	return targets.map((target) => ({
		baseCurrency: base,
		targetCurrency: target,
		rate: Math.random() * 2 + 0.5, // Mock rate
		lastUpdated: new Date().toISOString(),
		source: "Mock Service",
		type: "spot" as const,
	}));
}

function getExchangeRate(
	from: string,
	to: string,
	date?: string,
): ExchangeRateInfo {
	return {
		baseCurrency: from,
		targetCurrency: to,
		rate: Math.random() * 2 + 0.5, // Mock rate
		lastUpdated: date || new Date().toISOString(),
		source: "Mock Service",
		type: date ? "historical" : "spot",
	};
}

function getHistoricalRates(
	base: string,
	targets: string[],
): ExchangeRateInfo[] {
	// Mock historical data
	return targets.flatMap((target) =>
		Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return {
				baseCurrency: base,
				targetCurrency: target,
				rate: Math.random() * 2 + 0.5,
				lastUpdated: date.toISOString(),
				source: "Mock Service",
				type: "historical" as const,
			};
		}),
	);
}

function generateExchangeCalculations(rates: ExchangeRateInfo[]): Array<{
	description: string;
	calculation: string;
	example: string;
}> {
	return [
		{
			description: "Convert from base to target currency",
			calculation: "Amount × Exchange Rate",
			example: `100 ${rates[0]?.baseCurrency || "USD"} × ${rates[0]?.rate || 1} = ${(100 * (rates[0]?.rate || 1)).toFixed(2)} ${rates[0]?.targetCurrency || "EUR"}`,
		},
		{
			description: "Convert from target to base currency",
			calculation: "Amount ÷ Exchange Rate",
			example: `100 ${rates[0]?.targetCurrency || "EUR"} ÷ ${rates[0]?.rate || 1} = ${(100 / (rates[0]?.rate || 1)).toFixed(2)} ${rates[0]?.baseCurrency || "USD"}`,
		},
	];
}

function analyzeRateTrends(historical: ExchangeRateInfo[]): Array<{
	currency: string;
	trend: "increasing" | "decreasing" | "stable";
	change: number;
	period: string;
}> {
	const grouped = groupBy(historical, "targetCurrency");

	return Object.entries(grouped).map(([currency, rates]) => {
		const sortedRates = rates.sort(
			(a, b) =>
				new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
		);
		const first = sortedRates[0]?.rate || 0;
		const last = sortedRates[sortedRates.length - 1]?.rate || 0;
		const change = ((last - first) / first) * 100;

		return {
			currency,
			trend:
				Math.abs(change) < 1
					? "stable"
					: change > 0
						? "increasing"
						: "decreasing",
			change: Math.round(change * 100) / 100,
			period: "7 days",
		};
	});
}

// MoneyWorks-specific currency functions
function getMoneyWorksCurrencyConfiguration(): {
	baseCurrency: string;
	multiCurrencyEnabled: boolean;
	defaultExchangeRateSource: string;
	rounding: string;
	decimalPlaces: number;
} {
	return {
		baseCurrency: process.env.MW_BASE_CURRENCY || "USD",
		multiCurrencyEnabled: process.env.MW_MULTI_CURRENCY === "true",
		defaultExchangeRateSource: "Manual Entry",
		rounding: "Standard",
		decimalPlaces: 2,
	};
}

function getMultiCurrencySettings(): {
	enabled: boolean;
	supportedCurrencies: string[];
	exchangeRatePolicy: string;
	conversionMethod: string;
	limitations: string[];
} {
	return {
		enabled: process.env.MW_MULTI_CURRENCY === "true",
		supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
		exchangeRatePolicy: "Daily Update",
		conversionMethod: "Transaction Date Rate",
		limitations: [
			"Maximum 10 active currencies",
			"Base currency cannot be changed after transactions exist",
			"Exchange rates must be updated manually",
		],
	};
}

function getMoneyWorksCurrencyLimitations(): string[] {
	return [
		"Base currency cannot be changed after transactions are entered",
		"Exchange rates must be manually updated",
		"Currency symbols are limited to predefined set",
		"Maximum decimal places is 4",
		"Historical exchange rates are not automatically maintained",
	];
}

function getMoneyWorksCurrencyBestPractices(): string[] {
	return [
		"Set up base currency before entering any transactions",
		"Update exchange rates regularly for accurate reporting",
		"Use consistent currency formatting throughout",
		"Backup data before changing currency settings",
		"Test multi-currency setup in a sample file first",
	];
}

function getCurrencyMigrationGuidance(): {
	steps: string[];
	considerations: string[];
	risks: string[];
} {
	return {
		steps: [
			"Backup current data file",
			"Determine new base currency requirements",
			"Plan exchange rate conversion method",
			"Test migration process in sample environment",
			"Execute migration during low activity period",
			"Verify all amounts after migration",
		],
		considerations: [
			"Impact on historical reporting",
			"Exchange rate conversion accuracy",
			"User training requirements",
			"Integration with external systems",
		],
		risks: [
			"Data corruption during migration",
			"Incorrect exchange rate conversion",
			"Loss of historical currency information",
			"Disruption to business operations",
		],
	};
}

// Utility function for grouping
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce(
		(groups, item) => {
			const group = String(item[key]);
			groups[group] = groups[group] || [];
			groups[group].push(item);
			return groups;
		},
		{} as Record<string, T[]>,
	);
}
