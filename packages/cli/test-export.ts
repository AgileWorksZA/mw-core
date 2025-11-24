#!/usr/bin/env bun

// Simple test script to export tax rates
import { createSmartClient } from "@moneyworks/data";
import { TaxRateRepository } from "@moneyworks/data";

async function main() {
	try {
		// Load config
		const config = {
			host: "localhost",
			port: 6710,
			dataFile: "acme.moneyworks",
			username: "Herman Geldenhuys",
			password: "",
			protocol: "http" as const,
		};

		console.log("Creating MoneyWorks client...");
		const client = createSmartClient(config);

		console.log("Creating TaxRate repository...");
		const taxRateRepo = new TaxRateRepository(client);

		console.log("Fetching all tax rates...");
		const taxRates = await taxRateRepo.findAll();

		console.log(`Found ${taxRates.length} tax rates:`);
		console.log(JSON.stringify(taxRates, null, 2));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

main();
