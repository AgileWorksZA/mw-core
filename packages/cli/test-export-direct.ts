#!/usr/bin/env bun

// Test with direct imports to bypass the issue
import { MoneyWorksRESTClient } from "@moneyworks/data/src/client/moneyworks-rest-client";

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

		console.log("Creating MoneyWorks REST client...");
		const client = new MoneyWorksRESTClient(config);

		console.log("Exporting TaxRate table...");
		const result = await client.export("TaxRate", { format: "json" });

		console.log("Result:", JSON.stringify(result, null, 2));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

main();
