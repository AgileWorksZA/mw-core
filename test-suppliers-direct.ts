#!/usr/bin/env bun

// Direct test of supplier search using SmartMoneyWorksClient
import { SmartMoneyWorksClient } from "./packages/data/src/client/moneyworks-smart-client";

console.log("Testing supplier search with SmartMoneyWorksClient...");

const client = new SmartMoneyWorksClient({
	host: "localhost",
	port: 6710,
	dataFile: "acme.moneyworks",
	username: "Admin",
	password: "",
});

try {
	console.log("1. Testing direct export with supplier filter...");

	// Test the exact same search that the chat tool uses
	const result = await client.smartExport("Name", {
		search: "SupplierType > 0",
		limit: 10,
		exportFormat: "full",
	});

	console.log("Result:", JSON.stringify(result, null, 2));

	if (Array.isArray(result) && result.length > 0) {
		console.log("SUCCESS: Found suppliers!");
		console.log(
			"Suppliers found:",
			result.map((s) => ({
				Code: s.Code,
				Name: s.Name,
				SupplierType: s.SupplierType,
			})),
		);
	} else {
		console.log("ISSUE: No suppliers returned");
	}
} catch (error) {
	console.error("ERROR:", error);
}
