const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Define TaxRate type locally since we can't import from @moneyworks/canonical yet
export interface TaxRate {
	TaxCode: string;
	Ratename: string;
	Rate1: number;
	Rate2?: number;
	Type?: number;
	RecAccount?: string;
	PaidAccount?: string;
	[key: string]: any;
}

// Product type
export interface Product {
	Code: string;
	Description: string;
	Type: number;
	Hash?: number;
	SellPrice?: number;
	BuyPrice?: number;
	StockLevel?: number;
	Supplier?: string;
	COGAcct?: string;
	SalesAcct?: string;
	StockAcct?: string;
	ReorderLevel?: number;
	[key: string]: any;
}

export interface ApiResponse<T> {
	data: T;
	metadata?: {
		total?: number;
		count?: number;
		timestamp?: string;
		requestId?: string;
	};
}

export interface ApiError {
	message: string;
	code?: string;
	details?: unknown;
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	private async request<T>(
		path: string,
		options: RequestInit = {},
	): Promise<T> {
		const url = `${this.baseUrl}${path}`;

		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		const data = await response.json();

		// Handle validation errors that still contain valid data
		if (response.status === 422 && data.type === "validation" && data.found) {
			return data.found as T;
		}

		if (!response.ok) {
			throw new Error(data.message || `Request failed: ${response.status}`);
		}

		return data;
	}

	// Tax Rates
	async getTaxRates(params?: {
		format?: "compact" | "compact-headers" | "full" | "schema";
		limit?: number;
		offset?: number;
		orderBy?: string;
		filter?: string;
	}): Promise<ApiResponse<TaxRate[]>> {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, String(value));
				}
			});
		}

		return this.request(`/tables/TaxRate?${queryParams}`);
	}

	async getTaxRateSchema(): Promise<ApiResponse<any>> {
		return this.request("/tables/TaxRate/schema");
	}

	async getTaxRateLabels(language = "en"): Promise<ApiResponse<any>> {
		return this.request(`/tables/TaxRate/labels?lang=${language}`);
	}

	async createTaxRate(data: Partial<TaxRate>): Promise<ApiResponse<TaxRate>> {
		return this.request("/tables/TaxRate", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateTaxRate(
		code: string,
		data: Partial<TaxRate>,
	): Promise<ApiResponse<TaxRate>> {
		return this.request(`/tables/TaxRate/${code}`, {
			method: "PATCH",
			body: JSON.stringify(data),
		});
	}

	async deleteTaxRate(code: string): Promise<ApiResponse<void>> {
		return this.request(`/tables/TaxRate/${code}`, {
			method: "DELETE",
		});
	}

	// Products
	async getProducts(params?: {
		format?: "compact" | "compact-headers" | "full" | "schema";
		limit?: number;
		offset?: number;
		orderBy?: string;
		filter?: string;
	}): Promise<ApiResponse<Product[]>> {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, String(value));
				}
			});
		}

		return this.request(`/tables/Product?${queryParams}`);
	}

	async getProductSchema(): Promise<ApiResponse<any>> {
		return this.request("/tables/Product/schema");
	}

	async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
		return this.request("/tables/Product", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateProduct(
		code: string,
		data: Partial<Product>,
	): Promise<ApiResponse<Product>> {
		return this.request(`/tables/Product/${code}`, {
			method: "PATCH",
			body: JSON.stringify(data),
		});
	}

	async deleteProduct(code: string): Promise<ApiResponse<void>> {
		return this.request(`/tables/Product/${code}`, {
			method: "DELETE",
		});
	}

	// Company
	async getCompany(params?: {
		fields?: string[];
		format?: "nested" | "flat";
	}): Promise<ApiResponse<any>> {
		const queryParams = new URLSearchParams();
		if (params?.fields) {
			params.fields.forEach((field) => queryParams.append("fields[]", field));
		}
		if (params?.format) {
			queryParams.set("format", params.format);
		}
		return this.request(
			`/company${queryParams.toString() ? `?${queryParams}` : ""}`,
		);
	}

	// MWScript Evaluator
	async evaluateExpression(expression: string): Promise<ApiResponse<any>> {
		return this.request("/eval", {
			method: "POST",
			body: JSON.stringify({ expression }),
		});
	}

	async evaluateTemplate(
		table: string,
		template: string,
		params?: {
			limit?: number;
			filter?: string;
		},
	): Promise<ApiResponse<any>> {
		return this.request(`/eval/template/${table}`, {
			method: "POST",
			body: JSON.stringify({
				template,
				limit: params?.limit,
				filter: params?.filter,
			}),
		});
	}

	// i18n
	async getLanguages(): Promise<ApiResponse<any>> {
		return this.request("/i18n/languages");
	}

	async getTranslations(lang: string): Promise<ApiResponse<any>> {
		return this.request(`/i18n/translations/${lang}`);
	}

	// Health & Version
	async getHealth(): Promise<ApiResponse<any>> {
		return this.request("/health");
	}

	async getVersion(): Promise<ApiResponse<any>> {
		return this.request("/version");
	}
}

export const api = new ApiClient(API_BASE_URL);
