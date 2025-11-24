#!/usr/bin/env bun

// Basic test to check if MoneyWorks is accessible
async function main() {
	try {
		const host = "localhost";
		const port = 6710;
		const dataFile = "acme.moneyworks";
		const username = "Herman Geldenhuys";
		const password = "";

		console.log(`Connecting to MoneyWorks at ${host}:${port}...`);

		// Build auth header
		const auth = Buffer.from(`${username}:Document:${password}`).toString(
			"base64",
		);

		// Make a direct HTTP request to test connection
		const url = `http://${host}:${port}/REST/Version`;
		console.log(`Fetching: ${url}`);

		const response = await fetch(url, {
			headers: {
				Authorization: `Basic ${auth}`,
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		console.log("MoneyWorks Version:", data);

		// Now try to export tax rates
		const exportUrl = `http://${host}:${port}/REST/${dataFile}/export?table=TaxRate`;
		console.log(`\nExporting tax rates from: ${exportUrl}`);

		const exportResponse = await fetch(exportUrl, {
			headers: {
				Authorization: `Basic ${auth}`,
				Accept: "application/json",
			},
		});

		if (!exportResponse.ok) {
			const errorText = await exportResponse.text();
			throw new Error(
				`Export failed - HTTP ${exportResponse.status}: ${errorText}`,
			);
		}

		const taxRates = await exportResponse.json();
		console.log(
			`\nFound ${Array.isArray(taxRates) ? taxRates.length : "?"} tax rates:`,
		);
		console.log(JSON.stringify(taxRates, null, 2));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

main();
