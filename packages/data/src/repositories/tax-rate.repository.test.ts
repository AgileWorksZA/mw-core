/**
 * TaxRateRepository Unit Tests
 *
 * @moneyworks-entity TaxRate
 * @moneyworks-dsl PURE
 */

import { beforeAll, describe, expect, test } from "bun:test";
import { createSmartClient } from "@moneyworks/data/client/moneyworks-smart-client";
import { TaxRateRepository } from "@moneyworks/data/repositories/tax-rate.repository";
import { loadConfig } from "../config/index";

describe("TaxRateRepository", () => {
	let repository: TaxRateRepository;

	beforeAll(async () => {
		// Load config from mw-config.json
		const config = await loadConfig("../../mw-config.json");
		const client = createSmartClient(config);
		repository = new TaxRateRepository(client);
	});

	test("should export all tax rates", async () => {
		// Act - Export all tax rates
		const taxRates = await repository.findAll();

		// Assert - Basic validations
		expect(taxRates).toBeDefined();
		expect(Array.isArray(taxRates)).toBe(true);

		// Log the results for inspection
		console.log(`Exported ${taxRates.length} tax rates from MoneyWorks`);

		// If we have tax rates, verify the structure
		if (taxRates.length > 0) {
			const firstRate = taxRates[0];

			// Verify it's a properly typed MoneyWorksTaxRate
			expect(firstRate).toHaveProperty("TaxCode");
			expect(firstRate).toHaveProperty("PaidAccount");
			expect(firstRate).toHaveProperty("RecAccount");
			expect(firstRate).toHaveProperty("Date");
			expect(firstRate).toHaveProperty("Rate1");
			expect(firstRate).toHaveProperty("Rate2");

			// Verify types
			expect(typeof firstRate.TaxCode).toBe("string");
			expect(typeof firstRate.Rate1).toBe("number");
			expect(typeof firstRate.Rate2).toBe("number");

			// Log first rate for debugging
			console.log("First tax rate:", {
				TaxCode: firstRate.TaxCode,
				Rate1: firstRate.Rate1,
				Rate2: firstRate.Rate2,
				Date: firstRate.Date,
			});
		}
	});
});
